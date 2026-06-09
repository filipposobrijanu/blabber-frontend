import React, {
  useState,
  useMemo,
  useCallback,
  CSSProperties,
  JSX,
  useEffect,
} from "react";
import { format } from "date-fns";
import { useShopContext } from "../../hooks/useShopContext";
import { messageTranslations } from "./MessageTranslations";
import { Message as MessageType } from "../../types/chat";
import { User } from "../../types/chat";
import emojiRegex from "emoji-regex";
import { find } from "linkifyjs";

interface MessageProps {
  message: MessageType;
  isOwn: boolean;
  messageUser: User | undefined;
  isFirstMessageOfDay: boolean;
  isFirstMessageOfChannel: boolean;
  isSameMinuteAsPrev: boolean;
  isLastMessageInChannel?: boolean;
  isLoading?: boolean;
  onDelete?: (messageId: string) => void;
  onEdit?: (messageId: string, newContent: string) => void;
  currentUserId?: string;
  channelMembers?: User[];
  onMarkAsSeen?: (messageId: string) => void;
}

export const Message: React.FC<MessageProps> = React.memo(
  ({
    message,
    isOwn,
    messageUser,
    isFirstMessageOfDay,
    isFirstMessageOfChannel,
    isSameMinuteAsPrev,
    isLoading = false,
    isLastMessageInChannel = false,
    onDelete,
    onEdit,
    currentUserId,
    channelMembers = [],
    onMarkAsSeen,
  }) => {
    const { selectedLanguage } = useShopContext();
    const t =
      messageTranslations[
        selectedLanguage.code as keyof typeof messageTranslations
      ];

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
    const [showEditTooltip, setShowEditTooltip] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isLink, setIsLink] = useState(false);
    const [editedContent, setEditedContent] = useState(message.content);
    const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
    const [imageError, setImageError] = useState(false);

    const regex = emojiRegex();

    const isEmoji = (text: string): boolean => {
      const matches = text.match(regex);
      return matches !== null && matches.join("") === text;
    };

    const renderContentWithLinks = (
      content: string,
    ): (string | JSX.Element)[] => {
      const links = find(content);
      const hasLinks = links.length > 0;

      if (hasLinks !== isLink) {
        setIsLink(hasLinks);
      }

      if (links.length === 0) {
        return [content];
      }

      const elements: (string | JSX.Element)[] = [];
      let lastIndex = 0;

      links.forEach(
        (link, index) => {
          if (link.start > lastIndex) {
            elements.push(content.slice(lastIndex, link.start));
          }

          elements.push(
            <LinkPreview
              key={`link-${index}`}
              url={link.href}
              originalLink={link.value}
            />,
          );

          lastIndex = link.end;
        },
        [isLink],
      );

      if (lastIndex < content.length) {
        elements.push(content.slice(lastIndex));
      }

      return elements;
    };
    interface LinkPreviewProps {
      url: string;
      originalLink: string;
    }

    const LinkPreview: React.FC<LinkPreviewProps> = ({ url, originalLink }) => {
      const [previewData, setPreviewData] = useState<{
        title?: string;
        description?: string;
        image?: string;
        siteName?: string;
      } | null>(null);
      const [loading, setLoading] = useState(false);
      const [error, setError] = useState(false);

      useEffect(() => {
        const fetchPreview = async () => {
          setLoading(true);
          setError(false);

          try {
            const response = await fetch(
              `${API_URL}/api/link-preview?url=${encodeURIComponent(url)}`,
            );

            if (response.ok) {
              const data = await response.json();
              setPreviewData(data);
            } else {
              setError(true);
            }
          } catch (err) {
            setError(true);
          } finally {
            setLoading(false);
          }
        };

        fetchPreview();
      }, [url]);

      if (error || !previewData) {
        return (
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-texttt"
            style={{
              textDecoration: "underline",
              wordBreak: "break-all" as const,
              color: "#1d9bf0",
            }}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
              e.stopPropagation()
            }
          >
            {originalLink}
          </a>
        );
      }

      return (
        <div className="link-preview-container" style={{ margin: "8px 0" }}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="link-preview"
            style={{
              display: "block",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              borderRadius: "12px",
              overflow: "hidden",
              textDecoration: "none",
              color: "inherit",
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              transition: "all 0.2s ease",
            }}
            onClick={(e: React.MouseEvent<HTMLAnchorElement>) =>
              e.stopPropagation()
            }
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                "rgba(255, 255, 255, 0.05)";
            }}
          >
            {previewData.image && (
              <div
                className="link-preview-image"
                style={{
                  width: "100%",
                  height: "75px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={previewData.image}
                  alt={previewData.title || "Link preview"}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    // Hide image if it fails to load
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div
              className="link-preview-content"
              style={{
                padding: "12px",
              }}
            >
              {previewData.siteName && (
                <div
                  className="link-preview-site"
                  style={{
                    fontSize: "0.8rem",
                    color: "#71767b",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    fontWeight: "bold",
                  }}
                >
                  {previewData.siteName}
                </div>
              )}

              {previewData.title && (
                <div
                  className="link-preview-title"
                  style={{
                    fontSize: "0.95rem",
                    fontWeight: "bold",
                    marginBottom: "4px",
                    color: "white",
                  }}
                >
                  {previewData.title}
                </div>
              )}

              <div
                className="link-preview-url"
                style={{
                  fontSize: "0.8rem",
                  color: "#71767b",
                  marginTop: "6px",
                  wordBreak: "break-all" as const,
                }}
              >
                {originalLink}
              </div>
            </div>
          </a>
        </div>
      );
    };

    // Check if current user has seen the message
    const hasCurrentUserSeen = useMemo(() => {
      if (!currentUserId || !message.seenBy) return false;
      return message.seenBy.some((seen) => seen.userId === currentUserId);
    }, [message.seenBy, currentUserId]);
    const seenInfo = useMemo(() => {
      if (!message.seenBy || message.seenBy.length === 0) {
        return {
          count: 0,
          percentage: 0,
          recentSeen: [],
          totalMembers: channelMembers.length,
        };
      }

      const otherMembers = channelMembers.filter(
        (member) => member.id !== message.userId,
      );
      const totalMembers = Math.max(otherMembers.length, 1);

      const seenCount = message.seenBy.filter(
        (seen) => seen.userId !== message.userId,
      ).length;
      const percentage = Math.round((seenCount / totalMembers) * 100);

      const recentSeen = message.seenBy
        .filter((seen) => seen.userId !== message.userId)
        .slice(-3);

      return {
        count: seenCount,
        percentage,
        recentSeen,
        totalMembers,
      };
    }, [message.seenBy, channelMembers, message.userId]);

    const renderSeenIndicators = useCallback(() => {
      if (!isOwn || !message.seenBy || channelMembers.length <= 1) {
        return null;
      }

      const { count, totalMembers, recentSeen } = seenInfo;

      let statusText = t.sent;
      let statusColor = "#ffffffa8";

      if (count >= totalMembers) {
        statusText = t.seenByAll;
        statusColor = "#ffffffa8";
      } else if (count > 0) {
        statusText = `${t.seenBy} ${count}/${totalMembers}`;
        statusColor = "#ffffffa8";
      } else {
        return (
          <div
            className={`seen-indicators d-flex align-items-center ${
              isOwn ? "justify-content-end" : "justify-content-start"
            } gap-1 mt-2`}
          >
            <small style={{ color: statusColor, fontSize: "0.7rem" }}>
              {statusText}
            </small>
          </div>
        );
      }

      return (
        <div
          className={`seen-indicators d-flex align-items-center ${
            isOwn ? "justify-content-end" : "justify-content-start"
          } gap-1 mt-2`}
        >
          <div
            className="d-flex align-items-center flex-row"
            style={{ gap: "4px" }}
          >
            {/* Status text */}
            <div className="d-flex align-items-center gap-1 flex-shrink-0">
              <small style={{ color: statusColor, fontSize: "0.7rem" }}>
                {statusText}
              </small>
            </div>

            {/* Show avatars of users who have seen the message */}
            {recentSeen.length > 0 && (
              <div className="d-flex align-items-center">
                {recentSeen.map((seen, index) => {
                  const user = channelMembers.find((m) => m.id === seen.userId);
                  if (!user) return null;

                  return (
                    <div
                      key={seen.userId}
                      className="position-relative flex-shrink-0"
                      style={{
                        marginLeft: index > 0 ? "-6px" : "0",
                        zIndex: recentSeen.length - index,
                      }}
                      title={`${t.seenBy} ${user.username}`}
                    >
                      {user.image ? (
                        <img
                          src={user.image}
                          width="16"
                          height="16"
                          className="rounded-circle border border-2 border-dark"
                          alt={user.username}
                          style={{
                            objectFit: "cover",
                            filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
                            display: "block",
                          }}
                        />
                      ) : (
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center border border-2 border-dark flex-shrink-0"
                          style={{
                            backgroundColor: "#292929",
                            width: "16px",
                            height: "16px",
                            display: "block",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="8"
                            height="8"
                            viewBox="0 0 16 16"
                            style={{ fill: "#ffffff" }}
                          >
                            <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                          </svg>
                        </div>
                      )}
                    </div>
                  );
                })}

                {count > 3 && (
                  <small
                    style={{
                      color: statusColor,
                      fontSize: "0.7rem",
                      marginLeft: "4px",
                    }}
                  >
                    +{count - 3}
                  </small>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }, [isOwn, message.seenBy, seenInfo, channelMembers, t]);

    useEffect(() => {
      if (isOwn || !currentUserId || hasCurrentUserSeen || !onMarkAsSeen) {
        return;
      }

      const messageElement = document.getElementById(`message-${message.id}`);
      if (!messageElement) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.7) {
              console.log(
                `👀 Marking message ${message.id} as seen by user ${currentUserId}`,
              );
              onMarkAsSeen(message.id);
              observer.disconnect();
            }
          });
        },
        {
          threshold: 0.7,
          rootMargin: "50px",
        },
      );

      observer.observe(messageElement);

      return () => observer.disconnect();
    }, [message.id, isOwn, currentUserId, hasCurrentUserSeen, onMarkAsSeen]);

    const showImageFullscreen = useCallback((imageUrl: string) => {
      const overlay = document.createElement("div");
      overlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    cursor: pointer;
  `;

      const img = document.createElement("img");
      img.src = imageUrl;
      img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 10px;
    box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  `;

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
          document.body.removeChild(overlay);
          document.removeEventListener("keydown", handleKeydown);
        }
      });

      const handleKeydown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          document.body.removeChild(overlay);
          document.removeEventListener("keydown", handleKeydown);
        }
      };
      document.addEventListener("keydown", handleKeydown);

      overlay.appendChild(img);
      document.body.appendChild(overlay);
    }, []);
    const monthToString = useCallback((date: Date) => {
      const months = [
        t.january,
        t.february,
        t.march,
        t.april,
        t.may,
        t.june,
        t.july,
        t.august,
        t.september,
        t.october,
        t.november,
        t.december,
      ];
      return months[date.getMonth()];
    }, []);

    const dateToString = useCallback(
      (date: Date) => {
        const day = date.getDate();
        let suffix = t.th;
        if (day === 1 || day === 21 || day === 31) suffix = t.st;
        else if (day === 2 || day === 22) suffix = t.nd;
        else if (day === 3 || day === 23) suffix = t.rd;
        return `${day}${suffix}`;
      },
      [t],
    );

    const dateNextToNameString = useCallback((date: Date) => {
      const messageDate = new Date(date);
      const today = new Date();

      const isSameDay =
        messageDate.getDate() === today.getDate() &&
        messageDate.getMonth() === today.getMonth() &&
        messageDate.getFullYear() === today.getFullYear();

      if (isSameDay) {
        return format(messageDate, "HH:mm");
      } else {
        const day = String(messageDate.getDate()).padStart(2, "0");
        const month = String(messageDate.getMonth() + 1).padStart(2, "0");
        const year = String(messageDate.getFullYear()).slice(-2);
        const hours = String(messageDate.getHours()).padStart(2, "0");
        const minutes = String(messageDate.getMinutes()).padStart(2, "0");
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
      }
    }, []);

    const messageTimestamp = useMemo(
      () => new Date(message.timestamp),
      [message.timestamp],
    );
    const formattedDate = useMemo(
      () => dateToString(messageTimestamp),
      [messageTimestamp, dateToString],
    );
    const formattedMonth = useMemo(
      () => monthToString(messageTimestamp),
      [messageTimestamp, monthToString],
    );
    const formattedTime = useMemo(
      () => dateNextToNameString(messageTimestamp),
      [messageTimestamp, dateNextToNameString],
    );

    const userImage = useMemo(() => {
      return messageUser?.image || message.userImage || null;
    }, [messageUser?.image, message.userImage]);

    const username = useMemo(() => {
      return messageUser?.username || message.username || t.unknownUser;
    }, [messageUser?.username, message.username, t.unknownUser]);

    const isOnline = useMemo(() => {
      return messageUser?.isOnline || false;
    }, [messageUser?.isOnline]);

    const messageContentStyle = useMemo(
      (): CSSProperties => ({
        backgroundColor:
          isOwn &&
          !isEditing &&
          message.type !== "image" &&
          message.type !== "gif" &&
          !isLink
            ? "#063016bd"
            : !isOwn &&
                !isEditing &&
                message.type !== "image" &&
                message.type !== "gif" &&
                !isLink
              ? "rgba(73, 73, 73, 0.5)"
              : "transparent",
        backdropFilter:
          !isEditing &&
          message.type !== "image" &&
          message.type !== "gif" &&
          !isLink
            ? "blur(10px)"
            : "",
        color: "white",
        wordBreak: "break-word",
        alignSelf: "flex-start",
      }),
      [isOwn, isEditing, message.type],
    );

    const menuPositionStyle = useMemo(
      (): CSSProperties => ({
        position: "absolute",
        right: isOwn ? "0" : "auto",
        left: isOwn ? "auto" : "0",
        top: isLastMessageInChannel ? "" : "100%",
        bottom: isLastMessageInChannel ? "120%" : "",
        marginTop: "4px",
        background: "#063016bd",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "24px",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
        zIndex: 1000,
        overflow: "hidden",
        minWidth: selectedLanguage.code === "us" ? "100px" : "140px",
      }),
      [isOwn],
    );

    const handleEditSave = useCallback(() => {
      if (editedContent.trim()) {
        onEdit?.(message.id, editedContent);
        setIsEditing(false);
      }
    }, [editedContent, message.id, onEdit]);

    const handleEditCancel = useCallback(() => {
      setEditedContent(message.content);
      setIsEditing(false);
    }, [message.content]);

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && editedContent.trim()) {
          e.preventDefault();
          onEdit?.(message.id, editedContent);
          setIsEditing(false);
        }
        if (e.key === "Escape") {
          e.preventDefault();
          setEditedContent(message.content);
          setIsEditing(false);
        }
      },
      [editedContent, message.id, message.content, onEdit],
    );

    const handleMenuToggle = useCallback(() => {
      setShowMenu((prev) => !prev);
    }, []);

    const handleEditStart = useCallback(() => {
      setIsEditing(true);
      setShowMenu(false);
      setEditedContent(message.content);
    }, [message.content]);

    const handleDelete = useCallback(() => {
      onDelete?.(message.id);
      setShowMenu(false);
    }, [message.id, onDelete]);

    const handleImageError = useCallback(() => {
      setImageError(true);
    }, []);

    useEffect(() => {
      setIsLoadingSkeleton(false);
    }, []);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (isEditing) {
          const editArea = document.querySelector(".message-content");
          if (editArea && !editArea.contains(event.target as Node)) {
            handleEditCancel();
          }
        }
      };

      if (isEditing) {
        document.addEventListener("mousedown", handleClickOutside);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isEditing, handleEditCancel]);

    useEffect(() => {
      setImageError(false);
    }, [userImage]);

    const MessageSkeleton = useMemo(
      () => () => {
        const randomWidth1 = Math.random() * 200 + 100;
        const randomWidth2 = Math.random() * 150 + 50;

        return (
          <div
            className={`message ${
              isOwn ? "own-message" : "other-message"
            } d-flex flex-column gap-0 ${
              isOwn ? "align-items-end" : "align-items-start"
            } justify-content-center mb-1`}
          >
            {isFirstMessageOfDay && (
              <div className="d-flex align-items-center justify-content-center w-100">
                <hr
                  style={{
                    height: "1px",
                    backgroundColor: "white",
                    flexGrow: 1,
                    margin: 0,
                    border: "none",
                  }}
                />
                <div
                  className="d-flex gap-1 px-2"
                  style={{ color: "#ffffffa8" }}
                >
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "40px",
                      height: "16px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "60px",
                      height: "16px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "40px",
                      height: "16px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                </div>
                <hr
                  style={{
                    height: "1px",
                    backgroundColor: "white",
                    flexGrow: 1,
                    margin: 0,
                    border: "none",
                  }}
                />
              </div>
            )}

            {!isSameMinuteAsPrev && (
              <div
                className={`message-header d-flex gap-2 align-items-center align-text-center ${
                  isOwn ? "justify-content-end" : "justify-content-start"
                } mt-3 mb-1`}
              >
                {!isOwn && (
                  <div className="d-flex gap-2 align-items-center align-items-start">
                    <div
                      className="skeleton-blink rounded-5"
                      style={{
                        width: "32px",
                        height: "32px",
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
                )}

                {isOwn && (
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "45px",
                      height: "14px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                )}

                {!isOwn && (
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "45px",
                      height: "14px",
                      backgroundColor: "#adadade8",
                    }}
                  ></div>
                )}
              </div>
            )}

            <div
              className={`message-content ${isOwn ? "text-end" : "text-start"}`}
            >
              <div
                className="skeleton-blink2 rounded-5"
                style={{
                  width: `${randomWidth1}px`,
                  height: "20px",
                  backgroundColor: "#ffffffec",
                  marginBottom: "4px",
                  marginLeft: isOwn ? "auto" : "0",
                  marginRight: isOwn ? "0" : "auto",
                }}
              ></div>
              {Math.random() > 0.5 && (
                <div
                  className="skeleton-blink rounded-5"
                  style={{
                    width: `${randomWidth2}px`,
                    height: "20px",
                    backgroundColor: "#adadade8",
                    marginLeft: isOwn ? "auto" : "0",
                    marginRight: isOwn ? "0" : "auto",
                  }}
                ></div>
              )}
            </div>
          </div>
        );
      },
      [isOwn, isFirstMessageOfDay, isSameMinuteAsPrev],
    );

    if (isLoadingSkeleton) {
      return <MessageSkeleton />;
    }

    return (
      <div
        id={`message-${message.id}`}
        className={`message ${
          isOwn ? "own-message" : "other-message"
        } d-flex flex-column gap-0 ${
          isOwn ? "align-items-end" : "align-items-start"
        } justify-content-center mb-1`}
        style={{ position: "relative" }}
      >
        {isFirstMessageOfDay && (
          <div
            className={`d-flex align-items-center justify-content-center w-100 ${
              isFirstMessageOfChannel ? "mt-0" : "mt-4"
            } mb-2`}
          >
            <hr
              style={{
                height: "1px",
                backgroundColor: "white",
                flexGrow: 1,
                margin: 0,
                border: "none",
              }}
            />
            <div className="d-flex gap-1 px-2" style={{ color: "#ffffffa8" }}>
              <small style={{ fontSize: "0.8em" }}>{formattedDate}</small>
              <small style={{ fontSize: "0.8em" }}>{formattedMonth}</small>
              <small style={{ fontSize: "0.8em" }}>
                {messageTimestamp.getFullYear()}
              </small>
            </div>
            <hr
              style={{
                height: "1px",
                backgroundColor: "white",
                flexGrow: 1,
                margin: 0,
                border: "none",
              }}
            />
          </div>
        )}

        {!isSameMinuteAsPrev && (
          <div className="message-header flex-wrap d-flex gap-2 align-items-center align-text-center justify-content-start mt-3 mb-1">
            <div className="d-flex gap-2 align-text-center align-items-start">
              <div className="position-relative flex-shrink-0">
                {userImage && !imageError ? (
                  <img
                    src={userImage}
                    width={"32px"}
                    height={"32px"}
                    className="rounded-5"
                    style={{
                      filter: "drop-shadow(0 0 0.2rem #00000031)",
                      objectFit: "cover",
                    }}
                    alt={username}
                    onError={handleImageError}
                  />
                ) : (
                  <div
                    className="rounded-5 d-flex align-items-center justify-content-center"
                    style={{
                      backgroundColor: "#292929ff",
                      width: "32px",
                      height: "32px",
                      filter: "drop-shadow(0 0 0.2rem #00000031)",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      fill="currentColor"
                      viewBox="0 0 16 16"
                    >
                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                    </svg>
                  </div>
                )}

                {messageUser && (
                  <div
                    className="position-absolute rounded-circle border border-2 border-dark"
                    style={{
                      width: "12px",
                      height: "12px",
                      backgroundColor: isOnline ? "#20b92d" : "#6c757d",
                      bottom: "0",
                      right: "0",
                    }}
                  />
                )}
              </div>
              <span className="username fw-semibold fs-5">{username}</span>
            </div>
            <small
              className="timestamp"
              style={{ color: "#ffffffa8", fontSize: "0.8em" }}
            >
              {formattedTime}
            </small>

            {isOwn && (
              <div className="position-relative">
                <button
                  className="btn d-flex align-items-center justify-content-center btn-sm p-1 rounded-circle"
                  style={{
                    width: "24px",
                    height: "24px",
                    border: "1px solid rgba(255, 255, 255, 0.24)",
                    background: "rgba(255, 255, 255, 0.1)",
                    color: "white",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={(e) => {
                    setShowEditTooltip(true);
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    setShowEditTooltip(false);
                    e.currentTarget.style.background =
                      "rgba(255, 255, 255, 0.1)";
                  }}
                  onClick={() => {
                    handleMenuToggle();
                    setShowEditTooltip(false);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    viewBox="0 0 16 16"
                  >
                    <path d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                  </svg>
                  {showEditTooltip && window.innerWidth >= 768 && (
                    <div
                      className="custom-tooltip-settings rounded-5"
                      style={{
                        left: "-100%",
                      }}
                    >
                      {t.edit}
                    </div>
                  )}
                </button>

                {showMenu && (
                  <div style={menuPositionStyle}>
                    {message.type !== "image" && message.type !== "gif" && (
                      <>
                        <button
                          onClick={handleEditStart}
                          className="d-flex align-items-center justify-content-center gap-1 p-2 px-1 w-100 text-start fw-semibold"
                          style={{
                            background: "transparent",
                            border: "none",
                            color: "white",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            fontSize: "0.95rem",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16"
                          >
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                          </svg>
                          {t.edit}
                        </button>
                        <div
                          style={{
                            height: "1px",
                            background: "rgba(255, 255, 255, 0.1)",
                            margin: "0",
                          }}
                        />
                      </>
                    )}
                    <button
                      onClick={handleDelete}
                      className="d-flex align-items-center justify-content-center gap-1 p-2 px-1 w-100 text-start fw-semibold"
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        fontSize: "0.95rem",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background =
                          "rgba(255, 255, 255, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                      >
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                      {t.delete}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        <div
          className={`message-content ${
            message.type !== "image" && message.type !== "gif" ? "px-3" : ""
          } mt-2 py-1 rounded-5 ${isOwn ? "text-end" : "text-start"}`}
          style={
            isEmoji(message.content)
              ? {
                  ...messageContentStyle,
                  fontSize: isEditing ? "" : "1.5rem",
                  alignSelf: isOwn ? "flex-end" : "flex-start",
                }
              : {
                  ...messageContentStyle,
                  alignSelf: isOwn ? "flex-end" : "flex-start",
                }
          }
        >
          {isEditing ? (
            <div
              className="d-flex flex-wrap gap-2 mt-2 p-0 rounded-5"
              style={{
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                type="text"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                autoFocus
                className="form-control border-0 p-1 px-2 text-white rounded-5"
                style={{
                  minWidth: "120px",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  color: "black",
                  border: "none",
                  boxShadow: "none",
                  filter: "drop-shadow(0 0 0.2rem #00000031)",
                  outline: "none",
                  backdropFilter: "blur(20px)",
                  flex: 1,
                }}
                placeholder={t.editMessage}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn  fw-bold rounded-4 text-uppercase fw-semibold p-1 px-2"
                style={{
                  fontSize: "0.9em !important",
                  background: "#1f8a38ff",
                  color: "white",
                }}
                onClick={handleEditSave}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#17682aff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#1f8a38ff";
                }}
              >
                {t.save}
              </button>
              <button
                className="btn  fw-bold rounded-4 text-uppercase fw-semibold p-1 px-2"
                style={{
                  fontSize: "0.9em !important",
                  background: "rgba(179, 25, 25, 1)",
                  color: "white",
                  border: "none",
                }}
                onClick={handleEditCancel}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(133, 17, 17, 1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
                }}
              >
                {t.cancel}
              </button>
            </div>
          ) : (
            <>
              {message.type === "image" ? (
                <div className="message-image-container">
                  <img
                    onClick={() => showImageFullscreen(message.content)}
                    src={message.content}
                    alt="Uploaded image"
                    className="message-image rounded-4"
                    style={{
                      cursor: "pointer",
                      maxWidth: "300px",
                      maxHeight: "300px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : message.type === "gif" ? (
                <div className="message-gif-container">
                  <img
                    src={message.content}
                    alt="GIF"
                    className="message-gif rounded-4"
                    style={{
                      cursor: "pointer",
                      maxWidth: "300px",
                      maxHeight: "300px",
                      width: "auto",
                      height: "auto",
                      objectFit: "contain",
                    }}
                    onClick={() => showImageFullscreen(message.content)}
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <>{renderContentWithLinks(message.content)}</>
              )}
            </>
          )}
        </div>

        {/* ✅ Show seen indicators for own messages */}
        {renderSeenIndicators()}
      </div>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.message.content === nextProps.message.content &&
      prevProps.message.seenBy === nextProps.message.seenBy &&
      prevProps.isOwn === nextProps.isOwn &&
      prevProps.isSameMinuteAsPrev === nextProps.isSameMinuteAsPrev &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.channelMembers === nextProps.channelMembers &&
      prevProps.currentUserId === nextProps.currentUserId
    );
  },
);
