import { useState, useEffect, useMemo, useCallback } from "react";

export const useFadeIn = (duration: number = 600) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const fadeStyle: React.CSSProperties = useMemo(
    () => ({
      opacity: isVisible ? 1 : 0,
      transform: `translateY(${isVisible ? 0 : "20px"})`,
      transition: `opacity ${duration}ms ease, transform ${duration}ms ease`,
    }),
    [isVisible, duration],
  );

  const reset = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsVisible(true), 50);
  }, []);

  return { fadeStyle, isVisible, reset };
};
