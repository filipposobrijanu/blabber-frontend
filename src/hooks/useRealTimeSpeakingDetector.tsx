// hooks/useRealTimeSpeakingDetector.ts
import { useState, useEffect, useRef, useCallback } from "react";

interface UseRealTimeSpeakingDetectorProps {
  stream: MediaStream | null;
  audioElement: HTMLAudioElement | HTMLVideoElement | null;
  isLocal: boolean;
  onSpeakingStateChange?: (isSpeaking: boolean) => void;
  sendSpeakingState?: (isSpeaking: boolean) => void;
}

export const useRealTimeSpeakingDetector = ({
  stream,
  audioElement,
  isLocal,
  onSpeakingStateChange,
  sendSpeakingState,
}: UseRealTimeSpeakingDetectorProps) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<
    MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null
  >(null);
  const animationFrameRef = useRef<number>(0);
  const lastSpeakingStateRef = useRef<boolean>(false);
  const isSpeakingRef = useRef<boolean>(false); // FIX: Track speaking state in ref

  // Debounced speaking state sender
  const debouncedSendSpeakingState = useCallback(
    (speaking: boolean) => {
      if (lastSpeakingStateRef.current !== speaking) {
        lastSpeakingStateRef.current = speaking;

        if (isLocal && sendSpeakingState) {
          console.log("🎤 Sending speaking state:", speaking);
          sendSpeakingState(speaking);
        }

        if (onSpeakingStateChange) {
          onSpeakingStateChange(speaking);
        }
      }
    },
    [isLocal, sendSpeakingState, onSpeakingStateChange]
  );

  useEffect(() => {
    // Cleanup previous instances
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(console.warn);
    }

    setIsSpeaking(false);
    isSpeakingRef.current = false; // FIX: Reset ref too
    lastSpeakingStateRef.current = false;

    let audioSource: MediaStream | HTMLMediaElement | null = null;

    // Priority 1: Use MediaStream if available and has audio tracks
    if (stream && stream.getAudioTracks().length > 0) {
      audioSource = stream;
    }
    // Priority 2: Use audio element (for remote audio in audio-only calls)
    else if (audioElement) {
      audioSource = audioElement;
    }

    if (!audioSource) {
      console.log("🎤 No audio source available for detection");
      return;
    }

    console.log(
      "🎤 Starting real-time audio detection for",
      isLocal ? "local" : "remote"
    );

    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.2;
      analyser.minDecibels = -70;
      analyser.maxDecibels = -10;
      analyserRef.current = analyser;

      // Create source based on type
      if (audioSource instanceof MediaStream) {
        sourceRef.current =
          audioContextRef.current.createMediaStreamSource(audioSource);
      } else {
        sourceRef.current =
          audioContextRef.current.createMediaElementSource(audioSource);
      }

      sourceRef.current.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let silenceCounter = 0;
      let speakingCounter = 0;
      const SPEAKING_THRESHOLD = 3;
      const SILENCE_THRESHOLD = 8;

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }
        const average = sum / dataArray.length;

        // Adjust thresholds - higher for local audio (echo cancellation)
        const speakingThreshold = isLocal ? 25 : 20;
        const isCurrentlySpeaking = average > speakingThreshold;

        // Add hysteresis to prevent flickering
        if (isCurrentlySpeaking) {
          silenceCounter = 0;
          speakingCounter++;

          // FIX: Use ref instead of state in callback
          if (speakingCounter >= SPEAKING_THRESHOLD && !isSpeakingRef.current) {
            console.log("🎤 Speaking detected, level:", average.toFixed(2));
            isSpeakingRef.current = true; // Update ref first
            setIsSpeaking(true);
            debouncedSendSpeakingState(true);
          }
        } else {
          speakingCounter = 0;
          silenceCounter++;

          // FIX: Use ref instead of state in callback
          if (silenceCounter >= SILENCE_THRESHOLD && isSpeakingRef.current) {
            console.log("🎤 Silence detected");
            isSpeakingRef.current = false; // Update ref first
            setIsSpeaking(false);
            debouncedSendSpeakingState(false);
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      // Start detection with small delay
      const startTimeout = setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      }, 100);

      return () => {
        clearTimeout(startTimeout);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        if (sourceRef.current) {
          sourceRef.current.disconnect();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close().catch(console.warn);
        }
      };
    } catch (error) {
      console.warn("❌ Audio level detection failed:", error);
    }
  }, [stream, audioElement, isLocal, debouncedSendSpeakingState]);

  return isSpeaking;
};
