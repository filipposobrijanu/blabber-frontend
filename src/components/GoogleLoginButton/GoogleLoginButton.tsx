import React, { useMemo, useCallback, memo } from "react";
import { useShopContext } from "../../hooks/useShopContext";
import { loginTranslations } from "../Login/LoginTranslations";
import "./GoogleLoginButton.css";

interface GoogleLoginButtonProps {
  onSuccess: (userData: any) => void;
  onError: (error: string) => void;
  isLoading?: boolean;
  mode?: "login" | "signup";
}

// Memoized GoogleIcon component
const GoogleIcon = memo(() => (
  <svg
    width="22"
    height="22"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    aria-label="Google"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    />
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    />
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    />
  </svg>
));

GoogleIcon.displayName = "GoogleIcon";

// Memoized ButtonContent component
interface ButtonContentProps {
  isLoading: boolean;
  mode: "login" | "signup";
  signUpWithGoogle: string;
  continueWithGoogle: string;
  loadingText: string;
}

const ButtonContent = memo<ButtonContentProps>(
  ({ isLoading, mode, signUpWithGoogle, continueWithGoogle, loadingText }) => (
    <div className="google-btn-content gap-1">
      <GoogleIcon />
      <span>
        {isLoading
          ? loadingText
          : mode === "signup"
          ? signUpWithGoogle
          : continueWithGoogle}
      </span>
    </div>
  )
);

ButtonContent.displayName = "ButtonContent";

// Main GoogleLoginButton component
export const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = memo(
  ({ onSuccess, onError, isLoading = false, mode = "login" }) => {
    const { selectedLanguage } = useShopContext();

    // Memoize translations
    const t = useMemo(
      () =>
        loginTranslations[
          selectedLanguage.code as keyof typeof loginTranslations
        ],
      [selectedLanguage.code]
    );

    // Memoize OAuth configuration
    const oauthConfig = useMemo(() => {
      const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

      const redirectUri =
        process.env.NODE_ENV === "production"
          ? "https://blabber-chat.netlify.app/auth/google/callback"
          : "http://localhost:3000/auth/google/callback";

      return { clientId, redirectUri };
    }, []);

    // Memoize Google OAuth handler with optimized URL construction
    const handleGoogleAuth = useCallback(() => {
      if (isLoading || !oauthConfig.clientId) {
        if (!oauthConfig.clientId) {
          onError("Google OAuth client ID is not configured");
        }
        return;
      }

      try {
        // Store auth data before redirect
        localStorage.setItem("preAuthUrl", window.location.href);
        localStorage.setItem("googleAuthMode", mode);

        // Construct OAuth URL with URLSearchParams for better encoding
        const params = new URLSearchParams({
          client_id: oauthConfig.clientId,
          redirect_uri: oauthConfig.redirectUri,
          response_type: "code",
          scope: "email profile",
          access_type: "offline",
          prompt: "consent",
          state: JSON.stringify({ mode, timestamp: Date.now() }), // Add timestamp for uniqueness
        });

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        // Navigate to Google OAuth
        window.location.href = authUrl;
      } catch (error) {
        console.error("Failed to initiate Google OAuth:", error);
        onError("Failed to initiate Google login. Please try again.");
      }
    }, [
      isLoading,
      mode,
      oauthConfig.clientId,
      oauthConfig.redirectUri,
      onError,
    ]);

    // Memoize button text based on state
    const buttonProps = useMemo(
      () => ({
        isLoading,
        mode,
        signUpWithGoogle: t.signUpWithGoogle,
        continueWithGoogle: t.continueWithGoogle,
        loadingText: t.loading,
      }),
      [isLoading, mode, t]
    );

    return (
      <button
        onClick={handleGoogleAuth}
        className="btn btn-outline-light rounded-4 fw-bold google-login-btn"
        type="button"
        disabled={isLoading || !oauthConfig.clientId}
        aria-label={
          mode === "signup" ? t.signUpWithGoogle : t.continueWithGoogle
        }
        aria-busy={isLoading}
      >
        <ButtonContent {...buttonProps} />
      </button>
    );
  }
);

GoogleLoginButton.displayName = "GoogleLoginButton";
