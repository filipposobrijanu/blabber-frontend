import React, { useEffect, useState, useMemo, useCallback, memo } from "react";
import { useNavigate } from "react-router-dom";
import objects from "../../assets/3dobjects.png";
import { privacyTranslations } from "./PrivacyPolicyTranslations";
import { useShopContext } from "../../hooks/useShopContext";

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
const SkeletonLoader = memo(() => {
  const skeletonItems = useMemo(() => Array.from({ length: 8 }), []);

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
            {skeletonItems.map((_, index) => (
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
  );
});

SkeletonLoader.displayName = "SkeletonLoader";

// Memoized PrivacyContent component
interface PrivacyContentProps {
  t: (typeof privacyTranslations)[keyof typeof privacyTranslations];
  currentDate: string;
}

const PrivacyContent = memo<PrivacyContentProps>(({ t, currentDate }) => {
  const listStyle = useMemo(
    () => ({
      color: "#ffffffa8",
      fontSize: "14px",
      paddingLeft: "20px",
    }),
    []
  );

  const paragraphStyle = useMemo(
    () => ({
      color: "#ffffffa8",
      fontSize: "14px",
    }),
    []
  );

  return (
    <div
      className="terms-content"
      style={{
        maxHeight: "400px",
        overflowY: "auto",
        paddingRight: "10px",
      }}
    >
      <div className="mb-4">
        <h5 className="mb-3">{t.informationWeCollect}</h5>
        <p style={paragraphStyle}>{t.informationWeCollectText}</p>
        <ul style={listStyle}>
          <li>{t.accountInformation}</li>
          <li>{t.profileInformation}</li>
          <li>{t.messagesContent}</li>
          <li>{t.technicalInformation}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.howWeUseInformation}</h5>
        <p style={paragraphStyle}>{t.howWeUseInformationText}</p>
        <ul style={listStyle}>
          <li>{t.provideServices}</li>
          <li>{t.createManageAccount}</li>
          <li>{t.facilitateCommunication}</li>
          <li>{t.sendUpdates}</li>
          <li>{t.ensureSecurity}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.informationSharing}</h5>
        <p style={paragraphStyle}>{t.informationSharingText}</p>
        <ul style={listStyle}>
          <li>{t.withConsent}</li>
          <li>{t.withOtherUsers}</li>
          <li>{t.complyLegal}</li>
          <li>{t.serviceProviders}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.dataSecurity}</h5>
        <p style={paragraphStyle}>{t.dataSecurityText}</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.yourRights}</h5>
        <p style={paragraphStyle}>{t.yourRightsText}</p>
        <ul style={listStyle}>
          <li>{t.accessUpdate}</li>
          <li>{t.deleteAccount}</li>
          <li>{t.optOutPromo}</li>
          <li>{t.exportData}</li>
        </ul>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.dataRetention}</h5>
        <p style={paragraphStyle}>{t.dataRetentionText}</p>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">{t.childrenPrivacy}</h5>
        <p style={paragraphStyle}>{t.childrenPrivacyText}</p>
      </div>

      <div>
        <h5 className="mb-3">{t.contactUs}</h5>
        <p style={paragraphStyle}>{t.contactUsText}</p>
      </div>
    </div>
  );
});

PrivacyContent.displayName = "PrivacyContent";

// Memoized ActionButtons component
interface ActionButtonsProps {
  t: (typeof privacyTranslations)[keyof typeof privacyTranslations];
  onNavigateLogin: () => void;
  onNavigateTOS: () => void;
}

const ActionButtons = memo<ActionButtonsProps>(
  ({ t, onNavigateLogin, onNavigateTOS }) => (
    <div className="d-flex flex-column gap-2 mt-5">
      <button
        onClick={onNavigateLogin}
        className="btn btn-light p-2 px-3 shadow-sm rounded-4 fw-bold text-uppercase w-100"
      >
        {t.iUnderstand}
      </button>
      <button
        onClick={onNavigateTOS}
        className="btn btn-outline-light p-2 px-4 shadow-sm rounded-4 fw-bold text-uppercase w-100"
      >
        {t.termsOfService}
      </button>
    </div>
  )
);

ActionButtons.displayName = "ActionButtons";

// Memoized Header component
interface HeaderProps {
  t: (typeof privacyTranslations)[keyof typeof privacyTranslations];
  currentDate: string;
}

const Header = memo<HeaderProps>(({ t, currentDate }) => (
  <div className="text-center mb-3">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      fill="currentColor"
      className="bi bi-shield-check mb-4"
      viewBox="0 0 16 16"
      aria-label={t.privacyPolicy}
    >
      <path d="M5.338 1.59a61 61 0 0 0-2.837.856.48.48 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.7 10.7 0 0 0 2.287 2.233c.346.244.652.42.893.533q.18.085.293.118a1 1 0 0 0 .101.025 1 1 0 0 0 .1-.025q.114-.034.294-.118c.24-.113.547-.29.893-.533a10.7 10.7 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.8 11.8 0 0 1-2.517 2.453 7 7 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7 7 0 0 1-1.048-.625 11.8 11.8 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 63 63 0 0 1 5.072.56" />
      <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0" />
    </svg>
    <h3 className="mb-1">{t.privacyPolicy}</h3>
    <p style={{ color: "#ffffffa8" }}>
      {t.lastUpdated} {currentDate}
    </p>
  </div>
));

Header.displayName = "Header";

// Main PrivacyPolicy component
export const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const { selectedLanguage } = useShopContext();

  // Memoize translations
  const t = useMemo(
    () =>
      privacyTranslations[
        selectedLanguage.code as keyof typeof privacyTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize the date
  const currentDate = useMemo(() => new Date().toLocaleDateString(), []);

  // Memoize navigation handlers
  const handleNavigateLogin = useCallback(() => {
    navigate("/login");
  }, [navigate]);

  const handleNavigateTOS = useCallback(() => {
    navigate("/tos");
  }, [navigate]);

  // Effects with cleanup
  useEffect(() => {
    document.title = `Blabber - ${t.privacyPolicy}`;
  }, [t.privacyPolicy]);

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
          className="invite-container glass p-5 "
          style={{
            maxWidth: "800px",
            maxHeight: "calc(100vh - 90px)",
            overflowY: "auto",
          }}
        >
          <Header t={t} currentDate={currentDate} />
          <PrivacyContent t={t} currentDate={currentDate} />
          <ActionButtons
            t={t}
            onNavigateLogin={handleNavigateLogin}
            onNavigateTOS={handleNavigateTOS}
          />
        </div>
      </div>
    </div>
  );
};
