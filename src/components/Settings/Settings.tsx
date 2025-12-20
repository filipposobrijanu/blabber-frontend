import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  CSSProperties,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useShopContext } from "../../hooks/useShopContext";
import { User } from "../../types/chat";
import objects from "../../assets/3dobjects.png";
import "./Settings.css";
import { Navbar } from "../Navbar/Navbar";
import { translations } from "../../translations";
import { motion } from "framer-motion";
import { AudioVideoSettings } from "../AudioVideoSettings/AudioVideoSettings";

interface SettingsProps {
  user: User;
  onUpdateUser?: (updatedUser: User) => void;
}
// ADD THIS after the LANGUAGES array in Settings.tsx
const FLAGS = {
  us: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path
          fill="#eee"
          d="M256 0h256v64l-32 32 32 32v64l-32 32 32 32v64l-32 32 32 32v64l-256 32L0 448v-64l32-32-32-32v-64z"
        />
        <path
          fill="#d80027"
          d="M224 64h288v64H224Zm0 128h288v64H256ZM0 320h512v64H0Zm0 128h512v64H0Z"
        />
        <path fill="#0052b4" d="M0 0h256v256H0Z" />
        <path
          fill="#eee"
          d="m187 243 57-41h-70l57 41-22-67zm-81 0 57-41H93l57 41-22-67zm-81 0 57-41H12l57 41-22-67zm162-81 57-41h-70l57 41-22-67zm-81 0 57-41H93l57 41-22-67zm-81 0 57-41H12l57 41-22-67Zm162-82 57-41h-70l57 41-22-67Zm-81 0 57-41H93l57 41-22-67zm-81 0 57-41H12l57 41-22-67Z"
        />
      </g>
    </svg>
  ),
  gr: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path
          fill="#0052b4"
          d="M0 0h99l29 32 28-32h356v57l-32 28 32 29v57l-32 28 32 29v57l-32 28 32 28v57l-32 29 32 28v57H0v-57l32-28-32-29v-56l32-29-32-28V171l32-29-32-28Z"
        />
        <path
          fill="#eee"
          d="M99 0v114H0v57h99v114H0v57h512v-57H156V171h100v-57H156V0Zm157 57v57h256V57Zm0 114v57h256v-57ZM0 398v57h512v-57z"
        />
      </g>
    </svg>
  ),

  es: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#ffda44" d="m0 128 256-32 256 32v256l-256 32L0 384Z" />
        <path fill="#d80027" d="M0 0h512v128H0zm0 384h512v128H0z" />
        <g fill="#eee">
          <path d="M144 304h-16v-80h16zm128 0h16v-80h-16z" />
          <ellipse cx="208" cy="296" rx="48" ry="32" />
        </g>
        <g fill="#d80027">
          <rect width="16" height="24" x="128" y="192" rx="8" />
          <rect width="16" height="24" x="272" y="192" rx="8" />
          <path d="M208 272v24a24 24 0 0 0 24 24 24 24 0 0 0 24-24v-24h-24z" />
        </g>
        <rect width="32" height="16" x="120" y="208" fill="#ff9811" ry="8" />
        <rect width="32" height="16" x="264" y="208" fill="#ff9811" ry="8" />
        <rect width="32" height="16" x="120" y="304" fill="#ff9811" rx="8" />
        <rect width="32" height="16" x="264" y="304" fill="#ff9811" rx="8" />
        <path
          fill="#ff9811"
          d="M160 272v24c0 8 4 14 9 19l5-6 5 10a21 21 0 0 0 10 0l5-10 5 6c6-5 9-11 9-19v-24h-9l-5 8-5-8h-10l-5 8-5-8z"
        />
        <path d="M122 252h172m-172 24h28m116 0h28" />
        <path
          fill="#d80027"
          d="M122 248a4 4 0 0 0-4 4 4 4 0 0 0 4 4h172a4 4 0 0 0 4-4 4 4 0 0 0-4-4zm0 24a4 4 0 0 0-4 4 4 4 0 0 0 4 4h28a4 4 0 0 0 4-4 4 4 0 0 0-4-4zm144 0a4 4 0 0 0-4 4 4 4 0 0 0 4 4h28a4 4 0 0 0 4-4 4 4 0 0 0-4-4z"
        />
        <path
          fill="#eee"
          d="M196 168c-7 0-13 5-15 11l-5-1c-9 0-16 7-16 16s7 16 16 16c7 0 13-4 15-11a16 16 0 0 0 17-4 16 16 0 0 0 17 4 16 16 0 1 0 10-20 16 16 0 0 0-27-5c-3-4-7-6-12-6zm0 8c5 0 8 4 8 8 0 5-3 8-8 8-4 0-8-3-8-8 0-4 4-8 8-8zm24 0c5 0 8 4 8 8 0 5-3 8-8 8-4 0-8-3-8-8 0-4 4-8 8-8zm-44 10 4 1 4 8c0 4-4 7-8 7s-8-3-8-8c0-4 4-8 8-8zm64 0c5 0 8 4 8 8 0 5-3 8-8 8-4 0-8-3-8-7l4-8z"
        />
        <path fill="none" d="M220 284v12c0 7 5 12 12 12s12-5 12-12v-12z" />
        <path fill="#ff9811" d="M200 160h16v32h-16z" />
        <path fill="#eee" d="M208 224h48v48h-48z" />
        <path
          fill="#d80027"
          d="m248 208-8 8h-64l-8-8c0-13 18-24 40-24s40 11 40 24zm-88 16h48v48h-48z"
        />
        <rect
          width="20"
          height="32"
          x="222"
          y="232"
          fill="#d80027"
          rx="10"
          ry="10"
        />
        <path
          fill="#ff9811"
          d="M168 232v8h8v16h-8v8h32v-8h-8v-16h8v-8zm8-16h64v8h-64z"
        />
        <g fill="#ffda44">
          <circle cx="186" cy="202" r="6" />
          <circle cx="208" cy="202" r="6" />
          <circle cx="230" cy="202" r="6" />
        </g>
        <path
          fill="#d80027"
          d="M169 272v43a24 24 0 0 0 10 4v-47h-10zm20 0v47a24 24 0 0 0 10-4v-43h-10z"
        />
        <g fill="#338af3">
          <circle cx="208" cy="272" r="16" />
          <rect width="32" height="16" x="264" y="320" ry="8" />
          <rect width="32" height="16" x="120" y="320" ry="8" />
        </g>
      </g>
    </svg>
  ),
  fr: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#eee" d="M167 0h178l25.9 252.3L345 512H167l-29.8-253.4z" />
        <path fill="#0052b4" d="M0 0h167v512H0z" />
        <path fill="#d80027" d="M345 0h167v512H345z" />
      </g>
    </svg>
  ),
  de: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#ffda44" d="m0 345 256.7-25.5L512 345v167H0z" />
        <path fill="#d80027" d="m0 167 255-23 257 23v178H0z" />
        <path fill="#333" d="M0 0h512v167H0z" />
      </g>
    </svg>
  ),
  ru: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#0052b4" d="M512 170v172l-256 32L0 342V170l256-32z" />
        <path fill="#eee" d="M512 0v170H0V0Z" />
        <path fill="#d80027" d="M512 342v170H0V342Z" />
      </g>
    </svg>
  ),
  md: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 512 512"
    >
      <mask id="a">
        <circle cx="256" cy="256" r="256" fill="#fff" />
      </mask>
      <g mask="url(#a)">
        <path fill="#0052b4" d="M0 0h144.7l36 254.6-36 257.4H0z" />
        <path fill="#d80027" d="M367.3 0H512v512H367.3l-29.7-257.3z" />
        <path fill="#ffda44" d="M144.7 0h222.6v512H144.7z" />
        <path
          fill="#ff9811"
          d="M345.1 201.4H284a27.8 27.8 0 1 0-55.6 0h-61.2a28.2 28.2 0 0 0 28.3 27.4h-1a27.4 27.4 0 0 0 27.5 27.4c0 13.4 9.6 24.5 22.3 27l-21.6 48.7a88.8 88.8 0 0 0 33.5 6.5 88.8 88.8 0 0 0 33.5-6.5L268.1 283a27.4 27.4 0 0 0 22.3-26.9 27.4 27.4 0 0 0 27.4-27.4h-.9a28.2 28.2 0 0 0 28.3-27.4z"
        />
        <path
          fill="#0052b4"
          d="M256.1 239.3 220 256v33.4l36.2 22.3 36.2-22.3V256z"
        />
        <path fill="#d80027" d="M220 222.6h72.3V256H220z" />
      </g>
    </svg>
  ),
};
// Memoize the skeleton component to prevent unnecessary re-renders
const SettingsSkeleton = React.memo(() => {
  const skeletonItems = useMemo(() => Array.from({ length: 2 }), []);

  const { selectedLanguage } = useShopContext();
  const t = translations[selectedLanguage.code as keyof typeof translations];
  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
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
      ></div>

      <div className="settings-page">
        <div
          className="settings-container glass p-3 p-md-5"
          style={{ maxWidth: "1300px", margin: "0 auto" }}
        >
          <Navbar nameOfTop={t.settings} />

          <div className="row g-3">
            <div className="col-12 col-md-3">
              <div className="text-start mb-3">
                <div
                  className="skeleton-blink rounded-4"
                  style={{
                    width: "160px",
                    height: "35px",
                    backgroundColor: "#adadade8",
                  }}
                ></div>
              </div>
            </div>
          </div>
          <div className="row g-3">
            {/* Sidebar Skeleton */}
            <div className="col-12 col-md-3">
              <div className="settings-sidebar glass p-3 p-md-4 rounded-5 h-100">
                {/* Header Skeleton */}
                <div className="d-flex gap-2 align-items-center mb-3 pe-2 ps-2 p-2 rounded-5">
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "28px",
                      height: "28px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                  <div
                    className="skeleton-blink2 rounded-5 flex-grow-1"
                    style={{
                      height: "20px",
                      backgroundColor: "#ffffffec",
                    }}
                  ></div>
                </div>

                {/* Tab Skeletons */}
                {skeletonItems.map((_, index) => (
                  <div key={index} className="mb-2">
                    <div className="d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center pe-2 ps-2">
                      <div
                        className="skeleton-blink rounded-5"
                        style={{
                          width: "44px",
                          height: "44px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                      <div
                        className="skeleton-blink2 rounded-5 flex-grow-1"
                        style={{
                          height: "20px",
                          backgroundColor: "#ffffffec",
                        }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Content Area Skeleton */}
            <div className="col-12 col-md-9">
              <div className="settings-content glass p-3 p-md-4 rounded-5 h-100">
                {/* Title Skeleton */}
                <div
                  className="skeleton-blink rounded-5 mb-4"
                  style={{
                    width: "200px",
                    height: "32px",
                    backgroundColor: "#adadade8",
                  }}
                ></div>

                <div className="row g-3">
                  {/* Avatar Section Skeleton */}
                  <div className="col-12 col-md-4 text-center mb-4">
                    <div className="profile-picture mb-3">
                      <div
                        className="skeleton-blink rounded-circle mb-3"
                        style={{
                          width: "120px",
                          height: "120px",
                          backgroundColor: "#adadade8",
                          margin: "0 auto",
                        }}
                      ></div>
                      <div
                        className="skeleton-blink2 rounded-4"
                        style={{
                          width: "140px",
                          height: "38px",
                          backgroundColor: "#ffffffec",
                          margin: "0 auto",
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Form Fields Skeleton */}
                  <div className="col-12 col-md-8">
                    {skeletonItems.map((_, index) => (
                      <div key={index} className="mb-3">
                        <div
                          className="skeleton-blink rounded-5 mb-2"
                          style={{
                            width: "120px",
                            height: "20px",
                            backgroundColor: "#adadade8",
                          }}
                        ></div>
                        <div
                          className="skeleton-blink2 rounded-5"
                          style={{
                            width: "100%",
                            height: "50px",
                            backgroundColor: "#ffffffec",
                          }}
                        ></div>
                      </div>
                    ))}

                    {/* Buttons Skeleton */}
                    <div className="d-flex gap-2 flex-wrap mt-4">
                      <div
                        className="skeleton-blink2 rounded-4"
                        style={{
                          width: "140px",
                          height: "45px",
                          backgroundColor: "#ffffffec",
                        }}
                      ></div>
                      <div
                        className="skeleton-blink rounded-4"
                        style={{
                          width: "100px",
                          height: "45px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
const CustomSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: Array<{ code: string; name: string }>;
}> = React.memo(({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.code === value);

  const handleToggle = () => setIsOpen(!isOpen);

  const handleSelect = (optionCode: string) => {
    onChange(optionCode);
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="position-relative">
      {/* Selected Option Display */}
      <div
        className="option-dropdownad border-none p-2 px-3 rounded-5 d-flex align-items-center justify-content-between cursor-pointer "
        style={{
          cursor: "pointer",
          border: "none !important",
          color: "white",
          minHeight: "50px",
        }}
        onClick={handleToggle}
      >
        <div className="d-flex align-items-center gap-1 cursor-pointer">
          <div
            className="d-flex align-items-center justify-content-center"
            style={{
              width: "24px",
              height: "24px",
              flexShrink: 0,
            }}
          >
            {FLAGS[selectedOption?.code as keyof typeof FLAGS]}
          </div>
          <span className="fw-medium">{selectedOption?.name}</span>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className={`transition-all ${isOpen ? "rotate-180" : ""}`}
          viewBox="0 0 16 16"
          style={{
            transition: "transform 0.3s ease",
            color: "rgba(255, 255, 255, 0.8)",
          }}
        >
          <path
            fillRule="evenodd"
            d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
          />
        </svg>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div
          className=" position-absolute top-100 start-0 end-0 mt-2 rounded-5 overflow-x-hidden z-3 "
          style={{
            cursor: "pointer",
            background: "#1f462efa",
            backdropFilter: "blur(20px)",
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {options.map((option, index) => (
            <div
              key={option.code}
              className={`select-dropdownad p-3 d-flex align-items-center gap-1 cursor-pointer transition-all ${
                option.code === value
                  ? "bg-customshit "
                  : "hover:bg-white hover:bg-opacity-10"
              }`}
              style={{
                cursor: "pointer",
                borderBottom:
                  index < options.length - 1
                    ? "1px solid rgba(255, 255, 255, 0.1)"
                    : "none",
                minHeight: "52px",
                transition: "all 0.2s ease",
              }}
              onClick={() => handleSelect(option.code)}
            >
              <div
                className="d-flex align-items-center justify-content-center"
                style={{
                  width: "24px",
                  height: "24px",
                  flexShrink: 0,
                }}
              >
                {FLAGS[option.code as keyof typeof FLAGS]}
              </div>
              <span
                style={{
                  color:
                    option.code === value
                      ? "#ffffff"
                      : "rgba(255, 255, 255, 0.9)",
                  fontWeight: option.code === value ? "600" : "400",
                  fontSize: "0.95rem",
                }}
              >
                {option.name}
              </span>

              {/* Checkmark for selected option */}
              {option.code === value && (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  className="bi bi-check-lg ms-auto"
                  viewBox="0 0 16 16"
                  style={{
                    color: "rgba(255, 255, 255, 0.9)",
                  }}
                >
                  <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
// Background component to avoid recreating the style object on every render
const Background = React.memo(() => (
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

export const Settings: React.FC<SettingsProps> = React.memo(
  ({ user, onUpdateUser }) => {
    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const dangerzoneStyle: CSSProperties = useMemo(
      () => ({
        background: "rgba(255, 255, 255, 0.1)",
      }),
      []
    );

    const navigate = useNavigate();
    const { selectedLanguage, setSelectedLanguage, setPageTitle } =
      useShopContext();
    const [activeTab, setActiveTab] = useState<
      "profile" | "account" | "danger" | "language" | "audio-video"
    >("profile");
    const handleSetAudioVideoTab = useCallback(
      () => setActiveTab("audio-video"),
      []
    );

    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{
      type: "success" | "error";
      text: string;
    } | null>(null);
    const [selectedTheme, setSelectedTheme] = useState<"dark" | "light">(
      "dark"
    );
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

    // Danger zone state
    const [confirmDelete, setConfirmDelete] = useState("");

    // CHANGE THE LANGUAGES ARRAY - remove the SVG components
    const LANGUAGES = [
      { code: "us", name: "English" },
      { code: "gr", name: "Greek" },

      { code: "es", name: "Español" },
      { code: "fr", name: "Français" },
      { code: "de", name: "Deutsch" },
      { code: "ru", name: "Russian" },
      { code: "md", name: "Română" },
    ];

    const t = translations[selectedLanguage.code as keyof typeof translations];

    // Memoize API URL
    const apiUrl = useMemo(() => API_URL, [API_URL]);

    // Memoize user data to prevent unnecessary effects
    const userData = useMemo(
      () => ({
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.image,
      }),
      [user.id, user.username, user.email, user.image]
    );

    useEffect(() => {
      setPageTitle(`Blabber - ${t.settings}`);
    }, [setPageTitle]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoadingSkeleton(false);
      }, 350);

      return () => clearTimeout(timer);
    }, []);

    // Memoized message handler
    const showMessage = useCallback(
      (type: "success" | "error", text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
      },
      []
    );

    // Memoized form handlers
    const handleSaveProfile = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
          const response = await fetch(`${apiUrl}/api/user/profile`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userData.id,
              username,
              email,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || t.failedToUpdateProfile);
          }

          // Update local state and context
          const updatedUser = { ...user, username, email };
          if (onUpdateUser) {
            onUpdateUser(updatedUser);
          }

          showMessage("success", data.message || t.profileUpdatedSuccessfully);
        } catch (error: any) {
          console.error("Profile update error:", error);
          showMessage("error", error.message || t.failedToUpdateProfile);
        } finally {
          setIsSaving(false);
        }
      },
      [username, email, userData, onUpdateUser, showMessage, apiUrl, t]
    );

    const handleChangePassword = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        if (newPassword !== confirmPassword) {
          showMessage("error", t.newPasswordsDontMatch);
          setIsSaving(false);
          return;
        }

        try {
          const response = await fetch(`${apiUrl}/api/user/change-password`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userData.id,
              currentPassword,
              newPassword,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || t.failedToChangePassword);
          }

          showMessage("success", data.message || t.passwordChangedSuccessfully);

          // Clear password fields
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } catch (error: any) {
          console.error("Change password error:", error);
          showMessage("error", error.message || t.failedToChangePassword);
        } finally {
          setIsSaving(false);
        }
      },
      [
        currentPassword,
        newPassword,
        confirmPassword,
        userData.id,
        showMessage,
        apiUrl,
        t,
      ]
    );

    const handleAvatarChange = useCallback(
      async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Convert file to base64
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Image = reader.result as string;

          try {
            const response = await fetch(`${apiUrl}/api/upload/user-avatar`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                image: base64Image,
                userId: userData.id,
              }),
            });

            const data = await response.json();

            if (!response.ok) {
              throw new Error(data.message || t.failedToUploadAvatar);
            }

            // Update local state and context
            const updatedUser = { ...user, image: data.image_url };
            if (onUpdateUser) {
              onUpdateUser(updatedUser);
            }

            showMessage("success", t.avatarUpdatedSuccessfully);
          } catch (error: any) {
            console.error("Avatar upload error:", error);
            showMessage("error", error.message || t.failedToUploadAvatar);
          }
        };

        reader.readAsDataURL(file);
      },
      [userData, onUpdateUser, showMessage, apiUrl, t]
    );

    const handleDeleteAccount = useCallback(
      async (e: React.FormEvent) => {
        e.preventDefault();

        if (confirmDelete !== t.deletePlaceholder) {
          showMessage("error", t.typeToConfirm);
          return;
        }

        if (!window.confirm(t.confirmationRequired)) {
          return;
        }

        setIsSaving(true);
        setMessage(null);

        try {
          const response = await fetch(`${apiUrl}/api/user/delete-account`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: userData.id,
            }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || t.failedToDeleteAccount);
          }

          showMessage("success", data.message || t.accountDeletedSuccessfully);

          // Redirect to login or home page after deletion
          setTimeout(() => {
            localStorage.clear();
            window.location.href = "/";
          }, 2000);
        } catch (error: any) {
          console.error("Delete account error:", error);
          showMessage("error", error.message || t.failedToDeleteAccount);
        } finally {
          setIsSaving(false);
        }
      },
      [confirmDelete, userData.id, showMessage, apiUrl, t]
    );

    const handleThemeChange = useCallback(
      (theme: "dark" | "light") => {
        setSelectedTheme(theme);
        // Here you would typically save the theme preference to localStorage or backend
        localStorage.setItem("theme", theme);
        showMessage("success", `${t.themeChangedTo} ${theme}`);
      },
      [showMessage, t]
    );

    const handleResetForm = useCallback(() => {
      setUsername(userData.username);
      setEmail(userData.email);
      setMessage(null);
    }, [userData.username, userData.email]);

    // Memoized tab handlers
    const handleSetProfileTab = useCallback(() => setActiveTab("profile"), []);
    const handleSetAccountTab = useCallback(() => setActiveTab("account"), []);
    const handleSetLanguageTab = useCallback(
      () => setActiveTab("language"),
      []
    );
    const handleSetDangerTab = useCallback(() => setActiveTab("danger"), []);
    const handleGoBack = useCallback(() => navigate(-1), [navigate]);

    // Memoized danger button styles
    const dangerButtonStyle = useMemo(
      () => ({
        background: "rgba(179, 25, 25, 1)",
        color: "white",
        border: "none",
      }),
      []
    );
    const dangerTextStyle = useMemo(
      () => ({
        color: "rgba(179, 25, 25, 1)",
      }),
      []
    );

    const handleDangerMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "rgba(139, 18, 18, 1)";
      },
      []
    );

    const handleDangerMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
      },
      []
    );

    // Memoized message display
    const messageDisplay = useMemo(() => {
      if (!message) return null;

      return (
        <div
          className={` ${
            message.type === "success"
              ? "alert-success"
              : "text-danger alert-danger"
          } glass-alert  d-flex align-items-center rounded-5 border-0 ${
            window.innerWidth < 768 ? "mb-2" : "mb-2"
          } `}
          style={{
            color: message.type === "success" ? "#20b92d" : "",
          }}
        >
          {message.text}
        </div>
      );
    }, [message]);

    // Memoized profile form
    const profileForm = useMemo(
      () => (
        <div>
          <div className="d-inline-flex gap-2 flex-wrap align-items-start mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
            </svg>
            <h4>{t.profileSettings}</h4>
          </div>
          <form onSubmit={handleSaveProfile}>
            <div className="row g-3 d-flex align-items-center">
              <div className="col-12 col-md-4 text-center mb-4">
                <div className="profile-picture mb-3 d-flex flex-column align-items-center gap-3">
                  <img
                    src={userData.image}
                    alt={userData.username}
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                      filter: "drop-shadow(0 0 0.2rem #00000031)",
                    }}
                  />
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    style={{ display: "none" }}
                  />
                  <label
                    htmlFor="avatar-upload"
                    className="btn btn-outline-light fw-bold text-uppercase btn-sm rounded-4 px-2 w-100 w-md-auto"
                    style={{
                      cursor: "pointer",
                      maxWidth: "200px",
                    }}
                  >
                    {t.changeAvatar}
                  </label>
                </div>
              </div>
              <div className="col-12 col-md-8">
                <div className="mb-3">
                  <label className="form-label">{t.username}</label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    className="form-control p-2 px-3 border border-1 rounded-5"
                  >
                    <input
                      type="text"
                      className="border-0 w-100"
                      style={{
                        outline: "none",
                        background: "transparent",
                        color: "white",
                      }}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </motion.div>
                </div>
                <div className="mb-4">
                  <label className="form-label">{t.email}</label>
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    className="form-control p-2 px-3 border border-1 rounded-5"
                  >
                    <input
                      type="email"
                      className="border-0 w-100"
                      style={{
                        outline: "none",
                        background: "transparent",
                        color: "white",
                      }}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </motion.div>
                </div>

                <div className="d-flex gap-2 flex-wrap flex-column flex-md-row">
                  <button
                    type="submit"
                    className="btn btn-light fw-bold text-uppercase rounded-4 px-3 px-md-4 flex-grow-1"
                    disabled={isSaving}
                  >
                    {isSaving ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                        ></span>
                        {t.saveChanges}...
                      </>
                    ) : (
                      t.saveChanges
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-light text-uppercase fw-bold rounded-4 px-3 px-md-4 flex-grow-1"
                    onClick={handleResetForm}
                    disabled={isSaving}
                  >
                    {t.reset}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      ),
      [
        username,
        email,
        isSaving,
        userData,
        handleSaveProfile,
        handleAvatarChange,
        handleResetForm,
        t,
      ]
    );

    // Memoized account form
    const accountForm = useMemo(
      () => (
        <div>
          <div className="d-inline-flex gap-2 flex-wrap align-items-start mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="white"
              className="bi bi-shield-lock-fill"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
              />
            </svg>
            <h4>{t.accountSecurity}</h4>
          </div>
          <form onSubmit={handleChangePassword}>
            <div className="mb-4">
              <div className="mb-3">
                <label className="form-label">{t.currentPassword}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="password"
                    className="border-0 w-100"
                    style={{
                      outline: "none",
                      background: "transparent",
                      color: "white",
                    }}
                    placeholder={t.enterCurrentPassword}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </motion.div>
              </div>
              <hr />
              <div className="mb-3">
                <label className="form-label">{t.newPassword}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="password"
                    className="border-0 w-100"
                    style={{
                      outline: "none",
                      background: "transparent",
                      color: "white",
                    }}
                    placeholder={t.enterNewPassword}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </motion.div>
              </div>
              <div className="mb-4">
                <label className="form-label">{t.confirmPassword}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="password"
                    className="border-0 w-100"
                    style={{
                      outline: "none",
                      background: "transparent",
                      color: "white",
                    }}
                    placeholder={t.confirmNewPassword}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </motion.div>
              </div>
              <button
                type="submit"
                className="btn btn-light text-uppercase fw-bold rounded-4 px-3 px-md-4"
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {t.updatePassword}...
                  </>
                ) : (
                  t.updatePassword
                )}
              </button>
            </div>
          </form>
        </div>
      ),
      [
        currentPassword,
        newPassword,
        confirmPassword,
        isSaving,
        handleChangePassword,
        t,
      ]
    );
    const languageForm = useMemo(
      () => (
        <div>
          <div className="d-inline-flex gap-2 flex-wrap align-items-start mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="22"
              height="22"
              fill="white"
              className="bi bi-globe"
              viewBox="0 0 16 16"
            >
              <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
            </svg>
            <h4>{t.language}</h4>
          </div>

          <div className="mb-4">
            <div className="mb-3">
              <label className="form-label">{t.selectLanguage}</label>

              {/* REPLACE THE SELECT WITH CUSTOM SELECT */}
              <CustomSelect
                value={selectedLanguage.code}
                onChange={(newCode) => {
                  const newLang = LANGUAGES.find(
                    (lang) => lang.code === newCode
                  );
                  if (newLang) {
                    setSelectedLanguage(newLang);
                    showMessage(
                      "success",
                      `${t.languageChangedTo} ${newLang.name}`
                    );
                  }
                }}
                options={LANGUAGES}
              />
            </div>

            <div
              className="mt-4 p-3 rounded-5"
              style={{ background: "rgba(0, 0, 0, 0.377)" }}
            >
              <h6 className="text-white d-flex gap-1 align-items-center">
                {FLAGS[selectedLanguage.code as keyof typeof FLAGS]}
                {t.languagePreview}
              </h6>
              <p style={{ color: "#c0c0c0ff" }}>
                <strong>{t.currentLanguage}:</strong> {selectedLanguage.name}
                <br />
                <strong>{t.settings}:</strong> {t.settings}
                <br />
                <strong>{t.profile}:</strong> {t.profile}
                <br />
                <strong>{t.saveChanges}:</strong> {t.saveChanges}
              </p>
            </div>
          </div>
        </div>
      ),
      [selectedLanguage, t, showMessage]
    );

    // Memoized danger zone form
    const dangerForm = useMemo(
      () => (
        <div>
          <div className="d-inline-flex gap-2 flex-wrap align-items-center mb-3">
            <button
              className="rounded-5 p-2"
              style={{
                border: "none",
                background: "rgba(179, 25, 25, 1)",
                color: "white",
                filter: "drop-shadow(0 0 0.2rem #00000031)",
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "32px",
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="22"
                height="22"
                fill="white"
                viewBox="0 0 16 16"
              >
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
              </svg>
            </button>
            <div>
              <h4 className="text-white m-0">{t.dangerZone}</h4>
            </div>
          </div>

          {/* Delete Account */}
          <div className="p-3 rounded-5" style={dangerzoneStyle}>
            <h6 className="text-white">{t.deleteAccount}</h6>
            <p className="mb-3" style={{ color: "#c0c0c0ff" }}>
              {t.deleteWarning}
            </p>
            <form onSubmit={handleDeleteAccount}>
              <div className="mb-3">
                <label className="form-label text-danger">
                  {t.type}&nbsp;<strong>{t.deletePlaceholder}</strong>&nbsp;
                  {t.deleteConfirm2}
                </label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="text"
                    className="border-0 w-100"
                    style={{
                      outline: "none",
                      background: "transparent",
                      color: "white",
                    }}
                    value={confirmDelete}
                    onChange={(e) => setConfirmDelete(e.target.value)}
                    placeholder={`${t.deletePlaceholder}`}
                  />
                </motion.div>
              </div>
              <button
                type="submit"
                className="btn rounded-4 text-uppercase"
                style={dangerButtonStyle}
                onMouseEnter={handleDangerMouseEnter}
                onMouseLeave={handleDangerMouseLeave}
                disabled={
                  isSaving || confirmDelete !== `${t.deletePlaceholder}`
                }
              >
                {isSaving ? (
                  <>
                    <span
                      className="spinner-border spinner-border-sm me-2"
                      role="status"
                    ></span>
                    {t.deleting}
                  </>
                ) : (
                  t.deleteAccount
                )}
              </button>
            </form>
          </div>
        </div>
      ),
      [
        confirmDelete,
        isSaving,
        handleDeleteAccount,
        handleDangerMouseEnter,
        handleDangerMouseLeave,
        dangerButtonStyle,
        t,
      ]
    );

    // Return skeleton if loading
    if (isLoadingSkeleton) {
      return <SettingsSkeleton />;
    }

    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <Background />

        <div className="settings-page">
          <div
            className="settings-container glass p-3 p-md-5"
            style={{
              maxWidth: "1300px",
              margin: "0 auto",
              width: "100%",
              maxHeight: "calc(100vh - 90px)",
              overflowY: "auto",
            }}
          >
            <Navbar nameOfTop={t.settings} />

            <div style={{ maxHeight: "calc(100vh - 90px)" }}>
              <div className="row g-3 mt-4 mt-sm-0 mt-md-0">
                <div className="col-12 col-md-3">
                  <div className="text-start mb-3">
                    <button
                      onClick={handleGoBack}
                      className="btn btn-outline-light text-uppercase fw-bold rounded-4 px-3 px-md-4"
                    >
                      {t.back}
                    </button>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {/* Sidebar Navigation */}
                <div className="col-12 col-md-3">
                  <div className="settings-sidebar glass p-3 p-md-4 rounded-5 h-100">
                    <div className="nav flex-column">
                      {/* Settings Header */}
                      <div className="d-flex gap-0 align-items-center mb-2 pe-2 ps-2 p-2 rounded-5">
                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{
                            width: "28px",
                            height: "28px",
                            minWidth: "28px",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            fill="white"
                            className="bi bi-gear-fill"
                            viewBox="0 0 16 16"
                          >
                            <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                          </svg>
                        </div>
                        <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                          <span
                            className="text-truncate"
                            style={{ maxWidth: "155px" }}
                          >
                            {t.userSettings}
                          </span>
                        </div>
                      </div>

                      {/* Profile Tab */}
                      <div
                        className={`channel ${
                          activeTab === "profile" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={handleSetProfileTab}
                          className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                            activeTab === "profile" ? "active" : "ps-2"
                          }`}
                        >
                          <div className="d-flex gap-2 align-items-center flex-grow-1">
                            <button
                              className="rounded-5 p-2"
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.24)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                filter: "drop-shadow(0 0 0.2rem #00000031)",
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "44px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="white"
                                viewBox="0 0 16 16"
                              >
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                              </svg>
                            </button>
                            <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "155px" }}
                              >
                                {t.profile}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Account Tab */}
                      <div
                        className={`channel ${
                          activeTab === "account" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={handleSetAccountTab}
                          className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                            activeTab === "account" ? "active" : "ps-2"
                          }`}
                        >
                          <div className="d-flex gap-2 align-items-center flex-grow-1">
                            <button
                              className="rounded-5  p-2"
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.24)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                filter: "drop-shadow(0 0 0.2rem #00000031)",
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "44px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="white"
                                className="bi bi-shield-lock-fill"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.8 11.8 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7 7 0 0 0 1.048-.625 11.8 11.8 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.54 1.54 0 0 0-1.044-1.263 63 63 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
                                />
                              </svg>
                            </button>
                            <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "155px" }}
                              >
                                {t.account}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className={`channel ${
                          activeTab === "audio-video" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={handleSetAudioVideoTab}
                          className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                            activeTab === "audio-video" ? "active" : "ps-2"
                          }`}
                        >
                          <div className="d-flex gap-2 align-items-center flex-grow-1">
                            <button
                              className="rounded-5 p-2"
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.24)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                filter: "drop-shadow(0 0 0.2rem #00000031)",
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "44px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="white"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5 3a3 3 0 0 1 6 0v5a3 3 0 0 1-6 0z" />
                                <path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5" />
                              </svg>
                            </button>
                            <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "155px" }}
                              >
                                {t.audioVideo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Language Zone Tab */}
                      <div
                        className={`channel ${
                          activeTab === "language" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={handleSetLanguageTab}
                          className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                            activeTab === "language" ? "active" : "ps-2"
                          }`}
                        >
                          <div className="d-flex gap-2 align-items-center flex-grow-1">
                            <button
                              className="rounded-5  p-2"
                              style={{
                                border: "1px solid rgba(255, 255, 255, 0.24)",
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                filter: "drop-shadow(0 0 0.2rem #00000031)",
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "44px",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="white"
                                className="bi bi-globe"
                                viewBox="0 0 16 16"
                              >
                                <path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m7.5-6.923c-.67.204-1.335.82-1.887 1.855A8 8 0 0 0 5.145 4H7.5zM4.09 4a9.3 9.3 0 0 1 .64-1.539 7 7 0 0 1 .597-.933A7.03 7.03 0 0 0 2.255 4zm-.582 3.5c.03-.877.138-1.718.312-2.5H1.674a7 7 0 0 0-.656 2.5zM4.847 5a12.5 12.5 0 0 0-.338 2.5H7.5V5zM8.5 5v2.5h2.99a12.5 12.5 0 0 0-.337-2.5zM4.51 8.5a12.5 12.5 0 0 0 .337 2.5H7.5V8.5zm3.99 0V11h2.653c.187-.765.306-1.608.338-2.5zM5.145 12q.208.58.468 1.068c.552 1.035 1.218 1.65 1.887 1.855V12zm.182 2.472a7 7 0 0 1-.597-.933A9.3 9.3 0 0 1 4.09 12H2.255a7 7 0 0 0 3.072 2.472M3.82 11a13.7 13.7 0 0 1-.312-2.5h-2.49c.062.89.291 1.733.656 2.5zm6.853 3.472A7 7 0 0 0 13.745 12H11.91a9.3 9.3 0 0 1-.64 1.539 7 7 0 0 1-.597.933M8.5 12v2.923c.67-.204 1.335-.82 1.887-1.855q.26-.487.468-1.068zm3.68-1h2.146c.365-.767.594-1.61.656-2.5h-2.49a13.7 13.7 0 0 1-.312 2.5m2.802-3.5a7 7 0 0 0-.656-2.5H12.18c.174.782.282 1.623.312 2.5zM11.27 2.461c.247.464.462.98.64 1.539h1.835a7 7 0 0 0-3.072-2.472c.218.284.418.598.597.933M10.855 4a8 8 0 0 0-.468-1.068C9.835 1.897 9.17 1.282 8.5 1.077V4z" />
                              </svg>
                            </button>
                            <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "155px" }}
                              >
                                {t.language}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Danger Zone Tab */}
                      <div
                        className={`channel ${
                          activeTab === "danger" ? "active" : ""
                        }`}
                        style={{ cursor: "pointer" }}
                      >
                        <div
                          onClick={handleSetDangerTab}
                          className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                            activeTab === "danger" ? "active" : "ps-2"
                          }`}
                        >
                          <div className="d-flex gap-2 align-items-center flex-grow-1">
                            <button
                              className="rounded-5 p-2"
                              style={{
                                border: "none",
                                background: "rgba(179, 25, 25, 1)",
                                color: "white",
                                filter: "drop-shadow(0 0 0.2rem #00000031)",
                                width: "44px",
                                height: "44px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                minWidth: "44px",
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(139, 18, 18, 1)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background =
                                  "rgba(179, 25, 25, 1)";
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                fill="white"
                                viewBox="0 0 16 16"
                              >
                                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5m.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2" />
                              </svg>
                            </button>
                            <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                              <span
                                className="text-truncate"
                                style={{ maxWidth: "155px" }}
                              >
                                {t.danger}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="col-12 col-md-9 mb-3">
                  <div className="settings-content glass p-3 p-md-4 rounded-5 h-100">
                    {activeTab === "profile" ? (
                      profileForm
                    ) : activeTab === "account" ? (
                      accountForm
                    ) : activeTab === "language" ? (
                      languageForm
                    ) : activeTab === "audio-video" ? (
                      <AudioVideoSettings />
                    ) : (
                      dangerForm
                    )}
                    <div
                      className={`d-flex flex-wrap ${
                        activeTab === "profile"
                          ? "justify-content-end mt-4"
                          : "justify-content-start mt-2"
                      } `}
                    >
                      {messageDisplay}
                    </div>
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
