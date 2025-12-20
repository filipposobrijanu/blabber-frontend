import { useState, useEffect, useMemo, useCallback } from "react";

export const useFadeIn = (duration: number = 600) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Memoize the fade style to prevent recalculation on every render
  const fadeStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? 0 : "20px"})`,
      transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    }),
    [isVisible, duration]
  );

  // Optional: Memoize a reset function if you need to restart the animation
  const reset = useCallback(() => {
    setIsVisible(false);
    // Small timeout to ensure the reset is visible
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return { fadeStyle, isVisible, reset };
};
