import { useCallback, useRef } from "react";

type SoundType =
  | "calling" // Outgoing call ringing
  | "ringing" // Incoming call ringing
  | "connected" // Call connected/answered
  | "ended" // Call ended
  | "error"; // Call error/rejected

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

  // Default sound URLs from free CDN sources
  // You can replace these with your own hosted URLs
  const defaultSounds: SoundUrls = {
    calling:
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Phone calling tone
    ringing: "https://assets.mixkit.co/active_storage/sfx/933/933-preview.mp3", // Ringing tone
    connected:
      "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Connected beep
    ended: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // End beep
    error: "https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3", // Error sound
  };

  // Play a single sound effect
  const playSound = useCallback((soundType: SoundType, soundUrl?: string) => {
    try {
      // Stop any currently playing sound
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      // Create new audio element
      const audio = new Audio(soundUrl || defaultSounds[soundType]);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((err) => {
        console.warn(`Failed to play ${soundType} sound:`, err);
      });

      audioRef.current = audio;
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  }, []);

  // Play ringtone in a loop (for incoming/outgoing calls)
  const playRingtone = useCallback(
    (soundType: "calling" | "ringing", soundUrl?: string) => {
      try {
        // Stop any current ringtone
        stopRingtone();

        const audio = new Audio(soundUrl || defaultSounds[soundType]);
        audio.volume = 0.6;
        audio.loop = true; // Loop the ringtone
        audio.play().catch((err) => {
          console.warn(`Failed to play ringtone:`, err);
        });

        audioRef.current = audio;

        console.log(`🔊 ${soundType} ringtone started`);
      } catch (error) {
        console.error("Error playing ringtone:", error);
      }
    },
    []
  );

  // Stop any playing sound
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

  // Cleanup on unmount
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
