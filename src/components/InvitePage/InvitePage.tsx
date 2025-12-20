import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useShopContext } from "../../hooks/useShopContext";
import { invitePageTranslations } from "./InvitePageTranslations";
import logo from "../../assets/logo.png";
import "./InvitePage.css";
import objects from "../../assets/3dobjects.png";

// Memoized Background component
const Background = memo(({ isError = false }: { isError?: boolean }) => (
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
      filter: isError
        ? "blur(6px) brightness(0.6)"
        : "blur(7.5px) brightness(0.6)",
      opacity: 0.2,
      zIndex: 0,
    }}
  />
));

Background.displayName = "Background";

// Memoized ErrorState component
interface ErrorStateProps {
  error: string;
  t: (typeof invitePageTranslations)[keyof typeof invitePageTranslations];
  onGoHome: () => void;
}

const ErrorState = memo<ErrorStateProps>(({ error, t, onGoHome }) => (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    <Background isError />
    <div className="invite-page">
      <div className="invite-container glass p-5 rounded-5 text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="64"
          height="64"
          fill="currentColor"
          className="bi bi-exclamation-circle mb-4"
          viewBox="0 0 16 16"
          aria-label={t.invalidInvite}
        >
          <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
          <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z" />
        </svg>
        <h2 className="mb-3">{t.invalidInvite}</h2>
        <p className="mb-4" style={{ color: "#ffffffa8" }}>
          {error}
        </p>
        <button
          onClick={onGoHome}
          className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase"
        >
          {t.goHome}
        </button>
      </div>
    </div>
  </div>
));

ErrorState.displayName = "ErrorState";

// Memoized SkeletonLoader component
const SkeletonLoader = memo(() => (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    <Background />
    <div className="invite-page" style={{ position: "relative", zIndex: 1 }}>
      <div
        className="invite-container glass p-5 rounded-5 mx-auto"
        style={{ maxWidth: "500px" }}
      >
        <div className="text-center mb-5">
          <div className="d-flex align-items-center justify-content-center mb-3">
            <div
              className="skeleton-blink rounded-circle d-flex justify-content-center align-items-center"
              style={{
                width: "80px",
                height: "80px",
                backgroundColor: "#adadade8",
              }}
            />
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center">
            <div
              className="skeleton-blink rounded-5 mb-2 d-flex justify-content-center align-items-center"
              style={{
                width: "200px",
                height: "20px",
                backgroundColor: "#adadade8",
              }}
            />
            <div
              className="skeleton-blink2 rounded-5 mb-3 d-flex justify-content-center align-items-center"
              style={{
                width: "150px",
                height: "30px",
                backgroundColor: "#ffffffec",
              }}
            />
            <div
              className="skeleton-blink rounded-5 d-flex justify-content-center align-items-center"
              style={{
                width: "250px",
                height: "18px",
                backgroundColor: "#adadade8",
              }}
            />
          </div>
        </div>
        <div className="d-flex flex-column gap-3 mt-5">
          <div
            className="skeleton-blink2 rounded-4 d-flex justify-content-center align-items-center"
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#ffffffec",
            }}
          />
          <div
            className="skeleton-blink rounded-4 d-flex justify-content-center align-items-center"
            style={{
              width: "100%",
              height: "40px",
              backgroundColor: "#adadade8",
            }}
          />
        </div>
      </div>
    </div>
  </div>
));

SkeletonLoader.displayName = "SkeletonLoader";

// Memoized ChannelDisplay component
interface ChannelDisplayProps {
  channelInfo: any;
  t: (typeof invitePageTranslations)[keyof typeof invitePageTranslations];
  joining: boolean;
  onJoinChannel: () => void;
  onGoHome: () => void;
}

const ChannelDisplay = memo<ChannelDisplayProps>(
  ({ channelInfo, t, joining, onJoinChannel, onGoHome }) => {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // Handle window resize
    useEffect(() => {
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const maxNameWidth = windowWidth < 520 ? "190px" : "300px";
    const logoStyle = useMemo(
      () => ({ filter: "brightness(0) invert(1)" }),
      []
    );

    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Background />
        <div className="invite-page">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
                <div className="invite-container glass p-3 p-md-4 p-lg-5 rounded-5">
                  <div className="text-center mb-5">
                    <div className="d-flex align-items-center justify-content-center mb-3">
                      {channelInfo.image ? (
                        <img
                          src={channelInfo.image}
                          alt={channelInfo.name}
                          className="rounded-5"
                          style={{
                            width: "80px",
                            height: "80px",
                            objectFit: "cover",
                            filter: "drop-shadow(0 0 0.5rem #00000031)",
                          }}
                          loading="lazy"
                        />
                      ) : (
                        <div
                          className="rounded-5 p-4"
                          style={{
                            backgroundColor: channelInfo.bgcolor,
                            filter: "drop-shadow(0 0 0.5rem #00000031)",
                            width: "80px",
                            height: "80px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <img
                            className="rounded-4"
                            src={logo}
                            width="48"
                            alt="Channel"
                            style={logoStyle}
                          />
                        </div>
                      )}
                    </div>
                    <p style={{ color: "#ffffffa8" }} className="mb-2">
                      {t.youveBeenInvited}
                    </p>
                    <div className="d-flex align-items-center justify-content-center m-0">
                      <h3
                        className="text-capitalize m-0 text-truncate text-center"
                        style={{ maxWidth: maxNameWidth }}
                      >
                        #{channelInfo.name}
                      </h3>
                    </div>
                    {channelInfo.description && (
                      <p style={{ color: "#ffffffa8" }}>
                        {channelInfo.description}
                      </p>
                    )}
                  </div>

                  <div className="d-flex flex-column gap-3 mt-2">
                    <button
                      onClick={onJoinChannel}
                      disabled={joining}
                      className="btn btn-light p-2 px-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
                      aria-busy={joining}
                    >
                      {joining ? (
                        <>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          />
                          {t.joining}
                        </>
                      ) : (
                        t.acceptInvite
                      )}
                    </button>
                    <button
                      onClick={onGoHome}
                      className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase w-100"
                    >
                      {t.noThanks}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

ChannelDisplay.displayName = "ChannelDisplay";

// Main InvitePage component
export const InvitePage: React.FC = () => {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { selectedLanguage } = useShopContext();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [channelInfo, setChannelInfo] = useState<any | null>(null);
  const [joining, setJoining] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Memoize translations
  const t = useMemo(
    () =>
      invitePageTranslations[
        selectedLanguage.code as keyof typeof invitePageTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize extract invite code function
  const extractInviteCode = useCallback((code: string) => {
    if (code.includes("/invite/")) {
      return code.split("/invite/")[1];
    }
    return code;
  }, []);

  // Memoize handlers
  const handleJoinChannel = useCallback(async () => {
    if (!inviteCode) return;

    const userStr = localStorage.getItem("user");
    if (!userStr) {
      localStorage.setItem("pendingInvite", inviteCode);
      navigate("/");
      return;
    }

    try {
      const user = JSON.parse(userStr);
      setJoining(true);

      const code = extractInviteCode(inviteCode);

      const response = await fetch(`${API_URL}/api/channel/join/${code}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || t.failedToJoinChannel);
      }

      const { channel } = await response.json();

      navigate("/", {
        replace: true,
        state: {
          joinedChannel: {
            channelId: channel.id,
            channelName: channel.name,
          },
        },
      });
    } catch (err: any) {
      setError(err.message);
      setJoining(false);
    }
  }, [inviteCode, API_URL, navigate, extractInviteCode, t.failedToJoinChannel]);

  const handleGoHome = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // Effects
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

  useEffect(() => {
    let mounted = true;

    const fetchChannelInfo = async () => {
      if (!inviteCode) {
        if (mounted) {
          setError(t.invalidOrExpiredInvite);
          setLoading(false);
        }
        return;
      }

      const code = extractInviteCode(inviteCode);

      try {
        const response = await fetch(`${API_URL}/api/channel/invite/${code}`);

        if (!response.ok) {
          throw new Error(t.invalidOrExpiredInvite);
        }

        const data = await response.json();

        if (mounted) {
          setChannelInfo(data);
          setLoading(false);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          setLoading(false);
        }
      }
    };

    fetchChannelInfo();

    return () => {
      mounted = false;
    };
  }, [inviteCode, API_URL, extractInviteCode, t.invalidOrExpiredInvite]);

  // Update document title
  useEffect(() => {
    if (channelInfo?.name) {
      document.title = `Blabber - ${t.join} @${channelInfo.name}`;
    }
  }, [channelInfo, t.join]);

  // Loading state
  if (isLoadingSkeleton) {
    return <SkeletonLoader />;
  }

  // Error state
  if (error || !channelInfo) {
    return (
      <ErrorState
        error={error || t.invalidInviteMessage}
        t={t}
        onGoHome={handleGoHome}
      />
    );
  }

  // Channel display state
  return (
    <ChannelDisplay
      channelInfo={channelInfo}
      t={t}
      joining={joining}
      onJoinChannel={handleJoinChannel}
      onGoHome={handleGoHome}
    />
  );
};
