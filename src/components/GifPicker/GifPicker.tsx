import React, { useState, useEffect, useCallback, useMemo, memo } from "react";
import "./GifPicker.css";
import { GifPickerTranslations } from "./GifPickerTranslations";
import { useShopContext } from "../../hooks/useShopContext";
import { motion } from "framer-motion";

interface Gif {
  id: string;
  media_formats: {
    tinygif: { url: string };
    gif: { url: string };
  };
}

interface GifPickerProps {
  onGifSelect: (gifUrl: string) => void;
  onClose: () => void;
}

// Memoized CloseIcon component
const CloseIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-label="Close"
  >
    <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
  </svg>
));

CloseIcon.displayName = "CloseIcon";

// Memoized GifItem component
interface GifItemProps {
  gif: Gif;
  onSelect: (gif: Gif) => void;
}

const GifItem = memo<GifItemProps>(({ gif, onSelect }) => {
  const handleClick = useCallback(() => {
    onSelect(gif);
  }, [gif, onSelect]);

  return (
    <div className="gif-item" onClick={handleClick} role="button" tabIndex={0}>
      <img
        src={gif.media_formats.tinygif.url}
        alt="GIF"
        loading="lazy"
        width="100"
        height="100"
      />
    </div>
  );
});

GifItem.displayName = "GifItem";

// Memoized LoadingSpinner component
interface LoadingSpinnerProps {
  loadingText: string;
}

const LoadingSpinner = memo<LoadingSpinnerProps>(({ loadingText }) => (
  <div className="gif-loading">
    <div className="spinner-border text-white" role="status">
      <span className="visually-hidden">{loadingText}</span>
    </div>
  </div>
));

LoadingSpinner.displayName = "LoadingSpinner";

// Memoized NoGifsFound component
interface NoGifsFoundProps {
  noGifsFoundText: string;
}

const NoGifsFound = memo<NoGifsFoundProps>(({ noGifsFoundText }) => (
  <div className="no-gifs-found">
    <p>{noGifsFoundText}</p>
  </div>
));

NoGifsFound.displayName = "NoGifsFound";

// Main GifPicker component
export const GifPicker: React.FC<GifPickerProps> = memo(
  ({ onGifSelect, onClose }) => {
    const { selectedLanguage } = useShopContext();

    // State
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [loading, setLoading] = useState(false);
    const [featuredGifs, setFeaturedGifs] = useState<Gif[]>([]);
    const [isClosing, setIsClosing] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Constants
    const API_KEY = process.env.REACT_APP_TENOR_API_KEY;
    const CLIENT_KEY = "blabber_chat_app";

    // Memoize translations
    const t = useMemo(
      () =>
        GifPickerTranslations[
          selectedLanguage.code as keyof typeof GifPickerTranslations
        ],
      [selectedLanguage.code]
    );

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Memoize API base URL
    const apiBaseUrl = useMemo(() => "https://tenor.googleapis.com/v2", []);

    // Memoize fetch options
    const fetchOptions = useMemo(
      () => ({
        method: "GET" as const,
        headers: {
          Accept: "application/json",
        },
      }),
      []
    );

    // Memoize fetch function with abort controller
    const fetchWithAbort = useCallback(
      async (url: string) => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        try {
          const response = await fetch(url, {
            ...fetchOptions,
            signal: controller.signal,
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return await response.json();
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      },
      [fetchOptions]
    );

    // Fetch featured GIFs with caching
    const fetchFeaturedGifs = useCallback(async () => {
      if (!API_KEY) {
        console.error("Tenor API key is not configured");
        return;
      }

      // Check cache first
      const cacheKey = "featured_gifs_cache";
      const cached = sessionStorage.getItem(cacheKey);

      if (cached) {
        try {
          const cachedData = JSON.parse(cached);
          const now = Date.now();

          // Use cache if less than 5 minutes old
          if (now - cachedData.timestamp < 5 * 60 * 1000) {
            setFeaturedGifs(cachedData.results);
            setGifs(cachedData.results);
            return;
          }
        } catch {
          // Cache is invalid, continue with fetch
        }
      }

      setLoading(true);

      try {
        const limit = windowWidth < 768 ? "18" : "20";
        const url = `${apiBaseUrl}/featured?key=${API_KEY}&client_key=${CLIENT_KEY}&limit=${limit}`;

        const data = await fetchWithAbort(url);
        const results = data.results || [];

        // Cache the results
        sessionStorage.setItem(
          cacheKey,
          JSON.stringify({
            results,
            timestamp: Date.now(),
          })
        );

        setFeaturedGifs(results);
        setGifs(results);
      } catch (error) {
        console.error("Error fetching featured GIFs:", error);
        // Keep cached data if available
      } finally {
        setLoading(false);
      }
    }, [API_KEY, windowWidth, apiBaseUrl, fetchWithAbort]);

    // Search GIFs with debouncing
    const searchGifs = useCallback(
      async (query: string) => {
        if (!API_KEY || query.trim() === "") {
          setGifs(featuredGifs);
          return;
        }

        setLoading(true);

        try {
          const url = `${apiBaseUrl}/search?q=${encodeURIComponent(
            query
          )}&key=${API_KEY}&client_key=${CLIENT_KEY}&limit=20`;
          const data = await fetchWithAbort(url);
          setGifs(data.results || []);
        } catch (error) {
          console.error("Error searching GIFs:", error);
          // Fallback to featured GIFs on error
          setGifs(featuredGifs);
        } finally {
          setLoading(false);
        }
      },
      [API_KEY, apiBaseUrl, fetchWithAbort, featuredGifs]
    );

    // Register share with Tenor
    const registerShare = useCallback(
      async (gifId: string, searchTerm: string = "") => {
        if (!API_KEY) return;

        try {
          const url = `${apiBaseUrl}/registershare?id=${gifId}&key=${API_KEY}&client_key=${CLIENT_KEY}&q=${searchTerm}`;
          await fetch(url, { method: "POST" });
        } catch (error) {
          console.error("Error registering share:", error);
          // Non-critical error, continue anyway
        }
      },
      [API_KEY, apiBaseUrl]
    );

    // Effects
    useEffect(() => {
      fetchFeaturedGifs();
    }, [fetchFeaturedGifs]);

    // Memoized handlers
    const handleSearch = useCallback(
      (query: string) => {
        setSearchQuery(query);

        if (query.trim() === "") {
          setGifs(featuredGifs);
        } else {
          // Debounce search
          const timeoutId = setTimeout(() => {
            searchGifs(query);
          }, 300);

          return () => clearTimeout(timeoutId);
        }
      },
      [featuredGifs, searchGifs]
    );

    const handleClose = useCallback(() => {
      setIsClosing(true);
      setTimeout(() => {
        onClose();
      }, 250);
    }, [onClose]);

    const handleGifSelect = useCallback(
      (gif: Gif) => {
        // Register the share with Tenor (fire and forget)
        registerShare(gif.id, searchQuery);
        // Send the GIF URL to parent component
        onGifSelect(gif.media_formats.gif.url);
        handleClose();
      },
      [registerShare, searchQuery, onGifSelect, handleClose]
    );

    // Memoized gif items
    const gifItems = useMemo(
      () =>
        gifs.map((gif) => (
          <GifItem key={gif.id} gif={gif} onSelect={handleGifSelect} />
        )),
      [gifs, handleGifSelect]
    );

    return (
      <div className={`gif-picker-modal ${isClosing ? "fade-out" : "fade-in"}`}>
        <div className="gif-picker-content rounded-5">
          {/* Header */}
          <div className="gif-picker-header">
            <h5>{t.chooseGif}</h5>
            <button
              className="close-btn"
              onClick={handleClose}
              aria-label="Close GIF picker"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search Bar */}
          <motion.div
            whileFocus={{ scale: 1.02 }}
            whileHover={{ scale: 1.01 }}
            className="gif-search-bar"
          >
            <input
              type="text"
              placeholder={t.searchGifs}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="form-control rounded-5 py-2"
              aria-label="Search GIFs"
            />
          </motion.div>

          {/* GIF Grid */}
          <div className="gif-grid-container">
            {loading ? (
              <LoadingSpinner loadingText={t.loading} />
            ) : gifs.length > 0 ? (
              <div className="gif-grid">{gifItems}</div>
            ) : (
              <NoGifsFound noGifsFoundText={t.noGifsFound} />
            )}
          </div>
        </div>
      </div>
    );
  }
);

GifPicker.displayName = "GifPicker";
