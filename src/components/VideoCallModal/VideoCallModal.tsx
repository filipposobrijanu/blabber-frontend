import React, {
  FC,
  useState,
  useEffect,
  useMemo,
  CSSProperties,
  useRef,
  useCallback,
} from "react";
import logo from "../../assets/logo.png";
import objects from "../../assets/3dobjects.png";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "../../types/chat";
import { useAudioLevelDetector } from "../../hooks/useAudioLevelDetector";
import { VideoCallModalTranslations } from "./VideoCallModalTranslations";
import { useShopContext } from "../../context/ShopContext";
import { useRealTimeSpeakingDetector } from "../../hooks/useRealTimeSpeakingDetector";

interface VideoCallModalProps {
  incomingCall: any;
  onAnswer: () => void;
  onReject: () => void;
  onEndCall: () => void;
  callState: string;
  remoteVideoRef: React.RefObject<HTMLVideoElement | null>;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  remoteStreams: Map<string, MediaStream>; // Changed from remoteStream
  remoteUsername: string;
  remoteChannelName: string;
  remoteChannelImage: string;
  remoteImage: string;
  callError: string;
  localStream: MediaStream | null;
  isDMChannel?: boolean;
  isAudioOnly?: boolean;
  isAudioCallVar?: boolean;
  remoteIsDMChannel?: boolean;
  user: User;
  isRemoteSpeaking?: boolean;
  isLocalSpeaking?: boolean;
  sendSpeakingState?: (isSpeaking: boolean) => void;
  // Add new props for multiple users
  activeParticipants?: string[];
  peerConnections?: Map<string, RTCPeerConnection>;
  participantData?: Map<string, any>;
  onChannelChange?: () => void;

  dmchannelImage?: string;
  dmchannelName?: string;
  connectionStatus?: "good" | "fair" | "poor" | "disconnected";
  connectionStats?: {
    latency?: number; // in ms
    packetLoss?: number; // in percentage
    bitrate?: number; // in kbps
  };
  // or for multiple connections
  connectionStatuses?: Map<
    string,
    {
      status: "good" | "fair" | "poor" | "disconnected";
      stats?: {
        latency?: number;
        packetLoss?: number;
        bitrate?: number;
      };
    }
  >;
}

export const VideoCallModal: FC<VideoCallModalProps> = ({
  incomingCall,
  onAnswer,
  onReject,
  onEndCall,
  callState,
  remoteVideoRef,
  localVideoRef,
  remoteStreams,
  remoteUsername,
  remoteChannelName,
  remoteChannelImage,
  remoteImage,
  localStream,
  remoteIsDMChannel = false,
  callError,
  isDMChannel = false,
  isAudioOnly = false,
  isAudioCallVar,
  user,
  isRemoteSpeaking,
  isLocalSpeaking,
  sendSpeakingState,
  dmchannelName,
  dmchannelImage,
  activeParticipants = [],
  peerConnections = new Map(),
  participantData = new Map(),
  onChannelChange,
  connectionStatus = "good",
  connectionStats = {},
  connectionStatuses = new Map(),
}) => {
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const isAudioCall = isAudioOnly || incomingCall?.audioOnly;
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null);
  const { selectedLanguage } = useShopContext();
  const getConnectionStatus = useCallback(
    (userId?: string) => {
      if (userId && connectionStatuses.has(userId)) {
        return connectionStatuses.get(userId)!;
      }
      return { status: connectionStatus, stats: connectionStats };
    },
    [connectionStatus, connectionStats, connectionStatuses]
  );
  const isLocalSpeakingRealTime = useRealTimeSpeakingDetector({
    stream: localStream,
    audioElement: null,
    isLocal: true,
    sendSpeakingState: sendSpeakingState,
  });

  const [focusedParticipantId, setFocusedParticipantId] = useState<
    string | null
  >(null);
  const handleParticipantClick = (participantId: string) => {
    if (focusedParticipantId === participantId) {
      // Clicking the same participant again should unfocus
      setFocusedParticipantId(null);
    } else {
      setFocusedParticipantId(participantId);
    }
  };

  const isRemoteSpeakingRealTime = useRealTimeSpeakingDetector({
    stream:
      remoteStreams.size > 0 ? Array.from(remoteStreams.values())[0] : null,
    audioElement: isAudioCall ? remoteAudioRef.current : remoteVideoRef.current,
    isLocal: false,
  });

  // Use the real-time values (fallback to props if provided)
  const displayLocalSpeaking =
    isLocalSpeaking !== undefined ? isLocalSpeaking : isLocalSpeakingRealTime;
  const displayRemoteSpeaking =
    isRemoteSpeaking !== undefined
      ? isRemoteSpeaking
      : isRemoteSpeakingRealTime;
  const t =
    VideoCallModalTranslations[
      selectedLanguage.code as keyof typeof VideoCallModalTranslations
    ];

  const [aspectRatio, setAspectRatio] = useState<"landscape" | "portrait">(
    "landscape"
  );
  const toggleAspectRatio = () => {
    setAspectRatio((prev) => (prev === "landscape" ? "portrait" : "landscape"));
  };
  // Add this useEffect to handle local stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      console.log("🎬 Setting local video stream via useEffect");
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }

      // Force play the local video
      const playLocalVideo = async () => {
        try {
          await localVideoRef.current!.play();
          console.log("✅ Local video playing");
        } catch (error) {
          console.log(
            "⚠️ Local video autoplay blocked, will retry on interaction"
          );
          // Auto-retry on user interaction
          const handleInteraction = () => {
            localVideoRef.current?.play().catch(() => {});
            document.removeEventListener("click", handleInteraction);
          };
          document.addEventListener("click", handleInteraction, { once: true });
        }
      };

      playLocalVideo();
    }
  }, [localStream]);
  // Add this useEffect to ensure videos maintain their streams
  useEffect(() => {
    // Ensure local video stream is always set
    if (localVideoRef.current && localStream) {
      if (localVideoRef.current.srcObject !== localStream) {
        localVideoRef.current.srcObject = localStream;
      }
    }

    // Ensure remote video streams are always set
    Array.from(remoteStreams.entries()).forEach(([userId, stream]) => {
      const videoElement = videoRefs.current.get(userId);
      if (videoElement && videoElement.srcObject !== stream) {
        videoElement.srcObject = stream;
      }
    });
  }, [localStream, remoteStreams, focusedParticipantId]); // Added focusedParticipantId
  useEffect(() => {
    if (isAudioCall && remoteStreams.size > 0 && callState === "connected") {
      console.log(
        "🎵 Setting up remote audio for audio-only call with multiple users"
      );

      // For multiple users, you might want to mix streams or handle them differently
      // For now, we'll just use the first stream
      const firstStream = Array.from(remoteStreams.values())[0];

      if (firstStream) {
        if (!remoteAudioRef.current) {
          remoteAudioRef.current = new Audio();
        }

        const audioElement = remoteAudioRef.current;
        audioElement.srcObject = firstStream;
        audioElement.muted = false;
        audioElement.volume = 1.0;

        const playAudio = async () => {
          try {
            await audioElement.play();
            console.log("✅ Remote audio playing in audio-only call");
          } catch (error) {
            console.error("❌ Failed to play remote audio:", error);
            const handleInteraction = async () => {
              try {
                await audioElement.play();
              } catch (e) {
                console.error("Still failed to play audio:", e);
              }
              document.removeEventListener("click", handleInteraction);
            };
            document.addEventListener("click", handleInteraction, {
              once: true,
            });
          }
        };

        playAudio();
      }
    }

    return () => {
      if (remoteAudioRef.current) {
        remoteAudioRef.current.pause();
        remoteAudioRef.current.srcObject = null;
      }
    };
  }, [isAudioCall, remoteStreams, callState]);
  const [showAspectRatioTooltip, setShowAspectRatioTooltip] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  useEffect(() => {
    console.log("📱 VideoCallModal remoteImage prop:", remoteImage);
    console.log("📱 VideoCallModal remoteUsername:", remoteUsername);
    console.log("📱 VideoCallModal incomingCall:", incomingCall);
  }, [remoteImage, remoteUsername, incomingCall]);
  const backgroundStyle: CSSProperties = useMemo(
    () => ({
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "#03110ca1",
      backgroundSize: "cover",
      width: "150%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      backdropFilter: "blur(4px)",
      zIndex: 0,
    }),
    []
  );

  const [showMuteTooltip, setShowMuteTooltip] = useState(false);

  const [minimizeCall, setMinimizeCall] = useState(false);
  // Add this useEffect in VideoCallModal

  const [minimizedPosition, setMinimizedPosition] = useState(() => {
    if (typeof window === "undefined") return { x: 20, y: 20 };

    const isMobile = window.innerWidth < 768;

    if (isMobile) {
      // Mobile: center horizontally, place near top
      const mobileWidth = (window.innerWidth * 70) / 100; // 70vw
      const x = (window.innerWidth - mobileWidth) / 2; // Centers it
      return { x, y: 80 };
    } else {
      // Desktop: right side
      return { x: window.innerWidth - 320, y: 80 };
    }
  });
  useEffect(() => {
    const handleResize = () => {
      setMinimizedPosition((prev) => {
        const isMobile = window.innerWidth < 768;

        if (isMobile) {
          const mobileWidth = (window.innerWidth * 70) / 100;
          const x = (window.innerWidth - mobileWidth) / 2;
          return { x, y: prev.y };
        } else {
          return { x: window.innerWidth - 320, y: prev.y };
        }
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  // Add this useEffect to handle video stream restoration
  useEffect(() => {
    if (!focusedParticipantId) {
      // When returning to grid view, ensure all videos have their streams
      setTimeout(() => {
        // Force re-set streams after a short delay to ensure DOM is ready
        Array.from(remoteStreams.entries()).forEach(([userId, stream]) => {
          const videoElement = videoRefs.current.get(userId);
          if (videoElement) {
            videoElement.srcObject = stream;
            videoElement.play().catch(console.error);
          }
        });

        // Also ensure local video
        if (localVideoRef.current && localStream) {
          localVideoRef.current.srcObject = localStream;
          localVideoRef.current.play().catch(console.error);
        }
      }, 100);
    }
  }, [focusedParticipantId, remoteStreams, localStream]);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const minimizedWindowRef = useRef<HTMLDivElement>(null);

  const [showMinimizeTooltip, setShowMinimizeooltip] = useState(false);

  const [showVideoTooltip, setShowVideoTooltip] = useState(false);
  const [showLeaveTooltip, setShowLeaveTooltip] = useState(false);

  useEffect(() => {
    // Handle audio context for better audio processing
    const handleUserInteraction = async () => {
      // This helps with audio processing and echo cancellation
      if (localVideoRef.current?.srcObject) {
        const audioContext = new AudioContext();
        await audioContext.resume();
      }
    };

    // Add click listener to resume audio context
    document.addEventListener("click", handleUserInteraction, { once: true });

    return () => {
      document.removeEventListener("click", handleUserInteraction);
    };
  }, []);
  const handleMuteToggle = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);

    if (localStream) {
      // ✅ USE localStream prop instead of localVideoRef
      const audioTracks = localStream.getAudioTracks();

      console.log(
        `🔊 ${newMutedState ? "MUTING" : "UNMUTING"} ${
          audioTracks.length
        } tracks`
      );

      audioTracks.forEach((track) => {
        track.enabled = !newMutedState;
        console.log(`  Track ${track.id} enabled: ${track.enabled}`);
      });
    }
  };

  const handleMinimize = () => {
    // Add a small delay to see the transition
    setTimeout(() => {
      setMinimizeCall(true);
    }, 50);
  };

  const handleMaximize = () => {
    // Add a small delay to see the transition
    setTimeout(() => {
      setMinimizeCall(false);
    }, 50);
  };
  // Drag functions - UPDATED VERSION
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only allow dragging from the video container area
    const target = e.target as HTMLElement;

    // Check if we're clicking on control buttons
    if (
      target.closest(".minimized-control-btn") ||
      target.closest(".minimized-controls") ||
      target.closest(".minimized-control-buttons")
    ) {
      return; // Don't drag if clicking on controls
    }

    // Allow dragging from anywhere else in the minimized window
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };
  // Add this to VideoCallModal component

  // TEMPORARY: Add aggressive debug logging
  // Replace your current handleTouchStart function with this:
  const handleTouchStart = (e: React.TouchEvent) => {
    const target = e.target as HTMLElement;

    // Don't drag if clicking controls
    if (
      target.closest(".minimized-control-btn") ||
      target.closest(".minimized-controls") ||
      target.closest(".minimized-control-buttons")
    ) {
      return;
    }

    // Get the element's current position
    const rect = e.currentTarget.getBoundingClientRect();

    // Store the offset between touch point and element's top-left
    setDragOffset({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top,
    });

    setIsDragging(true);
    console.log("📱 TOUCH START");
  };
  const ConnectionIndicator: FC<{
    userId?: string;
    username?: string;
    className?: string;
  }> = ({ userId, username, className }) => {
    const [showDetails, setShowDetails] = useState(false);

    const connectionInfo = getConnectionStatus(userId);
    const { status, stats } = connectionInfo;

    // Add status text mapping
    const statusTextMap: Record<string, string> = {
      good: t.connectionGood || "Good",
      fair: t.connectionFair || "Fair",
      poor: t.connectionPoor || "Poor",
      disconnected: t.connectionDisconnected || "Disconnected",
    };

    // Get status text with fallback
    const statusText = statusTextMap[status] || "Unknown";

    const getStatusIcon = () => {
      switch (status) {
        case "good":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-wifi"
              viewBox="0 0 16 16"
            >
              <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049" />
              <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z" />
            </svg>
          );
        case "fair":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-wifi-2"
              viewBox="0 0 16 16"
            >
              <path d="M13.229 8.271c.216-.216.194-.578-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336c.205.132.48.108.652-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.408.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.611-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .708 0l.707-.707z" />
            </svg>
          );
        case "poor":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-wifi-1"
              viewBox="0 0 16 16"
            >
              <path d="M11.046 10.454c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.611-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.708-.707z" />
            </svg>
          );
        case "disconnected":
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-wifi-off"
              viewBox="0 0 16 16"
            >
              <path d="M10.706 3.294A12.6 12.6 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4q.946 0 1.852.148zM8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065 8.45 8.45 0 0 1 3.51-1.27zm2.596 1.404.785-.785q.947.362 1.785.907a.482.482 0 0 1 .063.745.525.525 0 0 1-.652.065 8.5 8.5 0 0 0-1.98-.932zM8 10l.933-.933a6.5 6.5 0 0 1 2.013.637c.285.145.326.524.1.75l-.015.015a.53.53 0 0 1-.611.09A5.5 5.5 0 0 0 8 10m4.905-4.905.747-.747q.886.451 1.685 1.03a.485.485 0 0 1 .047.737.52.52 0 0 1-.668.05 11.5 11.5 0 0 0-1.811-1.07M9.02 11.78c.238.14.236.464.04.66l-.707.706a.5.5 0 0 1-.707 0l-.707-.707c-.195-.195-.197-.518.04-.66A2 2 0 0 1 8 11.5c.374 0 .723.102 1.021.28zm4.355-9.905a.53.53 0 0 1 .75.75l-10.75 10.75a.53.53 0 0 1-.75-.75z" />
            </svg>
          );
        default:
          return (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill="currentColor"
              className="bi bi-wifi"
              viewBox="0 0 16 16"
            >
              <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049" />
              <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z" />
            </svg>
          );
      }
    };

    return (
      <div
        className={`connection-indicator connection-status-${status} ${
          className || ""
        }`}
        onMouseEnter={() => setShowDetails(true)}
        onMouseLeave={() => setShowDetails(false)}
        style={{ cursor: "pointer" }}
      >
        <span className="d-flex align-items-center gap-1 justify-content-center">
          {getStatusIcon()} {window.innerWidth < 768 ? null : statusText}
        </span>{" "}
        {/* Added status text */}
        {stats && (stats.latency || stats.packetLoss || stats.bitrate) && (
          <div className="connection-tooltip">
            <div className="connection-details">
              {username && (
                <div className="connection-detail-row">
                  <span className="connection-detail-label">User:</span>
                  <span className="connection-detail-value">{username}</span>
                </div>
              )}
              {stats.latency !== undefined && (
                <div className="connection-detail-row">
                  <span className="connection-detail-label">
                    {t.latency || "Latency"}:
                  </span>
                  <span className="connection-detail-value">
                    {stats.latency}ms
                  </span>
                </div>
              )}
              {stats.packetLoss !== undefined && (
                <div className="connection-detail-row">
                  <span className="connection-detail-label">
                    {t.packetLoss || "Packet Loss"}:
                  </span>
                  <span className="connection-detail-value">
                    {stats.packetLoss}%
                  </span>
                </div>
              )}
              {stats.bitrate !== undefined && (
                <div className="connection-detail-row">
                  <span className="connection-detail-label">
                    {t.bitrate || "Bitrate"}:
                  </span>
                  <span className="connection-detail-value">
                    {stats.bitrate}kbps
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      // Calculate new position with boundary checks
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Boundary checking to keep window within viewport
      const windowWidth = minimizedWindowRef.current?.offsetWidth || 300;
      const windowHeight = minimizedWindowRef.current?.offsetHeight || 180;

      const boundedX = Math.max(
        10,
        Math.min(newX, window.innerWidth - windowWidth - 10)
      );
      const boundedY = Math.max(
        10,
        Math.min(newY, window.innerHeight - windowHeight - 10)
      );

      setMinimizedPosition({
        x: boundedX,
        y: boundedY,
      });
    };
    // Add this useEffect for cleanup

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault();

      const touch = e.touches[0];

      let newX = touch.clientX - dragOffset.x;
      let newY = touch.clientY - dragOffset.y;

      const windowWidth = minimizedWindowRef.current?.offsetWidth || 210;
      const windowHeight = minimizedWindowRef.current?.offsetHeight || 180;

      newX = Math.max(0, Math.min(newX, window.innerWidth - windowWidth));
      newY = Math.max(
        50,
        Math.min(newY, window.innerHeight - windowHeight - 20)
      );

      console.log("🎯 setMinimizedPosition:", { x: newX, y: newY }); // ← ADD THIS
      setMinimizedPosition({
        x: newX,
        y: newY,
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      // Add both mouse and touch events
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("touchend", handleTouchEnd);

      // Add styles for better dragging experience
      if (minimizedWindowRef.current) {
        minimizedWindowRef.current.style.cursor = "grabbing";
        minimizedWindowRef.current.style.userSelect = "none";
        minimizedWindowRef.current.style.transition = "none";
      }

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);

        // Reset cursor and styles
        if (minimizedWindowRef.current) {
          minimizedWindowRef.current.style.cursor = "grab";
          minimizedWindowRef.current.style.userSelect = "auto";
          minimizedWindowRef.current.style.transition = "all 0.3s ease-in-out";
        }
      };
    }
  }, [isDragging, dragOffset]);

  const handleVideoToggle = () => {
    const newVideoState = !isVideoOff;
    setIsVideoOff(newVideoState);

    if (localStream) {
      // ✅ USE localStream prop
      const videoTracks = localStream.getVideoTracks();

      videoTracks.forEach((track) => {
        track.enabled = !newVideoState;
      });
    }
  };
  const [swapVideos, setSwapVideos] = useState(false);

  const handleChangeVideoPIPS = () => {
    console.log("Swapped Screens");

    setSwapVideos(!swapVideos);
  };
  useEffect(() => {
    const handleOrientationChange = () => {
      if (window.innerWidth < 768 && !isAudioCall) {
        // Auto-detect orientation based on screen dimensions
        const isPortraitMode = window.innerHeight > window.innerWidth;
        setAspectRatio(isPortraitMode ? "portrait" : "landscape");
      }
    };

    // Set initial aspect ratio based on current orientation
    handleOrientationChange();

    window.addEventListener("resize", handleOrientationChange);
    window.addEventListener("orientationchange", handleOrientationChange);

    return () => {
      window.removeEventListener("resize", handleOrientationChange);
      window.removeEventListener("orientationchange", handleOrientationChange);
    };
  }, [isAudioCall]);
  useEffect(() => {
    if (callState !== "connected") return;
    const timer = setInterval(() => setCallDuration((p) => p + 1), 1000);
    return () => clearInterval(timer);
  }, [callState]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const sec = s % 60;
    return h > 0
      ? `${String(h).padStart(2, "0")}:${String(m % 60).padStart(
          2,
          "0"
        )}:${String(sec).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  useEffect(() => {
    if (callState !== "connected") return;

    if (swapVideos) {
      // When swapped: Local on big screen, Remote on PIP
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
      }
      if (remoteVideoRef.current && remoteStreams.size > 0) {
        remoteVideoRef.current.srcObject = Array.from(
          remoteStreams.values()
        )[0];
      }
    } else {
      // Normal: Remote on big screen, Local on PIP
      if (remoteVideoRef.current && remoteStreams.size > 0) {
        remoteVideoRef.current.srcObject = Array.from(
          remoteStreams.values()
        )[0];
        remoteVideoRef.current.muted = false;
        remoteVideoRef.current.volume = 1.0;
      }
      if (localVideoRef.current && localStream) {
        localVideoRef.current.srcObject = localStream;
        localVideoRef.current.muted = true;
      }
    }
  }, [swapVideos, remoteStreams, localStream, callState]);
  // Add this as a last resort - it will force play every second when connected
  const videoItemStyle = {
    "--click-to-zoom-text": `"${t.clicktoZoom}"`,
    "--click-to-exit-text": `"${t.clicktoExit}"`,
  } as React.CSSProperties;
  return (
    <>
      {isAudioCall && (
        <audio
          ref={remoteAudioRef}
          style={{ display: "none" }}
          autoPlay
          playsInline
        />
      )}
      <style>{`

      .multiple-users {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: white;
}

.user-count {
  font-size:26px;
  font-weight: bold;
}

.users-text {
  font-size: 10px;
  opacity: 0.8;
}

.minimized-video-grid {
  width: 100%;
  height: 100%;
}

.minimized-video-grid video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

        .video-call-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease-in;
          font-family: inherit;
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
.video-grid {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 10px;
  padding: 10px;
}

.video-item {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  min-height: 200px;
}

.video-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.video-overlay {
  position: absolute;
  bottom: 10px;
  left: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 12px;
  font-size: 12px;
}

.user-name {
  font-weight: 500;
}

.participant-count {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

/* Responsive grid */
@media (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
  
  .video-item {
    min-height: 150px;
  }
}

/* For 1-2 participants */
.video-grid[style*="gridTemplateColumns: 1fr"] .video-item {
  min-height: 300px;
}

/* For 3+ participants */
.video-grid[style*="gridTemplateColumns: repeat(2, 1fr)"] .video-item {
  min-height: 200px;
}
        .call-container,
        .calling-container,
        .error-container {
          text-align: center;
          max-width: 400px;
          min-width: 300px;
          display: flex;
          justify-content: center;
          flex-direction: column;
          padding: 40px 30px;
        }

        .caller-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          margin: 0 auto 20px;
          background: rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .caller-name {
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .calling-status {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
        }

        .call-btn {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: none;
          cursor: pointer;
          font-size: 20px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
        }

        .call-btn-accept {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }

        .call-btn-accept:hover {
          transform: scale(1.1);
          background: rgba(255, 255, 255, 0.3);
        }

        .call-btn-reject {
          background: rgba(179, 25, 25, 0.7);
          color: white;
        }

        .call-btn-reject:hover {
          transform: scale(1.1);
          background: rgba(159, 20, 20, 0.8);
        }

        .calling-icon {
          width: 48px;
          height: 48px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 10px;
        }

        .calling-title {
          font-size: 22px;
          font-weight: 700;
          color: #fff;
          margin: 0 0 8px 0;
        }

        .calling-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 25px 0;
        }

        .loader-dots {
          display: flex;
          justify-content: center;
          gap: 8px;
        }

        .dot-animate {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.7);
          animation: bounce 1.4s infinite;
        }

        .dot-animate:nth-child(2) { animation-delay: 0.2s; }
        .dot-animate:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
          0%, 80%, 100% {
            opacity: 0.5;
            transform: translateY(0);
          }
          40% {
            opacity: 1;
            transform: translateY(-10px);
          }
        }

        .error-icon {
          font-size: 48px;
          margin-bottom: 20px;
          color: rgba(179, 25, 25, 0.8);
        }

        .error-title {
          font-size: 20px;
          font-weight: 700;
          color: rgba(179, 25, 25, 0.9);
          margin: 0 0 8px 0;
        }

        .error-message {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.7);
          margin: 0 0 25px 0;
          line-height: 1.5;
        }

        .close-btn {
          background: rgba(179, 25, 25, 0.8);
          color: white;
          border: none;
          padding: 10px 24px;
          border-radius: 25px;
          font-weight: bold;
          text-transform: uppercase;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .close-btn:hover {
          background: rgba(159, 20, 20, 0.9);
          transform: scale(1.05);
        }


/* Connection Indicator Styles */
.connection-indicator {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.connection-status-good {
  background: rgba(46, 204, 113, 0.2);
  color: #2ecc71;
}

.connection-status-fair {
  background: rgba(241, 196, 15, 0.2);
  color: #f1c40f;
}

.connection-status-poor {
  background: rgba(231, 76, 60, 0.2);
  color: #e74c3c;
}

.connection-status-disconnected {
  background: rgba(149, 165, 166, 0.2);
  color: #95a5a6;
}

.connection-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.connection-dot-good {
  background: #2ecc71;
  box-shadow: 0 0 8px #2ecc71;
}

.connection-dot-fair {
  background: #f1c40f;
  box-shadow: 0 0 8px #f1c40f;
}

.connection-dot-poor {
  background: #e74c3c;
  box-shadow: 0 0 8px #e74c3c;
}

.connection-dot-disconnected {
  background: #95a5a6;
  animation: none;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

/* Latency display */
.latency-display {
  font-size: 10px;
  opacity: 0.8;
}

/* Tooltip for connection details */
.connection-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 11px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 10001;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.connection-indicator:hover .connection-tooltip {
  opacity: 1;
  visibility: visible;
}

.connection-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.connection-detail-row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}

.connection-detail-label {
  opacity: 0.7;
}

.connection-detail-value {
  font-weight: 600;
}
/* MINIMIZED CALL WINDOW - FIXED VERSION */
.minimized-call-window {
  position: fixed;
  width: 300px;
  height: 180px;
  backdrop-filter: blur(20px);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  z-index: 10001;
  overflow: hidden;
  cursor: grab;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  user-select: none;
  
  /* CRITICAL: Make the entire window click-through by default */
  pointer-events: auto;
   touch-action: none; /* Important for touch dragging */
  -webkit-user-select: none; /* Safari */
  -webkit-touch-callout: none; 
}

.minimized-call-window:hover {
  transform: scale(1.02);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5);
}

.minimized-call-window:active {
  cursor: grabbing;
}

.minimized-call-window.dragging {
  cursor: grabbing;
  opacity: 0.9;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.6);
  transform: scale(1.02);
}

/* RE-ENABLE pointer-events ONLY for specific interactive elements */
.minimized-call-window .minimized-controls,
.minimized-call-window .minimized-control-btn,
.minimized-call-window .minimized-control-buttons {
  pointer-events: auto;
}

/* Video container - allow dragging but not other interactions */
.minimized-video-container {
  width: 100%;
  height: 120px;
  background: rgba(0, 0, 0, 0.8);
  position: relative;
  overflow: hidden;
  cursor: grab;
  /* Keep pointer-events: none for the video area */
  pointer-events: none;
}

/* Controls area - enable interactions */
.minimized-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
    background: #083d1d70;
           border-radius:0 0  24px 24px ;
          border: 1px solid rgba(255, 255, 255, 0.2);
  cursor: auto;
  pointer-events: auto;
  /* This area gets pointer-events: auto from parent rule */
}

.minimized-control-btn {
  cursor: pointer;
  pointer-events: auto;
  /* These get pointer-events: auto from parent rule */
}
  .minimized-control-buttons {
  pointer-events: auto; /* Button container gets interactions */
}

.minimized-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none; /* Keep video without pointer events */
}

.minimized-user-info {
  display: flex;
  align-items: center;
  pointer-events: none; /* Text info shouldn't be interactive */
}

.minimized-user-avatar {
  width: 34px;
  height: 34px;
  pointer-events: none; /* Avatar shouldn't be interactive */
}
.minimized-control-buttons {
  display: flex;
  gap: 6px;
}

.minimized-control-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.minimized-control-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: scale(1.1);
}
                       

.minimized-control-btn.end-call {
  background: rgba(179, 25, 25, 1);
}

.minimized-control-btn.end-call:hover {
  background: rgba(124, 19, 19, 1);
}

.video-call-modal.minimized {
  background: transparent;
  pointer-events: none 
}

.video-call-modal.minimized > div:first-child {
  display: none;
}


/* Mobile full-width minimized window */
@media (max-width: 768px) {
  .minimized-call-window {
    width: 70vw !important;
    height: 180px !important;
    position: fixed !important;
    border-radius: 24px !important;
    
    /* DELETE THESE - let inline styles control left/top */
    /* left: 15vw !important;  */
    /* top: 80px !important;   */
    /* transform: none !important; */
    
    cursor: grab !important;
    touch-action: none;
  }

  .minimized-call-window.dragging {
    cursor: grabbing !important;
    transform: none !important;
  }

  .minimized-call-window:hover {
    transform: none !important;
  }

  .minimized-video-container {
    height: 120px !important;
  }
}

/* Smooth transitions for minimize/maximize */
.video-call-modal {
  transition: all 0.3s ease-in-out;
}

.minimized-call-window {
  transition: all 0.3s ease-in-out;
}

.active-call-container {
  transition: all 0.3s ease-in-out;
}

/* Fade animations */
.fade-enter {
  opacity: 0;
  transform: scale(0.9);
}

.fade-enter-active {
  opacity: 1;
  transform: scale(1);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-exit {
  opacity: 1;
  transform: scale(1);
}

.fade-exit-active {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

/* Slide up/down animations for mobile */
.slide-up-enter {
  transform: translateY(100%);
}

.slide-up-enter-active {
  transform: translateY(0);
  transition: transform 0.3s ease;
}

.slide-up-exit {
  transform: translateY(0);
}

.slide-up-exit-active {
  transform: translateY(100%);
  transition: transform 0.3s ease;
}
        .active-call-container {
          width: 95%;
          max-width: 1200px;
          height: 90vh;
            background: #0630169c;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          border-radius: 24px ;
          overflow: hidden;
          display: flex;
          flex-direction: column;
        }

       .video-container, .audio-container {
  flex: 1;
  display: flex;
  position: relative;
  background: rgba(0, 0, 0, 0.72);
  overflow: hidden;
  border-radius: 24px 24px 0 0;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
}

.remote-video {
  width: 100%;
  height: 100%;
  transform: scaleX(-1);
  transition: all 0.3s ease;
}

/* Landscape - crop to fill */
.video-container.landscape .remote-video {
  object-fit: cover;
}

/* Portrait - show full video with letterboxing */
.video-container.portrait .remote-video {
  object-fit: contain;
  background: #000; /* Black bars color */
}
        .video-placeholder {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-direction: column;
                      background: #0a4b2470;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          gap: 16px;
        }

        .video-placeholder-icon {
          font-size: 48px;
          opacity: 0.7;
        }

        .local-pip {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 160px;
          height: 90px;
          border-radius: 12px;
          overflow: hidden;
           box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                      background: rgba(0, 0, 0, 0.22);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
          z-index: 10;
        }

        .local-video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scaleX(-1);
        }

        .call-info-badge {
          position: absolute;
          top: 20px;
          left: 20px;
          color: #fff;
          display: flex;
          
          align-items: center;
          backdrop-filter: blur(10px);
        }
/* Add to your existing CSS */
.focused-video-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.focused-video {
  width: 100%;
  height: 100%;
  position: relative;
}

.focused-video video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}

.focused-video .video-overlay {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  font-size: 14px;
  border-radius: 20px;
}

/* Add tooltip text */
.video-item:hover::after {
  content: ${window.innerWidth >= 768 ? "var(--click-to-zoom-text)" : "none"};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
}

.focused-video-container:hover::after {
   content: ${window.innerWidth >= 768 ? "var(--click-to-exit-text)" : "none"};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  pointer-events: none;
  z-index: 10;
}
  .focused-video-container {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.focused-video {
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
}

.focused-video video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #000;
}




        .call-info-badge.remote-name {
          left: auto;
          right: 20px;
        }
           .call-info-badge.remote-conn {
          right: auto;
          bottom:20px;
         top:auto;
          left: 00px;
        }
               .call-info-badge.remote-conn-video {
          left: auto;
          bottom:20px;
         top:auto;
          right: 10px;
        }
       
.name-of-displayed {
          position: absolute;
          bottom: 20px;
          display: flex;
          align-items: center;
          backdrop-filter: blur(10px);
          left: 20px;
        }
        
        .badge-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #20b92d;
        }

        .controls-bar {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 24px;
          background: #083d1d70;
           border-radius:0 0  24px 24px ;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .control-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.1);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.2s ease;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
   .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: scale(1.05);
        }
        .minimize-btn:hover {
          background: rgba(0, 0, 0, 0.83);
          transform: scale(1.05);
        }
                  .minimize-btn {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          border: none;
          background: rgba(0,0,0,0.7);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          transition: all 0.2s ease;
        }

     

        .control-btn.active {
          background: rgba(139, 18, 18, 1);
          border-color: rgba(139, 18, 18, 1);
        }

        .control-btn.end-call {
          background: rgba(179, 25, 25, 1);
          border: none;
        }

        .control-btn.end-call:hover {
          transform: scale(1.05);
          background: rgba(124, 19, 19, 1);
        }
/* Replace your existing speaking-border CSS with this: */
/* Enhanced speaking indicator styles */
.speaking-border {
  border: 3px solid #4CAF50 !important;
  box-shadow: 
    0 0 0 3px rgba(76, 175, 80, 0.4),
    0 0 25px rgba(76, 175, 80, 0.6) !important;
  transition: all 0.2s ease;
  transform: scale(1.05);
}
.video-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  /* Prevent video flickering */
  transform: scaleX(-1);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  perspective: 1000;
  -webkit-perspective: 1000;
}

/* Ensure smooth transitions */
.video-item {
  transition: opacity 0.3s ease;
}

/* Prevent layout shifts */
.video-grid {
  contain: layout style paint;
}
  /* Update your grid CSS */
.video-grid {
  display: grid;
  width: 100%;
  height: 100%;
  gap: 10px;
  padding: 10px;
}

/* Make grid items consistent height */
.video-item {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.3);
  min-height: 0; /* Remove fixed min-height */
  height: 100%; /* Make all items fill available space */
}

/* Ensure videos fill their containers properly */
.video-item video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Single column for 1-2 participants */
.video-grid[style*="gridTemplateColumns: 1fr"] .video-item {
  height: calc(50% - 5px); /* Adjust for gap */
}

/* Two columns for 3+ participants */
.video-grid[style*="gridTemplateColumns: repeat(2, 1fr)"] .video-item {
  height: 100%;
}
.normal-border {
  border: 3px solid transparent !important;
  box-shadow: none !important;
  transition: all 0.3s ease;
  transform: scale(1);
}

.pulse-animation {
  animation: pulse1 1.5s infinite;
}

@keyframes pulse1 {
  0% {
    box-shadow: 
      0 0 0 0 rgba(76, 175, 80, 0.7),
      0 0 0 0 rgba(76, 175, 80, 0.4) !important;
  }
  70% {
    box-shadow: 
      0 0 0 12px rgba(76, 175, 80, 0),
      0 0 0 24px rgba(76, 175, 80, 0) !important;
  }
  100% {
    box-shadow: 
      0 0 0 0 rgba(76, 175, 80, 0),
      0 0 0 0 rgba(76, 175, 80, 0) !important;
  }
}

/* Add a subtle glow effect for better visibility */
.speaking-glow {
  filter: drop-shadow(0 0 8px rgba(76, 175, 80, 0.6));
}

.speaking-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #4CAF50;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0.3; }
}
        @media (max-width: 768px) {
          .call-container,
          .calling-container,
          .error-container {
            padding: 30px 20px;
            margin: 20px;
          }

          .active-call-container {
            height: 90vh;
            margin: 10px;
          }

          .local-pip {
            width: 67px;
            height: 120px;

            bottom: 15px;
            right: 15px;
          }

         
          .control-btn {
            width: 44px;
            height: 44px;
            font-size: 18px;
          }

          .call-btn {
            width: 45px;
            height: 45px;
          }
            /* Add these to your existing CSS */

        }
      `}</style>

      <div className={`video-call-modal ${minimizeCall ? "minimized" : ""}`}>
        <div style={backgroundStyle}></div>

        <AnimatePresence mode="wait">
          {!minimizeCall && (
            <motion.div
              key="maximized-view"
              style={{
                position: "relative",
                zIndex: 1,
                width: "100%",
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <AnimatePresence mode="wait">
                {(callState === "ringing" ||
                  callState === "calling" ||
                  callState === "failed") && (
                  <motion.div
                    key="modal"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.3 }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    {/* INCOMING CALL */}
                    {(callState === "ringing" || incomingCall) && (
                      <div className="call-container glass-popup rounded-5 p-5 py-4">
                        <motion.div
                          animate={{
                            transform: [
                              "translateY(0px)",
                              "translateY(-7.5px)",
                              "translateY(0px)",
                            ], // Green -> Light Green -> Green
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeIn",
                          }}
                          className="calling-icon"
                        >
                          {isAudioCall ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="white"
                              className="bi bi-telephone-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="white"
                              className="bi bi-camera-video-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                              />
                            </svg>
                          )}
                        </motion.div>
                        <p className="calling-status m-0 mb-1">
                          {isAudioCall
                            ? t.incomingAudioCallFrom
                            : t.incomingVideoCallFrom}
                        </p>
                        <div className="d-flex align-items-center justify-content-center gap-2">
                          <div
                            className="d-flex gap-2  align-items-center justify-content-center mb-3 mt-2 px-4 py-2 rounded-5"
                            style={{
                              width: "fit-content",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              boxShadow: " 0 8px 32px rgba(0, 0, 0, 0.3);",
                            }}
                          >
                            {!remoteImage && (
                              <img
                                src={logo}
                                className="rounded-5"
                                width={"42px"}
                                alt={remoteImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}
                            {remoteImage && (
                              <img
                                className="rounded-5"
                                src={remoteImage}
                                width={"42px"}
                                alt={remoteImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}
                            <span
                              className="fw-bold text-capitalize text-truncate "
                              style={{
                                maxWidth:
                                  window.innerWidth < 768 ? "50px" : "80px",
                              }}
                            >
                              {incomingCall?.fromUsername}
                            </span>
                          </div>
                          {!isDMChannel && (
                            // Regular channel call
                            <div
                              className="d-flex gap-2 align-items-center justify-content-center mb-3 mt-2 px-4 py-2 rounded-5"
                              style={{
                                width: "fit-content",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                boxShadow: " 0 8px 32px rgba(0, 0, 0, 0.3);",
                              }}
                            >
                              {!remoteChannelImage ? (
                                <img
                                  src={logo}
                                  className="rounded-4"
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              ) : (
                                <img
                                  className="rounded-4"
                                  src={remoteChannelImage}
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              <span className="fw-bold text-capitalize text-truncate">
                                @{remoteChannelName}
                              </span>
                            </div>
                          )}
                        </div>

                        <section className="dots-container mt-3">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </section>

                        <div className="call-buttons d-inline-flex flex-wrap gap-1  mt-4 justify-content-center align-items-center">
                          <button
                            className="btn  rounded-4"
                            style={{
                              background: "rgba(179, 25, 25, 1)",
                              color: "white",
                            }}
                            onClick={onReject}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(133, 17, 17, 1)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(179, 25, 25, 1)";
                            }}
                          >
                            {t.decline}
                          </button>
                          <button
                            className="btn  fw-bold rounded-4 text-uppercase "
                            style={{
                              background: "#1f8a38ff",
                              color: "white",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#17682aff";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "#1f8a38ff";
                            }}
                            onClick={onAnswer}
                          >
                            {t.accept}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* CALLING STATE */}
                    {callState === "calling" && (
                      <div className="calling-container glass-popup rounded-5 p-5 py-4">
                        <motion.div
                          animate={{
                            transform: [
                              "translateY(0px)",
                              "translateY(-7.5px)",
                              "translateY(0px)",
                            ], // Green -> Light Green -> Green
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatType: "reverse",
                            ease: "easeIn",
                          }}
                          className="calling-icon"
                        >
                          {!isAudioCallVar ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="24"
                              fill="white"
                              className="bi bi-camera-video-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              fill="white"
                              className="bi bi-telephone-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                              />
                            </svg>
                          )}
                        </motion.div>
                        <h3 className="fw-bold mb-3">{t.calling}</h3>
                        <div className="d-flex align-items-center justify-content-center">
                          <div
                            className="d-flex gap-2  align-items-center justify-content-center mb-3 mt-2 px-4 py-2 rounded-5"
                            style={{
                              width: "fit-content",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                              boxShadow: " 0 8px 32px rgba(0, 0, 0, 0.3);",
                            }}
                          >
                            {!remoteChannelImage && !isDMChannel && (
                              <img
                                src={logo}
                                className="rounded-4"
                                width={"42px"}
                                alt={remoteChannelImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}

                            {remoteChannelImage && !isDMChannel && (
                              <img
                                className="rounded-4"
                                src={remoteChannelImage}
                                width={"42px"}
                                alt={remoteChannelImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}
                            {!dmchannelImage && isDMChannel && (
                              <img
                                className="rounded-4"
                                src={logo}
                                width={"42px"}
                                alt={dmchannelImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}
                            {dmchannelImage && isDMChannel && (
                              <img
                                className="rounded-5"
                                src={dmchannelImage}
                                width={"42px"}
                                alt={dmchannelImage}
                                style={{ filter: "brightness(0) invert(1)" }}
                              />
                            )}
                            <span
                              className="fw-bold text-capitalize text-truncate"
                              style={{
                                maxWidth:
                                  window.innerWidth < 768 ? "100px" : "150px",
                              }}
                            >
                              {isDMChannel ? dmchannelName : remoteChannelName}
                            </span>
                          </div>
                        </div>

                        <section className="dots-container mt-3">
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                          <div className="dot"></div>
                        </section>
                      </div>
                    )}
                    {callState === "failed" && (
                      <div className="error-container rounded-5">
                        <div className="error-icon">❌</div>
                        <h3 className="error-title">{t.callFailed}</h3>
                        <p className="error-message">
                          {callError || t.unableToEstablishConnection}
                        </p>
                        <button onClick={onEndCall} className="close-btn">
                          {t.close}
                        </button>
                      </div>
                    )}
                  </motion.div>
                )}
                {/* ACTIVE CALL */}
                {callState === "connected" && (
                  <motion.div
                    className={`active-call `}
                    key="connected"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div
                      className="active-call-container"
                      style={{
                        height:
                          isAudioCall && window.innerWidth < 768
                            ? "45vh"
                            : isAudioCall
                            ? "30vh"
                            : "90vh",
                        maxWidth: isAudioCall ? "1000px" : "",
                      }}
                    >
                      {isAudioCall ? (
                        // Audio-only UI
                        <div
                          className={`audio-container ${
                            isAudioCall && window.innerWidth < 768 ? "pt-5" : ""
                          }`}
                        >
                          <div className="call-info  d-flex align-items-center gap-3 flex-grow-1 px-3 py-2 justify-content-center flex-wrap">
                            {/* Render all remote participants */}
                            {Array.from(remoteStreams.entries()).map(
                              ([userId, stream]) => {
                                const participant = participantData.get(userId);
                                return (
                                  <div
                                    key={userId}
                                    className="d-flex flex-column gap-3 align-items-center justify-content-center"
                                  >
                                    {participant?.image ? (
                                      <img
                                        className={`rounded-circle ${
                                          displayRemoteSpeaking
                                            ? "speaking-border pulse-animation speaking-glow"
                                            : "normal-border"
                                        }`}
                                        src={participant.image}
                                        width={"100px"}
                                        height={"100px"}
                                        alt={participant.username}
                                        style={{
                                          objectFit: "cover",
                                          border: "3px solid transparent",
                                          transition: "all 0.3s ease",
                                        }}
                                      />
                                    ) : (
                                      <div
                                        className={`rounded-circle ${
                                          displayRemoteSpeaking
                                            ? "speaking-border pulse-animation speaking-glow"
                                            : "normal-border"
                                        }`}
                                        style={{
                                          width: "100px",
                                          height: "100px",
                                          background:
                                            "rgba(255, 255, 255, 0.1)",
                                          display: "flex",
                                          alignItems: "center",
                                          justifyContent: "center",
                                          border: "3px solid transparent",
                                          transition: "all 0.3s ease",
                                        }}
                                      >
                                        <span className="text-white fw-bold">
                                          {participant?.username
                                            ?.charAt(0)
                                            ?.toUpperCase() || "U"}
                                        </span>
                                      </div>
                                    )}

                                    <div className="d-inline-flex  align-items-center">
                                      <span
                                        className="user-name text-truncate d-inline-block"
                                        style={{
                                          maxWidth:
                                            window.innerWidth < 768
                                              ? "60px"
                                              : "70px",
                                        }}
                                      >
                                        {participant?.username ||
                                          `${t.user} ${userId.slice(0, 6)}`}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                            )}

                            {/* Local user */}
                            <div className="d-flex flex-column gap-3 align-items-center justify-content-center">
                              {user.image ? (
                                <img
                                  className={`rounded-circle ${
                                    displayLocalSpeaking && !isMuted
                                      ? "speaking-border pulse-animation speaking-glow"
                                      : "normal-border"
                                  }`}
                                  src={user.image}
                                  width={"100px"}
                                  height={"100px"}
                                  alt={user.username}
                                  style={{
                                    objectFit: "cover",
                                    border: "3px solid transparent",
                                    transition: "all 0.3s ease",
                                  }}
                                />
                              ) : (
                                <div
                                  className={`rounded-circle ${
                                    displayLocalSpeaking && !isMuted
                                      ? "speaking-border pulse-animation speaking-glow"
                                      : "normal-border"
                                  }`}
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    background: "rgba(255, 255, 255, 0.1)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    border: "3px solid transparent",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  <span className="text-white fw-bold">
                                    {user.username?.charAt(0)?.toUpperCase() ||
                                      "Y"}
                                  </span>
                                </div>
                              )}
                              <div className="d-inline-flex  align-items-center">
                                <span className="user-name   d-inline-flex  align-items-center">
                                  <span
                                    className=" text-truncate d-inline-block"
                                    style={{
                                      maxWidth:
                                        window.innerWidth < 768
                                          ? "50px"
                                          : "70px",
                                    }}
                                  >
                                    {user.username}
                                  </span>
                                  &nbsp;({t.you})
                                </span>
                              </div>
                            </div>
                          </div>

                          <div
                            className="call-info-badge remote-conn d-flex align-items-center justify-content-center gap-3 px-3 py-2 rounded-5"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            <ConnectionIndicator
                              userId={user.id}
                              username={
                                user?.username ||
                                `${t.user} ${user.id.slice(0, 6)}`
                              }
                            />
                          </div>
                          <div
                            className="call-info-badge remote-name d-flex align-items-center justify-content-center gap-3 px-3 py-2 rounded-5"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {!remoteChannelImage && !isDMChannel && (
                                <img
                                  src={logo}
                                  className="rounded-4"
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}

                              {remoteChannelImage && !isDMChannel && (
                                <img
                                  className="rounded-4"
                                  src={remoteChannelImage}
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              {!remoteImage && isDMChannel && (
                                <img
                                  className="rounded-4"
                                  src={logo}
                                  width={"42px"}
                                  alt={remoteImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              {remoteImage && isDMChannel && (
                                <img
                                  className="rounded-5"
                                  src={remoteImage}
                                  width={"42px"}
                                  alt={remoteImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              <div className="d-inline-flex  align-items-center">
                                <span
                                  className="text-capitalize fw-bold text-truncate d-inline-block"
                                  style={{
                                    maxWidth:
                                      window.innerWidth < 768 ? "70px" : "auto",
                                  }}
                                >
                                  {isDMChannel
                                    ? remoteUsername
                                    : remoteChannelName}
                                </span>
                              </div>
                            </div>
                            {(isVideoOff || isMuted) && (
                              <div className="d-flex align-items-center gap-2">
                                {isMuted ? (
                                  <div
                                    className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: "rgba(179, 25, 25, 1)",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="22"
                                      fill="white"
                                      className="bi bi-mic-mute-fill"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3" />
                                      <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                                    </svg>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                          <div className="call-info-badge  d-flex align-items-center justify-content-center gap-3  rounded-5">
                            <button
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setShowMinimizeooltip(true);
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                setShowMinimizeooltip(false);
                              }}
                              className={`control-btn }`}
                              onClick={handleMinimize}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-list"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                                />
                              </svg>
                              {showMinimizeTooltip &&
                                window.innerWidth >= 768 && (
                                  <div
                                    className="custom-tooltip rounded-5"
                                    style={{
                                      position: "absolute",
                                      left: "50%",
                                      transform: "translateX(25%)",
                                      bottom: "15%",
                                      background: "rgba(0, 0, 0, 0.9)",
                                      color: "white",
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      whiteSpace: "nowrap",
                                      zIndex: 10000,
                                      backdropFilter: "blur(10px)",
                                      border:
                                        "1px solid rgba(255, 255, 255, 0.15)",
                                      boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.3)",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t.minimize}
                                  </div>
                                )}
                            </button>
                          </div>
                        </div>
                      ) : (
                        // Video call UI (your existing video container)
                        <div className={`video-container ${aspectRatio}`}>
                          {/* Main video area - show multiple videos in grid */}
                          {focusedParticipantId ? (
                            // FOCUSED VIEW - Single participant takes full container
                            <div
                              className="focused-video-container"
                              style={{
                                ...videoItemStyle,
                                width: "100%",
                                height: "100%",
                                position: "relative",
                                cursor: "pointer",
                              }}
                              onClick={() => setFocusedParticipantId(null)} // Click to exit focused view
                            >
                              {focusedParticipantId === "local" ? (
                                // Focus on local video
                                <div className="video-item focused-video">
                                  <video
                                    ref={localVideoRef}
                                    autoPlay
                                    playsInline
                                    muted={true}
                                    className="remote-video"
                                    style={{ transform: "scaleX(-1)" }}
                                  />
                                  <div className="video-overlay rounded-5">
                                    {user.image ? (
                                      <img
                                        src={user.image}
                                        width={"24px"}
                                        height={"24px"}
                                        alt={user.username}
                                        className="rounded-circle me-2"
                                        style={{ objectFit: "cover" }}
                                      />
                                    ) : (
                                      <div
                                        className="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                                        style={{
                                          width: "24px",
                                          height: "24px",
                                          background:
                                            "rgba(255, 255, 255, 0.3)",
                                          fontSize: "10px",
                                        }}
                                      >
                                        {user.username
                                          ?.charAt(0)
                                          ?.toUpperCase() || "Y"}
                                      </div>
                                    )}
                                    <div className="d-inline-flex  align-items-center">
                                      <span
                                        className="user-name text-truncate d-inline-block"
                                        style={{
                                          maxWidth:
                                            window.innerWidth < 768
                                              ? "150px"
                                              : "auto",
                                        }}
                                      >
                                        {user.username} ({t.you})
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                // Focus on remote participant
                                Array.from(remoteStreams.entries()).map(
                                  ([userId, stream]) => {
                                    if (userId === focusedParticipantId) {
                                      const participant =
                                        participantData.get(userId);
                                      return (
                                        <div
                                          key={userId}
                                          className="video-item focused-video"
                                        >
                                          <video
                                            autoPlay
                                            playsInline
                                            muted={false}
                                            className="remote-video"
                                            style={{ transform: "scaleX(-1)" }}
                                            ref={(el) => {
                                              if (el) {
                                                videoRefs.current.set(
                                                  userId,
                                                  el
                                                );
                                                if (el.srcObject !== stream) {
                                                  el.srcObject = stream;
                                                }
                                              }
                                            }}
                                            onLoadedMetadata={(e) => {
                                              const video =
                                                e.target as HTMLVideoElement;
                                              video
                                                .play()
                                                .catch((e) =>
                                                  console.log(
                                                    `⚠️ Focused video play failed:`,
                                                    e
                                                  )
                                                );
                                            }}
                                          />
                                          <div className="video-overlay rounded-5">
                                            {participant?.image ? (
                                              <img
                                                src={participant.image}
                                                width={"24px"}
                                                height={"24px"}
                                                alt={participant.username}
                                                className="rounded-circle me-2"
                                                style={{ objectFit: "cover" }}
                                              />
                                            ) : (
                                              <div
                                                className="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                                                style={{
                                                  width: "24px",
                                                  height: "24px",
                                                  background:
                                                    "rgba(255, 255, 255, 0.3)",
                                                  fontSize: "10px",
                                                  color: "white",
                                                }}
                                              >
                                                {participant?.username
                                                  ?.charAt(0)
                                                  ?.toUpperCase() || "U"}
                                              </div>
                                            )}

                                            <div className="d-inline-flex  align-items-center">
                                              <span
                                                className="user-name text-truncate d-inline-block"
                                                style={{
                                                  maxWidth:
                                                    window.innerWidth < 768
                                                      ? "150px"
                                                      : "auto",
                                                }}
                                              >
                                                {participant?.username ||
                                                  `${t.user} ${userId.slice(
                                                    0,
                                                    6
                                                  )}`}
                                              </span>
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                    return null;
                                  }
                                )
                              )}
                            </div>
                          ) : (
                            <div
                              className="video-grid"
                              style={{
                                ...videoItemStyle,
                                display: "grid",
                                gridTemplateColumns:
                                  remoteStreams.size + 1 <= 2
                                    ? "1fr"
                                    : "repeat(2, 1fr)",
                                gap: "10px",
                                width: "100%",
                                height: "100%",
                                padding: "10px",
                              }}
                            >
                              {/* Local video */}
                              <div
                                className="video-item local-video-container"
                                onClick={() => handleParticipantClick("local")}
                                style={{ cursor: "pointer" }}
                              >
                                <video
                                  ref={(el) => {
                                    if (
                                      el &&
                                      localStream &&
                                      el.srcObject !== localStream
                                    ) {
                                      el.srcObject = localStream;
                                      console.log("🎬 Set local video stream");
                                    }
                                  }}
                                  autoPlay
                                  playsInline
                                  muted={true}
                                  className="remote-video"
                                  style={{ transform: "scaleX(-1)" }}
                                  onLoadedMetadata={(e) => {
                                    const video = e.target as HTMLVideoElement;
                                    video
                                      .play()
                                      .catch((e) =>
                                        console.log(
                                          "⚠️ Local video auto-play prevented:",
                                          e
                                        )
                                      );
                                  }}
                                  onCanPlay={(e) => {
                                    const video = e.target as HTMLVideoElement;
                                    video
                                      .play()
                                      .catch((e) =>
                                        console.log(
                                          "⚠️ Local video play failed:",
                                          e
                                        )
                                      );
                                  }}
                                />
                                <div className="video-overlay rounded-5">
                                  {user.image ? (
                                    <img
                                      src={user.image}
                                      width={"24px"}
                                      height={"24px"}
                                      alt={user.username}
                                      className="rounded-circle me-2"
                                      style={{ objectFit: "cover" }}
                                    />
                                  ) : (
                                    <div
                                      className="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                                      style={{
                                        width: "24px",
                                        height: "24px",
                                        background: "rgba(255, 255, 255, 0.3)",
                                        fontSize: "10px",
                                      }}
                                    >
                                      {user.username
                                        ?.charAt(0)
                                        ?.toUpperCase() || "Y"}
                                    </div>
                                  )}

                                  <div className="d-inline-flex  align-items-center">
                                    <span className="user-name   d-inline-flex  align-items-center">
                                      <span
                                        className=" text-truncate d-inline-block"
                                        style={{
                                          maxWidth:
                                            window.innerWidth < 768
                                              ? "50px"
                                              : "70px",
                                        }}
                                      >
                                        {user.username}
                                      </span>
                                      &nbsp;({t.you})
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Remote videos */}
                              {Array.from(remoteStreams.entries()).map(
                                ([userId, stream]) => {
                                  const participant =
                                    participantData.get(userId);

                                  return (
                                    <div
                                      key={userId}
                                      className="video-item remote-video-container"
                                      onClick={() =>
                                        handleParticipantClick(userId)
                                      }
                                      style={{ cursor: "pointer" }}
                                    >
                                      <video
                                        autoPlay
                                        playsInline
                                        muted={false}
                                        className="remote-video"
                                        style={{ transform: "scaleX(-1)" }}
                                        ref={(el) => {
                                          if (el) {
                                            // Always update the ref and srcObject when element exists
                                            videoRefs.current.set(userId, el);
                                            // Always set srcObject if stream exists
                                            if (el.srcObject !== stream) {
                                              el.srcObject = stream;
                                            }
                                          }
                                        }}
                                        onLoadedMetadata={(e) => {
                                          const video =
                                            e.target as HTMLVideoElement;
                                          video
                                            .play()
                                            .catch((e) =>
                                              console.log(
                                                `⚠️ Auto-play prevented for ${userId}:`,
                                                e
                                              )
                                            );
                                        }}
                                        onCanPlay={(e) => {
                                          const video =
                                            e.target as HTMLVideoElement;
                                          video
                                            .play()
                                            .catch((e) =>
                                              console.log(
                                                `⚠️ Video play failed for ${userId}:`,
                                                e
                                              )
                                            );
                                        }}
                                      />
                                      <div className="video-overlay rounded-5">
                                        {participant?.image ? (
                                          <img
                                            src={participant.image}
                                            width={"24px"}
                                            height={"24px"}
                                            alt={participant.username}
                                            className="rounded-circle me-2"
                                            style={{ objectFit: "cover" }}
                                          />
                                        ) : (
                                          <div
                                            className="rounded-circle me-2 d-inline-flex align-items-center justify-content-center"
                                            style={{
                                              width: "24px",
                                              height: "24px",
                                              background:
                                                "rgba(255, 255, 255, 0.3)",
                                              fontSize: "10px",
                                              color: "white",
                                            }}
                                          >
                                            {participant?.username
                                              ?.charAt(0)
                                              ?.toUpperCase() || "U"}
                                          </div>
                                        )}

                                        <div className="d-inline-flex  align-items-center">
                                          <span
                                            className="user-name text-truncate d-inline-block"
                                            style={{
                                              maxWidth:
                                                window.innerWidth < 768
                                                  ? "50px"
                                                  : "70px",
                                            }}
                                          >
                                            {participant?.username ||
                                              `${t.user} ${userId.slice(0, 6)}`}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  );
                                }
                              )}
                            </div>
                          )}

                          <div className="call-info-badge remote-conn-video d-flex align-items-center justify-content-center gap-3 px-3 py-2 rounded-5">
                            <ConnectionIndicator
                              userId={user.id}
                              username={
                                user?.username ||
                                `${t.user} ${user.id.slice(0, 6)}`
                              }
                            />
                          </div>
                          {/* Rest of your video call UI */}
                          <div
                            className="call-info-badge remote-name d-flex align-items-center justify-content-center gap-3 px-3 py-2 rounded-5"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.7)",
                            }}
                          >
                            <div className="d-flex align-items-center justify-content-center gap-2">
                              {!remoteChannelImage && !isDMChannel && (
                                <img
                                  src={logo}
                                  className="rounded-4"
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}

                              {remoteChannelImage && !isDMChannel && (
                                <img
                                  className="rounded-4"
                                  src={remoteChannelImage}
                                  width={"42px"}
                                  alt={remoteChannelImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              {!remoteImage && isDMChannel && (
                                <img
                                  className="rounded-4"
                                  src={logo}
                                  width={"42px"}
                                  alt={remoteImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              {remoteImage && isDMChannel && (
                                <img
                                  className="rounded-5"
                                  src={remoteImage}
                                  width={"42px"}
                                  alt={remoteImage}
                                  style={{ filter: "brightness(0) invert(1)" }}
                                />
                              )}
                              <div className="d-inline-flex  align-items-center">
                                <span
                                  className="text-capitalize fw-bold text-truncate d-inline-block"
                                  style={{
                                    maxWidth:
                                      window.innerWidth < 768 ? "70px" : "auto",
                                  }}
                                >
                                  {isDMChannel
                                    ? remoteUsername
                                    : remoteChannelName}
                                </span>
                              </div>
                            </div>
                            {window.innerWidth >= 768 ? (
                              <div className="participant-count">
                                {remoteStreams.size + 1}&nbsp;{t.participants}
                              </div>
                            ) : null}
                            {(isVideoOff || isMuted) && (
                              <div className="d-flex align-items-center gap-2">
                                {isVideoOff ? (
                                  <div
                                    className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: "rgba(179, 25, 25, 1)",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="22"
                                      fill="white"
                                      className="bi bi-camera-video-off-fill"
                                      viewBox="0 0 16 16"
                                    >
                                      <path
                                        fill-rule="evenodd"
                                        d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z"
                                      />
                                    </svg>
                                  </div>
                                ) : null}
                                {isMuted ? (
                                  <div
                                    className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                                    style={{
                                      width: "40px",
                                      height: "40px",
                                      backgroundColor: "rgba(179, 25, 25, 1)",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="20"
                                      height="22"
                                      fill="white"
                                      className="bi bi-mic-mute-fill"
                                      viewBox="0 0 16 16"
                                    >
                                      <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3" />
                                      <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                                    </svg>
                                  </div>
                                ) : null}
                              </div>
                            )}
                          </div>
                          <div
                            className="call-info-badge  d-flex align-items-center justify-content-center gap-3  rounded-5"
                            style={{
                              backgroundColor: "rgba(0, 0, 0, 0.7) !important",
                            }}
                          >
                            <button
                              onMouseEnter={(e) => {
                                e.stopPropagation();
                                setShowMinimizeooltip(true);
                              }}
                              onMouseLeave={(e) => {
                                e.stopPropagation();
                                setShowMinimizeooltip(false);
                              }}
                              className={`minimize-btn `}
                              style={{
                                background: "rgba(0, 0, 0, 0.7) !important",
                              }}
                              onClick={handleMinimize}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="currentColor"
                                className="bi bi-list"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fill-rule="evenodd"
                                  d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                                />
                              </svg>
                              {showMinimizeTooltip &&
                                window.innerWidth >= 768 && (
                                  <div
                                    className="custom-tooltip rounded-5"
                                    style={{
                                      position: "absolute",
                                      left: "50%",
                                      transform: "translateX(25%)",
                                      bottom: "15%",
                                      background: "rgba(0, 0, 0, 0.9)",
                                      color: "white",
                                      padding: "6px 12px",
                                      borderRadius: "8px",
                                      fontSize: "12px",
                                      fontWeight: "500",
                                      whiteSpace: "nowrap",
                                      zIndex: 10000,
                                      backdropFilter: "blur(10px)",
                                      border:
                                        "1px solid rgba(255, 255, 255, 0.15)",
                                      boxShadow:
                                        "0 4px 12px rgba(0, 0, 0, 0.3)",
                                      pointerEvents: "none",
                                    }}
                                  >
                                    {t.minimize}
                                  </div>
                                )}
                            </button>
                          </div>
                          {/* Remove the old local PIP since we're showing all videos in grid */}
                          {/* Remove this section: 
          <div className="local-pip">
            <video ... />
          </div>
          */}

                          {remoteStreams.size === 0 && (
                            <div className="video-placeholder">
                              <div className="video-placeholder-icon">📹</div>
                              <div>{t.waitingForVideoStream}</div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="controls-bar d-inline-flex gap-2 flex-wrap align-items-center py-3 position-relative">
                        <div className="call-info-badge px-2  rounded-5  gap-2 d-flex align-items-center">
                          <div
                            className="px-2 py-1 rounded-5  gap-1 "
                            style={{
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                          >
                            {formatTime(callDuration)}
                          </div>
                        </div>
                        <div
                          className={`d-flex align-items-center gap-2 justify-content-center ${
                            window.innerWidth < 466 ? "me-5 pe-2" : ""
                          }`}
                        >
                          <button
                            onMouseEnter={(e) => {
                              setShowMuteTooltip(true);
                            }}
                            onMouseLeave={(e) => {
                              setShowMuteTooltip(false);
                            }}
                            className={`control-btn }`}
                            onClick={handleMuteToggle}
                          >
                            {isMuted ? (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="white"
                                className="bi bi-mic-mute-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3" />
                                <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                              </svg>
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="22"
                                height="22"
                                fill="white"
                                className="bi bi-mic-fill"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                              </svg>
                            )}
                            {showMuteTooltip && window.innerWidth >= 768 && (
                              <div
                                className="custom-tooltip rounded-5"
                                style={{
                                  position: "absolute",
                                  left: "50%",
                                  transform: "translateX(-50%)",
                                  bottom: "100%",
                                  marginBottom: "8px",
                                  background: "rgba(0, 0, 0, 0.9)",
                                  color: "white",
                                  padding: "6px 12px",
                                  borderRadius: "8px",
                                  fontSize: "12px",
                                  fontWeight: "500",
                                  whiteSpace: "nowrap",
                                  zIndex: 10000,
                                  backdropFilter: "blur(10px)",
                                  border: "1px solid rgba(255, 255, 255, 0.15)",
                                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                  pointerEvents: "none",
                                }}
                              >
                                {isMuted ? t.unmute : t.mute}
                              </div>
                            )}
                          </button>
                          {!isAudioCall && (
                            <button
                              onMouseEnter={(e) => {
                                setShowVideoTooltip(true);
                              }}
                              onMouseLeave={(e) => {
                                setShowVideoTooltip(false);
                              }}
                              className={`control-btn `}
                              onClick={handleVideoToggle}
                            >
                              {isVideoOff ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="22"
                                  fill="white"
                                  className="bi bi-camera-video-off-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="20"
                                  height="22"
                                  fill="white"
                                  className="bi bi-camera-video-fill"
                                  viewBox="0 0 16 16"
                                >
                                  <path
                                    fill-rule="evenodd"
                                    d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                                  />
                                </svg>
                              )}
                              {showVideoTooltip && window.innerWidth >= 768 && (
                                <div
                                  className="custom-tooltip rounded-5"
                                  style={{
                                    position: "absolute",
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    bottom: "100%",
                                    marginBottom: "8px",
                                    background: "rgba(0, 0, 0, 0.9)",
                                    color: "white",
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    fontWeight: "500",
                                    whiteSpace: "nowrap",
                                    zIndex: 10000,
                                    backdropFilter: "blur(10px)",
                                    border:
                                      "1px solid rgba(255, 255, 255, 0.15)",
                                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                                    pointerEvents: "none",
                                  }}
                                >
                                  {isVideoOff ? t.cameraOn : t.cameraOff}
                                </div>
                              )}
                            </button>
                          )}
                        </div>

                        <div className="call-info-badge  px-2  rounded-5 gap-1 text-capitalize fw-bold remote-name">
                          <button
                            className="btn text-white text-uppercase rounded-4 fw-semibold end-call d-flex align-items-center justify-content-center"
                            onClick={onEndCall}
                            style={{ background: "rgba(179, 25, 25, 1)" }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background =
                                "rgba(124, 19, 19, 1)";
                              setShowLeaveTooltip(true);
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background =
                                "rgba(179, 25, 25, 1)";
                              setShowLeaveTooltip(false);
                            }}
                          >
                            {t.leave}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              {/* ERROR STATE */}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {minimizeCall && callState === "connected" && (
        <div
          ref={minimizedWindowRef}
          className={`minimized-call-window ${isDragging ? "dragging" : ""}`}
          style={{
            left: `${minimizedPosition.x}px`,
            top: `${minimizedPosition.y}px`,
            zIndex: 10001,
            // Add transitions only when NOT dragging
            transition: isDragging ? "none" : "all 0.3s ease-in-out",
            opacity: 1,
          }}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
        >
          {/* Video/Audio Preview */}
          <div className="minimized-video-container">
            {isAudioCall ? (
              <div className="d-flex align-items-center justify-content-center h-100">
                <div className="text-center">
                  <div className="participant-preview">
                    <div className="minimized-user-avatar">
                      {remoteStreams.size > 1 ? (
                        <div className=" d-inline-flex align-items-center justify-content-center gap-2">
                          <span className="user-count">
                            {remoteStreams.size + 1}
                          </span>
                        </div>
                      ) : participantData.size > 0 ? (
                        Array.from(participantData.values())[0]?.image ? (
                          <div className="d-flex align-items-start justify-content-center h-100">
                            <img
                              src={
                                Array.from(participantData.values())[0].image
                              }
                              className="d-flex align-items-center justify-content-center rounded-circle "
                              alt={
                                Array.from(participantData.values())[0].username
                              }
                              style={{
                                objectFit: "cover",
                                width: "56px",
                                height: "56px",
                              }}
                            />
                          </div>
                        ) : (
                          <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center">
                            <span className="text-dark fw-bold">
                              {Array.from(participantData.values())[0]
                                ?.username?.charAt(0)
                                ?.toUpperCase() || "U"}
                            </span>
                          </div>
                        )
                      ) : (
                        <div className="w-100 h-100 rounded-circle bg-light d-flex align-items-center justify-content-center">
                          <span className="text-dark fw-bold">
                            {remoteUsername?.charAt(0)?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="minimized-video-grid">
                {Array.from(remoteStreams.entries())
                  .slice(0, 1)
                  .map(([userId, stream]) => {
                    const participant = participantData.get(userId);
                    return (
                      <video
                        key={userId}
                        autoPlay
                        playsInline
                        muted={false}
                        className="minimized-video"
                        style={{ transform: "scaleX(-1)" }}
                        ref={(el) => {
                          if (el) {
                            // Always update the ref and srcObject when element exists
                            videoRefs.current.set(userId, el);
                            // Always set srcObject if stream exists
                            if (el.srcObject !== stream) {
                              el.srcObject = stream;
                            }
                          }
                        }}
                        onLoadedMetadata={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video
                            .play()
                            .catch((e) =>
                              console.log(
                                `⚠️ Auto-play prevented for ${userId}:`,
                                e
                              )
                            );
                        }}
                        onCanPlay={(e) => {
                          const video = e.target as HTMLVideoElement;
                          video
                            .play()
                            .catch((e) =>
                              console.log(
                                `⚠️ Video play failed for ${userId}:`,
                                e
                              )
                            );
                        }}
                      />
                    );
                  })}
                {remoteStreams.size === 0 && (
                  <video
                    ref={localVideoRef}
                    autoPlay
                    playsInline
                    muted={true}
                    className="minimized-video"
                    style={{ transform: "scaleX(-1)" }}
                  />
                )}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="minimized-controls">
            <div className="minimized-user-info d-flex gap-2 align-items-center">
              <div className="minimized-user-avatar">
                {!remoteChannelImage && !isDMChannel && (
                  <img
                    src={logo}
                    className="rounded-4"
                    width={"34px"}
                    alt={remoteChannelImage}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                )}
                {remoteChannelImage && !isDMChannel && (
                  <img
                    className="rounded-4"
                    src={remoteChannelImage}
                    width={"34px"}
                    alt={remoteChannelImage}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                )}
                {!remoteImage && isDMChannel && (
                  <img
                    className="rounded-4"
                    src={logo}
                    width={"34px"}
                    alt={remoteImage}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                )}
                {remoteImage && isDMChannel && (
                  <img
                    className="rounded-5"
                    src={remoteImage}
                    width={"34px"}
                    alt={remoteImage}
                    style={{ filter: "brightness(0) invert(1)" }}
                  />
                )}
              </div>
              <div className="d-flex flex-column">
                <div className="d-inline-flex  align-items-center">
                  <span
                    className="text-capitalize fw-bold small text-truncate d-inline-block"
                    style={{
                      maxWidth: window.innerWidth < 768 ? "50px" : "70px",
                    }}
                  >
                    {isDMChannel ? remoteUsername : remoteChannelName}
                  </span>
                </div>
                <div className="text-white small">
                  {formatTime(callDuration)}
                </div>
              </div>
            </div>

            <div className="minimized-control-buttons">
              {(isVideoOff || isMuted) && !isAudioCall && (
                <div className="d-flex align-items-center gap-2">
                  {isVideoOff ? (
                    <div
                      className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(179, 25, 25, 1)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="22"
                        fill="white"
                        className="bi bi-camera-video-off-fill"
                        viewBox="0 0 16 16"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M10.961 12.365a2 2 0 0 0 .522-1.103l3.11 1.382A1 1 0 0 0 16 11.731V4.269a1 1 0 0 0-1.406-.913l-3.111 1.382A2 2 0 0 0 9.5 3H4.272zm-10.114-9A2 2 0 0 0 0 5v6a2 2 0 0 0 2 2h5.728zm9.746 11.925-10-14 .814-.58 10 14z"
                        />
                      </svg>
                    </div>
                  ) : null}
                  {isMuted ? (
                    <div
                      className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                      style={{
                        width: "32px",
                        height: "32px",
                        backgroundColor: "rgba(179, 25, 25, 1)",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="22"
                        fill="white"
                        className="bi bi-mic-mute-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3" />
                        <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                      </svg>
                    </div>
                  ) : null}
                </div>
              )}
              {isMuted && isAudioCall ? (
                <div
                  className="px-2 py-1 rounded-5  gap-1 d-flex align-items-center justify-content-center"
                  style={{
                    width: "32px",
                    height: "32px",
                    backgroundColor: "rgba(179, 25, 25, 1)",
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="22"
                    fill="white"
                    className="bi bi-mic-mute-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 8c0 .564-.094 1.107-.266 1.613l-.814-.814A4 4 0 0 0 12 8V7a.5.5 0 0 1 1 0zm-5 4c.818 0 1.578-.245 2.212-.667l.718.719a5 5 0 0 1-2.43.923V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 1 0v1a4 4 0 0 0 4 4m3-9v4.879L5.158 2.037A3.001 3.001 0 0 1 11 3" />
                    <path d="M9.486 10.607 5 6.12V8a3 3 0 0 0 4.486 2.607m-7.84-9.253 12 12 .708-.708-12-12z" />
                  </svg>
                </div>
              ) : null}
              <button
                className="minimized-control-btn"
                onClick={handleMaximize}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="currentColor"
                  className="bi bi-list"
                  viewBox="0 0 16 16"
                >
                  <path
                    fillRule="evenodd"
                    d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
                  />
                </svg>
              </button>

              <button
                className="minimized-control-btn border-0 end-call"
                onClick={onEndCall}
              >
                <svg
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
