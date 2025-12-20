import React, { useEffect, useState, useMemo, memo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import objects from "../../assets/3dobjects.png";
import { termsTranslations } from "./TermsOfServiceTranslations";
import { useShopContext } from "../../hooks/useShopContext";
import "./TermsOfService.css";

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

// Memoized SkeletonLoader component
const SkeletonLoader = memo(() => (
  <div style={{ position: "relative", minHeight: "100vh" }}>
    <Background />
    <div className="invite-page login-container">
      <div
        className="invite-container glass p-5"
        style={{
          maxWidth: "800px",
          maxHeight: "calc(100vh - 90px)",
          overflowY: "auto",
        }}
      >
        <div className="text-center mb-5">
          <div
            className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center mx-auto mb-4"
            style={{
              width: "64px",
              height: "64px",
              backgroundColor: "#ffffffec",
            }}
          />
          <div
            className="skeleton-blink2 rounded-5 d-flex justify-content-center align-items-center mx-auto mb-3"
            style={{
              width: "200px",
              height: "32px",
              backgroundColor: "#ffffffec",
            }}
          />
          <div
            className="skeleton-blink rounded-5 d-flex justify-content-center align-items-center mx-auto"
            style={{
              width: "150px",
              height: "20px",
              backgroundColor: "#adadade8",
            }}
          />
        </div>

        <div
          className="terms-content"
          style={{
            maxHeight: "400px",
            overflowY: "auto",
            paddingRight: "10px",
          }}
        >
          {[...Array(8)].map((_, index) => (
            <div key={index} className="mb-4">
              <div
                className="skeleton-blink2 rounded-5 mb-3"
                style={{
                  width: "70%",
                  height: "24px",
                  backgroundColor: "#ffffffec",
                }}
              />
              <div
                className="skeleton-blink rounded-5"
                style={{
                  width: "100%",
                  height: "16px",
                  backgroundColor: "#adadade8",
                  marginBottom: "8px",
                }}
              />
              <div
                className="skeleton-blink rounded-5"
                style={{
                  width: "90%",
                  height: "16px",
                  backgroundColor: "#adadade8",
                  marginBottom: "8px",
                }}
              />
              <div
                className="skeleton-blink rounded-5"
                style={{
                  width: "85%",
                  height: "16px",
                  backgroundColor: "#adadade8",
                }}
              />
            </div>
          ))}
        </div>

        <div className="d-flex flex-column gap-2 mt-5">
          <div
            className="skeleton-blink2 rounded-4"
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "#ffffffec",
            }}
          />
          <div
            className="skeleton-blink2 rounded-4"
            style={{
              width: "100%",
              height: "44px",
              backgroundColor: "#ffffffec",
            }}
          />
        </div>
      </div>
    </div>
  </div>
));

SkeletonLoader.displayName = "SkeletonLoader";

// Memoized TermsContent component
const TermsContent = memo(
  ({
    t,
  }: {
    t: (typeof termsTranslations)[keyof typeof termsTranslations];
  }) => (
    <div
      className="terms-content"
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "10px",
        position: "relative",
      }}
    >
      <div className="mb-4">
        <h5 className="mb-3">{t.acceptanceOfTerms}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.acceptanceOfTermsText}
        </p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.userAccounts}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.userAccountsText}
        </p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.acceptableUse}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.acceptableUseText}
        </p>
        <ul
          style={{
            color: "#ffffffa8",
            fontSize: "14px",
            paddingLeft: "20px",
          }}
        >
          <li>{t.harassThreaten}</li>
          <li>{t.shareIllegal}</li>
          <li>{t.impersonate}</li>
          <li>{t.distributeSpam}</li>
          <li>{t.violateLaws}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.contentOwnership}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.contentOwnershipText}
        </p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.privacy}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>{t.privacyText}</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.termination}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.terminationText}
        </p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.changesTerms}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>
          {t.changesTermsText}
        </p>
      </div>

      <div>
        <h5 className="mb-3">{t.contact}</h5>
        <p style={{ color: "#ffffffa8", fontSize: "14px" }}>{t.contactText}</p>
      </div>
    </div>
  )
);

TermsContent.displayName = "TermsContent";

// Memoized ActionButtons component
const ActionButtons = memo(
  ({
    t,
    onNavigateLogin,
    onNavigatePrivacy,
  }: {
    t: (typeof termsTranslations)[keyof typeof termsTranslations];
    onNavigateLogin: () => void;
    onNavigatePrivacy: () => void;
  }) => (
    <div className="d-flex flex-column gap-2 mt-5">
      <button
        onClick={onNavigateLogin}
        className="btn btn-light p-2 px-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
      >
        {t.iUnderstand}
      </button>
      <button
        onClick={onNavigatePrivacy}
        className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase w-100"
      >
        {t.privacyPolicy}
      </button>
    </div>
  )
);

ActionButtons.displayName = "ActionButtons";

export const TermsOfService: React.FC = () => {
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const { selectedLanguage } = useShopContext();
  const navigate = useNavigate();

  // Memoize translation
  const t = useMemo(
    () =>
      termsTranslations[
        selectedLanguage.code as keyof typeof termsTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize the date
  const currentDate = useMemo(() => new Date().toLocaleDateString(), []);

  // Memoize navigation handlers
  const handleNavigateLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleNavigatePrivacy = useCallback(() => {
    navigate("/privacy");
  }, [navigate]);

  // Combine effects
  useEffect(() => {
    document.title = `Blabber - ${t.termsOfService}`;
  }, [t.termsOfService]);

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

  // Loading state
  if (isLoadingSkeleton) {
    return <SkeletonLoader />;
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Background />
      <div className="invite-page login-container">
        <div
          className="invite-container glass p-5"
          style={{
            maxWidth: "800px",
            maxHeight: "calc(100vh - 90px)",
            overflowY: "auto",
          }}
        >
          <div className="text-center mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              fill="currentColor"
              className="bi bi-file-text mb-4"
              viewBox="0 0 16 16"
              aria-label={t.termsOfService}
            >
              <path d="M5 4a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0-2a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zM5 7a.5.5 0 0 0 0 1h6a.5.5 0 0 0 0-1zm0 2a.5.5 0 0 0 0 1h3a.5.5 0 0 0 0-1z" />
              <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2zm10-1H4a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1" />
            </svg>
            <h3 className="mb-1">{t.termsOfService}</h3>
            <p style={{ color: "#ffffffa8" }}>
              {t.lastUpdated} {currentDate}
            </p>
          </div>

          <TermsContent t={t} />

          <ActionButtons
            t={t}
            onNavigateLogin={handleNavigateLogin}
            onNavigatePrivacy={handleNavigatePrivacy}
          />
        </div>
      </div>
    </div>
  );
};
