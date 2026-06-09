import { useCallback, useRef } from "react";

type SoundType = "calling" | "ringing" | "connected" | "ended" | "error";

interface SoundUrls {
  calling: string;
  ringing: string;
  connected: string;
  ended: string;
  error: string;
}

export const useCallSounds = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ringtoneIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const defaultSounds: SoundUrls = {
    calling:
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    ringing: "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3",
    connected:
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    ended: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
    error: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3",
  };

  const playSound = useCallback((soundType: SoundType, soundUrl?: string) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(soundUrl || defaultSounds[soundType]);
      audio.volume = 0.5;
      audio.play().catch((err) => {
        console.warn(`Failed to play ${soundType} sound:`, err);
      });

      audioRef.current = audio;
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  const playRingtone = useCallback(
    (soundType: "calling" | "ringing", soundUrl?: string) => {
      try {
        stopRingtone();

        const audio = new Audio(soundUrl || defaultSounds[soundType]);
        audio.volume = 0.6;
        audio.loop = true;
        audio.play().catch((err) => {
          console.warn(`Failed to play ringtone:`, err);
        });

        audioRef.current = audio;

        console.log(`🔊 ${soundType} ringtone started`);
      } catch (error) {
        console.error("Error playing ringtone:", error);
      }
    },
    [],
  );

  const stopRingtone = useCallback(() => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        audioRef.current = null;
        console.log("🔇 Ringtone stopped");
      }

      if (ringtoneIntervalRef.current) {
        clearInterval(ringtoneIntervalRef.current);
        ringtoneIntervalRef.current = null;
      }
    } catch (error) {
      console.error("Error stopping ringtone:", error);
    }
  }, []);

  const cleanup = useCallback(() => {
    stopRingtone();
    if (audioRef.current) {
      audioRef.current = null;
    }
  }, [stopRingtone]);

  return {
    playSound,
    playRingtone,
    stopRingtone,
    cleanup,
  };
};
