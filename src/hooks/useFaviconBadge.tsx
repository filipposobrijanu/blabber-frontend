// hooks/useFaviconBadge.ts
import { useCallback, useRef, useEffect } from "react";

export const useFaviconBadge = () => {
  const originalFavicon = useRef<string | null>(null);
  const originalFaviconImage = useRef<HTMLImageElement | null>(null);
  const originalTitle = useRef<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    const link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
    if (link) {
      linkRef.current = link;
      originalFavicon.current = link.href;

      if (link.href) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = link.href;
        img.onload = () => {
          originalFaviconImage.current = img;
        };
      }
    }

    originalTitle.current = document.title.replace(/^\(\d+\)\s*/, "");

    canvasRef.current = document.createElement("canvas");
    canvasRef.current.width = 32;
    canvasRef.current.height = 32;

    return () => {
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
      originalTitle.current = document.title.replace(/^\(\d+\)\s*/, "");
    }

    if (count === 0) {
      document.title = originalTitle.current;
    } else {
      const badge = `(${count > 9 ? "9+" : count}) `;
      document.title = badge + originalTitle.current;
    }
  }, []);

  const createFaviconWithBadge = useCallback(
    async (count: number): Promise<string> => {
      return new Promise((resolve) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const drawFavicon = () => {
          if (originalFaviconImage.current) {
            ctx.drawImage(originalFaviconImage.current, 0, 0, 32, 32);
          } else {
            ctx.fillStyle = "#2f3136";
            ctx.fillRect(0, 0, 32, 32);

            ctx.fillStyle = "#5865f2";
            ctx.beginPath();
            ctx.ellipse(16, 16, 12, 12, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          if (count > 0) {
            const badgeSize = 14;
            const badgeX = 24;
            const badgeY = 10;

            ctx.fillStyle = "rgba(209, 17, 17, 1)";
            ctx.beginPath();
            ctx.ellipse(
              badgeX,
              badgeY,
              badgeSize / 2,
              badgeSize / 2,
              0,
              0,
              Math.PI * 2,
            );
            ctx.fill();

            const text = "";
            ctx.fillText(text, badgeX, badgeY + 1);
          }

          resolve(canvas.toDataURL());
        };

        if (
          originalFaviconImage.current &&
          originalFaviconImage.current.complete
        ) {
          drawFavicon();
        } else {
          if (originalFavicon.current) {
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = originalFavicon.current;
            img.onload = () => {
              originalFaviconImage.current = img;
              drawFavicon();
            };
            img.onerror = () => {
              drawFavicon();
            };
          } else {
            drawFavicon();
          }
        }
      });
    },
    [],
  );

  const setBadge = useCallback(
    async (count: number) => {
      console.log("🔄 Setting favicon & title badge count:", count);

      updateTitle(count);

      if (count === 0) {
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

        let link =
          linkRef.current ||
          document.querySelector<HTMLLinkElement>("link[rel*='icon']");

        if (!link) {
          link = document.createElement("link");
          link.rel = "icon";
          document.head.appendChild(link);
          linkRef.current = link;
        }

        link.type = "image/x-icon";
        link.href = dataUrl;

        console.log(
          "✅ Favicon badge updated with count:",
          count > 9 ? "9+" : count,
        );
      } catch (error) {
        console.error("❌ Error updating favicon badge:", error);
      }
    },
    [createFaviconWithBadge, updateTitle],
  );

  const updateOriginalTitle = useCallback((newTitle: string) => {
    const cleanTitle = newTitle.replace(/^\(\d+\)\s*/, "");
    originalTitle.current = cleanTitle;

    const currentTitle = document.title;
    if (!currentTitle.startsWith("(")) {
      document.title = cleanTitle;
    }
  }, []);

  return { setBadge, updateOriginalTitle };
};
