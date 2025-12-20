import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Channel } from "../../types/chat";
import { useShopContext } from "../../hooks/useShopContext";
import { channelListTranslations } from "./ChannelListTranslations";
import logo from "../../assets/logo.png";
import "./ChannelList.css";
import { Link, useNavigate } from "react-router-dom";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

// Add this function component for the portal
const ModalPortal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const modalRoot = document.getElementById("modal-root");
  if (!modalRoot) return null;

  return ReactDOM.createPortal(children, modalRoot);
};

interface ChannelListProps {
  channels: Channel[];
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  onChannelCreate: (
    name: string,
    description: string,
    bgcolor: string,
    image: string
  ) => void;
  channelCreateError?: string;
  onClearChannelError?: () => void;
  onChannelSettings?: (channel: Channel) => void;
  unreadCounts?: Record<string, number>;
  currentUser?: { id: string };
}

// Memoize the skeleton component to prevent unnecessary re-renders
const ChannelListSkeleton = React.memo(() => {
  const skeletonItems = useMemo(() => Array.from({ length: 4 }), []);

  return (
    <div className="channel-list" style={{ overflowY: "hidden" }}>
      <div className="channels" style={{ overflowY: "hidden" }}>
        <div
          className="mt-1 d-flex flex-column"
          style={{ overflowY: "hidden" }}
        >
          {skeletonItems.map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="channel"
              style={{ overflowY: "hidden" }}
            >
              <div
                className="d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ps-2"
                style={{ overflowY: "hidden" }}
              >
                <div className="d-flex gap-2 align-items-center flex-grow-1">
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "44px",
                      height: "44px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                  <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                    <div
                      className="skeleton-blink2 rounded-5"
                      style={{
                        width: `${Math.random() * 70 + 40}px`,
                        height: "20px",
                        backgroundColor: "#ffffffec",
                      }}
                    ></div>
                  </div>
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "22px",
                      height: "22px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}

          <div className="d-flex gap-2 align-items-center mb-2 mt-2 pe-2 ps-2 channel_buttt p-2 rounded-5">
            <div
              className="skeleton-blink rounded-5"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#adadade8",
              }}
            ></div>
            <div
              className="skeleton-blink2 rounded-5"
              style={{
                width: "100px",
                height: "20px",
                backgroundColor: "#ffffffec",
              }}
            ></div>
          </div>

          <div className="d-flex gap-2 align-items-center mb-3 mt-0 pe-2 ps-2 channel_buttt p-2 rounded-5">
            <div
              className="skeleton-blink rounded-5"
              style={{
                width: "44px",
                height: "44px",
                backgroundColor: "#adadade8",
              }}
            ></div>
            <div
              className="skeleton-blink2 rounded-5"
              style={{
                width: "120px",
                height: "20px",
                backgroundColor: "#ffffffec",
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Properly extracted ChannelItem component
interface ChannelItemProps {
  channel: Channel;
  isSelected: boolean;
  selectedChannel: string;
  onChannelSelect: (channel: Channel) => void;
  onChannelSettings?: (channel: Channel) => void;
  onShowInvite: (channel: Channel, e: React.MouseEvent) => void;
  setActiveMainBut: (active: boolean) => void;
  setSelectedChannel: (channel: string) => void;
  setPageTitle: (title: string) => void;
  unreadCount?: number;
  isFirstChannel?: boolean;
  isDMChannel?: boolean;
  translations: typeof channelListTranslations.us;
  otherParticipant?: {
    userId: string;
    username: string;
    image?: string;
    isOnline?: boolean;
    lastSeen?: Date;
  } | null; // Allow null
}

const ChannelItem: React.FC<ChannelItemProps> = React.memo(
  ({
    channel,
    isSelected,
    selectedChannel,
    onChannelSelect,
    onChannelSettings,
    onShowInvite,
    setActiveMainBut,
    setSelectedChannel,
    setPageTitle,
    unreadCount = 0,
    isFirstChannel = false,
    isDMChannel = false,
    translations,
    otherParticipant,
  }) => {
    const [showLinkTooltip, setShowLinkTooltip] = useState(false);
    const [showSettingsTooltip, setShowSettingsTooltip] = useState(false);

    const handleChannelClick = useCallback(() => {
      setActiveMainBut(false);
      setSelectedChannel(channel.name);
      onChannelSelect(channel);

      // Update page title based on channel type
      if (isDMChannel && otherParticipant) {
        setPageTitle(`Blabber - ${otherParticipant.username}`);
      } else {
        setPageTitle(`Blabber - @${channel.name}`);
      }
    }, [
      channel,
      onChannelSelect,
      setActiveMainBut,
      setSelectedChannel,
      setPageTitle,
      isDMChannel,
      otherParticipant,
    ]);

    const [tooltipDirection, setTooltipDirection] = useState<"top" | "bottom">(
      isFirstChannel ? "bottom" : "top"
    );

    const handleTooltipShow = useCallback(
      (e: React.MouseEvent) => {
        if (isFirstChannel) {
          setTooltipDirection("bottom");
          return;
        }

        setTooltipDirection("top");
      },
      [isFirstChannel]
    );

    const handleSettingsClick = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        onChannelSettings?.(channel);
      },
      [channel, onChannelSettings]
    );

    const handleInviteClick = useCallback(
      (e: React.MouseEvent) => {
        onShowInvite(channel, e);
      },
      [channel, onShowInvite]
    );
    const { selectedLanguage } = useShopContext();
    const maxWidth =
      window.innerWidth < 410
        ? "115px"
        : window.innerWidth < 500
        ? "150px"
        : window.innerWidth < 768
        ? "180px"
        : "85px";

    return (
      <div className={`channel ${isSelected ? "active" : ""}`}>
        <Link
          to={`/channel/@${channel.name}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            onClick={handleChannelClick}
            className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
              selectedChannel === channel.name ? "active" : "ps-2"
            }`}
            style={{ position: "relative" }}
          >
            <div
              className={`d-flex gap-2 align-items-center flex-grow-1 pe-2 ${
                !isDMChannel ? "ps-2" : ""
              }`}
            >
              <div style={{ position: "relative" }}>
                {!isDMChannel ? (
                  <button
                    id="channel-button"
                    className="rounded-4 border-0 p-3 channel-button"
                    style={{
                      backgroundColor: channel.image
                        ? "transparent"
                        : channel.bgcolor,
                      backgroundImage: channel.image
                        ? `url(${channel.image})`
                        : "none",
                      backgroundSize: "cover",
                      filter: "drop-shadow(0 0 0.2rem #00000031)",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {!channel.image && (
                      <img
                        src={logo}
                        width={"28px"}
                        alt={channel.name}
                        style={{ filter: "brightness(0) invert(1)" }}
                      />
                    )}
                  </button>
                ) : null}

                {unreadCount > 0 && !isDMChannel && (
                  <motion.div
                    animate={{
                      scale: [1, 1.175, 1, 1.175, 1],
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      repeatDelay: 1,
                      ease: "easeInOut",
                    }}
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      top: "-4px",
                      right: "-4px",
                      backgroundColor: "rgba(209, 17, 17, 1)",
                      color: "white",
                      fontSize: "0.65rem",
                      borderRadius: "50%",
                      fontWeight: "bold",
                      minWidth: "16px",
                      width: "16px",
                      height: "16px",
                      padding: "0 4px",
                    }}
                  >
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </motion.div>
                )}
              </div>

              <div className="d-flex gap-1 text-capitalize align-items-center  flex-grow-1 ">
                {isDMChannel && otherParticipant ? (
                  // DM Channel Display
                  <div className="d-flex align-items-center gap-2 w-100">
                    <div className="position-relative">
                      <img
                        src={otherParticipant.image || "/default-avatar.png"}
                        width="40"
                        height="40"
                        className="rounded-circle m-0"
                        alt={otherParticipant.username}
                        style={{
                          objectFit: "cover",
                        }}
                      />
                      {unreadCount > 0 && isDMChannel && (
                        <motion.div
                          animate={{
                            scale: [1, 1.175, 1, 1.175, 1],
                          }}
                          transition={{
                            duration: 0.7,
                            repeat: Infinity,
                            repeatDelay: 1,
                            ease: "easeInOut",
                          }}
                          className="position-absolute d-flex align-items-center justify-content-center"
                          style={{
                            top: "-4px",
                            right: "-4px",
                            backgroundColor: "rgba(209, 17, 17, 1)",
                            color: "white",
                            fontSize: "0.65rem",
                            borderRadius: "50%",
                            fontWeight: "bold",
                            minWidth: "16px",
                            width: "16px",
                            height: "16px",
                            padding: "0 4px",
                          }}
                        >
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </motion.div>
                      )}
                    </div>
                    <div className="flex-grow-1 min-w-0">
                      <div className="text-white fw-semibold text-truncate">
                        {otherParticipant.username}
                      </div>
                    </div>
                  </div>
                ) : (
                  // Regular Channel Display
                  <span
                    className="text-truncate fw-semibold"
                    style={{ maxWidth }}
                  >
                    {channel.name}
                  </span>
                )}
              </div>
              {!isDMChannel && (
                <>
                  <button
                    id="settings_but_circle"
                    onClick={handleSettingsClick}
                    className="d-flex btn btn-sm p-1 rounded-5 position-relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.24)",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                      zIndex: showSettingsTooltip ? 1001 : 1,
                    }}
                    onMouseEnter={(e) => {
                      handleTooltipShow(e);
                      setShowSettingsTooltip(true);
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      setShowSettingsTooltip(false);
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>

                    {showSettingsTooltip && window.innerWidth >= 768 && (
                      <div
                        className="custom-tooltip rounded-5"
                        style={{
                          position: "absolute",
                          ...(tooltipDirection === "top"
                            ? {
                                bottom: "100%",
                                marginBottom: "8px",
                              }
                            : {
                                top: "100%",
                                marginTop: "8px",
                              }),
                          left: "50%",
                          transform: "translateX(-50%)",
                          background: "rgba(0, 0, 0, 0.9)",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          zIndex: 1002,
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          pointerEvents: "none",
                        }}
                      >
                        {translations.settings}
                      </div>
                    )}
                  </button>
                  <button
                    id="link_but_circle"
                    onClick={handleInviteClick}
                    className="d-flex btn btn-sm p-1 rounded-5 position-relative"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.24)",
                      borderRadius: "6px",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      handleTooltipShow(e);
                      setShowLinkTooltip(true);
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      setShowLinkTooltip(false);
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      fill="white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                      <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                    </svg>

                    {showLinkTooltip && window.innerWidth >= 768 && (
                      <div
                        className="custom-tooltip rounded-5"
                        style={{
                          position: "absolute",
                          ...(tooltipDirection === "top"
                            ? { bottom: "calc(100% + 8px)" }
                            : { top: "calc(100% + 8px)" }),
                          left: "50%",
                          transform:
                            selectedLanguage.code === "us"
                              ? "translateX(-50%)"
                              : "translateX(-90%)",
                          background: "rgba(0, 0, 0, 0.9)",
                          color: "white",
                          padding: "6px 12px",
                          borderRadius: "8px",
                          fontSize: "12px",
                          fontWeight: "500",
                          whiteSpace: "nowrap",
                          zIndex: 10000,
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
                          pointerEvents: "none",
                        }}
                      >
                        {translations.invite}
                      </div>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        </Link>
      </div>
    );
  }
);

export const ChannelList: React.FC<ChannelListProps> = React.memo(
  ({
    channels,
    currentChannel,
    onChannelSelect,
    onChannelCreate,
    channelCreateError,
    onClearChannelError,
    onChannelSettings,
    unreadCounts = {},
    currentUser,
  }) => {
    const {
      selectedChannel,
      setSelectedChannel,
      setActiveMainBut,
      pageTitle,
      setPageTitle,
      selectedLanguage,
    } = useShopContext();

    const navigate = useNavigate();

    const t =
      channelListTranslations[
        selectedLanguage.code as keyof typeof channelListTranslations
      ];

    const [showModal, setShowModal] = useState(false);
    const [newChannelName, setNewChannelName] = useState("");
    const [newChannelImg, setNewChannelImg] = useState("");
    const [newChannelDesc, setNewChannelDesc] = useState("");
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [joinCode, setJoinCode] = useState("");
    const [selectedChannelForInvite, setSelectedChannelForInvite] =
      useState<Channel | null>(null);
    const [copiedInvite, setCopiedInvite] = useState(false);
    const [isCreateModalClosing, setIsCreateModalClosing] = useState(false);
    const [isJoinModalClosing, setIsJoinModalClosing] = useState(false);
    const [isInviteModalClosing, setIsInviteModalClosing] = useState(false);
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

    const randomColor = useCallback(() => {
      const colors = [
        "#b83e23",
        "#2745ca",
        "#bc20c7",
        "#c92280",
        "#A833FF",
        "#e69122",
        "#3392ff",
        "#16a129ff",
        "#0b4d8aff",
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    }, []);

    const initialChannelCount = useMemo(
      () => channels.length,
      [channels.length]
    );

    useEffect(() => {
      if (showModal) {
        if (channels.length > initialChannelCount && !channelCreateError) {
          setShowModal(false);
          setNewChannelName("");
          setNewChannelDesc("");
          setNewChannelImg("");

          onClearChannelError?.();
        }
      }
    }, [
      channels.length,
      showModal,
      channelCreateError,
      onClearChannelError,
      initialChannelCount,
    ]);

    const handleCreateChannel = useCallback(
      (e: React.FormEvent) => {
        e.preventDefault();

        if (newChannelName.trim()) {
          const channelName = newChannelName.trim().toLowerCase();
          const isDuplicate = channels.some(
            (channel) => channel.name.toLowerCase() === channelName
          );

          if (isDuplicate) {
            onClearChannelError?.();
          }

          const newColor = randomColor();

          onClearChannelError?.();

          onChannelCreate(
            newChannelName.trim(),
            newChannelDesc.trim(),
            newColor,
            newChannelImg.trim()
          );
        }
      },
      [
        newChannelName,
        newChannelDesc,
        newChannelImg,
        randomColor,
        onChannelCreate,
        onClearChannelError,
        channels,
      ]
    );

    const handleCloseModal = useCallback(() => {
      if (showModal && !isCreateModalClosing) {
        setIsCreateModalClosing(true);
        setTimeout(() => {
          setShowModal(false);
          setIsCreateModalClosing(false);
          setNewChannelName("");
          setNewChannelDesc("");
          setNewChannelImg("");
          onClearChannelError?.();
        }, 250);
      }
    }, [showModal, isCreateModalClosing, onClearChannelError]);

    const handleShowInvite = useCallback(
      (channel: Channel, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedChannelForInvite(channel);
        setShowInviteModal(true);
        setCopiedInvite(false);
      },
      []
    );

    const handleCopyInvite = useCallback(() => {
      if (selectedChannelForInvite?.inviteCode) {
        navigator.clipboard.writeText(selectedChannelForInvite.inviteCode);
        setCopiedInvite(true);
        setTimeout(() => setCopiedInvite(false), 2000);
      }
    }, [selectedChannelForInvite]);

    useEffect(() => {
      document.title = pageTitle;
    }, [pageTitle]);

    useEffect(() => {
      const timer = setTimeout(() => {
        setIsLoadingSkeleton(false);
      }, 350);

      return () => clearTimeout(timer);
    }, []);

    const handleAddChannelClick = useCallback(() => setShowModal(true), []);
    const handleJoinChannelClick = useCallback(
      () => setShowJoinModal(true),
      []
    );
    const handleCloseJoinModal = useCallback(() => {
      if (showJoinModal && !isJoinModalClosing) {
        setIsJoinModalClosing(true);
        setTimeout(() => {
          setShowJoinModal(false);
          setIsJoinModalClosing(false);
          setJoinCode("");
        }, 250);
      }
    }, [showJoinModal, isJoinModalClosing]);

    const handleJoinChannel = useCallback(() => {
      let code = joinCode.trim();
      if (code.includes("/invite/")) {
        code = code.split("/invite/")[1];
      }

      setShowJoinModal(false);
      setJoinCode("");
      navigate(`/invite/${code}`);
    }, [joinCode, navigate]);

    const handleCloseInviteModal = useCallback(() => {
      if (showInviteModal && !isInviteModalClosing) {
        setIsInviteModalClosing(true);
        setTimeout(() => {
          setShowInviteModal(false);
          setIsInviteModalClosing(false);
        }, 250);
      }
    }, [showInviteModal, isInviteModalClosing]);

    const channelsList = useMemo(
      () => (
        <div
          style={{
            minHeight: channels.length > 0 ? "calc(25vh - 145px)" : "",
            maxHeight:
              window.innerWidth < 768
                ? "calc(100vh - 500px)"
                : "calc(100vh - 435px)",
            overflowY: "auto",
          }}
        >
          {channels.map((channel, index) => {
            const isDMChannel = channel.isDM;
            // For DM channels, find the other participant - FIXED
            const otherParticipant =
              isDMChannel && channel.participants
                ? channel.participants.find(
                    (p: any) => p.userId !== currentUser?.id
                  )
                : null;

            return (
              <ChannelItem
                key={channel.id}
                channel={channel}
                isSelected={currentChannel?.id === channel.id}
                selectedChannel={selectedChannel}
                onChannelSelect={onChannelSelect}
                onChannelSettings={onChannelSettings}
                onShowInvite={handleShowInvite}
                setActiveMainBut={setActiveMainBut}
                setSelectedChannel={setSelectedChannel}
                setPageTitle={setPageTitle}
                unreadCount={unreadCounts[channel.id] || 0}
                isFirstChannel={index === 0}
                isDMChannel={isDMChannel}
                otherParticipant={otherParticipant}
                translations={t}
              />
            );
          })}
        </div>
      ),
      [
        channels,
        currentChannel,
        selectedChannel,
        onChannelSelect,
        onChannelSettings,
        handleShowInvite,
        setActiveMainBut,
        setSelectedChannel,
        setPageTitle,
        unreadCounts,
        t,
        currentUser, // ADD THIS DEPENDENCY
      ]
    );

    if (isLoadingSkeleton) {
      return <ChannelListSkeleton />;
    }

    return (
      <>
        <div className="channel-list" style={{ overflowY: "hidden" }}>
          <div className="channels">
            <div className="mt-1 d-flex flex-column">
              {channelsList}
              <div
                onClick={handleAddChannelClick}
                className="d-flex gap-2 align-items-center mb-2 mt-2 pe-2 ps-2 channel_buttt p-2 rounded-5"
                style={{ cursor: "pointer" }}
              >
                <button
                  id="channel-button"
                  className="rounded-5  p-2"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.24)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    filter: "drop-shadow(0 0 0.2rem #00000031)",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="white"
                      className="bi bi-plus-circle-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                    </svg>
                  </div>
                </button>
                {t.createChannel}
              </div>
              <div
                onClick={handleJoinChannelClick}
                className="d-flex gap-2 align-items-center mb-3 mt-0 pe-2 ps-2 channel_buttt p-2 rounded-5"
                style={{ cursor: "pointer" }}
              >
                <button
                  id="channel-button"
                  className="rounded-5  p-2"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.24)",
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    filter: "drop-shadow(0 0 0.2rem #00000031)",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "28px", height: "28px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="white"
                      viewBox="0 0 16 16"
                    >
                      <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                      <path
                        fillRule="evenodd"
                        d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                      />
                    </svg>
                  </div>
                </button>
                {t.joinChannel}
              </div>
            </div>
          </div>
        </div>

        {/* Create Channel Modal */}
        {showModal && (
          <ModalPortal>
            <div
              className={`modal ${
                isCreateModalClosing ? "fade-out" : "fade-in"
              } ${!isCreateModalClosing ? "show" : ""} pb-5`}
              style={{
                display: isCreateModalClosing ? "block" : "block",
                background: "#020e0ac7",
                backdropFilter: "blur(5px)",
              }}
              onClick={(e) => {
                if (e.target === e.currentTarget && !channelCreateError) {
                  handleCloseModal();
                }
              }}
            >
              <div
                className={`modal-dialog modal-dialog-centered`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content text-white glass-popup rounded-5 m-0 mt-1 mt-md-0">
                  <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
                    <div
                      className="rounded-5 p-2 mb-1"
                      style={{
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        border: "1px solid rgba(255, 255, 255, 0.24)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        filter: "drop-shadow(0 0 0.2rem #00000031)",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "26px", height: "26px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="white"
                          className="bi bi-plus-circle-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="modal-title">{t.createChannel}</h3>
                  </div>
                  <small
                    className="d-flex justify-content-center align-items-center px-5 flex-wrap text-center"
                    style={{ color: "#c0c0c0ff" }}
                  >
                    {t.channelPrompt}
                  </small>
                  <form onSubmit={handleCreateChannel}>
                    <div className="modal-body d-flex flex-column gap-4 p-3 ">
                      <div className="form-group d-flex flex-column gap-2">
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          whileHover={{ scale: 1.01 }}
                          className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="white"
                            viewBox="0 0 16 16"
                          >
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
                          </svg>
                          <input
                            type="text"
                            placeholder={t.channelName}
                            className="border-0 px-2 flex-grow-1"
                            style={{
                              outline: "none",
                              background: "transparent",
                            }}
                            value={newChannelName}
                            onChange={(e) => setNewChannelName(e.target.value)}
                            required
                            disabled={isCreateModalClosing}
                          />
                        </motion.div>
                        {channelCreateError && (
                          <small className="text-danger m-0">
                            {channelCreateError}
                          </small>
                        )}
                      </div>

                      <div className="form-group d-flex flex-column gap-2">
                        <ImageUpload
                          onImageUpload={(imageUrl) =>
                            setNewChannelImg(imageUrl)
                          }
                          currentImage={newChannelImg}
                        />
                      </div>
                      <div className="form-group d-flex flex-column gap-2">
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          whileHover={{ scale: 1.01 }}
                          className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="white"
                            viewBox="0 0 16 16"
                          >
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001" />
                          </svg>
                          <input
                            type="text"
                            placeholder={t.channelDescription}
                            className="border-0 px-2 flex-grow-1"
                            style={{
                              outline: "none",
                              background: "transparent",
                            }}
                            value={newChannelDesc}
                            onChange={(e) => setNewChannelDesc(e.target.value)}
                            disabled={isCreateModalClosing}
                          />
                        </motion.div>
                      </div>
                    </div>

                    <div className="modal-footer">
                      <button
                        type="button"
                        className="btn btn-outline-light fw-bold order-md-first order-last rounded-4 text-uppercase p-2 px-3"
                        onClick={handleCloseModal}
                        disabled={isCreateModalClosing}
                      >
                        {t.close}
                      </button>
                      <button
                        type="submit"
                        className="btn btn-light fw-bold order-md-last order-first text-uppercase rounded-4 p-2 px-3"
                        disabled={
                          !newChannelName.trim() || isCreateModalClosing
                        }
                      >
                        {t.create}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Join Channel Modal */}
        {showJoinModal && (
          <ModalPortal>
            <div
              className={`modal ${
                isJoinModalClosing ? "fade-out" : "fade-in"
              } ${!isJoinModalClosing ? "show" : ""} pb-5`}
              style={{
                display: isJoinModalClosing ? "block" : "block",
                background: "#020e0ac7",
                backdropFilter: "blur(5px)",
              }}
              onClick={handleCloseJoinModal}
            >
              <div
                className={`modal-dialog modal-dialog-centered`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content text-white glass-popup rounded-5  m-0 mt-1  mt-md-0">
                  <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
                    <div
                      className="rounded-5 p-2 mb-1"
                      style={{
                        borderRadius: "8px",
                        transition: "all 0.2s ease",
                        border: "1px solid rgba(255, 255, 255, 0.24)",
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                        filter: "drop-shadow(0 0 0.2rem #00000031)",
                      }}
                    >
                      <div
                        className="d-flex align-items-center justify-content-center"
                        style={{ width: "26px", height: "26px" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          <path
                            fillRule="evenodd"
                            d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="modal-title">{t.joinChannelTitle}</h3>
                  </div>
                  <div className="modal-body d-flex flex-column gap-3 p-3">
                    <div className="form-group d-flex flex-column gap-2">
                      <motion.div
                        whileFocus={{ scale: 1.02 }}
                        whileHover={{ scale: 1.01 }}
                        className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                        style={{
                          backgroundColor: "transparent",
                          color: "white",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="white"
                          viewBox="0 0 16 16"
                        >
                          <path d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                          <path d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                        </svg>
                        <input
                          type="text"
                          placeholder={t.inviteCode}
                          className="border-0 px-2 flex-grow-1"
                          style={{
                            outline: "none",
                            background: "transparent",
                          }}
                          value={joinCode}
                          onChange={(e) =>
                            setJoinCode(e.target.value.toUpperCase())
                          }
                          required
                          disabled={isJoinModalClosing}
                        />
                      </motion.div>
                    </div>
                    <div className="d-flex gap-2 align-items-center">
                      <small style={{ color: "#c0c0c0ff" }}>
                        {t.pasteFullLink}
                      </small>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light fw-bold order-md-first order-last rounded-4 text-uppercase p-2 px-3"
                      onClick={handleCloseJoinModal}
                      disabled={isJoinModalClosing}
                    >
                      {t.close}
                    </button>
                    <button
                      type="button"
                      className="btn btn-light fw-bold order-md-last order-first text-uppercase rounded-4 p-2 px-3"
                      onClick={handleJoinChannel}
                      disabled={isJoinModalClosing || !joinCode.trim()}
                    >
                      {t.join}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}

        {/* Invite Link Modal */}
        {showInviteModal && selectedChannelForInvite && (
          <ModalPortal>
            <div
              className={`modal ${
                isInviteModalClosing ? "fade-out" : "fade-in"
              } ${!isInviteModalClosing ? "show" : ""} pb-5`}
              style={{
                display: isInviteModalClosing ? "block" : "block",
                background: "#020e0ac7",
                backdropFilter: "blur(5px)",
              }}
              onClick={handleCloseInviteModal}
            >
              <div
                className={`modal-dialog modal-dialog-centered`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-content text-white glass-popup rounded-5  m-0 mt-1 mt-md-0">
                  <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
                    <h3 className="modal-title ">
                      <span className="d-flex flex-wrap gap-1 align-items-center justify-content-center flex-grow-1">
                        {t.inviteToChannel}&nbsp;
                        <div
                          id="channel-button"
                          className="rounded-4 border-0 p-3 channel-button"
                          style={{
                            backgroundColor: selectedChannelForInvite.image
                              ? "transparent"
                              : selectedChannelForInvite.bgcolor,
                            backgroundImage: selectedChannelForInvite.image
                              ? `url(${selectedChannelForInvite.image})`
                              : "none",
                            backgroundSize: "cover",
                            filter: "drop-shadow(0 0 0.2rem #00000031)",
                            backgroundPosition: "center",
                            backgroundRepeat: "no-repeat",
                            width: "44px",
                            height: "44px",

                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {!selectedChannelForInvite.image && (
                            <img
                              src={logo}
                              width={"28px"}
                              alt={selectedChannelForInvite.name}
                              style={{
                                filter: "brightness(0) invert(1)",
                              }}
                            />
                          )}
                        </div>
                        <span
                          className="text-truncate"
                          style={{
                            maxWidth: `${
                              window.innerWidth < 768 ? "250px" : "400px"
                            }`,
                          }}
                        >
                          @{selectedChannelForInvite.name}
                        </span>
                      </span>
                    </h3>
                  </div>
                  <div className="modal-body" id="invitecodeid">
                    <div className="d-flex gap-2 align-items-center">
                      <input
                        type="text"
                        className="form-control  p-2 px-3  border border-1 shadow-sm rounded-5 d-flex align-items-center"
                        value={selectedChannelForInvite.inviteCode || ""}
                        readOnly
                        disabled={isInviteModalClosing}
                        style={{
                          fontFamily:
                            "Helvetica Neue, Helvetica, Arial, sans-serif",
                          fontSize: "0.9rem",
                          color: "white",
                        }}
                      />

                      <button
                        onClick={handleCopyInvite}
                        className="btn btn-light fw-bold rounded-4 d-flex align-items-center justify-content-center text-uppercase p-2 px-3"
                        style={{ minWidth: "140px" }}
                        disabled={isInviteModalClosing}
                      >
                        {copiedInvite ? (
                          <span className="d-flex fw-bold align-items-center">
                            {window.innerWidth >= 768 && (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                fill="white"
                                className="bi bi-check"
                                viewBox="0 0 16 16"
                              >
                                <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                              </svg>
                            )}
                            {t.copied}
                          </span>
                        ) : (
                          <span className="fw-bold">{t.copy}</span>
                        )}
                      </button>
                    </div>
                    <small
                      className="mt-3 d-block"
                      style={{ color: "#c0c0c0ff" }}
                    >
                      {t.copyPasteCode}
                    </small>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-light fw-bold  rounded-4 text-uppercase p-2 px-3"
                      onClick={handleCloseInviteModal}
                      disabled={isInviteModalClosing}
                    >
                      {t.close}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </ModalPortal>
        )}
      </>
    );
  }
);
