// hooks/useAudioLevelDetector.ts - UPDATED VERSION
import { useState, useEffect, useRef } from "react";

export const useAudioLevelDetector = (
  stream: MediaStream | null,
  audioElement: HTMLAudioElement | HTMLVideoElement | null,
  isLocal: boolean = false
) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<
    MediaStreamAudioSourceNode | MediaElementAudioSourceNode | null
  >(null);
  const animationFrameRef = useRef<number>(0);

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
      "🎤 Starting audio level detection for",
      isLocal ? "local" : "remote",
      {
        type:
          audioSource instanceof MediaStream
            ? "MediaStream"
            : "HTMLMediaElement",
        hasAudioTracks:
          audioSource instanceof MediaStream
            ? audioSource.getAudioTracks().length
            : "N/A",
      }
    );

    try {
      const AudioContext =
        window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContext();

      const analyser = audioContextRef.current.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.2; // Lower for more responsive detection
      analyser.minDecibels = -70; // Set minimum dB level
      analyser.maxDecibels = -10; // Set maximum dB level
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
      const SPEAKING_THRESHOLD = 3; // Require 3 frames of speaking
      const SILENCE_THRESHOLD = 10; // Require 10 frames of silence

      const checkAudioLevel = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume (more stable than RMS)
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

          if (speakingCounter >= SPEAKING_THRESHOLD && !isSpeaking) {
            console.log("🎤 Speaking detected, level:", average.toFixed(2));
            setIsSpeaking(true);
          }
        } else {
          speakingCounter = 0;
          silenceCounter++;

          if (silenceCounter >= SILENCE_THRESHOLD && isSpeaking) {
            console.log("🎤 Silence detected");
            setIsSpeaking(false);
          }
        }

        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      };

      // Start detection after a short delay to allow context to initialize
      setTimeout(() => {
        animationFrameRef.current = requestAnimationFrame(checkAudioLevel);
      }, 100);
    } catch (error) {
      console.warn("❌ Audio level detection failed:", error);
    }

    return () => {
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
  }, [stream, audioElement, isLocal]);

  return isSpeaking;
};
