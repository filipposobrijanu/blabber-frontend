import { useState, useRef, useCallback, useEffect } from "react";
import { Socket } from "socket.io-client";
import { User, Channel } from "../types/chat";
import { useCallSounds } from "./useCallSounds";
import { userInfo } from "os";

export interface CallData {
  from: string;
  fromUsername: string;
  to: string[];
  offer?: RTCSessionDescriptionInit;
  answer?: RTCSessionDescriptionInit;
  audioOnly?: boolean;
  fromImage?: string;
  isChannelCall?: boolean;
  channelId?: string;
  channelName?: string;
  channelImage?: string;
  isDMChannel?: boolean;
}

interface IceCandidateData {
  candidate: RTCIceCandidateInit;
  to: string;
  from?: string;
  fromUsername?: string;
  fromImage?: string;
  isChannelCall?: boolean;
  channelId?: string;
}

interface UseWebRTCProps {
  userId: string;
  username: string;
  socket: Socket | null;
  currentChannel?: Channel | null;
  onlineUsers?: User[];
}

interface CallAnswerData {
  from: string;
  to: string;
  answer: RTCSessionDescriptionInit;
  fromUsername?: string;
  fromImage?: string;
  isChannelCall?: boolean;
}

interface CallEndData {
  from: string;
  isChannelCall?: boolean;
  channelId?: string;
}

interface CallPermissions {
  canCall: boolean;
  reason?: string;
}

interface PeerConnectionData {
  pc: RTCPeerConnection;
  remoteUserId: string;
  remoteUsername: string;
  remoteImage?: string;
  stream?: MediaStream;
}

const RING_TIMEOUT_MS = 10000;
const CALL_TIMEOUT_MS = 300000;
const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },

    {
      urls: [
        "turn:openrelay.metered.ca:80?transport=udp",
        "turn:openrelay.metered.ca:80?transport=tcp",
      ],
      username: "openrelayproject",
      credential: "openrelayproject",
    },
    {
      urls: "turn:openrelay.metered.ca:443",
      username: "openrelayproject",
      credential: "openrelayproject",
    },
  ],
  iceTransportPolicy: "all",
  iceCandidatePoolSize: 0,
  bundlePolicy: "max-bundle",
  rtcpMuxPolicy: "require",
};

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { min: 1280, ideal: 1920, max: 1920 },
  height: { min: 720, ideal: 1080, max: 1080 },
  frameRate: { ideal: 48, max: 60 },
};

const AUDIO_CONSTRAINTS: MediaTrackConstraints = {
  echoCancellation: { ideal: true },
  noiseSuppression: { ideal: true },
  autoGainControl: { ideal: true },
  channelCount: 1,
  sampleRate: 16000,
  sampleSize: 16,
};

export const useWebRTC = ({
  userId,
  username,
  socket,
  currentChannel,
  onlineUsers = [],
}: UseWebRTCProps) => {
  const [callState, setCallState] = useState<
    "idle" | "calling" | "ringing" | "connected" | "failed"
  >("idle");
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(
    new Map(),
  );
  const [incomingCall, setIncomingCall] = useState<CallData | null>(null);
  const [callError, setCallError] = useState<string>("");
  const [remoteUsername, setRemoteUsername] = useState<string>("");
  const [remoteUsernameImage, setRemoteUsernameImage] = useState<string>("");
  const [remoteChannelName, setRemoteChannelName] = useState<string>("");
  const [remoteChannelImage, setRemoteChannelImage] = useState<string>("");
  const [remoteImage, setRemoteImage] = useState<string>("");
  const [remoteIsDMChannel, setRemoteIsDMChannel] = useState<boolean>(false);
  const [isAudioOnly, setIsAudioOnly] = useState<boolean>(false);

  const [connectionStatuses, setConnectionStatuses] = useState<
    Map<
      string,
      {
        status: "good" | "fair" | "poor" | "disconnected";
        stats: {
          latency?: number;
          packetLoss?: number;
          bitrate?: number;
        };
      }
    >
  >(new Map());

  const monitorConnectionStats = useCallback(
    (pc: RTCPeerConnection, userId: string) => {
      let isActive = true;

      const updateStats = async () => {
        if (!pc || !isActive) return;

        try {
          const stats = await pc.getStats();
          let latency = 0;
          let packetLoss = 0;
          let bitrate = 0;

          stats.forEach((report) => {
            if (
              report.type === "candidate-pair" &&
              report.state === "succeeded"
            ) {
              latency = report.currentRoundTripTime
                ? report.currentRoundTripTime * 1000
                : 0;
            }

            if (report.type === "inbound-rtp" && report.mediaType === "video") {
              const packetsLost = report.packetsLost || 0;
              const totalPackets = (report.packetsReceived || 0) + packetsLost;
              packetLoss =
                totalPackets > 0 ? (packetsLost / totalPackets) * 100 : 0;

              if (report.bytesReceived) {
                const bytesPerSecond =
                  report.bytesReceived / (report.timestamp / 1000);
                bitrate = Math.round((bytesPerSecond * 8) / 1000);
              }
            }
          });

          let status: "good" | "fair" | "poor" | "disconnected" = "good";

          if (
            pc.connectionState === "disconnected" ||
            pc.connectionState === "failed"
          ) {
            status = "disconnected";
          } else if (latency > 500 || packetLoss > 10) {
            status = "poor";
          } else if (latency > 200 || packetLoss > 5) {
            status = "fair";
          }

          if (isActive) {
            setConnectionStatuses((prev) => {
              const newMap = new Map(prev);
              newMap.set(userId, {
                status,
                stats: {
                  latency: Math.round(latency),
                  packetLoss: Math.round(packetLoss),
                  bitrate,
                },
              });
              return newMap;
            });
          }
        } catch (error) {
          console.warn("Failed to get connection stats:", error);
        }
      };

      const interval = setInterval(updateStats, 3000);

      updateStats();

      return () => {
        isActive = false;
        clearInterval(interval);
      };
    },
    [],
  );

  const [isRemoteSpeaking, setIsRemoteSpeaking] = useState<boolean>(false);
  const [isLocalSpeaking, setIsLocalSpeaking] = useState<boolean>(false);

  const callInitiatedByMeRef = useRef<boolean>(false);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const callTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const ringTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [isCallSuspended, setIsCallSuspended] = useState(false);

  const peerConnectionsRef = useRef<Map<string, RTCPeerConnection>>(new Map());
  const dataChannelsRef = useRef<Map<string, RTCDataChannel>>(new Map());
  const remoteStreamsRef = useRef<Map<string, MediaStream>>(new Map());

  const iceCandidateQueueRef = useRef<RTCIceCandidateInit[]>([]);
  const remoteDescriptionSetRef = useRef<boolean>(false);
  const callEndedRef = useRef<boolean>(false);

  const [originalCallChannel, setOriginalCallChannel] = useState<string | null>(
    null,
  );

  const isSettingRemoteRef = useRef<boolean>(false);

  const { playSound, playRingtone, stopRingtone, cleanup } = useCallSounds();
  const suspendCall = useCallback(() => {
    console.log("⏸️ Suspending call due to channel change");
    setIsCallSuspended(true);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.enabled = false;
      });
    }
  }, []);
  const resumeCall = useCallback(() => {
    console.log("▶️ Resuming call");
    setIsCallSuspended(false);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        track.enabled = true;
      });
    }
  }, []);

  useEffect(() => {
    let audioContext: AudioContext | null = null;

    const initializeAudioContext = async () => {
      try {
        audioContext = new AudioContext();
        const resumeAudio = async () => {
          if (audioContext && audioContext.state === "suspended") {
            await audioContext.resume();
          }
        };

        document.addEventListener("click", resumeAudio, { once: true });
        document.addEventListener("touchstart", resumeAudio, { once: true });
      } catch (error) {
        console.warn("⚠️ Audio context initialization failed:", error);
      }
    };

    initializeAudioContext();

    return () => {
      if (audioContext) {
        audioContext.close().catch(console.warn);
      }
    };
  }, []);

  const initializeMediaStream = useCallback(
    async (audioOnly: boolean = false): Promise<MediaStream> => {
      try {
        console.log(`🎤 Initializing ${audioOnly ? "audio" : "video"} stream`);

        const savedAudioInput = localStorage.getItem("preferredAudioInput");
        const savedVideoInput = localStorage.getItem("preferredVideoInput");

        const audioConstraints = {
          ...AUDIO_CONSTRAINTS,
          ...(savedAudioInput && { deviceId: { exact: savedAudioInput } }),
        };

        const videoConstraints = audioOnly
          ? false
          : {
              ...VIDEO_CONSTRAINTS,
              ...(savedVideoInput && { deviceId: { exact: savedVideoInput } }),
            };

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: AUDIO_CONSTRAINTS,
          video: audioOnly ? false : VIDEO_CONSTRAINTS,
        });

        if (!audioOnly && localVideoRef.current) {
          console.log("📹 IMMEDIATELY setting local video srcObject");
          localVideoRef.current.srcObject = stream;
          localVideoRef.current.muted = true;
          localVideoRef.current.playsInline = true;

          const playLocalVideo = async () => {
            try {
              await localVideoRef.current!.play();
              console.log("✅ Local video playing immediately");
            } catch (error) {
              console.log("⚠️ Local video autoplay blocked, will retry...");
              const handleInteraction = () => {
                localVideoRef.current?.play().catch(() => {});
                document.removeEventListener("click", handleInteraction);
              };
              document.addEventListener("click", handleInteraction, {
                once: true,
              });
            }
          };
          playLocalVideo();
        }

        localStreamRef.current = stream;
        setIsAudioOnly(audioOnly);
        return stream;
      } catch (error: any) {
        console.error("❌ Media initialization error:", error);
        const errorMessage =
          error.name === "NotAllowedError"
            ? "Camera/microphone permission denied."
            : error.name === "NotFoundError"
              ? "No media devices found."
              : "Failed to access media devices.";
        setCallError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [],
  );

  const processIceCandidateQueue = useCallback(
    async (pc?: RTCPeerConnection): Promise<void> => {
      const targetPc = pc;
      if (!targetPc || iceCandidateQueueRef.current.length === 0) return;

      console.log(
        `📥 Processing ${iceCandidateQueueRef.current.length} queued ICE candidates`,
      );

      const processedCandidates: RTCIceCandidateInit[] = [];
      const failedCandidates: RTCIceCandidateInit[] = [];

      for (const candidate of iceCandidateQueueRef.current) {
        try {
          await targetPc.addIceCandidate(new RTCIceCandidate(candidate));
          processedCandidates.push(candidate);
          console.log("✅ Queued ICE candidate added");
        } catch (error) {
          console.warn("⚠️ Failed to add queued ICE candidate:", error);
          failedCandidates.push(candidate);
        }
      }

      iceCandidateQueueRef.current = failedCandidates;

      if (failedCandidates.length > 0) {
        console.warn(
          `⚠️ ${failedCandidates.length} ICE candidates failed to process`,
        );
      }
    },
    [],
  );

  const createPeerConnection = useCallback(
    (
      remoteUserId: string,
      remoteUserImage?: string,
      remoteUsername?: string,
    ): RTCPeerConnection => {
      console.log("🔧 Creating peer connection for:", remoteUserId);

      const existingPc = peerConnectionsRef.current.get(remoteUserId);
      if (existingPc) {
        existingPc.close();
      }
      setConnectionStatuses((prev) => {
        const newMap = new Map(prev);
        newMap.set(remoteUserId, {
          status: "good",
          stats: { latency: 0, packetLoss: 0, bitrate: 0 },
        });
        return newMap;
      });
      const pc = new RTCPeerConnection(ICE_SERVERS);
      peerConnectionsRef.current.set(remoteUserId, pc);
      const cleanupMonitor = monitorConnectionStats(pc, remoteUserId);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          if (track.enabled && track.readyState === "live") {
            console.log(
              `➕ Adding ${track.kind} track to peer connection for ${remoteUserId}`,
            );
            pc.addTrack(track, localStreamRef.current!);
          }
        });
      }

      try {
        const dataChannel = pc.createDataChannel(`speaking-${remoteUserId}`, {
          ordered: true,
        });

        dataChannelsRef.current.set(remoteUserId, dataChannel);

        dataChannel.onopen = () => {
          console.log(`✅ Data channel opened for ${remoteUserId}`);
        };

        dataChannel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "speaking") {
              console.log(`🎤 ${remoteUsername} speaking:`, data.isSpeaking);
            }
          } catch (error) {
            console.warn(
              `⚠️ Failed to parse speaking data from ${remoteUserId}:`,
              error,
            );
          }
        };
      } catch (error) {
        console.warn(
          `⚠️ Could not create data channel for ${remoteUserId}:`,
          error,
        );
      }

      pc.ondatachannel = (event) => {
        const dataChannel = event.channel;
        dataChannelsRef.current.set(remoteUserId, dataChannel);

        dataChannel.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === "speaking") {
              console.log(`🎤 ${remoteUsername} speaking:`, data.isSpeaking);
            }
          } catch (error) {
            console.warn(
              `⚠️ Failed to parse speaking data from ${remoteUserId}:`,
              error,
            );
          }
        };
      };
      const isDMChannel = currentChannel?.isDM || false;
      pc.onicecandidate = (event) => {
        if (event.candidate && socket?.connected) {
          console.log(`🧊 Sending ICE candidate to ${remoteUserId}:`, {
            type: event.candidate.type,
            protocol: event.candidate.protocol,
            address: event.candidate.address,
          });

          const isDMChannel =
            remoteIsDMChannel || currentChannel?.isDM || false;

          socket.emit("webrtc:ice-candidate", {
            candidate: event.candidate,
            to: remoteUserId,
            from: userId,
            fromUsername: username,
            fromImage: "",
            isChannelCall: !isDMChannel,
            channelId: currentChannel?.id,
          });
        } else if (!event.candidate) {
          console.log("✅ All ICE candidates sent");
        }
      };

      pc.ontrack = (event) => {
        console.log(
          `🎵 Remote track received from ${remoteUserId}:`,
          event.track.kind,
        );

        const existingStream = remoteStreamsRef.current.get(remoteUserId);

        if (!existingStream) {
          let remoteStream: MediaStream;
          if (event.streams && event.streams[0]) {
            remoteStream = event.streams[0];
          } else {
            remoteStream = new MediaStream([event.track]);
          }

          remoteStreamsRef.current.set(remoteUserId, remoteStream);
          setRemoteStreams(new Map(remoteStreamsRef.current));
          console.log(`✅ Stream added for user ${remoteUserId}`);
        } else {
          console.log(`ℹ️ Stream already exists for user ${remoteUserId}`);
        }
      };

      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        console.log(`🔗 Peer connection state for ${remoteUserId}:`, state);

        switch (state) {
          case "connected":
            console.log(`🎉 PEER CONNECTION ESTABLISHED with ${remoteUserId}`);
            if (callState !== "connected") {
              setCallState("connected");
              stopRingtone();
              playSound("connected");
            }
            break;
          case "failed":
            console.error(`❌ Peer connection failed with ${remoteUserId}`);
            setConnectionStatuses((prev) => {
              const newMap = new Map(prev);
              newMap.set(remoteUserId, {
                status: "disconnected",
                stats: { latency: 0, packetLoss: 100, bitrate: 0 },
              });
              return newMap;
            });
            break;
        }
        return () => {
          if (cleanupMonitor) cleanupMonitor();
        };
      };

      return pc;
    },
    [
      socket,
      userId,
      username,
      callState,
      stopRingtone,
      monitorConnectionStats,
      playSound,
      currentChannel,
    ],
  );

  const rejectCall = useCallback(() => {
    console.log("❌ Rejecting call");

    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }

    if (socket?.connected && incomingCall) {
      socket.emit("webrtc:call-reject", {
        from: userId,
        to: incomingCall.from,
      });
    }

    stopRingtone();
    playSound("error");
    setIncomingCall(null);
    setCallState("idle");
    setCallError("");
    setRemoteImage("");
    setRemoteIsDMChannel(false);
    setRemoteUsername("");
    setRemoteChannelName("");

    setRemoteChannelImage("");
  }, [userId, socket, incomingCall, stopRingtone, playSound]);

  const canCallUser = useCallback(
    (targetUserId: string): CallPermissions => {
      console.log("🔍 Checking call permissions for:", targetUserId);

      if (!targetUserId || targetUserId === userId) {
        return { canCall: false, reason: "Cannot call yourself" };
      }

      if (callState !== "idle") {
        return { canCall: false, reason: "Already in a call" };
      }

      if (!socket?.connected) {
        return { canCall: false, reason: "Not connected to server" };
      }

      const isUserOnline = onlineUsers.some((user) => user.id === targetUserId);
      if (!isUserOnline) {
        return { canCall: false, reason: "User is currently offline" };
      }

      console.log("🎯 All call permission checks passed - User is online");
      return { canCall: true };
    },
    [userId, callState, socket, onlineUsers],
  );
  const endCall = useCallback(
    (reason: string = "Call ended") => {
      if (callEndedRef.current) return;

      console.log("🔚 Ending call with all participants:", reason);
      callEndedRef.current = true;
      callInitiatedByMeRef.current = false;

      if (ringTimeoutRef.current) {
        clearTimeout(ringTimeoutRef.current);
        ringTimeoutRef.current = null;
      }

      stopRingtone();
      playSound("ended");

      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => {
          try {
            track.stop();
          } catch (error) {
            console.warn("⚠️ Error stopping track:", error);
          }
        });
        localStreamRef.current = null;
      }
      setConnectionStatuses(new Map());
      peerConnectionsRef.current.forEach((pc, userId) => {
        try {
          pc.getSenders().forEach((sender) => {
            if (sender.track) sender.track.stop();
          });
          pc.close();
        } catch (error) {
          console.warn(`⚠️ Error closing PC for ${userId}:`, error);
        }
      });

      peerConnectionsRef.current.clear();
      dataChannelsRef.current.clear();
      remoteStreamsRef.current.clear();

      setRemoteStreams(new Map());
      setIncomingCall(null);
      setCallError("");
      setRemoteUsername("");
      setRemoteChannelName("");
      setRemoteChannelImage("");
      setRemoteImage("");
      setRemoteIsDMChannel(false);
      setCallState("idle");
      setIsAudioOnly(false);

      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }

      const isDMChannel = currentChannel?.isDM || false;
      if (socket?.connected) {
        socket.emit("webrtc:call-end", {
          from: userId,
          isChannelCall: !isDMChannel,
          channelId: currentChannel?.id,
        });
      }
    },
    [socket, userId, stopRingtone, playSound, currentChannel],
  );
  const startCall = useCallback(
    async (
      recipientIds: string[],
      recipientData: { [key: string]: { username: string; image?: string } },
      audioOnly: boolean = false,
      currentUserImage?: string,
    ): Promise<void> => {
      console.log("📞 Starting call to multiple users:", recipientIds);
      if (callState === "connected" && currentChannel?.id) {
        console.log("🔄 Already in a call - continuing existing call");
        return;
      }
      setOriginalCallChannel(currentChannel?.id || null);
      try {
        for (const recipientId of recipientIds) {
          const permission = canCallUser(recipientId);
          if (!permission.canCall) {
            throw new Error(
              permission.reason || `Cannot call user ${recipientId}`,
            );
          }
          const userData = recipientData[recipientId];
          const pc = createPeerConnection(
            recipientId,
            userData?.image,
            userData?.username,
          );

          const cleanup = pc;
        }

        callEndedRef.current = false;
        callInitiatedByMeRef.current = true;
        setCallError("");
        setCallState("calling");

        setRemoteChannelImage(currentChannel?.image || "");
        setRemoteChannelName(currentChannel?.name || "");

        const isDMChannel = currentChannel?.isDM || false;
        setRemoteIsDMChannel(isDMChannel);

        if (isDMChannel && recipientIds.length === 1) {
          const userData = recipientData[recipientIds[0]];
          setRemoteImage(userData?.image || "");
          setRemoteUsername(userData?.username || "");
        }

        playRingtone("calling");

        await initializeMediaStream(audioOnly);

        for (const recipientId of recipientIds) {
          const userData = recipientData[recipientId];
          const pc = createPeerConnection(
            recipientId,
            userData?.image,
            userData?.username,
          );

          const offer = await pc.createOffer({
            offerToReceiveAudio: true,
            offerToReceiveVideo: !audioOnly,
          });

          await pc.setLocalDescription(offer);

          const isDMChannel = currentChannel?.isDM || false;
          const channelName = isDMChannel
            ? `DM with ${userData?.username || recipientId}`
            : currentChannel?.name || "";
          const channelImage = isDMChannel
            ? userData?.image || ""
            : currentChannel?.image || "";

          socket!.emit("webrtc:call-offer", {
            from: userId,
            fromUsername: username,
            fromImage: currentUserImage || "",
            to: [recipientId],
            offer,
            audioOnly,
            isChannelCall: !isDMChannel,
            channelId: currentChannel?.id,
            channelName: channelName,
            channelImage: channelImage,
            isDMChannel: isDMChannel,
          });
        }

        callTimeoutRef.current = setTimeout(() => {
          if (callState === "calling") {
            console.log("⏰ Call timeout - no responses received");
            endCall("No response from recipients");
            setCallError("Call timed out.");
          }
        }, CALL_TIMEOUT_MS);

        console.log("✅ Group call initiated");
      } catch (error: any) {
        console.error("❌ Group call failed:", error);
        playSound("error");
        setCallError(error.message || "Failed to start group call");
        setCallState("idle");
        callInitiatedByMeRef.current = false;
      }
    },
    [
      canCallUser,
      socket,
      userId,
      username,
      initializeMediaStream,
      createPeerConnection,
      playRingtone,
      playSound,
      currentChannel,
      callState,
      endCall,
    ],
  );

  const sendSpeakingState = useCallback(
    (isSpeaking: boolean, targetUserId?: string) => {
      if (targetUserId) {
        const dataChannel = dataChannelsRef.current.get(targetUserId);
        if (dataChannel && dataChannel.readyState === "open") {
          try {
            dataChannel.send(
              JSON.stringify({
                type: "speaking",
                isSpeaking: isSpeaking,
                timestamp: Date.now(),
              }),
            );
          } catch (error) {
            console.warn(
              `⚠️ Failed to send speaking state to ${targetUserId}:`,
              error,
            );
          }
        }
      } else {
        dataChannelsRef.current.forEach((dataChannel, userId) => {
          if (dataChannel.readyState === "open") {
            try {
              dataChannel.send(
                JSON.stringify({
                  type: "speaking",
                  isSpeaking: isSpeaking,
                  timestamp: Date.now(),
                }),
              );
            } catch (error) {
              console.warn(
                `⚠️ Failed to send speaking state to ${userId}:`,
                error,
              );
            }
          }
        });
      }
    },
    [],
  );

  const answerCall = useCallback(async (): Promise<void> => {
    if (ringTimeoutRef.current) {
      clearTimeout(ringTimeoutRef.current);
      ringTimeoutRef.current = null;
    }

    if (callState !== "ringing" || !incomingCall) {
      console.log("⚠️ Cannot answer call");
      return;
    }

    setOriginalCallChannel(currentChannel?.id || null);

    try {
      console.log("📞 Answering call");

      callEndedRef.current = false;
      callInitiatedByMeRef.current = false;
      setCallError("");
      stopRingtone();

      setRemoteUsername(incomingCall.fromUsername || "");
      setRemoteChannelImage(incomingCall.channelImage || "");
      setRemoteChannelName(incomingCall.channelName || "");
      setRemoteImage(incomingCall.fromImage || "");
      setRemoteIsDMChannel(incomingCall.isDMChannel || false);

      console.log("🖼️ Setting channel info from incoming call:", {
        channelImage: incomingCall.channelImage,
        channelName: incomingCall.channelName,
        remoteImage: incomingCall.fromImage,
        isDMChannel: incomingCall.isDMChannel,
        isChannelCall: incomingCall.isChannelCall,
      });

      await initializeMediaStream(incomingCall.audioOnly || false);
      const pc = createPeerConnection(
        incomingCall.from,
        incomingCall.fromImage,
        incomingCall.fromUsername,
      );

      if (incomingCall.offer) {
        isSettingRemoteRef.current = true;
        await pc.setRemoteDescription(
          new RTCSessionDescription(incomingCall.offer),
        );
        remoteDescriptionSetRef.current = true;
        isSettingRemoteRef.current = false;

        await processIceCandidateQueue(pc);

        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        const isDMChannel = incomingCall.isDMChannel || false;
        socket!.emit("webrtc:call-answer", {
          from: userId,
          to: incomingCall.from,
          answer,
          fromUsername: username,
          fromImage: "",
          isChannelCall: !isDMChannel,
          channelId: incomingCall.channelId,
        });

        setCallState("connected");
        console.log("✅ Call answered");
      }

      setIncomingCall(null);
    } catch (error: any) {
      console.error("❌ Answer failed:", error);
      playSound("error");
      setCallError(error.message || "Failed to answer call");
      setCallState("idle");
      endCall("Call answer failed");
    }
  }, [
    callState,
    incomingCall,
    socket,
    userId,
    username,
    initializeMediaStream,
    createPeerConnection,
    processIceCandidateQueue,
    stopRingtone,
    playSound,
    endCall,
    currentChannel,
  ]);

  useEffect(() => {
    if (!socket) return;

    const handleCallOffer = (data: CallData) => {
      console.log("📞 Incoming call offer from:", data.fromUsername);

      console.log("📊 Incoming call data:", {
        isChannelCall: data.isChannelCall,
        channelId: data.channelId,
        currentChannelId: currentChannel?.id,
        isDMChannel: data.isDMChannel,
        channelName: data.channelName,
        from: data.from,
      });

      if (data.isChannelCall) {
        if (data.channelId !== currentChannel?.id) {
          console.log(
            "⚠️ Ignoring channel call - user is not in the same channel",
          );
          console.log(
            `   Call channel: ${data.channelId}, User channel: ${currentChannel?.id}`,
          );
          console.log(`   Channel name: ${data.channelName}`);

          if (socket.connected) {
            socket.emit("webrtc:call-reject", {
              from: userId,
              to: data.from,
              silent: true,
            });
          }
          return;
        }
      }

      if (callState !== "idle") {
        console.log("⚠️ Ignoring call - already in call state:", callState);
        if (socket.connected) {
          socket.emit("webrtc:call-reject", {
            from: userId,
            to: data.from,
          });
        }
        return;
      }

      playRingtone("ringing");

      setRemoteChannelImage(data.channelImage || "");
      setRemoteChannelName(data.channelName || "");
      setRemoteUsername(data.fromUsername || "");
      setRemoteImage(data.fromImage || "");
      setRemoteIsDMChannel(data.isDMChannel || false);

      console.log(
        "🎯 Setting remoteIsDMChannel to:",
        data.isDMChannel || false,
      );
      console.log("✅ Showing call modal for:", {
        type: data.isDMChannel ? "DM Call" : "Channel Call",
        channelName: data.channelName,
        from: data.fromUsername,
      });

      setIncomingCall(data);
      setCallState("ringing");

      ringTimeoutRef.current = setTimeout(() => {
        console.log("⏰ Incoming call ring timeout - auto rejecting");

        if (socket?.connected) {
          socket.emit("webrtc:call-reject", {
            from: userId,
            to: data.from,
          });
        }

        stopRingtone();
        playSound("error");
        setIncomingCall(null);
        setCallState("idle");
        setCallError("Missed call");
        ringTimeoutRef.current = null;
      }, RING_TIMEOUT_MS);
    };

    const handleCallAnswer = async (data: CallAnswerData) => {
      console.log("✅ Call answered by:", data.from);

      const pc = peerConnectionsRef.current.get(data.from);
      if (!pc || !data.answer) {
        console.log("⚠️ No peer connection or answer for user:", data.from);
        return;
      }

      try {
        stopRingtone();
        playSound("connected");

        isSettingRemoteRef.current = true;
        await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
        remoteDescriptionSetRef.current = true;
        isSettingRemoteRef.current = false;

        await processIceCandidateQueue(pc);

        let connectedCount = 0;
        peerConnectionsRef.current.forEach((pc) => {
          if (pc.connectionState === "connected") connectedCount++;
        });

        if (connectedCount > 0 && callState !== "connected") {
          setCallState("connected");
        }

        console.log(`✅ Connected with ${data.from}`);
      } catch (error) {
        console.error(`❌ Answer error with ${data.from}:`, error);
      }
    };

    const handleIceCandidate = async (data: IceCandidateData) => {
      if (data.isChannelCall) {
        if (data.channelId !== currentChannel?.id) {
          console.log("⚠️ Ignoring ICE candidate - not in the same channel");
          console.log(
            `   Call channel: ${data.channelId}, User channel: ${currentChannel?.id}`,
          );
          return;
        }
      }

      const pc = peerConnectionsRef.current.get(data.from!);
      if (!pc || !data.candidate) {
        console.log("⚠️ No peer connection or candidate data for:", data.from);
        return;
      }

      try {
        if (isSettingRemoteRef.current || !remoteDescriptionSetRef.current) {
          console.log("📥 Queueing ICE candidate");
          iceCandidateQueueRef.current.push(data.candidate);
          return;
        }

        await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
        console.log("✅ ICE candidate added successfully for:", data.from);
      } catch (error) {
        console.warn(
          `⚠️ Failed to add ICE candidate from ${data.from}:`,
          error,
        );
        iceCandidateQueueRef.current.push(data.candidate);
      }
    };

    const handleCallEnd = (data: CallEndData) => {
      console.log("📞 Call ended by remote:", data.from);

      if (data.isChannelCall && data.channelId !== currentChannel?.id) {
        console.log("⚠️ Ignoring call end - not in the same channel");
        console.log(
          `   End call channel: ${data.channelId}, User channel: ${currentChannel?.id}`,
        );
        return;
      }

      if (!data.isChannelCall) {
        console.log("📞 DM call ended - normal cleanup");
        const pc = peerConnectionsRef.current.get(data.from);
        if (pc) {
          pc.close();
          peerConnectionsRef.current.delete(data.from);
          remoteStreamsRef.current.delete(data.from);
          setRemoteStreams(new Map(remoteStreamsRef.current));
        }

        if (peerConnectionsRef.current.size === 0 && !callEndedRef.current) {
          endCall("All participants left");
        }
        return;
      }

      console.log("📞 Channel call ended - cleaning up");
      const pc = peerConnectionsRef.current.get(data.from);
      if (pc) {
        pc.close();
        peerConnectionsRef.current.delete(data.from);
        remoteStreamsRef.current.delete(data.from);
        setRemoteStreams(new Map(remoteStreamsRef.current));
      }

      if (peerConnectionsRef.current.size === 0 && !callEndedRef.current) {
        endCall("All participants left");
      }
    };

    const handleCallReject = () => {
      console.log("❌ Call rejected by recipient");

      stopRingtone();
      playSound("error");

      setCallState("idle");
      setCallError("Call was rejected");
      setIncomingCall(null);

      if (callTimeoutRef.current) {
        clearTimeout(callTimeoutRef.current);
        callTimeoutRef.current = null;
      }
    };

    socket.on("webrtc:call-offer", handleCallOffer);
    socket.on("webrtc:call-answer", handleCallAnswer);
    socket.on("webrtc:ice-candidate", handleIceCandidate);
    socket.on("webrtc:call-end", handleCallEnd);
    socket.on("webrtc:call-reject", handleCallReject);

    return () => {
      socket.off("webrtc:call-offer", handleCallOffer);
      socket.off("webrtc:call-answer", handleCallAnswer);
      socket.off("webrtc:ice-candidate", handleIceCandidate);
      socket.off("webrtc:call-end", handleCallEnd);
      socket.off("webrtc:call-reject", handleCallReject);
    };
  }, [
    socket,
    callState,
    userId,
    endCall,
    processIceCandidateQueue,
    playRingtone,
    stopRingtone,
    playSound,
    currentChannel,
  ]);

  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up WebRTC hook");
      endCall("Component unmounted");
      cleanup();
    };
  }, [endCall, cleanup]);

  return {
    callState,
    remoteStreams,
    incomingCall,
    callError,
    remoteUsername,
    remoteChannelImage,
    remoteChannelName,
    remoteImage,
    remoteIsDMChannel,
    isAudioOnly,

    localVideoRef,
    remoteVideoRef,

    isRemoteSpeaking,
    isLocalSpeaking,
    sendSpeakingState,

    startCall,
    answerCall,
    rejectCall,
    endCall,
    localStream: localStreamRef.current,
    connectionStatuses,
    canCallUser,

    isInCall:
      callState === "calling" ||
      callState === "ringing" ||
      callState === "connected",
    isConnected: callState === "connected",

    peerConnections: peerConnectionsRef.current,
    activeParticipants: Array.from(remoteStreamsRef.current.keys()),
  };
};
