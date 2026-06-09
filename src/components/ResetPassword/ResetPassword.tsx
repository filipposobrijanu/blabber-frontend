import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import objects from "../../assets/3dobjects.png";
import { resetPasswordTranslations } from "./ResetPasswordTranslations";
import { useShopContext } from "../../hooks/useShopContext";
import { motion } from "framer-motion";

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

const SkeletonLoader = memo(() => (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    <Background />
    <div className="invite-page">
      <div className="login-container glass p-5 rounded-5">
        <div className="text-center mb-4">
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div
              className="skeleton-blink rounded-5 mb-3 d-flex justify-content-center align-items-center"
              style={{
                width: "50px",
                height: "50px",
                backgroundColor: "#adadade8",
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div
              className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center"
              style={{
                width: "325px",
                height: "35px",
                backgroundColor: "#ffffffec",
              }}
            />
            <div
              className="skeleton-blink rounded-5 mt-3 d-flex justify-content-center align-items-center"
              style={{
                width: "275px",
                height: "25px",
                backgroundColor: "#adadade8",
              }}
            />
          </div>
        </div>

        <form>
          <div className="mb-4">
            <div
              className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center"
              style={{
                width: "325px",
                height: "40px",
                backgroundColor: "#ffffffec",
              }}
            />
          </div>

          <div className="mb-2">
            <div
              className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center"
              style={{
                width: "325px",
                height: "40px",
                backgroundColor: "#ffffffec",
              }}
            />
          </div>

          <div className="d-flex flex-column gap-3 mt-5">
            <div
              className="skeleton-blink2 rounded-4 d-flex justify-content-center align-items-center"
              style={{
                width: "325px",
                height: "40px",
                backgroundColor: "#ffffffec",
              }}
            />
            <div
              className="skeleton-blink2 rounded-4 d-flex justify-content-center align-items-center"
              style={{
                width: "325px",
                height: "40px",
                backgroundColor: "#ffffffec",
              }}
            />
          </div>
        </form>
      </div>
    </div>
  </div>
));

SkeletonLoader.displayName = "SkeletonLoader";

const InvalidLinkState = memo(
  ({
    t,
    onNavigateLogin,
  }: {
    t: (typeof resetPasswordTranslations)[keyof typeof resetPasswordTranslations];
    onNavigateLogin: () => void;
  }) => (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Background />
      <div className="invite-page">
        <div className="invite-container glass p-5 rounded-5 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="64"
            height="64"
            fill="currentColor"
            className="bi bi-exclamation-circle mb-4"
            viewBox="0 0 16 16"
            aria-label={t.invalidResetLink}
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
          </svg>
          <h2 className="mb-3">{t.invalidResetLink}</h2>
          <p className="mb-4" style={{ color: "#ffffffa8" }}>
            {t.invalidResetLinkMessage}
          </p>
          <button
            onClick={onNavigateLogin}
            className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase"
          >
            {t.goToLogin}
          </button>
        </div>
      </div>
    </div>
  ),
);

InvalidLinkState.displayName = "InvalidLinkState";

interface PasswordFormProps {
  newPassword: string;
  confirmPassword: string;
  errorMessage: string;
  successMessage: string;
  isLoading: boolean;
  t: (typeof resetPasswordTranslations)[keyof typeof resetPasswordTranslations];
  onNewPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onNavigateLogin: () => void;
}

const PasswordForm = memo<PasswordFormProps>(
  ({
    newPassword,
    confirmPassword,
    errorMessage,
    successMessage,
    isLoading,
    t,
    onNewPasswordChange,
    onConfirmPasswordChange,
    onSubmit,
    onNavigateLogin,
  }) => {
    const handleSubmit = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(e);
      },
      [onSubmit],
    );

    return (
      <div className="login-container glass p-5 rounded-5">
        <div className="text-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-shield-lock mb-4"
            viewBox="0 0 16 16"
            aria-label={t.resetYourPassword}
          >
            <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
            <path d="M9.5 6.5a1.5 1.5 0 0 1-1 1.415l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99a1.5 1.5 0 1 1 2-1.415" />
          </svg>
          <h3 className="mb-1">{t.resetYourPassword}</h3>
          <p style={{ color: "#ffffffa8" }}>{t.enterNewPassword}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <input
                type="password"
                className="border-0 px-2 flex-grow-1"
                style={{
                  outline: "none",
                  background: "transparent",
                  color: "white",
                }}
                placeholder={t.newPassword}
                value={newPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
                required
                disabled={isLoading}
              />
            </motion.div>
          </div>

          <div className="mb-2">
            <motion.div
              whileFocus={{ scale: 1.02 }}
              whileHover={{ scale: 1.01 }}
              className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
              style={{
                backgroundColor: "transparent",
                color: "white",
              }}
            >
              <input
                type="password"
                className="border-0 px-2 flex-grow-1"
                style={{
                  outline: "none",
                  background: "transparent",
                  color: "white",
                }}
                placeholder={t.confirmNewPassword}
                value={confirmPassword}
                onChange={(e) => onConfirmPasswordChange(e.target.value)}
                required
                disabled={isLoading}
              />
            </motion.div>
          </div>

          {errorMessage && (
            <div className="text-center mb-3">
              <small className="text-danger">{errorMessage}</small>
            </div>
          )}

          {successMessage && (
            <div className="text-center mb-3">
              <small className="text-white">{successMessage}</small>
            </div>
          )}

          <div className="d-flex flex-column gap-3 mt-5">
            <button
              type="submit"
              disabled={isLoading}
              className="btn btn-light p-2 px-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
              aria-busy={isLoading}
            >
              {isLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  />
                  {t.resetting}
                </>
              ) : (
                t.resetPassword
              )}
            </button>
            <button
              type="button"
              onClick={onNavigateLogin}
              className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase w-100"
              disabled={isLoading}
            >
              {t.backToLogin}
            </button>
          </div>
        </form>
      </div>
    );
  },
);

PasswordForm.displayName = "PasswordForm";

export const ResetPassword: React.FC = () => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { selectedLanguage } = useShopContext();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  // Extract params
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const t = useMemo(
    () =>
      resetPasswordTranslations[
        selectedLanguage.code as keyof typeof resetPasswordTranslations
      ],
    [selectedLanguage.code],
  );

  const handleNavigateLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleNewPasswordChange = useCallback((value: string) => {
    setNewPassword(value);
  }, []);

  const handleConfirmPasswordChange = useCallback((value: string) => {
    setConfirmPassword(value);
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!token || !email) {
        setErrorMessage(t.invalidResetLinkError);
        return;
      }

      if (newPassword !== confirmPassword) {
        setErrorMessage(t.passwordsDontMatch);
        return;
      }

      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      let mounted = true;
      let redirectTimer: NodeJS.Timeout | null = null;

      try {
        const response = await fetch(`${API_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, email, newPassword }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || t.passwordResetFailed);
        }

        if (mounted) {
          setSuccessMessage(t.passwordResetSuccessfully);

          redirectTimer = setTimeout(() => {
            if (mounted) {
              navigate("/login");
            }
          }, 3000);
        }
      } catch (error: any) {
        if (mounted) {
          setErrorMessage(error.message || t.passwordResetFailed);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }

      return () => {
        mounted = false;
        if (redirectTimer) {
          clearTimeout(redirectTimer);
        }
      };
    },
    [token, email, newPassword, confirmPassword, API_URL, navigate, t],
  );

  useEffect(() => {
    document.title = `Blabber - ${t.resetYourPassword}`;
  }, [t.resetYourPassword]);

  useEffect(() => {
    let mounted = true;

    const timer = setTimeout(() => {
      if (mounted) {
        setIsLoadingSkeleton(false);
      }
    }, 350);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  if (isLoadingSkeleton) {
    return <SkeletonLoader />;
  }

  if (!token || !email) {
    return <InvalidLinkState t={t} onNavigateLogin={handleNavigateLogin} />;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Background />
      <div className="invite-page">
        <PasswordForm
          newPassword={newPassword}
          confirmPassword={confirmPassword}
          errorMessage={errorMessage}
          successMessage={successMessage}
          isLoading={isLoading}
          t={t}
          onNewPasswordChange={handleNewPasswordChange}
          onConfirmPasswordChange={handleConfirmPasswordChange}
          onSubmit={handleSubmit}
          onNavigateLogin={handleNavigateLogin}
        />
      </div>
    </div>
  );
};
