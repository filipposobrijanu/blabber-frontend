// hooks/useFaviconBadge.ts
import { useCallback, useRef, useEffect } from "react";

export const useFaviconBadge = () => {
  const originalFavicon = useRef<string | null>(null);
  const originalFaviconImage = useRef<HTMLImageElement | null>(null);
  const originalTitle = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    // Store original favicon
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (link) {
      linkRef.current = link;
      originalFavicon.current = link.href;

      // Load original favicon image to draw it on canvas
      if (link.href) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = link.href;
        img.onload = () => {
          originalFaviconImage.current = img;
        };
      }
    }

    // Store original page title
    originalTitle.current = document.title.replace(/^\(\d+\)\s*/, ""); // Remove any existing badge

    // Create canvas once
    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = 32;
    canvasRef.current.height = 32;

    return () => {
      // Cleanup on unmount
      if (linkRef.current && originalFavicon.current) {
        linkRef.current.href = originalFavicon.current;
      }
      if (originalTitle.current) {
        document.title = originalTitle.current;
      }
    };
  }, []);

  const updateTitle = useCallback((count: number) => {
    if (!originalTitle.current) {
      // Clean the current title and store it
      originalTitle.current = document.title.replace(/^\(\d+\)\s*/, "");
    }

    if (count === 0) {
      // Restore original title without badge
      document.title = originalTitle.current;
    } else {
      // Add notification count to title
      const badge = `(${count > 9 ? "9+" : count}) `;
      document.title = badge + originalTitle.current;
    }
  }, []);

  const createFaviconWithBadge = useCallback(
    async (count: number): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Try to draw original favicon
        const drawFavicon = () => {
          if (originalFaviconImage.current) {
            // Draw original favicon
            ctx.drawImage(originalFaviconImage.current, 0, 0, 32, 32);
          } else {
            // Fallback: Draw a simple background
            ctx.fillStyle = "#2f3136";
            ctx.fillRect(0, 0, 32, 32);

            // Draw a simple chat bubble as placeholder
            ctx.fillStyle = "#5865f2";
            ctx.beginPath();
            ctx.ellipse(16, 16, 12, 12, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Draw badge
          if (count > 0) {
            const badgeSize = 14;
            const badgeX = 24;
            const badgeY = 10;

            // Badge background
            ctx.fillStyle = "rgba(209, 17, 17, 1)";
            ctx.beginPath();
            ctx.ellipse(
              badgeX,
              badgeY,
              badgeSize / 2,
              badgeSize / 2,
              0,
              0,
              Math.PI * 2
            );
            ctx.fill();

            // Badge text

            const text = "";
            ctx.fillText(text, badgeX, badgeY + 1); // +1 for vertical alignment
          }

          resolve(canvas.toDataURL());
        };

        // If we have the original image, use it
        if (
          originalFaviconImage.current &&
          originalFaviconImage.current.complete
        ) {
          drawFavicon();
        } else {
          // Try to load original favicon
          if (originalFavicon.current) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = originalFavicon.current;
            img.onload = () => {
              originalFaviconImage.current = img;
              drawFavicon();
            };
            img.onerror = () => {
              // If original favicon fails to load, use fallback
              drawFavicon();
            };
          } else {
            // No original favicon, use fallback
            drawFavicon();
          }
        }
      });
    },
    []
  );

  const setBadge = useCallback(
    async (count: number) => {
      // Debug log
      console.log("🔄 Setting favicon & title badge count:", count);

      // Update page title with notification count
      updateTitle(count);

      if (count === 0) {
        // Restore original favicon
        const link =
          linkRef.current ||
          document.querySelector<HTMLLinkElement>("link[rel*='icon']");
        if (link && originalFavicon.current) {
          console.log("🔄 Restoring original favicon");
          link.href = originalFavicon.current;
        }
        return;
      }

      try {
        const dataUrl = await createFaviconWithBadge(count);

        // Update or create favicon link
        let link =
          linkRef.current ||
          document.querySelector<HTMLLinkElement>("link[rel*='icon']");

        if (!link) {
          // Create new link element if it doesn't exist
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
          linkRef.current = link;
        }

        // Update the favicon
        link.type = "image/x-icon";
        link.href = dataUrl;

        console.log(
          "✅ Favicon badge updated with count:",
          count > 9 ? "9+" : count
        );
      } catch (error) {
        console.error("❌ Error updating favicon badge:", error);
      }
    },
    [createFaviconWithBadge, updateTitle]
  );

  // Expose a function to update the original title when it changes
  const updateOriginalTitle = useCallback((newTitle: string) => {
    // Clean the title (remove any existing badge)
    const cleanTitle = newTitle.replace(/^\(\d+\)\s*/, "");
    originalTitle.current = cleanTitle;

    // Update current title if there's no unread count
    const currentTitle = document.title;
    if (!currentTitle.startsWith("(")) {
      document.title = cleanTitle;
    }
  }, []);

  return { setBadge, updateOriginalTitle };
};
