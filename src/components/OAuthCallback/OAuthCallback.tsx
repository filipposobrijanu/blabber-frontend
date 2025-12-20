import React, { useEffect, useMemo, useCallback, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { OAuthCallbackTranslations } from "./OAuthCallbackTranslations";
import { useShopContext } from "../../hooks/useShopContext";
import objects from "../../assets/3dobjects.png";

// Memoized Background component
const Background = memo(() => (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundImage: `url(${objects})`,
      backgroundSize: "cover",
      width: "150%",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      filter: "blur(7.5px) brightness(0.6)",
      opacity: 0.2,
      zIndex: 0,
    }}
  />
));

Background.displayName = "Background";

// Memoized LoadingAnimation component
const LoadingAnimation = memo(() => (
  <section className="dots-container">
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
    <div className="dot" />
  </section>
));

LoadingAnimation.displayName = "LoadingAnimation";

// Memoized LoadingState component
interface LoadingStateProps {
  loadingText: string;
  connectingText: string;
}

const LoadingState = memo<LoadingStateProps>(
  ({ loadingText, connectingText }) => (
    <div className="text-center">
      <LoadingAnimation />
      <span className="visually-hidden text-white">{loadingText}</span>
      <p className="mt-3">{connectingText}</p>
    </div>
  )
);

LoadingState.displayName = "LoadingState";

export const AuthGoogleCallback: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedLanguage } = useShopContext();

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Memoize translations
  const t = useMemo(
    () =>
      OAuthCallbackTranslations[
        selectedLanguage.code as keyof typeof OAuthCallbackTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize cleanup function for auth data
  const cleanupAuthData = useCallback(() => {
    localStorage.removeItem("googleAuthMode");
    localStorage.removeItem("preAuthUrl");
  }, []);

  // Memoize error navigation function
  const navigateToAuthPage = useCallback(
    (mode: string, errorMessage: string, email?: string) => {
      const targetPath = mode === "signup" ? "/signup" : "/login";

      navigate(targetPath, {
        state: {
          error: errorMessage,
          ...(email && { email }),
        },
        replace: true,
      });

      cleanupAuthData();
    },
    [navigate, cleanupAuthData]
  );

  // Memoize the OAuth callback handler
  const handleGoogleCallback = useCallback(async () => {
    try {
      const urlParams = new URLSearchParams(location.search);
      const code = urlParams.get("code");
      const error = urlParams.get("error");
      const state = urlParams.get("state");

      // Determine auth mode
      let mode = "login"; // Default

      if (state) {
        try {
          const stateData = JSON.parse(state);
          mode = stateData.mode || "login";
        } catch {
          console.warn("Invalid state parameter, falling back to localStorage");
          mode = localStorage.getItem("googleAuthMode") || "login";
        }
      } else {
        mode = localStorage.getItem("googleAuthMode") || "login";
      }

      // Handle OAuth error
      if (error) {
        console.error("Google OAuth error:", error);
        navigateToAuthPage(mode, `Google ${mode} failed`);
        return;
      }

      // Validate authorization code
      if (!code) {
        console.error("No authorization code received");
        navigateToAuthPage(mode, "Authorization failed");
        return;
      }

      // Exchange code for tokens with mode
      const response = await axios.post(
        `${API_URL}/api/auth/google`,
        {
          code,
          mode,
        },
        {
          timeout: 10000, // 10 second timeout
        }
      );

      if (response.data.success) {
        // Store user data
        const userData = response.data.user;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isAuthenticated", "true");

        console.log("✅ Google authentication successful:", userData.username);

        // Redirect to previous page or home
        const preAuthUrl = localStorage.getItem("preAuthUrl") || "/";
        cleanupAuthData();

        // Use window.location.href for full page reload to trigger Chat component re-render
        window.location.href = preAuthUrl;
        return;
      }

      // Handle needsSignup flag from backend
      if (response.data.needsSignup) {
        navigateToAuthPage(
          "signup",
          response.data.message,
          response.data.email
        );
        return;
      }

      // Handle other backend errors
      throw new Error(response.data.message || "Authentication failed");
    } catch (error: any) {
      console.error("Google callback error:", error);

      const mode = localStorage.getItem("googleAuthMode") || "login";

      // Extract error message
      let errorMessage = "Failed to authenticate with Google";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      } else if (error.code === "ECONNABORTED") {
        errorMessage = "Request timeout. Please try again.";
      }

      navigateToAuthPage(mode, errorMessage);
    }
  }, [location.search, navigateToAuthPage, API_URL, cleanupAuthData]);

  // Main effect with cleanup
  useEffect(() => {
    let mounted = true;

    const executeCallback = async () => {
      if (mounted) {
        await handleGoogleCallback();
      }
    };

    executeCallback();

    return () => {
      mounted = false;
    };
  }, [handleGoogleCallback]);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Background />
      <div className="d-flex justify-content-center align-items-center vh-100">
        <LoadingState loadingText={t.loading} connectingText={t.connecting} />
      </div>
    </div>
  );
};
