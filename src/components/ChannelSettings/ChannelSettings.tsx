import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  CSSProperties,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useShopContext } from "../../hooks/useShopContext";
import { channelSettingsTranslations } from "./ChannelSettingsTranslations";
import { User, Channel } from "../../types/chat";
import objects from "../../assets/3dobjects.png";
import { Navbar } from "../Navbar/Navbar";
import { ImageUpload } from "../ImageUpload/ImageUpload";
import logo from "../../assets/logo.png";
import "./ChannelSettings.css";
import { motion } from "framer-motion";

interface ChannelSettingsProps {
  user: User;
  channel?: Channel;
  onUpdateChannel?: (updatedChannel: Channel) => void;
  onDeleteChannel?: (channelId: string) => void;
  onCloseSettings?: () => void;
}

export const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  user,
  channel,
  onUpdateChannel,
  onDeleteChannel,
  onCloseSettings,
}) => {
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const navigate = useNavigate();
  const { channelId } = useParams();
  const { setPageTitle, selectedLanguage } = useShopContext();

  const t =
    channelSettingsTranslations[
      selectedLanguage.code as keyof typeof channelSettingsTranslations
    ];

  const [activeTab, setActiveTab] = useState<"general" | "members" | "danger">(
    "general"
  );
  const [channelName, setChannelName] = useState(channel?.name || "");
  const [channelDescription, setChannelDescription] = useState(
    channel?.description || ""
  );
  const [channelImage, setChannelImage] = useState(channel?.image || "");
  const [channelBgColor, setChannelBgColor] = useState(
    channel?.bgcolor || "#3392ff"
  );
  const [isPrivate, setIsPrivate] = useState(channel?.isPrivate || false);

  const [members, setMembers] = useState<User[]>([]);
  const [newMemberUsername, setNewMemberUsername] = useState("");

  const [confirmChannelName, setConfirmChannelName] = useState("");

  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);

  const backgroundStyle: CSSProperties = useMemo(
    () => ({
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
    }),
    []
  );

  const containerStyle: CSSProperties = useMemo(
    () => ({
      maxWidth: "1300px",
      margin: "0 auto",
      width: "100%",
      maxHeight: "calc(100vh - 90px)",
      overflowY: "auto",
    }),
    []
  );

  const contentStyle: CSSProperties = useMemo(
    () => ({
      maxHeight: "calc(100vh - 90px)",
    }),
    []
  );

  const formControlStyle: CSSProperties = useMemo(
    () => ({
      outline: "none",
      background: "transparent",
      color: "white",
    }),
    []
  );

  const profileImageStyle: CSSProperties = useMemo(
    () => ({
      width: "120px",
      height: "120px",
      objectFit: "cover",
      filter: "drop-shadow(0 0 0.2rem #00000031)",
    }),
    []
  );
  const membersListStyle: CSSProperties = useMemo(
    () => ({
      background: "rgba(255, 255, 255, 0.1)",
    }),
    []
  );

  const colorButtonStyle = useMemo(
    () => (color: string, isSelected: boolean) => ({
      width: "40px",
      height: "40px",
      backgroundColor: color,
      border: isSelected ? "3px solid white" : "none",
    }),
    []
  );

  const dangerButtonStyle: CSSProperties = useMemo(
    () => ({
      background: "rgba(179, 25, 25, 1)",
      color: "white",
      border: "none",
    }),
    []
  );

  const dangerButtonHoverStyle: CSSProperties = useMemo(
    () => ({
      background: "rgba(139, 18, 18, 1)",
    }),
    []
  );

  const messageStyle = useMemo(
    () => (type: "success" | "error") => ({
      color: type === "success" ? "#20b92d" : "",
    }),
    []
  );

  const channelColors = useMemo(
    () => ["#3392ff", "#16a129ff", "#e69122", "#bc20c7", "#b83e23", "#2745ca"],
    []
  );

  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const fetchChannelMembers = useCallback(async () => {
    if (!channel) return;

    try {
      const response = await fetch(
        `${API_URL}/api/channel/${channel.id}/members`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch members");
      }

      setMembers(data.members || []);
    } catch (error: any) {
      console.error("Fetch members error:", error);
      showMessage("error", error.message || "Failed to fetch members");
    }
  }, [channel, API_URL, showMessage]);

  const handleSaveGeneral = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!channel) return;

      setIsSaving(true);
      setMessage(null);

      try {
        const response = await fetch(`${API_URL}/api/channel/${channel.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: channelName,
            description: channelDescription,
            image: channelImage,
            bgcolor: channelBgColor,
            isPrivate: isPrivate,
            updatedBy: user.id,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update channel");
        }

        const updatedChannel = { ...channel, ...data.channel };
        if (onUpdateChannel) {
          onUpdateChannel(updatedChannel);
        }

        showMessage("success", data.message || "Channel updated successfully!");
      } catch (error: any) {
        console.error("Channel update error:", error);
        showMessage("error", error.message || "Failed to update channel");
      } finally {
        setIsSaving(false);
      }
    },
    [
      channel,
      channelName,
      channelDescription,
      channelImage,
      channelBgColor,
      isPrivate,
      user.id,
      API_URL,
      onUpdateChannel,
      showMessage,
    ]
  );

  const handleAddMember = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!channel || !newMemberUsername.trim()) return;

      setIsSaving(true);
      setMessage(null);

      try {
        const response = await fetch(
          `${API_URL}/api/channel/${channel.id}/members`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: newMemberUsername.trim(),
              addedBy: user.id,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to add member");
        }

        await fetchChannelMembers();
        setNewMemberUsername("");
        showMessage("success", data.message || "Member added successfully!");
      } catch (error: any) {
        console.error("Add member error:", error);
        showMessage("error", error.message || "Failed to add member");
      } finally {
        setIsSaving(false);
      }
    },
    [
      channel,
      newMemberUsername,
      user.id,
      API_URL,
      fetchChannelMembers,
      showMessage,
    ]
  );

  const handleRemoveMember = useCallback(
    async (memberId: string) => {
      if (!channel) return;

      setIsSaving(true);
      setMessage(null);

      try {
        const response = await fetch(
          `${API_URL}/api/channel/${channel.id}/members/${memberId}`,
          {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              removedBy: user.id,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to remove member");
        }

        await fetchChannelMembers();
        showMessage("success", data.message || "Member removed successfully!");
      } catch (error: any) {
        console.error("Remove member error:", error);
        showMessage("error", error.message || "Failed to remove member");
      } finally {
        setIsSaving(false);
      }
    },
    [channel, user.id, API_URL, fetchChannelMembers, showMessage]
  );

  const handleLeaveChannel = useCallback(async () => {
    if (!channel) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(
        `${API_URL}/api/channel/${channel.id}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: user.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to leave channel");
      }

      showMessage("success", data.message || "You have left the channel");

      if (onCloseSettings) {
        onCloseSettings();
      } else {
        navigate("/channels/@me");
      }
    } catch (error: any) {
      console.error("Leave channel error:", error);
      showMessage("error", error.message || "Failed to leave channel");
    } finally {
      setIsSaving(false);
    }
  }, [channel, user.id, API_URL, navigate, showMessage, onCloseSettings]);

  const handleDeleteChannel = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!channel) return;

      console.log("🔄 Starting channel deletion process...");

      if (confirmChannelName !== channel.name) {
        showMessage(
          "error",
          `Channel name doesn't match. Type "${channel.name}" to confirm.`
        );
        return;
      }

      setIsSaving(true);
      setMessage(null);

      try {
        const payload = {
          deletedBy: user.id,
          userId: user.id,
        };

        const response = await fetch(`${API_URL}/api/channel/${channel.id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        showMessage("success", data.message || "Channel deleted successfully!");

        if (onDeleteChannel) {
          onDeleteChannel(channel.id);
        }

        if (onCloseSettings) {
          onCloseSettings();
        } else {
          navigate("/channels/@me");
        }
      } catch (error: any) {
        console.error("❌ Delete channel error:", error);
        let errorMessage = error.message || "Failed to delete channel";

        if (error.message.includes("403")) {
          errorMessage = "Only the channel creator can delete the channel";
        } else if (error.message.includes("404")) {
          errorMessage = "Channel not found";
        } else if (error.message.includes("400")) {
          errorMessage = "Invalid request";
        }

        showMessage("error", errorMessage);
      } finally {
        setIsSaving(false);
      }
    },
    [
      channel,
      confirmChannelName,
      user.id,
      API_URL,
      onDeleteChannel,
      navigate,
      showMessage,
      onCloseSettings,
    ]
  );

  const handleResetForm = useCallback(() => {
    if (channel) {
      setChannelName(channel.name);
      setChannelDescription(channel.description || "");
      setChannelImage(channel.image || "");
      setChannelBgColor(channel.bgcolor || "#3392ff");
      setIsPrivate(channel.isPrivate || false);
    }
    setMessage(null);
  }, [channel]);

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

  const GeneralTab = useMemo(
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
            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
          </svg>
          <h4>{t.general}</h4>
        </div>

        <form onSubmit={handleSaveGeneral}>
          <div className="row g-3 d-flex align-items-center">
            <div className="col-12 col-md-4 text-center mb-4">
              <div className="profile-picture mb-3 d-flex flex-column align-items-center gap-3">
                {channelImage ? (
                  <img
                    src={channelImage}
                    alt={channelName}
                    className="rounded-5"
                    style={profileImageStyle}
                  />
                ) : (
                  <div
                    className="rounded-5 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: channelBgColor,
                      ...profileImageStyle,
                    }}
                  >
                    <img
                      src={logo}
                      width={"80px"}
                      alt={channel?.name || "Channel"}
                      style={{
                        filter: "brightness(0) invert(1)",
                      }}
                    />
                  </div>
                )}
                <ImageUpload
                  onImageUpload={setChannelImage}
                  currentImage={channelImage}
                />
              </div>
            </div>
            <div className="col-12 col-md-8">
              <div className="mb-3">
                <label className="form-label">{t.channelName}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="text"
                    className="border-0 w-100"
                    style={formControlStyle}
                    value={channelName}
                    onChange={(e) => setChannelName(e.target.value)}
                    required
                  />
                </motion.div>
              </div>
              <div className="mb-3">
                <label className="form-label">{t.description}</label>
                <motion.div
                  whileFocus={{ scale: 1.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="form-control p-2 px-3 border border-1 rounded-5"
                >
                  <input
                    type="text"
                    className="border-0 w-100"
                    style={formControlStyle}
                    value={channelDescription}
                    onChange={(e) => setChannelDescription(e.target.value)}
                    placeholder={t.whatIsThisChannelAbout}
                  />
                </motion.div>
              </div>
              <div className="mb-4">
                <label className="form-label">{t.channelColor}</label>
                <div className="d-flex gap-2 flex-wrap">
                  {channelColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className="rounded-5 border-0"
                      style={colorButtonStyle(color, channelBgColor === color)}
                      onClick={() => setChannelBgColor(color)}
                    />
                  ))}
                </div>
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
                      {t.saving}
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
      t,
      channelName,
      channelDescription,
      channelImage,
      channelBgColor,
      isSaving,
      handleSaveGeneral,
      handleResetForm,
      profileImageStyle,
      formControlStyle,
      colorButtonStyle,
      channelColors,
      channel,
    ]
  );

  const MembersTab = useMemo(
    () => (
      <div>
        <div className="d-inline-flex gap-2 flex-wrap align-items-start mb-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="white"
            className="bi bi-people-fill"
            viewBox="0 0 16 16"
          >
            <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
          </svg>
          <h4>{t.members}</h4>
        </div>

        <form onSubmit={handleAddMember} className="mb-4">
          <div className="row g-2">
            <div className="col-12 col-md-8">
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 rounded-5"
              >
                <input
                  type="text"
                  className="border-0 w-100"
                  style={formControlStyle}
                  placeholder={t.addMemberPlaceholder}
                  value={newMemberUsername}
                  onChange={(e) => setNewMemberUsername(e.target.value)}
                />
              </motion.div>
            </div>
            <div className="col-12 col-md-4">
              <button
                type="submit"
                className="btn btn-light fw-bold text-uppercase rounded-4 w-100"
                disabled={isSaving || !newMemberUsername.trim()}
              >
                {t.addMember}
              </button>
            </div>
          </div>
        </form>

        <div className="members-list">
          <h6 className="mb-3">
            {t.currentMembers}&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;
            {members.length}
          </h6>
          {members.length === 0 ? (
            <p className="text-muted">{t.noMembers}</p>
          ) : (
            <div className="row g-2">
              {members.map((member) => (
                <div key={member.id} className="col-12 col-md-6">
                  <div
                    className="d-flex align-items-center justify-content-between p-3 rounded-5 "
                    style={membersListStyle}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={member.image}
                        alt={member.username}
                        className="rounded-circle"
                        style={{
                          width: "40px",
                          height: "40px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <div
                          className="fw-semibold text-truncate "
                          style={{
                            maxWidth:
                              window.innerWidth < 768 ? "100px" : "120px",
                          }}
                        >
                          {member.username}
                        </div>
                        <small
                          style={{
                            color: member.isOnline ? "#20b92d" : "#6c757d",
                          }}
                        >
                          {member.isOnline ? t.online : t.offline}
                        </small>
                      </div>
                    </div>
                    {member.id !== user.id && (
                      <button
                        style={dangerButtonStyle}
                        onMouseEnter={handleDangerMouseEnter}
                        onMouseLeave={handleDangerMouseLeave}
                        onClick={() => handleRemoveMember(member.id)}
                        className="btn  btn-sm rounded-5"
                        disabled={isSaving}
                      >
                        {t.remove}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    ),
    [
      t,
      newMemberUsername,
      members,
      isSaving,
      handleAddMember,
      handleRemoveMember,
      user.id,
      formControlStyle,
    ]
  );

  const DangerTab = useMemo(
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

        <div className="mb-4 p-3 rounded-5" style={membersListStyle}>
          <h6 className="text-white">{t.leaveChannel}</h6>
          <p className=" mb-3" style={{ color: "#c0c0c0ff" }}>
            {t.leaveChannelDescription}
          </p>
          <button
            onClick={handleLeaveChannel}
            className="btn rounded-4 text-uppercase"
            style={dangerButtonStyle}
            onMouseEnter={handleDangerMouseEnter}
            onMouseLeave={handleDangerMouseLeave}
            disabled={isSaving}
          >
            {t.leaveChannel}
          </button>
        </div>

        <div className="p-3 rounded-5" style={membersListStyle}>
          <h6 className="text-white">{t.deleteChannel}</h6>
          <p className="mb-3" style={{ color: "#c0c0c0ff" }}>
            {t.deleteChannelDescription}
          </p>
          <form onSubmit={handleDeleteChannel}>
            <div className="mb-3">
              <label className="form-label text-danger">
                {t.typeChannelNameToConfirm} <strong>{channel?.name}</strong>
              </label>
              <motion.div
                whileFocus={{ scale: 1.02 }}
                whileHover={{ scale: 1.01 }}
                className="form-control p-2 px-3 border border-1 rounded-5"
              >
                <input
                  type="text"
                  className="border-0 w-100"
                  style={formControlStyle}
                  value={confirmChannelName}
                  onChange={(e) => setConfirmChannelName(e.target.value)}
                  placeholder={`Type "${channel?.name}" to confirm`}
                />
              </motion.div>
            </div>
            <button
              type="submit"
              className="btn rounded-4 text-uppercase"
              style={dangerButtonStyle}
              onMouseEnter={handleDangerMouseEnter}
              onMouseLeave={handleDangerMouseLeave}
              disabled={isSaving || confirmChannelName !== channel?.name}
            >
              {t.deleteChannelForever}
            </button>
          </form>
        </div>
      </div>
    ),
    [
      t,
      confirmChannelName,
      isSaving,
      handleLeaveChannel,
      handleDeleteChannel,
      handleDangerMouseEnter,
      handleDangerMouseLeave,
      channel,
      formControlStyle,
      dangerButtonStyle,
    ]
  );

  const SettingsSkeleton = useMemo(
    () => () =>
      (
        <div style={{ position: "relative", minHeight: "100vh" }}>
          <div style={backgroundStyle}></div>

          <div className="settings-page">
            <div
              className="settings-container glass p-3 p-md-5 rounded-5"
              style={containerStyle}
            >
              <Navbar nameOfTop={t.channelSettings} />

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
                <div className="col-12 col-md-3">
                  <div className="settings-sidebar glass p-3 p-md-4 rounded-5 h-100">
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

                    {Array.from({ length: 3 }).map((_, index) => (
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

                <div className="col-12 col-md-9">
                  <div className="settings-content glass p-3 p-md-4 rounded-5 h-100">
                    <div
                      className="skeleton-blink rounded-5 mb-4"
                      style={{
                        width: "200px",
                        height: "32px",
                        backgroundColor: "#adadade8",
                      }}
                    ></div>

                    <div className="row g-3">
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

                      <div className="col-12 col-md-8">
                        {Array.from({ length: 2 }).map((_, index) => (
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
      ),
    [backgroundStyle, containerStyle, t]
  );

  useEffect(() => {
    setPageTitle(`Blabber - @${channel?.name} ${t.settingsName}`);

    const timer = setTimeout(() => {
      setIsLoadingSkeleton(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [setPageTitle, channel]);

  useEffect(() => {
    if (!channel) {
      console.log("❌ Channel no longer exists, navigating away...");
      navigate("/channels/@me");
      return;
    }

    const isStillMember = channel.members?.includes(user.id);
    const isCreator = channel.createdBy === user.id;

    if (!isCreator && !isStillMember) {
      console.log("👤 User is no longer a member, closing settings...");
      navigate("/channels/@me");
    }
  }, [channel, user.id, navigate]);

  useEffect(() => {
    if (channel) {
      setChannelName(channel.name);
      setChannelDescription(channel.description || "");
      setChannelImage(channel.image || "");
      setChannelBgColor(channel.bgcolor || "#3392ff");
      setIsPrivate(channel.isPrivate || false);
      fetchChannelMembers();
    }
  }, [channel, fetchChannelMembers]);

  if (isLoadingSkeleton) {
    return <SettingsSkeleton />;
  }

  if (!channel) {
    return (
      <div style={{ position: "relative", minHeight: "100vh" }}>
        <div style={backgroundStyle}></div>

        <div className="settings-page">
          <div
            className="settings-container glass p-3 p-md-5"
            style={containerStyle}
          >
            <Navbar nameOfTop={t.channelSettings} />
            <div className="text-center py-5">
              <h3>{t.channelNotFound}</h3>
              <p>{t.noPermissionMessage}</p>
              <button
                onClick={() => navigate("/channels/@me")}
                className="btn btn-outline-light rounded-4 mt-3"
              >
                Back to Friends
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <div style={backgroundStyle}></div>

      <div className="settings-page">
        <div
          className="settings-container glass p-3 p-md-5"
          style={containerStyle}
        >
          <Navbar nameOfTop={t.channelSettings} />

          <div style={contentStyle}>
            <div className="row g-3 mt-4 mt-sm-0 mt-md-0">
              <div className="col-12 col-md-3">
                <div className="text-start mb-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-light text-uppercase fw-bold rounded-4 px-3 px-md-4"
                  >
                    {t.backButton}
                  </button>
                </div>
              </div>
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-3">
                <div className="settings-sidebar glass p-3 p-md-4 rounded-5 h-100">
                  <div className="nav flex-column">
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
                          {t.channelSettings}
                        </span>
                      </div>
                    </div>

                    <div
                      className={`channel ${
                        activeTab === "general" ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        onClick={() => setActiveTab("general")}
                        className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                          activeTab === "general" ? "active" : "ps-2"
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
                              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
                            </svg>
                          </button>
                          <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "155px" }}
                            >
                              {t.general}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`channel ${
                        activeTab === "members" ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        onClick={() => setActiveTab("members")}
                        className={`d-flex channel_buttt p-2 rounded-5 gap-2 align-items-center mb-2 pe-2 ${
                          activeTab === "members" ? "active" : "ps-2"
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
                              className="bi bi-people-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                          </button>
                          <div className="d-flex gap-1 text-capitalize align-items-center flex-grow-1">
                            <span
                              className="text-truncate"
                              style={{ maxWidth: "155px" }}
                            >
                              {t.members}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`channel ${
                        activeTab === "danger" ? "active" : ""
                      }`}
                      style={{ cursor: "pointer" }}
                    >
                      <div
                        onClick={() => setActiveTab("danger")}
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
                              {t.dangerZone}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 col-md-9 mb-3">
                <div className="settings-content glass p-3 p-md-4 rounded-5 h-100">
                  {activeTab === "general" && GeneralTab}
                  {activeTab === "members" && MembersTab}
                  {activeTab === "danger" && DangerTab}
                  {message && (
                    <div
                      className={`${
                        activeTab === "general"
                          ? "justify-content-end mt-4"
                          : "justify-content-start mt-4"
                      } ${
                        message.type === "success"
                          ? "alert-success"
                          : "text-danger alert-danger"
                      } d-flex flex-wrap align-items-center rounded-5 border-0 ${
                        window.innerWidth < 768 ? "mb-2" : "mb-2"
                      }`}
                      style={messageStyle(message.type)}
                    >
                      {message.text}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
