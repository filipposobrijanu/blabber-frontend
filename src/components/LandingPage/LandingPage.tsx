import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";
import logo from "../../assets/logo.png";
import objects from "../../assets/3dobjects.png";
import { useShopContext } from "../../hooks/useShopContext";
import { motion } from "framer-motion";
import { LandingPageTranslations } from "./LandingPageTranslations";
import { isAndroid, isIOS, isWindows } from "react-device-detect";

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

// Memoized AndroidIcon component
const AndroidIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    fill="currentColor"
    viewBox="0 0 1024 1024"
    aria-label="Android"
  >
    <path d="M270.1 741.7c0 23.4 19.1 42.5 42.6 42.5h48.7v120.4c0 30.5 24.5 55.4 54.6 55.4 30.2 0 54.6-24.8 54.6-55.4V784.1h85v120.4c0 30.5 24.5 55.4 54.6 55.4 30.2 0 54.6-24.8 54.6-55.4V784.1h48.7c23.5 0 42.6-19.1 42.6-42.5V346.4h-486v395.3zm357.1-600.1l44.9-65c2.6-3.8 2-8.9-1.5-11.4-3.5-2.4-8.5-1.2-11.1 2.6l-46.6 67.6c-30.7-12.1-64.9-18.8-100.8-18.8-35.9 0-70.1 6.7-100.8 18.8l-46.6-67.5c-2.6-3.8-7.6-5.1-11.1-2.6-3.5 2.4-4.1 7.4-1.5 11.4l44.9 65c-71.4 33.2-121.4 96.1-127.8 169.6h486c-6.6-73.6-56.7-136.5-128-169.7zM409.5 244.1a26.9 26.9 0 1 1 26.9-26.9 26.97 26.97 0 0 1-26.9 26.9zm208.4 0a26.9 26.9 0 1 1 26.9-26.9 26.97 26.97 0 0 1-26.9 26.9zm223.4 100.7c-30.2 0-54.6 24.8-54.6 55.4v216.4c0 30.5 24.5 55.4 54.6 55.4 30.2 0 54.6-24.8 54.6-55.4V400.1c.1-30.6-24.3-55.3-54.6-55.3zm-658.6 0c-30.2 0-54.6 24.8-54.6 55.4v216.4c0 30.5 24.5 55.4 54.6 55.4 30.2 0 54.6-24.8 54.6-55.4V400.1c0-30.6-24.5-55.3-54.6-55.3z" />
  </svg>
));

AndroidIcon.displayName = "AndroidIcon";

// Memoized iOSIcon component
const IOSIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="42"
    height="42"
    fill="currentColor"
    viewBox="0 0 1024 1024"
    aria-label="iOS"
  >
    <path d="M747.4 535.7c-.4-68.2 30.5-119.6 92.9-157.5-34.9-50-87.7-77.5-157.3-82.8-65.9-5.2-138 38.4-164.4 38.4-27.9 0-91.7-36.6-141.9-36.6C273.1 298.8 163 379.8 163 544.6c0 48.7 8.9 99 26.7 150.8 23.8 68.2 109.6 235.3 199.1 232.6 46.8-1.1 79.9-33.2 140.8-33.2 59.1 0 89.7 33.2 141.9 33.2 90.3-1.3 167.9-153.2 190.5-221.6-121.1-57.1-114.6-167.2-114.6-170.7zm-105.1-305c50.7-60.2 46.1-115 44.6-134.7-44.8 2.6-96.6 30.5-126.1 64.8-32.5 36.8-51.6 82.3-47.5 133.6 48.4 3.7 92.6-21.2 129-63.7z" />
  </svg>
));

IOSIcon.displayName = "IOSIcon";

// Memoized WindowsIcon component
const WindowsIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-label="Windows"
  >
    <path d="M6.555 1.375 0 2.237v5.45h6.555zM0 13.795l6.555.933V8.313H0zm7.278-5.4.026 6.378L16 16V8.395zM16 0 7.33 1.244v6.414H16z" />
  </svg>
));

WindowsIcon.displayName = "WindowsIcon";

// Memoized BrowserIcon component
const BrowserIcon = memo(() => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="30"
    height="30"
    fill="currentColor"
    viewBox="0 0 16 16"
    aria-label="Browser"
  >
    <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A7.97 7.97 0 0 0 5.145 4H7.5zM4.09 4H2.255a6.96 6.96 0 0 1 3.525-2.618Q4.474 2.06 4.09 4m-2.8 3.134A1 1 0 0 1 1 6.2V4.9A7.02 7.02 0 0 0 2.255 5zM1 7v1a1 1 0 0 0 .293.707L3 9.207V8zm3 3.207v1.586l-.707-.293A1 1 0 0 1 3 10zm2 0v1.085c.976 0 1.765-.555 2.15-1.642a5 5 0 0 1-.155-.168zM8 13c.468 0 .907-.151 1.263-.416l.761.97a2 2 0 0 1-2.024.446z" />
  </svg>
));

BrowserIcon.displayName = "BrowserIcon";

// Memoized Header component
const Header = memo(
  ({
    onSkipToApp,
    loginButton,
  }: {
    onSkipToApp: () => void;
    loginButton: string;
  }) => (
    <header className="landing-header">
      <div className="logo-container d-flex gap-2 align-items-center">
        <img
          src={logo}
          alt="Blabber Logo"
          className="logo align-middle"
          width="48"
          height="48"
          loading="eager"
        />
        <h3 className="m-0 align-middle">Blabber</h3>
      </div>
      <button
        className="skip-button btn btn-outline-light fw-bold rounded-4 px-4 py-2"
        onClick={onSkipToApp}
      >
        {loginButton}
      </button>
    </header>
  )
);

Header.displayName = "Header";

// Memoized Stats component
const Stats = memo(
  ({
    activeUsers,
    messagesSent,
    uptime,
    isMobile,
  }: {
    activeUsers: string;
    messagesSent: string;
    uptime: string;
    isMobile: boolean;
  }) => (
    <div className="stats-container">
      <div className="row justify-content-center gap-4">
        <div className="col-auto">
          <div className="stat-item text-center">
            <h3 className="text-white mb-1">10K+</h3>
            <p className="text-white-50 mb-0">{activeUsers}</p>
          </div>
        </div>
        <div className="col-auto">
          <div className="stat-item text-center">
            <h3 className="textt-white mb-1">1M+</h3>
            <p className="text-white-50 mb-0">{messagesSent}</p>
          </div>
        </div>
        {!isMobile && (
          <div className="col-auto">
            <div className="stat-item text-center">
              <h3 className="textt-white mb-1">99.9%</h3>
              <p className="text-white-50 mb-0">{uptime}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
);

Stats.displayName = "Stats";

// Memoized Footer component
const Footer = memo(() => (
  <footer className="landing-footer">
    <p className="footer-copyright">
      © {new Date().getFullYear()} Blabber. All rights reserved.
    </p>
  </footer>
));

Footer.displayName = "Footer";

// Memoized DownloadModal component
interface DownloadModalProps {
  isNoDownloadClosing: boolean;
  showNoDownload: boolean;
  t: (typeof LandingPageTranslations)[keyof typeof LandingPageTranslations];
  onClose: () => void;
}

const DownloadModal = memo<DownloadModalProps>(
  ({ isNoDownloadClosing, showNoDownload, t, onClose }) => {
    const handleModalClick = useCallback(
      (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      },
      [onClose]
    );

    if (!showNoDownload) return null;

    const isIOSDevice = isIOS;
    const modalStyle = isIOSDevice
      ? {
          color: "black",
          backgroundColor: isIOSDevice
            ? "rgba(255, 255, 255, 0.95)"
            : undefined,
        }
      : {};

    return (
      <div
        className={`modal ${isNoDownloadClosing ? "fade-out" : "fade-in"} ${
          !isNoDownloadClosing ? "show" : ""
        } pb-5`}
        style={{
          display: "block",
          background: "#020e0ac7",
          backdropFilter: "blur(5px)",
        }}
        onClick={handleModalClick}
      >
        <div
          className="modal-dialog modal-dialog-centered"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className={`modal-content text-white ${
              isAndroid
                ? "glass-popup-android"
                : isIOS
                ? "glass-popup-ios"
                : isWindows
                ? "glass-popup-windows"
                : "glass-popup-windows"
            } rounded-5 m-0 mt-1 py-3 mt-md-0`}
            style={modalStyle}
          >
            <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
              {isAndroid ? (
                <AndroidIcon />
              ) : isIOS ? (
                <IOSIcon />
              ) : (
                <WindowsIcon />
              )}
              <h3 className="modal-title" style={modalStyle}>
                {t.noDownloadTitle}
              </h3>
            </div>
            <small
              className="d-flex justify-content-center align-items-center px-5 flex-wrap text-center"
              style={{ color: isIOS ? "black" : "#e9e9e9ff" }}
            >
              {t.noDownloadMessage}
            </small>
            <div className="modal-footer d-flex justify-content-center align-items-center">
              <button
                type="button"
                className={`btn ${
                  isIOS ? "text-white bg-black" : "btn-outline-light"
                } fw-bold order-md-first order-last rounded-5 text-uppercase p-2 mt-3 px-3`}
                onClick={onClose}
                disabled={isNoDownloadClosing}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

DownloadModal.displayName = "DownloadModal";

// Main LandingPage component
export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [hasVisitedBefore, setHasVisitedBefore] = useState(false);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const { selectedLanguage } = useShopContext();
  const [showNoDownload, setShowNoDownload] = useState(false);
  const [isNoDownloadClosing, setIsNoDownloadClosing] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Memoize translations
  const t = useMemo(
    () =>
      LandingPageTranslations[
        selectedLanguage.code as keyof typeof LandingPageTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize animation variants
  const containerVariants = useMemo(
    () => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          duration: 1.25,
          when: "beforeChildren",
          staggerChildren: 0.1,
        },
      },
    }),
    []
  );

  // Memoize handlers
  const handleGetStarted = useCallback(() => {
    localStorage.setItem("hasVisitedLanding", "true");
    navigate("/login");
  }, [navigate]);

  const handleSkipToApp = useCallback(() => {
    localStorage.setItem("hasVisitedLanding", "true");
    navigate("/login");
  }, [navigate]);

  const handleGetDownloadLink = useCallback(() => {
    setShowNoDownload(true);
  }, []);

  const handleCloseShowNoDownloadModal = useCallback(() => {
    if (showNoDownload && !isNoDownloadClosing) {
      setIsNoDownloadClosing(true);
      setTimeout(() => {
        setIsNoDownloadClosing(false);
        setShowNoDownload(false);
      }, 250);
    }
  }, [showNoDownload, isNoDownloadClosing]);

  // Check if user has visited before
  useEffect(() => {
    const visited = localStorage.getItem("hasVisitedLanding");
    if (visited === "true") {
      setHasVisitedBefore(true);
      navigate("/login");
    }
  }, [navigate]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Handle loading skeleton
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Calculate responsive values
  const isMobile = windowWidth < 768;
  const browserButtonText = isMobile ? t.openInBrowserSmall : t.openInBrowser;

  // If has visited before, redirect will happen in useEffect
  if (hasVisitedBefore) {
    return null;
  }

  // Loading skeleton (optional)
  if (isLoadingSkeleton) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Background />
        <div className="d-flex justify-content-center align-items-center vh-100">
          <div className="spinner-border text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      style={{ position: "relative", minHeight: "100vh" }}
    >
      <DownloadModal
        isNoDownloadClosing={isNoDownloadClosing}
        showNoDownload={showNoDownload}
        t={t}
        onClose={handleCloseShowNoDownloadModal}
      />
      <Background />
      <div className="landing-page">
        <div className="landing-container">
          <Header onSkipToApp={handleSkipToApp} loginButton={t.loginButton} />

          <main className="landing-hero">
            <div className="hero-content">
              <h1 className="hero-title text-center text-white">
                {t.heroTitle}
              </h1>
              <p className="hero-subtitle">{t.heroSubtitle}</p>

              <div className="cta-section rounded-5">
                <div className="cta-content d-inline-flex gap-3 align-items-center justify-content-center rounded-5">
                  <div
                    className={`download-options ${
                      isMobile
                        ? "d-flex gap-2 flex-column"
                        : "d-flex gap-3 flex-column"
                    }`}
                  >
                    {isAndroid && (
                      <button
                        onClick={handleGetDownloadLink}
                        className="download-btn android-btn gap-1 d-flex justify-content-center align-items-center btn fw-bold px-4 py-2 rounded-5"
                      >
                        <AndroidIcon />
                        {t.androidDownload}
                      </button>
                    )}
                    {isIOS && (
                      <button
                        onClick={handleGetDownloadLink}
                        className="download-btn ios-btn gap-1 d-flex justify-content-center align-items-center btn fw-bold px-4 py-2 rounded-5"
                      >
                        <IOSIcon />
                        {t.iosDownload}
                      </button>
                    )}
                    {isWindows && (
                      <button
                        onClick={handleGetDownloadLink}
                        className="download-btn windows-btn gap-2 d-flex justify-content-center align-items-center btn fw-bold px-4 py-3 rounded-5"
                      >
                        <WindowsIcon />
                        {t.downloadWindows}
                      </button>
                    )}
                    <button
                      className="download-btn browser-btn gap-2 d-flex justify-content-center align-items-center btn fw-bold px-4 py-3 rounded-5 btn-light"
                      onClick={handleGetStarted}
                    >
                      <BrowserIcon />
                      {browserButtonText}
                    </button>
                  </div>
                </div>

                <Stats
                  activeUsers={t.activeUsers}
                  messagesSent={t.messagesSent}
                  uptime={t.uptime}
                  isMobile={isMobile}
                />
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </motion.div>
  );
};
