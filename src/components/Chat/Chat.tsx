import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  CSSProperties,
} from "react";
import { useSocket } from "../../hooks/useSocket";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  MessageBatch,
  Message as MessageType,
  Channel,
} from "../../types/chat";
import { Message } from "../Message/Message";
import { ChannelList } from "../ChannelList/ChannelList";
import { Login } from "../Login/Login";
import "./Chat.css";
import logo from "../../assets/logo.png";
import { Navbar } from "../Navbar/Navbar";
import { useShopContext } from "../../hooks/useShopContext";
import { useUsersContext } from "../../context/UsersContext";
import { ActiveNowList } from "../ActiveNowList/ActiveNowList";
import { Link, useNavigate } from "react-router-dom";
import { Settings } from "../Settings/Settings";
import objects from "../../assets/3dobjects.png";
import { ChannelSettings } from "../ChannelSettings/ChannelSettings";
import { AllList } from "../AllList/AllList";
import { useWebRTC } from "../../hooks/useWebRTC";
import { VideoCallModal } from "../VideoCallModal/VideoCallModal";
import { chatTranslations } from "./ChatTranslations";
import { GifPicker } from "../GifPicker/GifPicker";
import { FriendsProvider, useFriends } from "../../context/FriendsContext";
import { FriendRequestItem } from "../FriendRequestItem/FriendRequestItem";
import { useFaviconBadge } from "../../hooks/useFaviconBadge";
import { CallData } from "../../hooks/useWebRTC";
// Memoize SwipeHint component

const SwipeHint: React.FC<{ show: boolean; onHide: () => void }> = React.memo(
  ({ show, onHide }) => {
    useEffect(() => {
      if (show) {
        const timer = setTimeout(() => {
          onHide();
        }, 3000);
        return () => clearTimeout(timer);
      }
    }, [show, onHide]);

    if (!show) return null;

    return (
      <div
        className="text-uppercase"
        style={{
          position: "fixed",
          top: "45%",
          left: "25px",
          transform: "translateY(-50%)",
          background: "transparent",
          color: "white",
          border: "white 1px solid",
          padding: "10px 15px",
          filter: "drop-shadow(0 0 0.2rem #00000031)",
          borderRadius: "20px",
          fontSize: "14px",
          zIndex: 1002,
          animation: "fadeInOut 3s ease-in-out",
        }}
      >
        ← Swipe to Right
      </div>
    );
  }
);

// Memoize TypingAnimationComponent
const TypingAnimationComponent = React.memo(() => {
  const [animationText, setAnimationText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const { selectedLanguage } = useShopContext();

  const t =
    chatTranslations[selectedLanguage.code as keyof typeof chatTranslations];

  const texts = useMemo(
    () => [
      t.selectChannelToStart.toString(),
      t.joinConversation.toString(),
      t.startChattingWithFriends.toString(),
      t.connectWithCommunity.toString(),
    ],
    []
  );

  const typingSpeed = 50;
  const deletingSpeed = 30;
  const pauseTime = 2000;

  useEffect(() => {
    const currentText = texts[textIndex];
    const isTyping = charIndex < currentText.length;

    let timeoutId: NodeJS.Timeout;

    if (!isDeleting && isTyping) {
      timeoutId = setTimeout(() => {
        setAnimationText(currentText.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, typingSpeed);
    } else if (!isDeleting && !isTyping) {
      timeoutId = setTimeout(() => {
        setIsDeleting(true);
      }, pauseTime);
    } else if (isDeleting && charIndex > 0) {
      timeoutId = setTimeout(() => {
        setAnimationText(currentText.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      }, deletingSpeed);
    } else if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
    }

    return () => clearTimeout(timeoutId);
  }, [charIndex, isDeleting, textIndex, texts]);

  return (
    <div className="mb-5 px-2" style={{ fontSize: "1.1em" }}>
      <span style={{ marginRight: "3px" }}>
        <img src={logo} width="24" height="24" alt="Friends" />
      </span>
      {animationText}
      <span style={{ marginLeft: "3px" }}>
        <img src={logo} width="24" height="24" alt="Friends" />
      </span>
      <style>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
});

export const Chat: React.FC = React.memo(() => {
  const {
    selectedChannel,
    setSelectedChannel,
    pageTitle,
    setPageTitle,
    selectedLanguage,
  } = useShopContext();

  const {
    friends,
    friendRequests, // ← Make sure this is here
    onlineFriends,
    addFriend,
    removeFriend,
    addFriendRequest,
    removeFriendRequest,
    refreshFriends,
    refreshFriendRequests, // ← Make sure this is here
  } = useFriends();
  const MessagesSkeleton = useMemo(() => {
    return () => {
      // Generate random variations for more realistic skeleton
      const generateRandomWidth = (min: number, max: number) =>
        Math.random() * (max - min) + min;

      const generateSkeletonMessages = () => {
        const messages = [];
        const messageCount = 8; // Show 8 skeleton messages

        for (let i = 0; i < messageCount; i++) {
          const isOwn = Math.random() > 0.7; // 30% chance of own message
          const isFirstOfDay = i === 0 || Math.random() > 0.95; // First message or rare chance
          const isSameMinuteAsPrev = i > 0 && Math.random() > 0.7; // 30% chance same minute
          const hasMultipleLines = Math.random() > 0.3; // 70% chance multiple lines

          const randomWidth1 = generateRandomWidth(100, 250);
          const randomWidth2 = generateRandomWidth(50, 180);
          const randomWidth3 = generateRandomWidth(60, 120);

          messages.push(
            <div
              key={`skeleton-msg-${i}`}
              className={`message ${
                isOwn ? "own-message" : "other-message"
              } d-flex flex-column gap-0 ${
                isOwn ? "align-items-end" : "align-items-start"
              } justify-content-center mb-3`}
            >
              {/* Date separator skeleton */}
              {isFirstOfDay && (
                <div className="d-flex align-items-center justify-content-center w-100 mb-3">
                  <hr
                    style={{
                      height: "1px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
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
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }}
                    ></div>
                    <div
                      className="skeleton-blink rounded-5"
                      style={{
                        width: "60px",
                        height: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }}
                    ></div>
                    <div
                      className="skeleton-blink rounded-5"
                      style={{
                        width: "40px",
                        height: "16px",
                        backgroundColor: "rgba(255, 255, 255, 0.15)",
                      }}
                    ></div>
                  </div>
                  <hr
                    style={{
                      height: "1px",
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      flexGrow: 1,
                      margin: 0,
                      border: "none",
                    }}
                  />
                </div>
              )}

              {/* Message header skeleton */}
              {!isSameMinuteAsPrev && (
                <div
                  className={`message-header d-flex gap-2 align-items-center align-text-center ${
                    isOwn ? "justify-content-end" : "justify-content-start"
                  } mb-2`}
                >
                  {!isOwn && (
                    <div className="d-flex gap-2 align-items-center align-items-start">
                      {/* Avatar skeleton */}
                      <div
                        className="skeleton-blink rounded-circle"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "rgba(255, 255, 255, 0.15)",
                        }}
                      ></div>
                      {/* Username skeleton */}
                      <div
                        className="skeleton-blink2 rounded-5"
                        style={{
                          width: `${randomWidth3}px`,
                          height: "18px",
                          backgroundColor: "rgba(255, 255, 255, 0.2)",
                        }}
                      ></div>
                    </div>
                  )}

                  {/* Timestamp skeleton */}
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "45px",
                      height: "14px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      marginLeft: isOwn ? "0" : "auto",
                      marginRight: isOwn ? "auto" : "0",
                    }}
                  ></div>
                </div>
              )}

              {/* Message content skeleton */}
              <div
                className={`message-content ${
                  isOwn ? "text-end" : "text-start"
                }`}
              >
                {/* First line of message */}
                <div
                  className="skeleton-blink2 rounded-5 mb-1"
                  style={{
                    width: `${randomWidth1}px`,
                    height: "20px",
                    backgroundColor: "rgba(255, 255, 255, 0.25)",
                    marginLeft: isOwn ? "auto" : "0",
                    marginRight: isOwn ? "0" : "auto",
                  }}
                ></div>

                {/* Second line (conditional) */}
                {hasMultipleLines && (
                  <div
                    className="skeleton-blink rounded-5 mb-1"
                    style={{
                      width: `${randomWidth2}px`,
                      height: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.15)",
                      marginLeft: isOwn ? "auto" : "0",
                      marginRight: isOwn ? "0" : "auto",
                    }}
                  ></div>
                )}

                {/* Third line (rare) */}
                {hasMultipleLines && Math.random() > 0.7 && (
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: `${generateRandomWidth(30, 120)}px`,
                      height: "20px",
                      backgroundColor: "rgba(255, 255, 255, 0.1)",
                      marginLeft: isOwn ? "auto" : "0",
                      marginRight: isOwn ? "0" : "auto",
                    }}
                  ></div>
                )}
              </div>
            </div>
          );
        }
        return messages;
      };

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className=""
          style={{ background: "transparent !important" }}
        >
          {generateSkeletonMessages()}

          {/* Add some CSS for the blinking animation */}
          <style>
            {`
            @keyframes skeleton-blink {
              0% { opacity: 0.6; }
              50% { opacity: 0.8; }
              100% { opacity: 0.6; }
            }
            .skeleton-blink {
              animation: skeleton-blink 2s ease-in-out infinite;
            }
            .skeleton-blink2 {
              animation: skeleton-blink 1.8s ease-in-out infinite;
            }
          `}
          </style>
        </motion.div>
      );
    };
  }, []);
  const containerStyle: CSSProperties = useMemo(
    () => ({
      height: "100%",
      overflowY: "auto",
    }),
    []
  );
  // Add this to your Chat component (around where you have other skeleton components)
  const FriendRequestsSkeleton = useMemo(
    () => () =>
      (
        <div className="active-now-list">
          <div className="users-container">
            <div className="d-flex flex-column gap-1" style={containerStyle}>
              {/* Generate 4 skeleton user items - MATCHING ALLLIST SKELETON */}
              {Array.from({ length: 4 }).map((_, index) => {
                const randomWidth = Math.random() * 80 + 60;

                return (
                  <div
                    key={`skeleton-${index}`}
                    className="user-item d-flex align-items-center gap-2 p-2 rounded-4"
                    style={{
                      background: "rgba(255, 255, 255, 0.05)",
                    }}
                  >
                    {/* Avatar Skeleton */}
                    <div className="position-relative flex-shrink-0">
                      <div
                        className="skeleton-blink rounded-5"
                        style={{
                          width: "36px",
                          height: "36px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                      {/* Online Status Skeleton */}
                      <div
                        className="skeleton-blink2 position-absolute rounded-circle border border-2 border-dark"
                        style={{
                          width: "12px",
                          height: "12px",
                          backgroundColor: "#ffffffec",
                          bottom: "0",
                          right: "0",
                        }}
                      />
                    </div>

                    {/* User Info Skeleton */}
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="skeleton-blink2 rounded-4"
                          style={{
                            width: `${randomWidth}px`,
                            height: "16px",
                            backgroundColor: "#ffffffec",
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Status Badge Skeleton */}
                    <div className="text-end flex-shrink-0">
                      <div
                        className="skeleton-blink rounded-4"
                        style={{
                          width: "50px",
                          height: "20px",
                          backgroundColor: "#adadade8",
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ),
    [containerStyle]
  );
  const [friendUsername, setFriendUsername] = useState("");
  const [isAddingFriend, setIsAddingFriend] = useState(false);
  const [isChannelTransitioning, setIsChannelTransitioning] = useState(false);
  const t =
    chatTranslations[selectedLanguage.code as keyof typeof chatTranslations];
  const { getUserById, setUser, setUsers, onlineUsers, setOnlineUsers } =
    useUsersContext();
  const navigate = useNavigate();

  useEffect(() => {
    const hasVisited = localStorage.getItem("hasVisitedLanding");
    const isOnLanding =
      window.location.pathname === "/" ||
      window.location.pathname === "/welcome";

    if (!hasVisited && !isOnLanding) {
      // Αν δεν έχει δει το landing page και είναι σε άλλη σελίδα,
      // τον στέλνουμε πρώτα στο landing
      navigate("/");
    }
  }, [navigate]);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const lastTransformRef = useRef<number>(0);
  // State declarations
  const [showChannelSettings, setShowChannelSettings] = useState(false);
  const [selectedChannelForSettings, setSelectedChannelForSettings] =
    useState<Channel | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [showLogoutTooltip, setShowLogoutTooltip] = useState(false);
  const [showSettingsTooltip, setShowSettingsTooltip] = useState(false);

  const [isChannelSettingsClosing, setIsChannelSettingsClosing] =
    useState(false);
  const [showImageTooltip, setShowImageTooltip] = useState(false);
  const [missedCallNotifications, setMissedCallNotifications] = useState<
    Map<
      string,
      {
        count: number;
        lastCall: CallData | null;
        channelId?: string;
        channelName?: string;
        isDMChannel?: boolean;
      }
    >
  >(new Map());
  const [showGIFTooltip, setShowGIFTooltip] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);

  const [showCallTooltip, setShowCallTooltip] = useState(false);
  const [showVideoCallTooltip, setShowVideoCallTooltip] = useState(false);
  const [showShowMembersTooltip, setShowMembersTooltip] = useState(false);

  const [showMembersSidebar, setShowMembersSidebar] = useState(false);
  const [isMembersSidebarClosing, setIsMembersSidebarClosing] = useState(false);
  const [shouldAnimateMembers, setShouldAnimateMembers] = useState(false);
  const [sidebarAnimationKey, setSidebarAnimationKey] = useState(0);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isActiveNowList, setIsActiveNowList] = useState(false);
  const [swipeStart, setSwipeStart] = useState<{
    x: number;
    y: number;
    time: number;
  } | null>(null);
  const [swipeDistance, setSwipeDistance] = useState(0);
  const [showSwipeHint, setShowSwipeHint] = useState(false);
  const [user, setUserState] = useState<User | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [currentChannel, setCurrentChannel] = useState<Channel | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [isLogoutModalClosing, setIsLogoutModalClosing] = useState(false);
  const [isAddModalClosing, setIsAddModalClosing] = useState(false);
  const [selectedTab, setSelectedTab] = useState<"friends" | "channel" | null>(
    "friends"
  );
  const [isLoadingFriendRequests, setIsLoadingFriendRequests] = useState(false);
  // Στις state declarations, πρόσθεσε αυτό:
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [channelCreateError, setChannelCreateError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredChannels, setFilteredChannels] = useState<Channel[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [showFriendRequests, setShowFriendRequests] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const [showLogoutModal, setLogoutModal] = useState(false);
  const [showAddFriendModal, setShowAddFriendModal] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";
  const { socket, isConnected } = useSocket(API_URL);
  const [isAudioCallVar, setIsAudioCallVar] = useState(true);
  // Βρες αυτό το useEffect στο Chat component και ΠΡΟΣΘΗΚΗ αυτού του κώδικα:

  useEffect(() => {
    const checkAuthentication = () => {
      const user = localStorage.getItem("user");
      const isAuthenticated = localStorage.getItem("isAuthenticated");

      if (user && isAuthenticated === "true") {
        try {
          const userData = JSON.parse(user);
          setUserState(userData);
          setUser(userData);
          setIsLoggedIn(true); // Αν έχεις αυτή τη state variable
          setPageTitle(`Blabber - ${t.friends}`);
          console.log(
            "✅ User automatically logged in from storage:",
            userData.username
          );

          // Επανεκκίνηση socket connection
          if (socket) {
            socket.disconnect();
            socket.connect();

            const joinUser = () => {
              if (socket.connected) {
                socket.emit("user:join", userData, currentChannel?.id || "1");
                console.log(
                  "User rejoined after auto-login:",
                  userData.username
                );
              } else {
                setTimeout(joinUser, 100);
              }
            };
            joinUser();
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("isAuthenticated");
        }
      }
    };

    checkAuthentication();
  }, [setUser, setPageTitle, socket, currentChannel?.id, t.friends]);
  const {
    callState,
    remoteStreams,
    incomingCall,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    rejectCall,
    endCall,
    callError,
    remoteChannelName,
    remoteChannelImage,
    remoteUsername,
    remoteImage,
    isAudioOnly,
    connectionStatuses,
    localStream,
    remoteIsDMChannel,
  } = useWebRTC({
    userId: user?.id || "",
    username: user?.username || "",
    socket,
    currentChannel,
    onlineUsers,
  });

  const participantData = useMemo(() => {
    const data = new Map();

    // Add data for all users in remoteStreams
    Array.from(remoteStreams.keys()).forEach((userId) => {
      const user = onlineUsers.find((u) => u.id === userId);
      if (user) {
        data.set(userId, {
          username: user.username,
          image: user.image,
        });
      } else {
        // Fallback if user not found in onlineUsers
        data.set(userId, {
          username: `User ${userId.slice(0, 6)}`,
          image: undefined,
        });
      }
    });

    return data;
  }, [remoteStreams, onlineUsers]);
  const [isRestoringChannel, setIsRestoringChannel] = useState(false);
  useEffect(() => {
    if (currentChannel) {
      const channelData = {
        id: currentChannel.id,
        name: currentChannel.name,
        bgcolor: currentChannel.bgcolor,
      };
      localStorage.setItem("currentChannel", JSON.stringify(channelData));
      console.log("💾 Saved channel to localStorage:", currentChannel.name);
    }
  }, [currentChannel?.id]);
  // Replace your restore useEffect with this improved version
  useEffect(() => {
    const restoreChannel = async () => {
      if (isRestoringChannel || !user || channels.length === 0) return;

      setIsRestoringChannel(true);

      try {
        const savedChannel = localStorage.getItem("currentChannel");
        console.log("🔄 Restore attempt - saved channel:", savedChannel);

        if (!savedChannel) {
          console.log("ℹ️ No saved channel found");
          setIsRestoringChannel(false);
          return;
        }

        const channelData = JSON.parse(savedChannel);
        console.log("📋 Parsed channel data:", channelData);

        // Find the exact channel from the current channels list
        const exactChannel = channels.find(
          (channel) => channel.id === channelData.id
        );

        if (!exactChannel) {
          console.log("🚫 Channel not found in current list, cleaning up");
          localStorage.removeItem("currentChannel");
          setIsRestoringChannel(false);
          return;
        }

        // Only restore if we're not already on this channel
        if (currentChannel?.id !== exactChannel.id) {
          console.log("✅ Restoring channel:", exactChannel.name);

          handleChannelSelect(exactChannel as Channel);
          // IMPORTANT: Set all states together to avoid race conditions
          setCurrentChannel(exactChannel);
          setSelectedChannel(exactChannel.name);
          setSelectedTab("channel");
          setPageTitle(`Blabber - @${exactChannel.name}`);

          // Emit socket event to join channel
          if (socket && socket.connected) {
            socket.emit("channel:join", exactChannel.id, user.id);
            console.log("📡 Emitted channel:join for:", exactChannel.name);
          }
        } else {
          console.log("ℹ️ Already on the correct channel");
        }
      } catch (error) {
        console.error("❌ Error restoring channel:", error);
        localStorage.removeItem("currentChannel");
      } finally {
        setIsRestoringChannel(false);
      }
    };

    // Restore when user is logged in, channels are loaded, and not currently restoring
    if (user && channels.length > 0) {
      console.log("👤 Conditions met for restore");
      restoreChannel();
    }
  }, [user?.id, channels.length]);
  useEffect(() => {
    return () => {
      setIsRestoringChannel(false);
    };
  }, []);
  // Identify user with socket
  useEffect(() => {
    if (socket?.connected && user) {
      (socket as any).emit("user:identify", user.id);
    }
  }, [socket?.connected, user]);

  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  // Memoized message handler - MOVE THIS BEFORE messageDisplay
  const showMessage = useCallback((type: "success" | "error", text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 5000);
  }, []);

  const messageDisplay = useMemo(() => {
    if (!message) return null;
    return (
      <div
        className={` ${
          message.type === "success"
            ? "alert-success"
            : "text-danger alert-danger"
        } glass-alert  d-flex justify-content-start text-start align-items-center small ps-4 rounded-5 border-0 mb-1 `}
        style={{
          color: message.type === "success" ? "#20b92d" : "",
        }}
      >
        {message.text}
      </div>
    );
  }, [message]);

  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [filteredMessages, setFilteredMessages] = useState<MessageType[]>([]);

  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});
  const [totalUnread, setTotalUnread] = useState(0);

  useEffect(() => {
    const total = Object.values(unreadCounts).reduce(
      (total, count) => total + count,
      0
    );
    setTotalUnread(total);
  }, [unreadCounts]);

  // Add with your other state declarations
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [isLoadingOlderMessages, setIsLoadingOlderMessages] =
    useState<boolean>(false);
  const [oldestMessageId, setOldestMessageId] = useState<string | null>(null);

  const loadOlderMessages = useCallback(async () => {
    if (
      !currentChannel?.id ||
      !user ||
      isLoadingOlderMessages ||
      !hasMoreMessages
    )
      return;

    console.log("📥 Loading older messages...");
    setIsLoadingOlderMessages(true);

    try {
      const params = new URLSearchParams({
        limit: "50",
      });

      // Use oldest message ID for pagination
      if (oldestMessageId) {
        params.append("before", oldestMessageId);
      }

      const response = await fetch(
        `${API_URL}/api/channel/${currentChannel.id}/messages?${params}`
      );

      if (!response.ok) throw new Error("Failed to fetch older messages");

      const olderMessages: MessageType[] = await response.json();

      if (olderMessages.length === 0) {
        console.log("✅ No more older messages");
        setHasMoreMessages(false);
        return;
      }

      // Update messages state - prepend older messages
      setMessages((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const newMessages = olderMessages.filter((m) => !existingIds.has(m.id));
        return [...newMessages, ...prev];
      });

      // Update oldest message ID for next pagination
      if (olderMessages.length > 0) {
        const newOldestId = olderMessages[0].id;
        setOldestMessageId(newOldestId);
        console.log(`📌 New oldest message ID: ${newOldestId}`);
      }

      // If we got fewer messages than requested, there are no more
      if (olderMessages.length < 50) {
        setHasMoreMessages(false);
      }

      console.log(`✅ Loaded ${olderMessages.length} older messages`);
    } catch (error) {
      console.error("❌ Error loading older messages:", error);
      setHasMoreMessages(false);
    } finally {
      setIsLoadingOlderMessages(false);
    }
  }, [
    currentChannel?.id,
    user,
    isLoadingOlderMessages,
    hasMoreMessages,
    oldestMessageId,
    API_URL,
  ]);
  const handleMessagesScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const container = e.currentTarget;
      const scrollTop = container.scrollTop;
      const scrollHeight = container.scrollHeight;
      const clientHeight = container.clientHeight;

      // Update initial load state if user scrolls
      if (isInitialLoad && scrollTop > 100) {
        setIsInitialLoad(false);
      }

      // Load more messages when scrolled near the top (within 100px)
      if (scrollTop < 100 && hasMoreMessages && !isLoadingOlderMessages) {
        console.log("⬆️ Scrolled to top, loading older messages...");
        loadOlderMessages();
      }
    },
    [hasMoreMessages, isLoadingOlderMessages, loadOlderMessages, isInitialLoad]
  );
  // Add this function to fetch unread counts:
  const fetchUnreadCounts = useCallback(async () => {
    if (!user) return;

    try {
      console.log("📡 Fetching unread counts...");
      const response = await fetch(
        `${API_URL}/api/user/${user.id}/unread-by-channel`
      );
      const data = await response.json();

      if (data.success) {
        console.log("✅ Unread counts received:", data.unreadByChannel);
        setUnreadCounts(data.unreadByChannel);
      }
    } catch (error) {
      console.error("Error fetching unread counts:", error);
    }
  }, [user, API_URL]);
  // Add debug logging when unread counts update via socket:
  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = (data: { channelId: string; count: number }) => {
      console.log(
        `🔔 Unread update: Channel ${data.channelId} has ${data.count} unread messages`
      );
      setUnreadCounts((prev) => ({
        ...prev,
        [data.channelId]: data.count,
      }));
    };

    socket.on("unread:update", handleUnreadUpdate);

    return () => {
      socket.off("unread:update", handleUnreadUpdate);
    };
  }, [socket]);

  // Also add this debug useEffect to see when unread counts change:
  useEffect(() => {
    console.log("📈 Unread counts changed:", unreadCounts);
  }, [unreadCounts]);
  useEffect(() => {
    if (user) {
      // Fetch immediately
      fetchUnreadCounts();

      // Set up interval to refresh every 30 seconds
      const interval = setInterval(() => {
        fetchUnreadCounts();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, fetchUnreadCounts]);
  // Add this custom hook near your other hooks
  const { setBadge, updateOriginalTitle } = useFaviconBadge();
  useEffect(() => {
    if (!pageTitle) return;

    // Let the favicon badge hook handle title updates
    updateOriginalTitle(pageTitle);

    // Get current unread count
    const totalUnread = Object.values(unreadCounts).reduce(
      (total, count) => total + count,
      0
    );

    // Update badge if needed
    if (totalUnread > 0) {
      setBadge(totalUnread);
    } else {
      setBadge(0);
    }
  }, [pageTitle, unreadCounts, setBadge, updateOriginalTitle]);
  useEffect(() => {
    const totalUnread = Object.values(unreadCounts).reduce(
      (total, count) => total + count,
      0
    );
    console.log(`📊 Total unread messages: ${totalUnread}`);
    setBadge(totalUnread);
  }, [unreadCounts, setBadge]);
  // Add effect to fetch unread counts on mount and when user changes:
  useEffect(() => {
    if (user) {
      fetchUnreadCounts();
    }
  }, [user, fetchUnreadCounts]);

  // Memoized values
  const channelMessages = useMemo(() => {
    if (!currentChannel?.id) return [];
    return messages.filter(
      (m) => String(m.channelId) === String(currentChannel.id)
    );
  }, [messages, currentChannel?.id]);

  const memoizedMessages = useMemo(() => {
    return channelMessages.map((message, index) => ({
      ...message,
      key: `${message.id}-${message.timestamp}`,
      index,
    }));
  }, [channelMessages]);

  // Memoized handler functions
  const triggerHapticFeedback = useCallback(() => {
    if ("vibrate" in navigator) {
      navigator.vibrate(50);
    }
  }, []);
  const [isSwiping, setIsSwiping] = useState(false);
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    setSwipeStart({
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
    });
    setSwipeDistance(0);
    setIsSwiping(true); // START SWIPING
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!swipeStart) return;

      const touch = e.touches[0];
      const deltaX = touch.clientX - swipeStart.x;
      const deltaY = touch.clientY - swipeStart.y;

      // Only process if horizontal movement is more than vertical (avoid triggering on vertical scroll)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        e.preventDefault();
        setSwipeDistance(deltaX);
      }
    },
    [swipeStart]
  );

  const handleTouchEnd = useCallback(() => {
    if (!swipeStart) return;

    const swipeTime = Date.now() - swipeStart.time;
    const isQuickSwipe = swipeTime < 300;
    const minSwipeDistance = 80; // Increased threshold - must swipe at least 80px

    if (Math.abs(swipeDistance) > minSwipeDistance) {
      if (swipeDistance > 0 && !sidebarOpen) {
        // Swiped right to open
        setSidebarOpen(true);
        triggerHapticFeedback();
        setShowSwipeHint(false);
      } else if (swipeDistance < 0 && sidebarOpen) {
        // Swiped left to close
        setSidebarOpen(false);
        triggerHapticFeedback();
      }
    } else if (isQuickSwipe && Math.abs(swipeDistance) > 40) {
      // Quick flick with less distance required
      if (swipeDistance > 0 && !sidebarOpen) {
        setSidebarOpen(true);
        triggerHapticFeedback();
        setShowSwipeHint(false);
      } else if (swipeDistance < 0 && sidebarOpen) {
        setSidebarOpen(false);
        triggerHapticFeedback();
      }
    }

    // Reset state
    setSwipeStart(null);
    setSwipeDistance(0);
    setIsSwiping(false); // STOP SWIPING
  }, [swipeStart, swipeDistance, sidebarOpen, triggerHapticFeedback]);

  const openSidebar = useCallback(() => {
    setSidebarOpen(true);
    triggerHapticFeedback();
    setShowSwipeHint(false);
  }, [triggerHapticFeedback]);

  const handleCloseLogoutModal = useCallback(() => {
    if (showLogoutModal && !isLogoutModalClosing) {
      setIsLogoutModalClosing(true);
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setLogoutModal(false);
        setIsLogoutModalClosing(false);
      }, 250); // Match this with your CSS animation duration
    }
  }, [showLogoutModal, isLogoutModalClosing]);
  const handleCloseAddFriendModal = useCallback(() => {
    if (showAddFriendModal && !isAddModalClosing) {
      setIsAddModalClosing(true);
      // Wait for animation to complete before actually closing
      setTimeout(() => {
        setIsAddModalClosing(false);
        setShowAddFriendModal(false);
      }, 250); // Match this with your CSS animation duration
    }
  }, [showAddFriendModal, isAddModalClosing]);

  const handleSendFriendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!friendUsername.trim() || !user) return;

    setIsAddingFriend(true);
    try {
      const response = await fetch(`${API_URL}/api/friends/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fromUserId: user.id,
          toUsername: friendUsername.trim(),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setFriendUsername("");
        setShowAddFriendModal(false);
        // Show success message
        showMessage("success", `Friend request sent to ${friendUsername}`);
      } else {
        showMessage("error", data.error || "Failed to send friend request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      alert("Failed to send friend request");
    } finally {
      setIsAddingFriend(false);
    }
  };

  // Add friend request handlers
  const handleAcceptFriendRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/api/friends/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // The socket event will handle updating the UI
        console.log("Friend request accepted");
      }
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const handleRejectFriendRequest = async (requestId: string) => {
    if (!user) return;

    try {
      const response = await fetch(`${API_URL}/api/friends/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          userId: user.id,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // The socket event will handle updating the UI
        console.log("Friend request rejected");
      }
    } catch (error) {
      console.error("Error rejecting friend request:", error);
    }
  };

  // Add socket event handlers for friends
  useEffect(() => {
    if (!socket) return;

    const handleFriendRequestSent = (data: any) => {
      console.log("📨 Friend request sent event:", data);
      if (data.toUserId === user?.id) {
        console.log("🔔 You received a friend request!");
        refreshFriendRequests(); // ← Refresh the list
      }
    };

    const handleFriendRequestAccepted = (data: any) => {
      console.log("✅ Friend request accepted event:", data);
      if (data.toUser?.id === user?.id || data.fromUser?.id === user?.id) {
        refreshFriends();
        refreshFriendRequests();
      }
    };

    const handleFriendRequestRejected = (data: any) => {
      console.log("❌ Friend request rejected event:", data);
      if (data.toUserId === user?.id) {
        refreshFriendRequests();
      }
    };

    socket.on("friend:request:sent", handleFriendRequestSent);
    socket.on("friend:request:accepted", handleFriendRequestAccepted);
    socket.on("friend:request:rejected", handleFriendRequestRejected);

    return () => {
      socket.off("friend:request:sent", handleFriendRequestSent);
      socket.off("friend:request:accepted", handleFriendRequestAccepted);
      socket.off("friend:request:rejected", handleFriendRequestRejected);
    };
  }, [socket, user, refreshFriends, refreshFriendRequests]);

  useEffect(() => {
    if (user) {
      // Load friends only once
      refreshFriends();

      // Only load friend requests if we're showing the friend requests panel
      setIsLoadingFriendRequests(true);
      refreshFriendRequests().finally(() => {
        setIsLoadingFriendRequests(false);
      });

      // Optional: Set up interval to refresh friend requests periodically
      const interval = setInterval(() => {
        refreshFriendRequests();
      }, 20000); // Refresh every 20 seconds

      return () => clearInterval(interval);
    }
  }, [user?.id, showFriendRequests]);
  // Only depend on these // Only depend on these

  const handleGifSelect = useCallback(
    (gifUrl: string) => {
      if (!user || !currentChannel || !socket) return;

      const messageData = {
        content: gifUrl,
        userId: user.id,
        username: user.username,
        channelId: currentChannel.id,
        type: "gif" as const, // Make sure this is "gif" not "text"
      };

      console.log("📤 Sending GIF message:", gifUrl);
      socket.emit("message:send", messageData);
      setShowGifPicker(false); // Close the picker after sending
    },
    [user, currentChannel, socket]
  );

  const handleImageUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file || !user || !currentChannel || !socket) return;

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert(t.selectImageFile.toString());
        return;
      }

      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t.imageMustBeLessThan.toString());
        return;
      }

      setIsUploadingImage(true);

      try {
        // Convert image to base64
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // Upload to backend
        const response = await fetch(`${API_URL}/api/upload/message-image`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64 }),
        });

        const data = await response.json();

        if (data.success) {
          // Send image message
          const messageData = {
            content: data.image_url,
            userId: user.id,
            username: user.username,
            channelId: currentChannel.id,
            type: "image" as const,
          };

          socket.emit("message:send", messageData);
        } else {
          alert(t.imageUploadFailed + " " + data.message);
        }
      } catch (error) {
        console.error("Image upload error:", error);
        alert("Image upload failed. Please try again.");
      } finally {
        setIsUploadingImage(false);
        // Clear the file input
        if (e.target) e.target.value = "";
      }
    },
    [user, currentChannel, socket, API_URL]
  );

  const handleChannelSettings = useCallback(
    (channel: Channel) => {
      if (!user) {
        console.error("User not found");
        return;
      }
      setSelectedChannelForSettings(channel);
      setShowChannelSettings(true);
      setShowSettings(false);
      setIsChannelSettingsClosing(false); // ADD THIS
      window.history.pushState({}, "", `/channel-settings/${channel.id}`);
    },
    [user]
  );
  const handleCloseChannelSettings = useCallback(() => {
    if (showChannelSettings && !isChannelSettingsClosing) {
      setIsChannelSettingsClosing(true);
      setTimeout(() => {
        setShowChannelSettings(false);
        setSelectedChannelForSettings(null);
        setIsChannelSettingsClosing(false);
        // Navigate back to friends
        navigate("/channels/@me");
      }, 250);
    }
  }, [showChannelSettings, isChannelSettingsClosing, navigate]);

  const handleUpdateChannel = useCallback(
    (updatedChannel: Channel) => {
      setChannels((prev) =>
        prev.map((ch) => (ch.id === updatedChannel.id ? updatedChannel : ch))
      );
      if (currentChannel?.id === updatedChannel.id) {
        setCurrentChannel(updatedChannel);
      }
    },
    [currentChannel?.id]
  );

  const handleDeleteChannel = useCallback(
    (channelId: string) => {
      setChannels((prev) => prev.filter((ch) => ch.id !== channelId));
      if (currentChannel?.id === channelId) {
        setCurrentChannel(null);
        setSelectedChannel("");
        setSelectedTab("friends");
      }

      // ADD THIS - Close settings immediately when channel is deleted
      if (selectedChannelForSettings?.id === channelId) {
        console.log("🚀 Closing settings because channel was deleted");
        setShowChannelSettings(false);
        setSelectedChannelForSettings(null);
        navigate("/channels/@me");
      }
    },
    [
      currentChannel?.id,
      setSelectedChannel,
      selectedChannelForSettings?.id,
      navigate,
    ]
  );
  const handleLogout = useCallback(async () => {
    try {
      console.log("🚪 Starting logout process...");

      // Store user info for potential cleanup before clearing state
      const userId = user?.id;
      const username = user?.username;

      // 1. First, disconnect socket to prevent any new messages
      if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.disconnect();
      }

      localStorage.removeItem("currentChannel");

      // 2. Try to call logout API (but don't block if it fails)
      if (user?.id) {
        try {
          console.log(`📡 Calling logout API for user: ${user.username}`);
          const logoutPromise = fetch(`${API_URL}/api/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });

          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Logout timeout")), 5000)
          );

          await Promise.race([logoutPromise, timeoutPromise]);
          console.log("✅ Logout API call successful");
        } catch (apiError) {
          console.warn(
            "⚠️ Logout API call failed, but continuing with local cleanup:",
            apiError
          );
          // Don't throw - continue with local cleanup
        }
      }

      setSearchQuery("");
      // 3. Clear all local state and storage
      console.log("🧹 Clearing local state and storage...");
      setShowMembersSidebar(false);
      // Clear state in sequence to avoid race conditions
      setMessages([]);
      setChannels([]);
      setCurrentChannel(null);
      setSelectedChannel("");
      setSelectedTab("friends");
      setUsers([]);

      // Clear user state
      setUserState(null);
      setUser(null);
      setIsLoggedIn(false);

      // Clear all storage items
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token"); // If you use tokens
      localStorage.removeItem("currentChannel");
      sessionStorage.clear(); // Clear session storage too

      // Clear any cookies that might be related to auth
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Clear auth-related cookies
        if (
          name.includes("auth") ||
          name.includes("session") ||
          name.includes("token")
        ) {
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });

      // 4. Update page title
      setPageTitle(`Blabber - ${t.login}`);

      console.log("✅ Logout process completed successfully");

      // 5. Optional: Force page reload for complete cleanup (especially for Google OAuth)
      setTimeout(() => {
        // This ensures all components are properly unmounted and state is reset
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 100);
    } catch (error) {
      console.error("❌ Logout error:", error);

      // Emergency cleanup - ensure user can't get stuck
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      sessionStorage.clear();
      setUser(null);
      setIsLoggedIn(false);

      // Force redirect to login
      window.location.href = "/login";
    }
  }, [
    user,
    socket,
    setUser,
    setUsers,
    setSelectedChannel,
    setPageTitle,
    API_URL,
    t.login,
    setMessages,
    setChannels,
    setCurrentChannel,
    setSelectedTab,
    setIsLoggedIn,
    setUserState,
  ]);
  const handleAddFriend = useCallback(async () => {
    try {
      console.log("🚪 Starting logout process...");

      // Store user info for potential cleanup before clearing state
      const userId = user?.id;
      const username = user?.username;

      // 1. First, disconnect socket to prevent any new messages
      if (socket) {
        console.log("🔌 Disconnecting socket...");
        socket.disconnect();
      }

      // 2. Try to call logout API (but don't block if it fails)
      if (user?.id) {
        try {
          console.log(`📡 Calling logout API for user: ${user.username}`);
          const logoutPromise = fetch(`${API_URL}/api/logout`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: user.id }),
          });

          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Logout timeout")), 5000)
          );

          await Promise.race([logoutPromise, timeoutPromise]);
          console.log("✅ Logout API call successful");
        } catch (apiError) {
          console.warn(
            "⚠️ Logout API call failed, but continuing with local cleanup:",
            apiError
          );
          // Don't throw - continue with local cleanup
        }
      }

      // 3. Clear all local state and storage
      console.log("🧹 Clearing local state and storage...");

      // Clear state in sequence to avoid race conditions
      setMessages([]);
      setChannels([]);
      setCurrentChannel(null);
      setSelectedChannel("");
      setSelectedTab("friends");
      setUsers([]);

      // Clear user state
      setUserState(null);
      setUser(null);
      setIsLoggedIn(false);

      // Clear all storage items
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token"); // If you use tokens
      localStorage.removeItem("currentChannel");
      sessionStorage.clear(); // Clear session storage too

      // Clear any cookies that might be related to auth
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name =
          eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        // Clear auth-related cookies
        if (
          name.includes("auth") ||
          name.includes("session") ||
          name.includes("token")
        ) {
          document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
      });

      // 4. Update page title
      setPageTitle(`Blabber - ${t.login}`);

      console.log("✅ Logout process completed successfully");

      // 5. Optional: Force page reload for complete cleanup (especially for Google OAuth)
      setTimeout(() => {
        // This ensures all components are properly unmounted and state is reset
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }, 100);
    } catch (error) {
      console.error("❌ Logout error:", error);

      // Emergency cleanup - ensure user can't get stuck
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("token");
      sessionStorage.clear();
      setUser(null);
      setIsLoggedIn(false);

      // Force redirect to login
      window.location.href = "/login";
    }
  }, [
    user,
    socket,
    setUser,
    setUsers,
    setSelectedChannel,
    setPageTitle,
    API_URL,
    t.login,
    setMessages,
    setChannels,
    setCurrentChannel,
    setSelectedTab,
    setIsLoggedIn,
    setUserState,
  ]);

  const handleDeleteMessage = useCallback(
    async (messageId: string) => {
      if (!user) return;
      try {
        await fetch(`${API_URL}/api/message/${messageId}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (error) {
        console.error("Delete message error:", error);
      }
    },
    [user, API_URL]
  );

  const handleEditMessage = useCallback(
    (messageId: string, newContent: string) => {
      if (!user || !currentChannel || !socket) return;
      console.log(
        `📝 Editing message: ${messageId} with content: ${newContent}`
      );
      socket.emit("message:edited", {
        id: messageId,
        content: newContent,
        channelId: currentChannel.id,
      });
    },
    [user, currentChannel, socket]
  );

  const handleLogin = useCallback(
    (userData: User) => {
      console.log("User logging in:", userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("isAuthenticated", "true"); // ΠΡΟΣΘΗΚΗ ΑΥΤΟΥ
      setUserState(userData);
      setUser(userData);
      setIsLoggedIn(true); // ΠΡΟΣΘΗΚΗ ΑΥΤΟΥ
      setPageTitle(`Blabber - ${t.friends}`);
      setLogoutModal(false);

      if (socket) {
        socket.disconnect();
        socket.connect();

        const joinUser = () => {
          if (socket.connected) {
            socket.emit("user:join", userData, currentChannel?.id || "1");
            console.log("User joined after login:", userData.username);
          } else {
            setTimeout(joinUser, 100);
          }
        };
        joinUser();
      }
    },
    [socket, currentChannel?.id, setUser, setPageTitle, t.friends]
  );

  const handleSendMessage = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (!newMessage.trim() || !user || !currentChannel || !socket) return;

      const messageData = {
        content: newMessage.trim(),
        userId: user.id,
        username: user.username,
        channelId: currentChannel.id,
        type: "text" as const,
      };

      socket.emit("message:send", messageData);
      setNewMessage("");

      setTimeout(() => {
        if (messagesEndRef.current) {
          messagesContainerRef.current?.scrollTo({
            top: messagesContainerRef.current.scrollHeight,
            behavior: "smooth",
          });
        }
      }, 50);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
    },
    [newMessage, user, currentChannel, socket]
  );
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [loadingChannelId, setLoadingChannelId] = useState<string | null>(null);
  const handleTyping = useCallback(() => {
    if (!user || !currentChannel || !socket) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    socket.emit("user:typing", {
      userId: user.id,
      username: user.username,
      channelId: currentChannel.id,
      isTyping: true,
    });

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("user:typing", {
        userId: user.id,
        username: user.username,
        channelId: currentChannel.id,
        isTyping: false,
      });
    }, 3000);
  }, [user, currentChannel, socket]);

  const handleFriendsClick = useCallback(() => {
    setSelectedChannel("");
    setCurrentChannel(null);
    setShowMembersSidebar(false);
    setSelectedTab("friends");
    setSidebarOpen(false);
    refreshFriendRequests();
    localStorage.removeItem("currentChannel");
    setPageTitle(`Blabber - ${t.friends}`);
  }, [setSelectedChannel, setPageTitle]);
  // In your Chat component, add this function

  const handleChannelCreate = useCallback(
    async (
      name: string,
      description: string,
      bgcolor: string,
      image: string = ""
    ) => {
      if (!user) {
        console.error("Cannot create channel: User not logged in");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/channel/create`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name,
            description,
            bgcolor,
            image,
            isPrivate: true,
            createdBy: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create channel");
        }

        const { channel } = await response.json();
        console.log("Channel created:", channel);
        setChannels((prev) => [...prev, channel]);

        setCurrentChannel(channel);
        setSelectedChannel(channel.name);
        setSelectedTab("channel");
        handleChannelSelect(channel);
      } catch (error) {
        console.error("Channel creation error:", error);
        setChannelCreateError("Failed to create channel");
      }
    },
    [user, API_URL, setSelectedChannel]
  );
  const getCallableUsersInChannel = useCallback((): User[] => {
    if (!currentChannel || !onlineUsers) return [];

    // Get all users who are:
    // 1. Members of the current channel
    // 2. Currently online
    // 3. Not the current user
    const callableUsers = onlineUsers.filter(
      (u) =>
        currentChannel.members.includes(u.id) && u.isOnline && u.id !== user?.id
    );

    console.log("📞 Callable users in channel:", {
      channelId: currentChannel.id,
      channelName: currentChannel.name,
      totalMembers: currentChannel.members.length,
      onlineUsers: onlineUsers.length,
      callableUsers: callableUsers.length,
      callableUsersList: callableUsers.map((u) => ({
        id: u.id,
        username: u.username,
        isOnline: u.isOnline,
      })),
    });

    return callableUsers;
  }, [currentChannel, onlineUsers, user?.id]);

  // Updated video call button handler
  // FIND THIS in your handleVideoCallClick:
  const handleVideoCallClick = useCallback(() => {
    setIsAudioCallVar(false);
    const callableUsers = getCallableUsersInChannel();

    if (callableUsers.length === 0) {
      showMessage(
        "error",
        "No online users in this channel to call. Try an audio call or invite someone."
      );
      return;
    }

    console.log("🎥 Video call options:", callableUsers);

    // Prepare recipient data for all callable users
    const recipientIds = callableUsers.map((user) => user.id);
    const recipientData: {
      [key: string]: { username: string; image?: string };
    } = {};

    callableUsers.forEach((user) => {
      recipientData[user.id] = {
        username: user.username,
        image: user.image,
      };
    });

    console.log("📞 Initiating video call to:", callableUsers.length, "users");
    startCall(
      recipientIds, // array of user IDs
      recipientData, // user data object
      false, // audioOnly = false (video call)
      user?.image // current user image
    );
  }, [getCallableUsersInChannel, startCall, showMessage, user?.image]);

  const [members, setMembers] = useState<User[]>([]);
  const fetchChannelMembers = useCallback(async () => {
    if (!currentChannel || !currentChannel.id) {
      console.error("No channel selected or channel has no ID");
      return;
    }

    try {
      console.log(`📥 Fetching members for channel: ${currentChannel.id}`);

      const response = await fetch(
        `${API_URL}/api/channel/${currentChannel.id}/members`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch members");
      }

      console.log(`✅ Fetched ${data.members?.length || 0} members`);

      setMembers(data.members || []);
      console.log(members);
    } catch (error: any) {
      console.error("Fetch members error:", error);
      showMessage("error", error.message || "Failed to fetch members");
    }
  }, [currentChannel, API_URL, showMessage]);
  const handleMembersAllClick = useCallback(() => {
    const wasClosed = !showMembersSidebar;

    if (showMembersSidebar && !isMembersSidebarClosing) {
      setIsMembersSidebarClosing(true);
      setTimeout(() => {
        setShowMembersSidebar(false);
        setIsMembersSidebarClosing(false);
      }, 200);
    }
    if (wasClosed) {
      setShowMembersSidebar(true);
      // If opening the sidebar, fetch members and trigger animations
      fetchChannelMembers();

      // Reset animation states
      setShouldAnimateMembers(false);
      setSidebarAnimationKey((prev) => prev + 1);

      // Small delays to ensure DOM is updated
      setTimeout(() => {
        setShouldAnimateMembers(true);
      }, 100);
    }
  }, [showMembersSidebar, fetchChannelMembers, isMembersSidebarClosing]);

  // Updated audio call button handler
  const handleAudioCallClick = useCallback(() => {
    setIsAudioCallVar(true);
    const callableUsers = getCallableUsersInChannel();

    if (callableUsers.length === 0) {
      showMessage(
        "error",
        "No online users in this channel to call. Invite someone to join."
      );
      return;
    }

    console.log("🎤 Audio call options:", callableUsers);

    // Prepare recipient data for all callable users
    const recipientIds = callableUsers.map((user) => user.id);
    const recipientData: {
      [key: string]: { username: string; image?: string };
    } = {};

    callableUsers.forEach((user) => {
      recipientData[user.id] = {
        username: user.username,
        image: user.image,
      };
    });

    console.log("📞 Initiating audio call to:", callableUsers.length, "users");
    startCall(
      recipientIds, // array of user IDs
      recipientData, // user data object
      true, // audioOnly = true
      user?.image // current user image
    );
  }, [getCallableUsersInChannel, startCall, showMessage, user?.image]);
  useEffect(() => {
    if (!currentChannel) return;

    const callableUsers = getCallableUsersInChannel();

    if (callableUsers.length === 0) {
      console.warn("⚠️ No callable users in current channel");
    } else {
      console.log(`✅ ${callableUsers.length} users available to call`);
    }
  }, [currentChannel, onlineUsers, user?.id, getCallableUsersInChannel]);

  const handleChannelSelect = useCallback(
    (channel: Channel) => {
      console.log("🎯 Channel selected:", channel.name, channel.id);

      if (
        loadingChannelId === channel.id ||
        currentChannel?.id === channel.id
      ) {
        console.log("⏭️ Skipping channel select - same channel or loading");
        return;
      }

      console.log("🔄 Switching to channel:", channel.name);

      // Add transition state
      setIsChannelTransitioning(true);

      // Reset pagination states when switching channels
      setHasMoreMessages(true);
      setIsLoadingOlderMessages(false);
      setOldestMessageId(null);

      // Your existing channel switching logic
      setIsLoadingMessages(true);
      setLoadingChannelId(channel.id);
      setMessages((prev) =>
        prev.filter((msg) => String(msg.channelId) !== String(channel.id))
      );
      setMembers([]);
      setSearchQuery("");
      setShowMembersSidebar(false);
      setSelectedChannel(channel.name);
      setSelectedTab("channel");
      setSidebarOpen(false);

      // Update page title based on channel type
      if (channel.isDM && channel.participants) {
        const otherParticipant = channel.participants.find(
          (p: any) => p.userId !== user?.id
        );
        if (otherParticipant) {
          setPageTitle(`Blabber - ${otherParticipant.username}`);
        }
      } else {
        setPageTitle(`Blabber - @${channel.name}`);
      }

      fetchChannelMembers();

      // Save to localStorage immediately
      localStorage.setItem("currentChannel", JSON.stringify(channel));
      console.log("💾 Saved channel to localStorage:", channel.name);

      if (socket && user) {
        socket.emit("channel:join", channel.id, user.id);
      }

      // End transition after a short delay
      setTimeout(() => {
        setIsChannelTransitioning(false);
        setCurrentChannel(channel);
      }, 300);
    },
    [
      currentChannel?.id,
      user,
      socket,
      loadingChannelId,
      fetchChannelMembers,
      setPageTitle,
    ]
  );
  const handleStartDM = useCallback(
    async (otherUserId: string) => {
      if (!user) {
        console.error("❌ Cannot start DM: User not logged in");
        return;
      }

      // Don't allow DM with yourself
      if (otherUserId === user.id) {
        showMessage("error", "You cannot start a DM with yourself");
        return;
      }

      try {
        console.log(`💬 Starting DM between ${user.id} and ${otherUserId}`);

        const response = await fetch(`${API_URL}/api/channels/direct-message`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId1: user.id,
            userId2: otherUserId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create DM channel");
        }

        if (data.success) {
          console.log(
            `✅ DM channel ${data.isNew ? "created" : "found"}:`,
            data.channel.id
          );

          // Add to channels list if it's new
          if (data.isNew) {
            setChannels((prev) => [...prev, data.channel]);
          } else {
            // Ensure the channel exists in our local state
            setChannels((prev) => {
              const exists = prev.some((ch) => ch.id === data.channel.id);
              if (!exists) {
                return [...prev, data.channel];
              }
              return prev;
            });
          }

          // Select the DM channel
          handleChannelSelect(data.channel);

          // Update page title for DM
          if (data.channel.isDM && data.channel.participants) {
            const otherParticipant = data.channel.participants.find(
              (p: any) => p.userId !== user.id
            );
            if (otherParticipant) {
              setPageTitle(`Blabber - ${otherParticipant.username}`);
            }
          }

          showMessage("success", "Direct message started!");
        }
      } catch (error) {
        console.error("❌ Start DM error:", error);
        showMessage("error", "Failed to start direct message");
      }
    },
    [user, API_URL, handleChannelSelect, setPageTitle, showMessage]
  );
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query);

      if (query.trim() === "") {
        setFilteredChannels([]);
        setFilteredUsers([]);
        setFilteredMessages([]); // ADD THIS LINE
        return;
      }

      const lowerQuery = query.toLowerCase().trim();

      const filteredChans = channels.filter(
        (channel) =>
          channel.name.toLowerCase().includes(lowerQuery) ||
          channel.description?.toLowerCase().includes(lowerQuery)
      );
      setFilteredChannels(filteredChans);

      const filteredUsrs = onlineUsers.filter(
        (user) =>
          user.username.toLowerCase().includes(lowerQuery) ||
          user.email.toLowerCase().includes(lowerQuery)
      );
      setFilteredUsers(filteredUsrs);

      // ADD THIS BLOCK - Filter messages
      const filteredMsgs = channelMessages.filter(
        (message) =>
          message.type === "text" &&
          message.content.toLowerCase().includes(lowerQuery)
      );
      setFilteredMessages(filteredMsgs);
    },
    [channels, onlineUsers, channelMessages] // ADD channelMessages to dependencies
  );

  const handleClearChannelError = useCallback(() => {
    setChannelCreateError("");
  }, []);

  const getIsFirstMessageOfDay = useCallback(
    (messages: MessageType[], currentIndex: number) => {
      if (currentIndex === 0) return true;
      const currentMessage = messages[currentIndex];
      const previousMessage = messages[currentIndex - 1];
      const currentDate = new Date(currentMessage.timestamp);
      const previousDate = new Date(previousMessage.timestamp);

      return (
        currentDate.getDate() !== previousDate.getDate() ||
        currentDate.getMonth() !== previousDate.getMonth() ||
        currentDate.getFullYear() !== previousDate.getFullYear()
      );
    },
    []
  );

  const getIsFirstMessageOfChannel = useCallback(
    (messages: MessageType[], currentIndex: number) => {
      return currentIndex === 0;
    },
    []
  );

  const getisSameMinuteAsPrev = useCallback(
    (messages: MessageType[], currentIndex: number) => {
      if (currentIndex === 0) return false;
      const currentMessage = messages[currentIndex];
      const previousMessage = messages[currentIndex - 1];
      const currentDate = new Date(currentMessage.timestamp);
      const previousDate = new Date(previousMessage.timestamp);

      return (
        currentMessage.userId === previousMessage.userId &&
        currentDate.getMinutes() === previousDate.getMinutes() &&
        currentDate.getHours() === previousDate.getHours() &&
        currentDate.getDate() === previousDate.getDate() &&
        currentDate.getMonth() === previousDate.getMonth() &&
        currentDate.getFullYear() === previousDate.getFullYear()
      );
    },
    []
  );
  const EmptyState = useMemo(
    () => (
      <div
        className="d-flex align-items-center justify-content-center"
        style={{
          height: "92.5%",
          width: "100%",
          minHeight: "200px",
        }}
      >
        <div className="text-center py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="#ffffff77"
            className="bi bi-envelope text-white mb-3"
            viewBox="0 0 16 16"
          >
            <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1zm13 2.383-4.708 2.825L15 11.105zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741M1 11.105l4.708-2.897L1 5.383z" />
          </svg>

          <p className="text-white m-0 small">{t.noFriendRequests}</p>
        </div>
      </div>
    ),
    [t]
  );
  // Effects
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserState(userData);
        setUser(userData);
        console.log("Loaded user from localStorage:", userData.username);
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem("user");
      }
    }
  }, [setUser]);

  useEffect(() => {
    const handleRouteChange = () => {
      if (window.location.pathname === "/settings" && user) {
        setShowSettings(true);
        setShowChannelSettings(false);
      } else if (
        window.location.pathname.includes("/channel-settings") &&
        user
      ) {
        setShowChannelSettings(true);
        setShowSettings(false);
      } else {
        setShowSettings(false);
        setShowChannelSettings(false);
        setSelectedChannelForSettings(null); // ADD THIS
      }
    };

    window.addEventListener("popstate", handleRouteChange);
    handleRouteChange();
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [user]);
  // ADD THIS EFFECT - Handle browser back button
  useEffect(() => {
    const handleBackButton = () => {
      if (showChannelSettings) {
        console.log("🔙 Back button pressed, closing channel settings");
        handleCloseChannelSettings();
      }
    };

    window.addEventListener("popstate", handleBackButton);
    return () => {
      window.removeEventListener("popstate", handleBackButton);
    };
  }, [showChannelSettings, handleCloseChannelSettings]);

  useEffect(() => {
    if (!socket) return;

    const handleUnreadUpdate = (data: { channelId: string; count: number }) => {
      console.log(
        `🔔 Unread update: Channel ${data.channelId} has ${data.count} unread messages`
      );
      setUnreadCounts((prev) => ({
        ...prev,
        [data.channelId]: data.count,
      }));
    };

    socket.on("unread:update", handleUnreadUpdate);

    return () => {
      socket.off("unread:update", handleUnreadUpdate);
    };
  }, [socket]);
  // Add this function in Chat.tsx - place it with your other callback functions
  // Around line 1800-1900, with your other useCallbacks

  const onMarkAsSeen = useCallback(
    async (messageId: string) => {
      if (!user || !currentChannel || !socket) return;

      try {
        console.log(
          `👀 Marking message ${messageId} as seen by user ${user.id}`
        );

        // Emit socket event to notify server
        (socket as any).emit("message:seen", {
          messageId,
          userId: user.id,
          username: user.username,
          channelId: currentChannel.id,
          timestamp: new Date(),
        });

        // Optional: Also call the API endpoint for persistence
        await fetch(`${API_URL}/api/message/${messageId}/seen`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
      } catch (error) {
        console.error("Error marking message as seen:", error);
      }
    },
    [user, currentChannel, socket, API_URL]
  );
  // REPLACE THIS useEffect in Chat.tsx
  useEffect(() => {
    if (currentChannel?.id) {
      // Clear unread count for current channel when viewing it
      setUnreadCounts((prev) => ({
        ...prev,
        [currentChannel.id]: 0,
      }));

      // Mark all messages in this channel as seen
      const messages = channelMessages.filter(
        (msg) => !msg.seenBy?.some((seen) => seen.userId === user?.id)
      );

      messages.forEach((msg) => {
        if (onMarkAsSeen) {
          onMarkAsSeen(msg.id);
        }
      });
    }
  }, [currentChannel?.id, user?.id, channelMessages]);

  const handleChannelJoined = useCallback(
    (channel: Channel) => {
      console.log("✅ Successfully joined channel:", channel);
      setChannels((prev) => {
        const exists = prev.some((c) => c.id === channel.id);
        if (exists) return prev;
        return [...prev, channel];
      });
      setCurrentChannel(channel);
      setSelectedChannel(channel.name);
      setSelectedTab("channel");
      setPageTitle(`Blabber - @${channel.name}`);

      // CRITICAL: Clear messages immediately when joining new channel
      setMessages([]);
    },
    [setSelectedChannel, setPageTitle]
  );
  const isChangingChannelRef = useRef(false);
  const lastChannelIdRef = useRef<string | null>(null);

  // Then in your socket useEffect, use it like this:
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      console.log("✅ Socket connected");
      if (user) {
        socket.emit("user:join", user, currentChannel?.id || "1");
      }
    };

    const handleMessageHistory = (messageHistory: MessageType[]) => {
      // Only process if we're loading this specific channel
      if (loadingChannelId === currentChannel?.id) {
        setIsLoadingMessages(false);
        setLoadingChannelId(null);

        setMessages(messageHistory);

        // Set oldest message ID for pagination
        if (messageHistory.length > 0) {
          const oldestId = messageHistory[0].id;
          setOldestMessageId(oldestId);
          console.log(`📌 Initial oldest message ID: ${oldestId}`);
        }

        // Check if there might be more messages
        setHasMoreMessages(messageHistory.length === 50);

        console.log(
          `✅ Loaded ${messageHistory.length} initial messages, hasMore: ${
            messageHistory.length === 50
          }`
        );
      }
    };

    const handleMessageReceive = (message: MessageType) => {
      console.log("📨 Message received:", {
        id: message.id,
        channelId: message.channelId,
        currentChannelId: currentChannel?.id,
      });

      // Only add message if it's for the current channel AND doesn't exist
      if (String(message.channelId) === String(currentChannel?.id)) {
        setMessages((prev) => {
          // Check for duplicates before adding
          const messageExists = prev.some((m) => m.id === message.id);
          if (messageExists) {
            console.log("🚫 Message already exists, skipping");
            return prev;
          }

          // Use functional update to avoid stale state
          return [...prev, message];
        });
      }
    };

    const handleMessageDeleted = (data: {
      messageId: string;
      channelId: string;
    }) => {
      console.log("🗑️ Message deleted:", data.messageId);
      setMessages((prev) => prev.filter((m) => m.id !== data.messageId));
    };

    const handleMessageUpdated = (message: MessageType) => {
      console.log("📝 Message updated:", message);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? message : m))
      );
    };

    const handleChannelList = (channelList: Channel[]) => {
      console.log("📋 Received channel list:", channelList.length);
      setChannels(channelList);
    };

    const handleUserOnline = (users: User[]) => {
      console.log("👥 Online users updated:", users.length);
      setOnlineUsers(users);
      setUsers(users);
    };

    const handleChannelJoined = (channel: Channel) => {
      console.log("✅ Successfully joined channel:", channel);

      // Only add to channels list if it doesn't exist
      setChannels((prev) => {
        const exists = prev.some((c) => c.id === channel.id);
        if (exists) return prev;
        return [...prev, channel];
      });

      // DON'T automatically set current channel here - this was causing the loop
      console.log(
        "ℹ️ Channel joined event received, but not changing current channel"
      );
    };

    const handleMessageBatch = (data: MessageBatch) => {
      console.log(`📦 Received batch of ${data.batchSize} messages`);

      // Add batched messages to current messages
      setMessages((prev) => {
        const newMessages = [...prev];
        const existingIds = new Set(prev.map((m) => m.id));

        data.messages.forEach((message: any) => {
          if (!existingIds.has(message.id)) {
            const fullMessage: MessageType = {
              ...message,
              seenBy: message.seenBy || [],
              deliveredTo: message.deliveredTo || [],
            };
            newMessages.push(fullMessage);
          }
        });

        return newMessages;
      });
    };
    const handleDMChannelCreated = (data: {
      channel: Channel;
      participants: string[];
    }) => {
      console.log("📨 DM channel created event received:", data.channel.id);

      // Only add to our channels if we're one of the participants
      if (data.participants.includes(user?.id || "")) {
        setChannels((prev) => {
          const exists = prev.some((c) => c.id === data.channel.id);
          if (exists) return prev;
          console.log("✅ Adding DM channel to local state:", data.channel.id);
          return [...prev, data.channel];
        });
      }
    };
    // Socket event listeners
    socket.on("connect", handleConnect);
    socket.on("message:receive", handleMessageReceive);
    socket.on("message:history", handleMessageHistory);
    socket.on("message:deleted", handleMessageDeleted);
    socket.on("channel:list", handleChannelList);
    socket.on("user:online", handleUserOnline);
    socket.on("channel:joined", handleChannelJoined);
    socket.on("message:updated", handleMessageUpdated);
    socket.on("message:batch", handleMessageBatch);
    socket.on("dm:channel:created", handleDMChannelCreated);
    // In the socket event handler for "user:online", add:

    return () => {
      console.log("🧹 Cleaning up socket listeners");
      socket.off("connect", handleConnect);
      socket.off("message:receive", handleMessageReceive);
      socket.off("message:history", handleMessageHistory);
      socket.off("message:deleted", handleMessageDeleted);
      socket.off("channel:list", handleChannelList);
      socket.off("user:online", handleUserOnline);
      socket.off("channel:joined", handleChannelJoined);
      socket.off("message:updated", handleMessageUpdated);
      socket.off("message:batch", handleMessageBatch);
      socket.off("dm:channel:created", handleDMChannelCreated);
    };
  }, [socket, user, currentChannel?.id, isLoadingMessages, loadingChannelId]); // Only these dependencies
  // Clean up loading states when component unmounts or user changes
  useEffect(() => {
    return () => {
      setIsLoadingMessages(false);
      setLoadingChannelId(null);
    };
  }, []);

  // Reset loading when user changes
  useEffect(() => {
    setIsLoadingMessages(false);
    setLoadingChannelId(null);
  }, [user?.id]);
  useEffect(() => {
    if (window.location.pathname === "/settings" && user) {
      setShowSettings(true);
    }
  }, [user]);

  useEffect(() => {
    if (user && socket?.connected) {
      const pendingInvite = localStorage.getItem("pendingInvite");
      if (pendingInvite) {
        console.log("Redirecting to pending invite:", pendingInvite);
        localStorage.removeItem("pendingInvite");
        navigate(`/invite/${pendingInvite}`);
        return;
      }
    }
  }, [user, socket?.connected, navigate]);

  useEffect(() => {
    const location = window.location;
    const navigationState = (window.history.state as any)?.usr;

    if (navigationState?.joinedChannel && user && socket?.connected) {
      const { channelId } = navigationState.joinedChannel;
      console.log("Processing channel join from invite:", channelId);
      socket.emit("channel:join", channelId, user.id);
      const newState = { ...window.history.state };
      delete newState.usr;
      window.history.replaceState(newState, document.title);
    }
  }, [user, socket?.connected]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle]);

  useEffect(() => {
    if (user && socket) {
      if (!socket.connected) {
        socket.connect();
      }
      socket.emit("user:join", user, currentChannel?.id || "1");
      console.log("User joined in useEffect:", user.username);
    }
  }, [user, socket, currentChannel?.id]);

  useEffect(() => {
    return () => {
      // Reset all refs and states when component unmounts
      isChangingChannelRef.current = false;
      lastChannelIdRef.current = null;
      setIsLoadingMessages(false);
      setLoadingChannelId(null);
    };
  }, []);
  // Add this useEffect to handle scroll position when loading older messages
  useEffect(() => {
    if (isLoadingOlderMessages && messagesContainerRef.current) {
      // Save current scroll position and height
      const container = messagesContainerRef.current;
      const previousScrollHeight = container.scrollHeight;

      // After messages load, maintain scroll position
      const maintainScrollPosition = () => {
        if (container && !isLoadingOlderMessages) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - previousScrollHeight;
        }
      };

      // Use a small timeout to ensure DOM is updated
      setTimeout(maintainScrollPosition, 100);
    }
  }, [isLoadingOlderMessages]);
  // Replace your current scroll useEffect with this:
  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current && messagesContainerRef.current) {
        const container = messagesContainerRef.current;
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          100;

        // Only auto-scroll if:
        // 1. It's initial load OR
        // 2. User is near bottom OR
        // 3. It's a new message in current channel
        if (isInitialLoad || isNearBottom) {
          messagesEndRef.current.scrollIntoView({
            behavior: isInitialLoad ? "auto" : "smooth",
            block: "end",
          });
        }
      }
    };

    // Use requestAnimationFrame for better timing
    requestAnimationFrame(() => {
      setTimeout(scrollToBottom, 100);
    });
  }, [channelMessages, isInitialLoad]); // Only depend on these

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: currentChannel?.id ? "auto" : "smooth",
        block: "end",
      });
    }
  }, [channelMessages, currentChannel?.id]);

  useEffect(() => {
    if (messagesEndRef.current && !isLoadingOlderMessages) {
      const container = messagesContainerRef.current;
      if (container) {
        // Check if user is near the bottom (within 200px)
        const isNearBottom =
          container.scrollHeight -
            container.scrollTop -
            container.clientHeight <
          200;

        // Only auto-scroll if near bottom or it's initial load
        if (isNearBottom || isInitialLoad) {
          messagesEndRef.current.scrollIntoView({
            behavior: isInitialLoad ? "auto" : "smooth",
            block: "end",
          });
        }
      }
    }
  }, [channelMessages, isLoadingOlderMessages, isInitialLoad]);
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      setHasMoreMessages(true);
      setIsLoadingOlderMessages(false);
      setOldestMessageId(null);
    };
  }, []);

  // In your Chat component, replace the problematic functions:

  // Mark message as seen - WITH TYPE SAFETY
  const handleMarkAsSeen = useCallback(
    async (messageId: string) => {
      if (!user || !socket || !currentChannel) return;

      try {
        const message = messages.find((m) => m.id === messageId);
        if (message && message.userId === user.id) return;

        // Use type assertion to bypass TypeScript checking
        (socket as any).emit("message:seen", {
          messageId,
          userId: user.id,
          channelId: currentChannel.id,
        });

        console.log(
          `👀 Marking message ${messageId} as seen by ${user.username}`
        );
      } catch (error) {
        console.error("Error marking message as seen:", error);
      }
    },
    [user, socket, currentChannel, messages]
  );

  useEffect(() => {
    if (channelMessages.length > 0 && isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [channelMessages, isInitialLoad]);

  // Reset when channel changes
  useEffect(() => {
    setIsInitialLoad(true);
  }, [currentChannel?.id]);
  // Handle socket event for message seen - WITH TYPE SAFETY
  useEffect(() => {
    if (!socket) return;

    const handleMessageSeen = (data: {
      messageId: string;
      userId: string;
      username: string;
      timestamp: Date;
      channelId: string;
    }) => {
      if (data.channelId === currentChannel?.id) {
        setMessages((prev) =>
          prev.map((msg) => {
            if (msg.id === data.messageId) {
              const seenBy = msg.seenBy || [];
              const alreadySeen = seenBy.some(
                (seen) => seen.userId === data.userId
              );

              if (!alreadySeen) {
                return {
                  ...msg,
                  seenBy: [
                    ...seenBy,
                    {
                      userId: data.userId,
                      timestamp: data.timestamp,
                    },
                  ],
                };
              }
            }
            return msg;
          })
        );
      }
    };

    (socket as any).on("message:seen", handleMessageSeen);

    return () => {
      (socket as any).off("message:seen", handleMessageSeen);
    };
  }, [socket, currentChannel?.id]);

  // Get channel members for seen status
  const channelMembers = useMemo(() => {
    if (!currentChannel) return [];
    return onlineUsers.filter((user) =>
      currentChannel.members.includes(user.id)
    );
  }, [currentChannel, onlineUsers]);

  // Safe message rendering function with null checks
  const renderMessage = useCallback(
    (message: MessageType, index: number) => {
      const isLastMessageInChannel = index === memoizedMessages.length - 1;

      if (!user) return null;

      // Early return for loading state
      const shouldShowSkeleton =
        isLoadingMessages &&
        loadingChannelId === currentChannel?.id &&
        index < 5;

      if (shouldShowSkeleton) {
        return (
          <div
            key={`skeleton-${message.id}-${index}`}
            className="message-skeleton"
          >
            {/* Your skeleton JSX here */}
          </div>
        );
      }

      return (
        <motion.div
          key={`${message.id}-${message.timestamp}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          layout // This makes messages animate to their new positions
        >
          <Message
            key={`${message.id}-${message.timestamp}`}
            message={message}
            isOwn={message.userId === user.id}
            messageUser={getUserById(message.userId)}
            isFirstMessageOfDay={getIsFirstMessageOfDay(channelMessages, index)}
            isFirstMessageOfChannel={getIsFirstMessageOfChannel(
              channelMessages,
              index
            )}
            isLastMessageInChannel={isLastMessageInChannel}
            isSameMinuteAsPrev={getisSameMinuteAsPrev(channelMessages, index)}
            onDelete={handleDeleteMessage}
            onEdit={handleEditMessage}
            currentUserId={user.id}
            channelMembers={channelMembers}
            onMarkAsSeen={onMarkAsSeen}
            isLoading={false}
          />
        </motion.div>
      );
    },
    [
      user,
      channelMessages,
      getUserById,
      getIsFirstMessageOfDay,
      getIsFirstMessageOfChannel,
      getisSameMinuteAsPrev,
      handleDeleteMessage,
      handleEditMessage,
      handleMarkAsSeen,
      channelMembers,
      isLoadingMessages,
      loadingChannelId,
      currentChannel?.id,
    ]
  );

  // Early returns
  if (!user) {
    return (
      <div
        className="fullscreen-login"
        style={{ position: "relative", minHeight: "100vh" }}
      >
        <div
          id="background-image-obj"
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
            filter: "blur(6px) brightness(0.6)",
            opacity: 0.2,
            zIndex: 0,
          }}
        ></div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Login onLogin={handleLogin} />
        </div>
      </div>
    );
  }

  if (showChannelSettings && selectedChannelForSettings) {
    if (!user) return <div>Loading...</div>;
    return (
      <ChannelSettings
        user={user}
        channel={selectedChannelForSettings}
        onUpdateChannel={handleUpdateChannel}
        onDeleteChannel={handleDeleteChannel}
        onCloseSettings={handleCloseChannelSettings} // ADD THIS
      />
    );
  }

  if (showSettings && user) {
    return (
      <Settings
        user={user}
        onUpdateUser={(updatedUser) => {
          setUserState(updatedUser);
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }}
      />
    );
  }
  return (
    <div className="fullscreen-chat">
      {/* Mobile Sidebar Toggle */}

      {window.innerWidth < 768 && (
        <>
          {/*!sidebarOpen && <div className="swipe-indicator" /> */}
          <SwipeHint
            show={showSwipeHint && !sidebarOpen}
            onHide={() => setShowSwipeHint(false)}
          />
        </>
      )}

      {/* Video Call Modal */}
      {incomingCall && (
        <VideoCallModal
          incomingCall={incomingCall}
          onAnswer={answerCall}
          onReject={rejectCall}
          onEndCall={endCall}
          callState={callState}
          remoteVideoRef={remoteVideoRef as React.RefObject<HTMLVideoElement>} // ✅ Add assertion
          localVideoRef={localVideoRef as React.RefObject<HTMLVideoElement>} // ✅ Add assertion
          remoteStreams={remoteStreams}
          remoteUsername={remoteUsername}
          remoteChannelName={remoteChannelName}
          remoteChannelImage={remoteChannelImage}
          remoteImage={remoteImage}
          callError={callError}
          isAudioCallVar={isAudioCallVar}
          remoteIsDMChannel={remoteIsDMChannel}
          localStream={localStream}
          isAudioOnly={isAudioOnly}
          isDMChannel={currentChannel?.isDM}
          user={user}
          dmchannelName={
            currentChannel?.isDM && currentChannel?.participants
              ? currentChannel.participants.find((p) => p.userId !== user?.id)
                  ?.username
              : "unknown"
          }
          dmchannelImage={
            currentChannel?.isDM && currentChannel?.participants
              ? currentChannel.participants.find((p) => p.userId !== user?.id)
                  ?.image || "/default-avatar.png"
              : "/default-avatar.png"
          }
          participantData={participantData}
        />
      )}

      {callState !== "idle" && (
        <VideoCallModal
          incomingCall={incomingCall}
          onAnswer={answerCall}
          onReject={rejectCall}
          onEndCall={endCall}
          callState={callState}
          remoteVideoRef={remoteVideoRef as React.RefObject<HTMLVideoElement>} // ✅ Add assertion
          localVideoRef={localVideoRef as React.RefObject<HTMLVideoElement>} // ✅ Add assertion
          remoteStreams={remoteStreams}
          remoteUsername={remoteUsername}
          isAudioCallVar={isAudioCallVar}
          remoteChannelName={remoteChannelName}
          remoteChannelImage={remoteChannelImage}
          remoteImage={remoteImage}
          dmchannelImage={
            currentChannel?.isDM && currentChannel?.participants
              ? currentChannel.participants.find((p) => p.userId !== user?.id)
                  ?.image || "/default-avatar.png"
              : "/default-avatar.png"
          }
          dmchannelName={
            currentChannel?.isDM && currentChannel?.participants
              ? currentChannel.participants.find((p) => p.userId !== user?.id)
                  ?.username
              : "unknown"
          }
          callError={callError}
          localStream={localStream}
          isDMChannel={currentChannel?.isDM}
          isAudioOnly={isAudioOnly}
          user={user}
          participantData={participantData}
        />
      )}
      {/* Sidebar */}
      {window.innerWidth >= 769 ? (
        <div className="sidebar">
          <div className="sidebar-content">
            {/* Channels Section */}

            <div className="channels-section">
              <Link
                to={`/channels/@me`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.div
                  onClick={handleFriendsClick}
                  className={`friends-channel main_logo d-flex align-items-end justify-content-center p-2 cursor-pointer rounded-5 m-0 ${
                    selectedTab === "friends" && window.innerWidth >= 768
                      ? "active"
                      : ""
                  }${window.innerWidth >= 768 ? "" : "active_mob"}`}
                  animate={
                    selectedTab !== "friends" && window.innerWidth >= 768
                      ? { y: [0, -4, 0] }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat:
                      selectedTab !== "friends" && window.innerWidth >= 768
                        ? Infinity
                        : 0,
                    ease: "easeInOut",
                  }}
                >
                  <img src={logo} width="44" height="44" alt="Friends" />
                  <div>
                    <h4>Blabber</h4>
                  </div>
                </motion.div>
              </Link>
              <hr />
              <div>
                <div className="d-flex gap-2 text-capitalize align-items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-megaphone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                  </svg>
                  <div>
                    <h5 className="fs-6 m-0">{t.directChannels}</h5>
                  </div>
                </div>
                <div className="channels-list">
                  <ChannelList
                    channels={channels}
                    currentChannel={currentChannel}
                    onChannelSelect={handleChannelSelect}
                    onChannelCreate={handleChannelCreate}
                    // ADD THESE:
                    channelCreateError={channelCreateError}
                    onClearChannelError={handleClearChannelError}
                    onChannelSettings={handleChannelSettings} // ADD THIS LIN
                    unreadCounts={unreadCounts} // ADD THIS LINE
                    currentUser={user}
                  />
                </div>
              </div>
            </div>

            {/* User Section */}
            <div className="user-section mt-3">
              <div className="user-info-card px-2 p-2 rounded-5 cursor-auto d-flex align-items-center gap-2 position-relative">
                <div className="d-flex user-info-main align-items-center gap-2 flex-grow-1 p-1 rounded-5">
                  <div className="position-relative flex-shrink-0">
                    {getUserById(user.id)?.image ? (
                      <img
                        src={getUserById(user.id)?.image}
                        width="40"
                        height="40"
                        className="rounded-circle"
                        alt="User"
                        style={{
                          objectFit: "cover",
                          filter: "drop-shadow(0 0 0.2rem #00000031)",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#292929ff",
                          width: "40px",
                          height: "40px",
                          filter: "drop-shadow(0 0 0.2rem #00000031)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 16 16"
                          style={{
                            fill: "#ffffff",
                            display: "block",
                          }}
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    )}

                    <motion.div
                      animate={{
                        backgroundColor: user.isOnline
                          ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                          : "#6c757d",
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: user.isOnline ? Infinity : 0,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="position-absolute rounded-circle border border-2 border-dark"
                      style={{
                        width: "12px",
                        height: "12px",
                        bottom: "0",
                        right: "0",
                      }}
                    ></motion.div>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-1 mb-0">
                      <span
                        className="fw-semibold text-white text-truncate"
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.2",
                          maxWidth: "100px",
                        }}
                      >
                        {user.username}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <motion.div
                        animate={{
                          color: user.isOnline
                            ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                            : "#6c757d",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: user.isOnline ? Infinity : 0,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="text-truncate"
                        style={{
                          fontSize: "0.75rem",
                          color: user.isOnline ? "#20b92d" : "#6c757d",
                          maxWidth: "100px",
                        }}
                      >
                        {user.isOnline ? t.online : t.offline}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="relative">
                  <button
                    className="btn d-flex rounded-circle align-items-center justify-content-center p-1 flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "rgba(179, 25, 25, 1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(133, 17, 17, 1)";
                      setShowLogoutTooltip(true);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
                      setShowLogoutTooltip(false);
                    }}
                    onClick={() => {
                      setLogoutModal(true);
                      setShowLogoutTooltip(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" // Reduced from 18 to 16 for better fit
                      height="16" // Reduced from 18 to 16 for better fit
                      fill="white"
                      className="bi bi-box-arrow-left"
                      viewBox="0 0 16 16"
                      style={{
                        display: "block", // Ensures no extra space
                        margin: "0 auto", // Center the icon
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                      />
                    </svg>
                    {showLogoutTooltip && window.innerWidth >= 768 && (
                      <div className="custom-tooltip-logout rounded-5">
                        {t.logout}
                      </div>
                    )}
                  </button>
                </div>

                {/* Settings Button */}

                <div className="relative">
                  <button
                    id="settings_but_circle"
                    className="btn d-flex rounded-circle align-items-center justify-content-center p-1 flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "1px solid rgba(255, 255, 255, 0.24)",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.2)";
                      setShowSettingsTooltip(true);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                      setShowSettingsTooltip(false);
                    }}
                    onClick={() => {
                      navigate("/settings");
                      setShowSettings(true);
                      setShowSettingsTooltip(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" // Reduced from 18 to 16 for better fit
                      height="16" // Reduced from 18 to 16 for better fit
                      fill="white"
                      viewBox="0 0 16 16"
                      style={{
                        display: "block", // Ensures no extra space
                        margin: "0 auto", // Center the icon
                      }}
                    >
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>
                    {showSettingsTooltip && window.innerWidth >= 768 && (
                      <div className="custom-tooltip-settings rounded-5">
                        {t.settings}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          className="sidebar"
          initial={false}
          animate={isSwiping ? false : sidebarOpen ? "open" : "closed"} // DISABLE ANIMATION WHILE SWIPING
          variants={{
            open: { x: 0 },
            closed: { x: -window.innerWidth },
          }}
          transition={{
            type: "spring",
            stiffness: 500, // Increased from 300 to 500 for faster response
            damping: 25, // Reduced from 30 to 25 for less resistance
            mass: 0.3,
          }}
          style={{
            width: "79.5vw",
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1001,
            borderRadius: "0px 40px 40px 0px",
            borderRight: "1px solid rgba(255, 255, 255, 0.2)",
            background:
              "linear-gradient(40deg, #0630169c 0%, #0630169c 35%, #0630169c 70%, #0630169c 100%)",
            backdropFilter: "blur(30px)",
          }}
        >
          <div className="sidebar-content">
            {/* Channels Section */}

            <div className="channels-section">
              <Link
                to={`/channels/@me`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <motion.div
                  onClick={handleFriendsClick}
                  className={`friends-channel main_logo d-flex align-items-end justify-content-center p-2 cursor-pointer rounded-5 m-0 ${
                    selectedTab === "friends" && window.innerWidth >= 768
                      ? "active"
                      : ""
                  }${window.innerWidth >= 768 ? "" : "active_mob"}`}
                  animate={
                    selectedTab !== "friends" && window.innerWidth >= 768
                      ? { y: [0, -4, 0] }
                      : {}
                  }
                  transition={{
                    duration: 2,
                    repeat:
                      selectedTab !== "friends" && window.innerWidth >= 768
                        ? Infinity
                        : 0,
                    ease: "easeInOut",
                  }}
                >
                  <img src={logo} width="44" height="44" alt="Friends" />
                  <div>
                    <h4>Blabber</h4>
                  </div>
                </motion.div>
              </Link>
              <hr />
              <div>
                <div className="d-flex gap-2 text-capitalize align-items-center mb-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="white"
                    className="bi bi-megaphone-fill"
                    viewBox="0 0 16 16"
                  >
                    <path d="M13 2.5a1.5 1.5 0 0 1 3 0v11a1.5 1.5 0 0 1-3 0zm-1 .724c-2.067.95-4.539 1.481-7 1.656v6.237a25 25 0 0 1 1.088.085c2.053.204 4.038.668 5.912 1.56zm-8 7.841V4.934c-.68.027-1.399.043-2.008.053A2.02 2.02 0 0 0 0 7v2c0 1.106.896 1.996 1.994 2.009l.496.008a64 64 0 0 1 1.51.048m1.39 1.081q.428.032.85.078l.253 1.69a1 1 0 0 1-.983 1.187h-.548a1 1 0 0 1-.916-.599l-1.314-2.48a66 66 0 0 1 1.692.064q.491.026.966.06" />
                  </svg>
                  <div>
                    <h5 className="fs-6 m-0">{t.directChannels}</h5>
                  </div>
                </div>
                <div className="channels-list">
                  <ChannelList
                    channels={channels}
                    currentChannel={currentChannel}
                    onChannelSelect={handleChannelSelect}
                    onChannelCreate={handleChannelCreate}
                    // ADD THESE:
                    channelCreateError={channelCreateError}
                    onClearChannelError={handleClearChannelError}
                    onChannelSettings={handleChannelSettings} // ADD THIS LIN
                    unreadCounts={unreadCounts} // ADD THIS LINE
                    currentUser={user}
                  />
                </div>
              </div>
            </div>

            {/* User Section */}
            <div className="user-section mt-3">
              <div className="user-info-card px-2 p-2 rounded-5 cursor-auto d-flex align-items-center gap-2 position-relative">
                <div className="d-flex user-info-main align-items-center gap-2 flex-grow-1 p-1 rounded-5">
                  <div className="position-relative flex-shrink-0">
                    {getUserById(user.id)?.image ? (
                      <img
                        src={getUserById(user.id)?.image}
                        width="40"
                        height="40"
                        className="rounded-circle"
                        alt="User"
                        style={{
                          objectFit: "cover",
                          filter: "drop-shadow(0 0 0.2rem #00000031)",
                        }}
                      />
                    ) : (
                      <div
                        className="rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                          backgroundColor: "#292929ff",
                          width: "40px",
                          height: "40px",
                          filter: "drop-shadow(0 0 0.2rem #00000031)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="22"
                          height="22"
                          viewBox="0 0 16 16"
                          style={{
                            fill: "#ffffff",
                            display: "block",
                          }}
                        >
                          <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                        </svg>
                      </div>
                    )}

                    <motion.div
                      animate={{
                        backgroundColor: user.isOnline
                          ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                          : "#6c757d",
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: user.isOnline ? Infinity : 0,
                        repeatType: "reverse",
                        ease: "easeInOut",
                      }}
                      className="position-absolute rounded-circle border border-2 border-dark"
                      style={{
                        width: "12px",
                        height: "12px",
                        bottom: "0",
                        right: "0",
                      }}
                    ></motion.div>
                  </div>

                  <div className="flex-grow-1 min-w-0">
                    <div className="d-flex align-items-center gap-1 mb-0">
                      <span
                        className="fw-semibold text-white text-truncate"
                        style={{
                          fontSize: "0.95rem",
                          lineHeight: "1.2",
                          maxWidth: "100px",
                        }}
                      >
                        {user.username}
                      </span>
                    </div>
                    <div className="d-flex align-items-center gap-1">
                      <motion.div
                        animate={{
                          color: user.isOnline
                            ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                            : "#6c757d",
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: user.isOnline ? Infinity : 0,
                          repeatType: "reverse",
                          ease: "easeInOut",
                        }}
                        className="text-truncate"
                        style={{
                          fontSize: "0.75rem",
                          color: user.isOnline ? "#20b92d" : "#6c757d",
                          maxWidth: "100px",
                        }}
                      >
                        {user.isOnline ? t.online : t.offline}
                      </motion.div>
                    </div>
                  </div>
                </div>

                {/* Logout Button */}
                <div className="relative">
                  <button
                    className="btn d-flex rounded-circle align-items-center justify-content-center p-1 flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      background: "rgba(179, 25, 25, 1)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(133, 17, 17, 1)";
                      setShowLogoutTooltip(true);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
                      setShowLogoutTooltip(false);
                    }}
                    onClick={() => {
                      setLogoutModal(true);
                      setShowLogoutTooltip(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" // Reduced from 18 to 16 for better fit
                      height="16" // Reduced from 18 to 16 for better fit
                      fill="white"
                      className="bi bi-box-arrow-left"
                      viewBox="0 0 16 16"
                      style={{
                        display: "block", // Ensures no extra space
                        margin: "0 auto", // Center the icon
                      }}
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                      />
                    </svg>
                    {showLogoutTooltip && window.innerWidth >= 768 && (
                      <div className="custom-tooltip-logout rounded-5">
                        {t.logout}
                      </div>
                    )}
                  </button>
                </div>

                {/* Settings Button */}

                <div className="relative">
                  <button
                    id="settings_but_circle"
                    className="btn d-flex rounded-circle align-items-center justify-content-center p-1 flex-shrink-0"
                    style={{
                      width: "28px",
                      height: "28px",
                      border: "1px solid rgba(255, 255, 255, 0.24)",
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "8px",
                      transition: "all 0.2s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.2)";
                      setShowSettingsTooltip(true);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                      setShowSettingsTooltip(false);
                    }}
                    onClick={() => {
                      navigate("/settings");
                      setShowSettings(true);
                      setShowSettingsTooltip(false);
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16" // Reduced from 18 to 16 for better fit
                      height="16" // Reduced from 18 to 16 for better fit
                      fill="white"
                      viewBox="0 0 16 16"
                      style={{
                        display: "block", // Ensures no extra space
                        margin: "0 auto", // Center the icon
                      }}
                    >
                      <path d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872l-.1-.34zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z" />
                    </svg>
                    {showSettingsTooltip && window.innerWidth >= 768 && (
                      <div className="custom-tooltip-settings rounded-5">
                        {t.settings}
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="sidebar-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
              zIndex: 1000,
            }}
          />
        )}
      </AnimatePresence>
      {sidebarOpen && (
        <div
          className="sidebar-overlay active"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      {/* Logout Modal */}
      {showLogoutModal && (
        <div
          className={`modal ${isLogoutModalClosing ? "fade-out" : "fade-in"} ${
            !isLogoutModalClosing ? "show" : ""
          } pb-5`}
          style={{
            display: isLogoutModalClosing ? "block" : "block",
            background: "#020e0ac7",
            backdropFilter: "blur(5px)",
          }}
          onClick={handleCloseLogoutModal}
        >
          <div
            className={`modal-dialog modal-dialog-centered
            `}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content text-white glass-popup-logout rounded-5  m-0 mt-1  mt-md-0">
              <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
                <div
                  className="rounded-5 p-2 mb-1"
                  style={{
                    background: "rgba(179, 25, 25, 1)",
                    border: "none",
                    borderRadius: "8px",
                    transition: "all 0.2s ease",
                    filter: "drop-shadow(0 0 0.2rem #00000031)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(124, 19, 19, 1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
                  }}
                >
                  {" "}
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ width: "26px", height: "26px" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="white"
                      className="bi bi-box-arrow-left"
                      viewBox="0 0 16 16"
                    >
                      <path
                        fillRule="evenodd"
                        d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"
                      />
                      <path
                        fillRule="evenodd"
                        d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="modal-title">{t.logout}</h3>
                <small style={{ color: "#c0c0c0ff" }}>
                  {t.areYouSureLogout}
                </small>
                <div className="d-flex gap-2 align-items-center mb-0 mt-3">
                  <img
                    width={"42px"}
                    className="rounded-5"
                    src={user.image}
                    alt=""
                  />
                  <span
                    className="fw-bold text-truncate"
                    style={{
                      maxWidth: "100px",
                    }}
                  >
                    {user.username}
                  </span>
                </div>
              </div>

              <form onSubmit={handleLogout}>
                <div className="modal-footer d-flex justify-content-center align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-light fw-bold order-md-first order-last rounded-5 text-uppercase p-2 px-3"
                    onClick={handleCloseLogoutModal}
                    disabled={isLogoutModalClosing}
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
                    className="btn  fw-bold order-md-last order-first text-uppercase rounded-5 p-2 px-3"
                    style={{
                      background: "rgba(179, 25, 25, 1)",
                      color: "white",
                      border: "none",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(139, 18, 18, 1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(179, 25, 25, 1)";
                    }}
                    disabled={isLogoutModalClosing}
                  >
                    {t.confirmLogout}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showAddFriendModal && (
        <div
          className={`modal ${isAddModalClosing ? "fade-out" : "fade-in"} ${
            !isAddModalClosing ? "show" : ""
          } pb-5`}
          style={{
            display: isAddModalClosing ? "block" : "block",
            background: "#020e0ac7",
            backdropFilter: "blur(5px)",
          }}
          onClick={handleCloseAddFriendModal} // FIXED
        >
          <div
            className={`modal-dialog modal-dialog-centered`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content text-white glass-popup rounded-5 m-0 mt-1 mt-md-0">
              <div className="modal-header d-flex flex-column justify-content-center align-items-center text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  fill="white"
                  className="bi bi-person-fill-add mb-1"
                  viewBox="0 0 16 16"
                >
                  <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                  <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                </svg>
                <h3 className="modal-title">{t.addFriend}</h3>
              </div>
              <small
                className="d-flex justify-content-center align-items-center px-5 flex-wrap text-center"
                style={{ color: "#c0c0c0ff" }}
              >
                {t.youCanAddFriends}
              </small>

              <form onSubmit={handleSendFriendRequest}>
                <div className="modal-body">
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
                      type="text"
                      placeholder={t.enterUsername}
                      className="border-0 px-2 flex-grow-1"
                      style={{
                        outline: "none",
                        background: "transparent",
                        color: "white",
                      }}
                      value={friendUsername}
                      onChange={(e) => setFriendUsername(e.target.value)}
                      required
                      disabled={isAddingFriend}
                    />
                  </motion.div>
                </div>
                {messageDisplay}
                <div className="modal-footer d-flex justify-content-end align-items-center">
                  <button
                    type="button"
                    className="btn btn-outline-light order-md-first order-last fw-bold rounded-5 text-uppercase p-2 px-3"
                    onClick={handleCloseAddFriendModal}
                    disabled={isAddingFriend}
                  >
                    {t.close}
                  </button>
                  <button
                    type="submit"
                    className="btn btn-light fw-bold order-md-last order-first text-uppercase rounded-5 p-2 px-3"
                    disabled={isAddingFriend || !friendUsername.trim()}
                  >
                    {isAddingFriend ? t.sending : t.sendFriendRequest}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Chat Area */}
      <div
        className="chat-area"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div
          className="chat-container"
          style={{
            maxHeight: window.innerWidth < 768 ? "calc(100vh - 60px)" : "",
            overflowY: "auto",
          }}
        >
          <div className="chat-content ">
            <Navbar nameOfTop={t.friends} />

            {currentChannel ? (
              <>
                {/* Chat Header */}
                <div className="chat-header d-flex align-items-center justify-content-center p-2">
                  <div
                    className="channel-info mt-2 w-100"
                    style={{ position: "relative" }}
                  >
                    {/* Left: Menu Button (Absolute Position - Truly Fixed on Left) */}
                    {window.innerWidth < 768 && (
                      <div
                        onClick={openSidebar}
                        className="d-flex list-nav-menu align-items-center justify-content-center"
                        style={{
                          cursor: "pointer",
                          position: "absolute",
                          left: "-6px",
                          top: "40%",
                          transform: "translateY(-50%)",
                          borderRadius: "50%",
                          height: "34px",
                          width: "34px",
                          zIndex: 10,
                        }}
                      >
                        <img
                          className="rounded-circle"
                          style={{ width: "34px", height: "34px" }}
                          src={user.image}
                          alt={user.username}
                        />
                      </div>
                    )}

                    {/* Center: Channel Info (Perfectly Centered) */}
                    <div className="d-flex flex-column align-items-center justify-content-center w-100">
                      <div className="d-flex align-items-center gap-2 justify-content-center">
                        {currentChannel.isDM && currentChannel.participants ? (
                          // DM Channel - show other participant's avatar
                          <div className="position-relative">
                            <img
                              src={
                                currentChannel.participants.find(
                                  (p) => p.userId !== user?.id
                                )?.image || "/default-avatar.png"
                              }
                              width={"42px"}
                              height={"42px"}
                              className="rounded-5"
                              alt=""
                              style={{ objectFit: "cover" }}
                            />
                          </div>
                        ) : (
                          // Regular channel
                          <>
                            {currentChannel.image && (
                              <img
                                src={currentChannel.image}
                                width={"42px"}
                                style={{ objectFit: "cover" }}
                                height={"42px"}
                                className="rounded-4"
                                alt=""
                              />
                            )}
                            {!currentChannel.image && (
                              <div
                                className="rounded-4 border-0 p-3 channel-button"
                                style={{
                                  backgroundColor: currentChannel.bgcolor,
                                  filter: "drop-shadow(0 0 0.2rem #00000031)",
                                  width: "44px",
                                  height: "44px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  flexShrink: 0,
                                }}
                              >
                                <img
                                  src={logo}
                                  width={"28px"}
                                  className="rounded-4"
                                  alt={currentChannel.name}
                                  style={{
                                    filter: "brightness(0) invert(1)",
                                  }}
                                />
                              </div>
                            )}
                          </>
                        )}
                        <h3
                          className="text-capitalize text-truncate m-0"
                          style={{
                            maxWidth: `${
                              window.innerWidth < 768 ? "150px" : "400px"
                            }`,
                          }}
                        >
                          {currentChannel.isDM && currentChannel.participants
                            ? (() => {
                                const otherParticipant =
                                  currentChannel.participants.find(
                                    (p: any) => p.userId !== user?.id
                                  );
                                return (
                                  otherParticipant?.username ||
                                  currentChannel.displayName
                                );
                              })()
                            : currentChannel.name}
                        </h3>
                      </div>

                      {/* Description centered below */}
                      {currentChannel.description && !currentChannel.isDM && (
                        <small
                          style={{
                            color: "#ffffffa8",
                            textAlign: "center",
                            marginTop: "4px",
                          }}
                        >
                          {currentChannel.description}
                        </small>
                      )}
                    </div>
                  </div>
                </div>
                <hr
                  className={`${
                    window.innerWidth < 768 ? " d-none" : "d-block"
                  }`}
                />
                {currentChannel && (
                  <div
                    className={`d-inline-flex flex-wrap flex-md-row ${
                      window.innerWidth < 768 ? " gap-3 mt-2" : "gap-2"
                    } align-items-start align-items-md-center justify-content-between mb-3`}
                  >
                    <div
                      className={`d-flex align-items-center ${
                        window.innerWidth < 768
                          ? "justify-content-start gap-2"
                          : "gap-2"
                      }`}
                    >
                      <div
                        className="d-flex  order-last align-items-center justify-content-start search-container "
                        style={{}} // Add minimum width for smaller screens
                      >
                        <motion.div
                          whileFocus={{ scale: 1.02 }}
                          whileHover={{ scale: 1.01 }}
                          className="form-control p-1 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center"
                          style={{
                            backgroundColor: "transparent",
                            color: "white",
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            fill="white"
                            className="bi bi-search"
                            viewBox="0 0 16 16"
                          >
                            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                          </svg>
                          <input
                            disabled={isLoadingMessages}
                            type="text"
                            placeholder={`${t.searchMessages}`}
                            className="border-0 px-2 flex-grow-1"
                            style={{
                              maxWidth:
                                window.innerWidth < 768 ? "170px" : "300px",
                              outline: "none",
                              background: "transparent",
                              color: "white",
                            }}
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                          />
                          {searchQuery && (
                            <button
                              onClick={() => {
                                setSearchQuery("");
                                setFilteredChannels([]);
                                setFilteredUsers([]);
                              }}
                              className="btn p-0"
                              style={{
                                background: "transparent",
                                border: "none",
                                color: "rgba(255, 255, 255, 0.6)",
                              }}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                fill="currentColor"
                                viewBox="0 0 16 16"
                              >
                                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                              </svg>
                            </button>
                          )}
                        </motion.div>
                      </div>

                      <div className="d-inline-flex  order-first align-items-start gap-2 ">
                        <div className="position-relative">
                          <button
                            disabled={isLoadingMessages}
                            onClick={handleVideoCallClick}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              width: "34px",
                              height: "34px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                            className="btn  d-flex m-0 p-0 align-items-center justify-content-center rounded-5 fw-bold"
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.212)";
                              setShowVideoCallTooltip(true);
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.1)";
                              setShowVideoCallTooltip(false);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="18"
                              fill="white"
                              className="bi bi-camera-video-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M0 5a2 2 0 0 1 2-2h7.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 4.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 13H2a2 2 0 0 1-2-2z"
                              />
                            </svg>
                            {showVideoCallTooltip &&
                              window.innerWidth >= 768 && (
                                <div
                                  className="custom-tooltip-settings rounded-5"
                                  style={{
                                    left: "130%",
                                  }}
                                >
                                  {t.videoCall}
                                </div>
                              )}
                          </button>
                        </div>

                        <div className="position-relative">
                          <button
                            disabled={isLoadingMessages}
                            onClick={handleAudioCallClick}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              width: "34px",
                              height: "34px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                            className="btn d-flex m-0 p-0 align-items-center justify-content-center rounded-5 fw-bold"
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.212)";
                              setShowCallTooltip(true);
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.1)";
                              setShowCallTooltip(false);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="white"
                              className="bi bi-telephone-fill"
                              viewBox="0 0 16 16"
                            >
                              <path
                                fillRule="evenodd"
                                d="M1.885.511a1.745 1.745 0 0 1 2.61.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z"
                              />
                            </svg>
                            {showCallTooltip && window.innerWidth >= 768 && (
                              <div className="custom-tooltip-settings rounded-5">
                                {t.audioCall}
                              </div>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className={`d-flex align-items-center ${
                        window.innerWidth < 768
                          ? "justify-content-end gap-3"
                          : "gap-2"
                      }`}
                    >
                      <div className="d-inline-flex   gap-2 ">
                        <div className="position-relative">
                          <button
                            disabled={isLoadingMessages}
                            onClick={handleMembersAllClick}
                            style={{
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              width: "34px",
                              height: "34px",
                              border: "1px solid rgba(255, 255, 255, 0.1)",
                              backgroundColor: "rgba(255, 255, 255, 0.1)",
                            }}
                            className="btn  d-flex m-0 p-0 align-items-center justify-content-center rounded-5 fw-bold"
                            onMouseEnter={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.212)";
                              setShowMembersTooltip(true);
                            }}
                            onMouseLeave={(e) => {
                              (
                                e.currentTarget as HTMLButtonElement
                              ).style.backgroundColor =
                                "rgba(255, 255, 255, 0.1)";
                              setShowMembersTooltip(false);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                              fill="white"
                              className="bi bi-people-fill"
                              viewBox="0 0 16 16"
                            >
                              <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                            </svg>
                            {showShowMembersTooltip &&
                              window.innerWidth >= 768 && (
                                <div
                                  className="custom-tooltip-settings rounded-5"
                                  style={{
                                    left: "-60%",
                                  }}
                                >
                                  {t.membersShow}
                                </div>
                              )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Container */}
                {/* Messages Container */}

                <div
                  className={`messages-section d-flex  ${
                    showMembersSidebar ? "flex-column flex-md-row" : ""
                  } gap-3 w-100`}
                  style={{
                    height: "calc(100vh - 210px)",
                    overflow: "hidden",
                    borderRadius: "20px",
                  }}
                  ref={messagesContainerRef}
                  onScroll={handleMessagesScroll}
                >
                  <motion.div
                    className={`messages-container ${
                      showMembersSidebar ? "flex-grow-1" : "w-100"
                    }`}
                    style={{
                      minWidth:
                        showMembersSidebar && window.innerWidth >= 768
                          ? 0
                          : "100%",
                      minHeight:
                        (showMembersSidebar && window.innerWidth < 768) ||
                        !(
                          (searchQuery && filteredMessages.length === 0) ||
                          searchQuery
                        )
                          ? ""
                          : "calc(100vh - 250px)",
                      overflowY:
                        channelMessages.length === 0 ||
                        (searchQuery && filteredMessages.length === 0)
                          ? "hidden"
                          : "auto",
                    }}
                    key={currentChannel?.id || "no-channel"} // Important: key triggers animation on channel change
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                  >
                    {/* Loading indicator for older messages */}
                    {isLoadingOlderMessages && (
                      <div className="text-center p-3">
                        <div
                          className="spinner-border spinner-border-sm text-light"
                          role="status"
                        >
                          <span className="visually-hidden">
                            {t.loadingOlderMessages}
                          </span>
                        </div>
                        <small className="text-light ms-2">
                          {t.loadingOlderMessages}
                        </small>
                      </div>
                    )}

                    {/* Your existing message rendering logic */}
                    {searchQuery && filteredMessages.length > 0 ? (
                      // SEARCH RESULTS
                      <>
                        <div className="d-flex align-items-center justify-content-between mb-3 px-3">
                          <small style={{ color: "#ffffffa8" }}>
                            {t.foundMessages}&nbsp;{filteredMessages.length}{" "}
                            message
                            {filteredMessages.length !== 1 ? "s" : ""}
                          </small>
                          <button
                            onClick={() => {
                              setSearchQuery("");
                              setFilteredMessages([]);
                            }}
                            className="btn btn-sm p-1 px-2 rounded-5"
                            style={{
                              background: "rgba(255, 255, 255, 0.1)",
                              border: "1px solid rgba(255, 255, 255, 0.24)",
                              color: "white",
                              fontSize: "0.8rem",
                            }}
                          >
                            {t.clear}
                          </button>
                        </div>
                        {filteredMessages.map((message, index) =>
                          renderMessage(message, index)
                        )}
                      </>
                    ) : searchQuery && filteredMessages.length === 0 ? (
                      // NO MESSAGES FOUND IN SEARCH
                      <div
                        className="empty-messages d-flex flex-column justify-content-center align-items-center"
                        style={{
                          height: "100%", // Fill parent container
                          minHeight: "calc(100vh - 280px)", // Same calculation as maxHeight but adjusted
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                        </svg>
                        <p>
                          {t.noMessagesFoundFor} "{searchQuery}"
                        </p>
                      </div>
                    ) : isLoadingMessages &&
                      loadingChannelId === currentChannel?.id ? (
                      // SHOW SKELETON LOADER
                      <MessagesSkeleton />
                    ) : channelMessages.length === 0 ? (
                      // EMPTY CHANNEL (not loading)
                      <div
                        className="empty-messages d-flex flex-column justify-content-center align-items-center"
                        style={{
                          height: "100%", // Fill parent container
                          minHeight: "calc(100vh - 280px)", // Same calculation as maxHeight but adjusted
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="48"
                          height="48"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.678 11.894a1 1 0 0 1 .287.801 10.97 10.97 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8.06 8.06 0 0 0 8 14c3.996 0 7-2.807 7-6 0-3.192-3.004-6-7-6S1 4.808 1 8c0 1.468.617 2.83 1.678 3.894zm-.493 3.905a21.682 21.682 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a9.68 9.68 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.520.263-1.639.742-3.468 1.105z" />
                        </svg>
                        <p>{t.noMessagesYet}</p>
                      </div>
                    ) : (
                      // SHOW ALL MESSAGES (with infinite scroll)
                      channelMessages.map((message, index) =>
                        renderMessage(message, index)
                      )
                    )}
                    <div ref={messagesEndRef} />
                  </motion.div>
                  {showMembersSidebar && (
                    <div
                      key={`sidebar-${sidebarAnimationKey}`}
                      className={`members-sidebar rounded-4 ${
                        isMembersSidebarClosing ? "fade-out" : ""
                      } flex-column flex-shrink-0 ${
                        window.innerWidth < 768 ? "mobile" : "desktop"
                      }`}
                      style={{
                        width: window.innerWidth < 768 ? "100%" : "300px",
                        height: "100%",
                        background: "rgba(0, 0, 0, 0.3)",
                        borderRadius: "12px",
                        padding: "16px",
                        overflow: "hidden",
                      }}
                    >
                      {/* Header */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="text-white fw-bold m-0">
                          {t.members}&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;
                          {members.length}
                        </h6>
                      </div>

                      {/* Rest of your members list code remains the same */}
                      <div
                        className="flex-grow-1"
                        style={{
                          overflowY: "auto",
                          maxHeight: "calc(100vh - 280px)",
                        }}
                      >
                        {members.length === 0 ? (
                          <div className="text-center py-5 members-empty-state">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="48"
                              height="48"
                              fill="rgba(255, 255, 255, 0.3)"
                              className="bi bi-people mb-3"
                              viewBox="0 0 16 16"
                            >
                              <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4m3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0M6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816M4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4" />
                            </svg>
                            <p className="text-muted m-0 small">
                              {t.noMembersInChannel}
                            </p>
                          </div>
                        ) : (
                          <div className="members-list">
                            {members.map((member, index) => (
                              <div
                                key={member.id}
                                className={`d-flex align-items-center gap-2 px-3 py-2 rounded-5 mb-2 member-item ${
                                  shouldAnimateMembers
                                    ? "member-item-animate"
                                    : ""
                                } ${
                                  shouldAnimateMembers
                                    ? window.innerWidth < 768
                                      ? "mobile"
                                      : "desktop"
                                    : ""
                                }`}
                                style={{
                                  background: "rgba(255, 255, 255, 0.05)",
                                  transition: "all 0.2s ease",
                                  cursor: "pointer",
                                  animationDelay: shouldAnimateMembers
                                    ? `${index * 0.05}s`
                                    : "0s",
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background =
                                    "rgba(255, 255, 255, 0.1)";
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background =
                                    "rgba(255, 255, 255, 0.05)";
                                }}
                              >
                                <div className="position-relative flex-shrink-0">
                                  {member.image ? (
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
                                  ) : (
                                    <div
                                      className="rounded-circle d-flex align-items-center justify-content-center"
                                      style={{
                                        backgroundColor: "#292929",
                                        width: "40px",
                                        height: "40px",
                                      }}
                                    >
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        viewBox="0 0 16 16"
                                        style={{ fill: "#ffffff" }}
                                      >
                                        <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                      </svg>
                                    </div>
                                  )}
                                  <motion.div
                                    animate={{
                                      backgroundColor: member.isOnline
                                        ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                                        : "#6c757d",
                                    }}
                                    transition={{
                                      duration: 1.5,
                                      repeat: member.isOnline ? Infinity : 0,
                                      repeatType: "reverse",
                                      ease: "easeInOut",
                                    }}
                                    className="position-absolute rounded-circle border border-2 border-dark"
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                      backgroundColor: member.isOnline
                                        ? "#20b92d"
                                        : "#6c757d",
                                      bottom: "2px",
                                      right: "2px",
                                    }}
                                  ></motion.div>
                                </div>

                                <div className="flex-grow-1 min-w-0">
                                  <div
                                    className="text-white fw-semibold text-truncate"
                                    style={{
                                      maxWidth:
                                        window.innerWidth < 768
                                          ? "150px"
                                          : "100px",
                                    }}
                                  >
                                    {member.username}
                                  </div>
                                  <div className="d-flex align-items-center gap-1">
                                    <small
                                      style={{
                                        color: member.isOnline
                                          ? "#20b92d"
                                          : "#6c757d",
                                        fontSize: "0.8rem",
                                      }}
                                    >
                                      {member.isOnline ? t.online : t.offline}
                                    </small>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                {/* Message Form */}
                <motion.form
                  onSubmit={handleSendMessage}
                  className="message-form"
                  key={`input-${currentChannel?.id}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: "easeOut" }}
                >
                  <div className="input-group flex-nowrap align-items-center">
                    {/* Image Upload Button */}

                    <div className="position-relative">
                      <label
                        className="btn d-flex align-items-center justify-content-center p-2 rounded-5 flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "1px solid rgba(255, 255, 255, 0.24)",
                          background: isUploadingImage
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          transition: "all 0.2s ease",
                          cursor: isUploadingImage ? "not-allowed" : "pointer",
                          opacity: isUploadingImage ? 0.7 : 1,
                        }}
                        onMouseEnter={(e) => {
                          if (!isUploadingImage) {
                            setShowImageTooltip(true);
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.2)";
                          }
                        }}
                        onClick={() => {
                          setShowImageTooltip(false);
                        }}
                        onMouseLeave={(e) => {
                          if (!isUploadingImage) {
                            setShowImageTooltip(false);
                            e.currentTarget.style.background =
                              "rgba(255, 255, 255, 0.1)";
                          }
                        }}
                      >
                        {isUploadingImage ? (
                          <div
                            className="spinner-border spinner-border-sm"
                            role="status"
                          >
                            <span className="visually-hidden">
                              {t.uploading}
                            </span>
                          </div>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            fill="white"
                            viewBox="0 0 16 16"
                          >
                            <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
                            <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z" />
                          </svg>
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          style={{ display: "none" }}
                          disabled={isUploadingImage}
                        />
                      </label>

                      {/* Tooltip moved outside the label */}
                      {showImageTooltip && window.innerWidth >= 768 && (
                        <div className="custom-tooltip-settings rounded-5">
                          {t.media}
                        </div>
                      )}
                    </div>
                    <div className="position-relative">
                      <button
                        disabled={isLoadingMessages}
                        type="button"
                        className="btn d-flex align-items-center justify-content-center p-2 rounded-5 flex-shrink-0"
                        style={{
                          width: "40px",
                          height: "40px",
                          border: "1px solid rgba(255, 255, 255, 0.24)",
                          background: "rgba(255, 255, 255, 0.1)",
                          color: "white",
                          transition: "all 0.2s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          setShowGIFTooltip(true);
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          setShowGIFTooltip(false);
                          e.currentTarget.style.background =
                            "rgba(255, 255, 255, 0.1)";
                        }}
                        onClick={() => setShowGifPicker(true)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="white"
                          viewBox="0 0 256 256"
                          id="Flat"
                        >
                          <path d="M148,72V184a12,12,0,0,1-24,0V72a12,12,0,0,1,24,0Zm80-12H180a12.0006,12.0006,0,0,0-12,12V184a12,12,0,0,0,24,0V140h24a12,12,0,0,0,0-24H192V84h36a12,12,0,0,0,0-24ZM96,120H72a12,12,0,0,0,0,24H84v8a20,20,0,0,1-40,0V104a20.00476,20.00476,0,0,1,39.37109-5.00879,11.99988,11.99988,0,0,0,23.24219-5.98242A44.00462,44.00462,0,0,0,20,104v48a44,44,0,0,0,88,0V132A12.0006,12.0006,0,0,0,96,120Z" />
                        </svg>
                      </button>

                      {/* Tooltip moved outside the label */}
                      {showGIFTooltip && window.innerWidth >= 768 && (
                        <div className="custom-tooltip-settings rounded-5">
                          GIF
                        </div>
                      )}
                    </div>
                    {showGifPicker && (
                      <GifPicker
                        onGifSelect={handleGifSelect}
                        onClose={() => {
                          console.log("Closing GIF picker");
                          setShowGifPicker(false);
                        }}
                      />
                    )}
                    {/* Message Input */}

                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => {
                        setNewMessage(e.target.value);
                        handleTyping();
                      }}
                      placeholder={`${t.channelPlaceholder}${
                        currentChannel?.isDM && currentChannel?.displayName
                          ? currentChannel.displayName.toLowerCase()
                          : currentChannel?.name?.toLowerCase() || "channel"
                      }`}
                      className="form-control flex-grow-1 rounded-5"
                      style={{
                        color: "white",
                        padding: "10px 20px",
                        height: "45px",
                      }}
                      maxLength={500}
                      spellCheck={false}
                      disabled={!isConnected || isLoadingMessages}
                    />

                    {/* Send Button */}
                    <button
                      className="btn btn-light text-white d-flex align-items-center rounded-4 justify-content-center fw-bold text-uppercase flex-shrink-0"
                      type="submit"
                      disabled={
                        !isConnected || !newMessage.trim() || isLoadingMessages
                      }
                      style={{
                        whiteSpace: "nowrap",
                        background: newMessage.trim()
                          ? "white"
                          : "rgba(255, 255, 255, 0.2)",
                        color: newMessage.trim()
                          ? "black"
                          : "rgba(255, 255, 255, 0.5)",
                        height: window.innerWidth < 576 ? "40px" : "45px",

                        minWidth: window.innerWidth < 576 ? "50px" : "80px",
                        transition: "all 0.2s ease",
                      }}
                      onMouseEnter={(e) => {
                        if (newMessage.trim()) {
                          e.currentTarget.style.background = "#e8e8e8";
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (newMessage.trim()) {
                          e.currentTarget.style.background = "white";
                        }
                      }}
                    >
                      <span className="d-none d-sm-inline fw-bold">
                        {t.send}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        style={{ transform: "rotate(45deg)" }}
                        fill="currentColor"
                        className="bi bi-send d-block d-sm-none"
                        viewBox="0 0 16 16"
                      >
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z" />
                      </svg>
                    </button>
                  </div>
                </motion.form>
              </>
            ) : (
              <motion.div
                className="no-channel"
                key="no-channel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="d-flex align-items-center justify-content-between  w-100 mt-3 mt-md-2 mb-2 mb-md-0">
                  <div className="d-flex align-items-center justify-content-start gap-1">
                    {window.innerWidth < 768 && (
                      <>
                        <div
                          onClick={openSidebar}
                          className="d-flex list-nav-menu align-items-center justify-content-center ms-1  "
                          style={{
                            cursor: "pointer",
                            borderRadius: "50%",
                            height: "34px",
                            width: "34px",
                          }}
                        >
                          <img
                            className="rounded-circle"
                            style={{ width: "34px", height: "34px" }}
                            src={user.image}
                            alt={user.username}
                          />
                        </div>
                      </>
                    )}
                    <div className="d-none d-md-flex align-items-center justify-content-start gap-1 pe-2 ">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill="white"
                        className="bi bi-people-fill"
                        viewBox="0 0 16 16"
                      >
                        <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                      </svg>
                      <h5 className="fs-5 m-0 lh-1">{t.friends}</h5>
                    </div>

                    <div className="pe-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="6"
                        height="6"
                        fill="rgba(255, 255, 255, 0.38)"
                        className="bi bi-circle-fill d-none d-md-flex"
                        viewBox="0 0 16 16"
                      >
                        <circle cx="8" cy="8" r="8" />
                      </svg>
                    </div>
                    <div className="d-flex align-items-center justify-content-start gap-2 ">
                      <button
                        onClick={() => {
                          setShowFriendRequests(false);
                          setIsActiveNowList(true);
                        }}
                        className={`d-flex fw-bold align-items-center justify-content-start text-white ${
                          isActiveNowList && !showFriendRequests
                            ? "top-main-but-active"
                            : "top-main-but"
                        } gap-1 btn  p-1 px-2 rounded-5`}
                      >
                        {t.online}
                      </button>
                      <button
                        onClick={() => {
                          setShowFriendRequests(false);
                          setIsActiveNowList(false);
                        }}
                        className={`d-flex fw-bold align-items-center justify-content-start text-white ${
                          !isActiveNowList && !showFriendRequests
                            ? "top-main-but-active"
                            : "top-main-but"
                        }  gap-1 btn p-1 px-2 rounded-5`}
                      >
                        {t.all}
                      </button>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-start gap-3 me-1">
                    <div className="d-flex align-items-center justify-content-start gap-2 ">
                      <button
                        onClick={() => {
                          setShowAddFriendModal(true);
                        }}
                        className={`d-flex fw-bold align-items-center justify-content-start text-white  gap-1 btn btn-light  p-1 px-3 rounded-5`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={window.innerWidth < 768 ? "20" : "16"}
                          height={window.innerWidth < 768 ? "20" : "16"}
                          fill="white"
                          className="bi bi-person-fill-add"
                          viewBox="0 0 16 16"
                        >
                          <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.5-5v1h1a.5.5 0 0 1 0 1h-1v1a.5.5 0 0 1-1 0v-1h-1a.5.5 0 0 1 0-1h1v-1a.5.5 0 0 1 1 0m-2-6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
                          <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4" />
                        </svg>
                        {window.innerWidth < 768 ? null : t.addFriendCAP}
                      </button>
                    </div>
                    <div style={{ position: "relative" }}>
                      <button
                        onClick={(e) => {
                          setShowFriendRequests(true);
                          setIsLoadingFriendRequests(true);
                          e.currentTarget.blur();
                        }}
                        className={`d-flex fw-bold align-items-center justify-content-start text-white  gap-2 btn btn-outline-light  p-1 px-3 rounded-5`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={window.innerWidth < 768 ? "20" : "16"}
                          height={window.innerWidth < 768 ? "20" : "16"}
                          fill="white"
                          className="bi bi-envelope-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" />
                        </svg>

                        {window.innerWidth < 768 ? null : t.friendRequestsCAP}
                      </button>
                      {friendRequests.length > 0 && (
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
                          className="position-absolute  d-flex align-items-center justify-content-center"
                          style={{
                            top: "-4px",
                            left: "-4px",
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
                          {friendRequests.length > 9
                            ? "9+"
                            : friendRequests.length}
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
                <hr />

                {/* SEARCH BAR - AUTOMATIC ON CHANGE */}
                {/* SEARCH BAR - AUTOMATIC ON CHANGE */}
                <div className="d-flex align-items-center justify-content-start w-100 search-container mt-1 mb-3">
                  <motion.div
                    whileFocus={{ scale: 1.02 }}
                    whileHover={{ scale: 1.01 }}
                    className="form-control p-2 px-3 border border-1 shadow-sm rounded-5 d-flex align-items-center w-100"
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
                      className="bi bi-search"
                      viewBox="0 0 16 16"
                    >
                      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0" />
                    </svg>
                    <input
                      type="text"
                      placeholder={`${t.searchFriendsAndChannels}`}
                      className="border-0 px-2 flex-grow-1"
                      style={{
                        outline: "none",
                        background: "transparent",
                        color: "white",
                      }}
                      value={searchQuery}
                      onChange={(e) => {
                        handleSearch(e.target.value);
                        setShowFriendRequests(false);
                      }}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilteredChannels([]);
                          setFilteredUsers([]);
                        }}
                        className="btn p-0"
                        style={{
                          background: "transparent",
                          border: "none",
                          color: "rgba(255, 255, 255, 0.6)",
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 16 16"
                        >
                          <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8z" />
                        </svg>
                      </button>
                    )}
                  </motion.div>
                </div>

                {/* SEARCH RESULTS OR REGULAR LISTS - ONLY THIS PART CHANGES */}
                <div
                  className="channels-list p-3 px-3"
                  style={{
                    borderRadius: "12px",
                    background: "rgba(0, 0, 0, 0.377)",
                    overflowY: "auto",
                    width: "100%",
                    maxHeight: "calc(50vh - 100px)",
                  }}
                >
                  {showFriendRequests ? (
                    isLoadingFriendRequests && friendRequests.length > 0 ? (
                      <FriendRequestsSkeleton />
                    ) : friendRequests.length > 0 ? (
                      <div className="mb-4 rounded-5 fade-in-up">
                        <h6
                          className="text-white mb-3 fw-bold"
                          style={{
                            fontSize: "0.95rem",
                            letterSpacing: "0.5px",
                          }}
                        >
                          {t.friendRequests}
                          &nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;
                          {friendRequests.length}
                        </h6>
                        <div
                          className="friend-requests-list "
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {friendRequests.map((request) => (
                            <FriendRequestItem
                              key={request.id}
                              request={request}
                              onAccept={handleAcceptFriendRequest}
                              onReject={handleRejectFriendRequest}
                            />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="all-users-list h-100">
                        <div className="users-container h-100">
                          {EmptyState}
                        </div>
                      </div>
                    )
                  ) : searchQuery ? (
                    /* SEARCH RESULTS */
                    <div className="search-results">
                      {/* Search Results Header */}
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <h6 className="text-white m-0">{t.searchResults}</h6>
                        <small style={{ color: "#ffffffa8" }}>
                          {filteredChannels.length + filteredUsers.length}{" "}
                          {t.results}
                        </small>
                      </div>

                      {/* Channels Results */}
                      {filteredChannels.length > 0 && (
                        <div className="mb-4">
                          <h6
                            className="text-white mb-2"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {t.channels}&nbsp;({filteredChannels.length})
                          </h6>
                          {filteredChannels.map((channel) => (
                            <div
                              key={`search-channel-${channel.id}`}
                              className="d-flex align-items-center gap-2 p-2 rounded-5 mb-2 channel_buttt"
                              style={{ cursor: "pointer" }}
                              onClick={() => handleChannelSelect(channel)}
                            >
                              <button
                                id="channel-button"
                                className="rounded-4 border-0 p-2 channel-button"
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
                                  width: "40px",
                                  height: "40px",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                {!channel.image && (
                                  <img
                                    src={logo}
                                    width={"20px"}
                                    alt={channel.name}
                                    style={{
                                      filter: "brightness(0) invert(1)",
                                    }}
                                  />
                                )}
                              </button>
                              <div className="flex-grow-1">
                                <div className="text-white fw-semibold">
                                  @{channel.name}
                                </div>
                                {channel.description && (
                                  <small style={{ color: "#ffffffa8" }}>
                                    {channel.description}
                                  </small>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Users Results */}
                      {filteredUsers.length > 0 && (
                        <div className="mb-4">
                          <h6
                            className="text-white mb-2"
                            style={{ fontSize: "0.9rem" }}
                          >
                            {t.users}&nbsp;({filteredUsers.length})
                          </h6>
                          {filteredUsers.map((user) => (
                            <div
                              key={`search-user-${user.id}`}
                              className="d-flex align-items-center gap-2 p-2 rounded-5 mb-2 channel_buttt"
                              style={{ cursor: "pointer" }}
                            >
                              <div className="position-relative">
                                {user.image ? (
                                  <img
                                    src={user.image}
                                    width="36"
                                    height="36"
                                    className="rounded-circle"
                                    alt="User"
                                    style={{
                                      objectFit: "cover",
                                    }}
                                  />
                                ) : (
                                  <div
                                    className="rounded-circle d-flex align-items-center justify-content-center"
                                    style={{
                                      backgroundColor: "#292929ff",
                                      width: "36px",
                                      height: "36px",
                                    }}
                                  >
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      width="18"
                                      height="18"
                                      viewBox="0 0 16 16"
                                      style={{
                                        fill: "#ffffff",
                                        display: "block",
                                      }}
                                    >
                                      <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
                                    </svg>
                                  </div>
                                )}
                                <motion.div
                                  animate={{
                                    backgroundColor: user.isOnline
                                      ? ["#20b92d", "#26db35ff", "#20b92d"] // Green -> Light Green -> Green
                                      : "#6c757d",
                                  }}
                                  transition={{
                                    duration: 1.5,
                                    repeat: user.isOnline ? Infinity : 0,
                                    repeatType: "reverse",
                                    ease: "easeInOut",
                                  }}
                                  className="position-absolute rounded-circle border border-2 border-dark"
                                  style={{
                                    width: "10px",
                                    height: "10px",

                                    bottom: "0",
                                    right: "0",
                                  }}
                                ></motion.div>
                              </div>
                              <div className="flex-grow-1">
                                <div
                                  className="text-white fw-semibold text-truncate"
                                  style={{
                                    maxWidth: "100px",
                                  }}
                                >
                                  {user.username}
                                </div>
                                <small style={{ color: "#ffffffa8" }}>
                                  {user.isOnline ? t.online : t.offline}
                                </small>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* No Results */}
                      {filteredChannels.length === 0 &&
                        filteredUsers.length === 0 && (
                          <div
                            className="d-flex align-items-center justify-content-center"
                            style={{
                              height: "100%",
                              width: "100%",
                              minHeight: "200px", // Fixed height for vertical centering
                            }}
                          >
                            <div className="text-center py-4">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="48"
                                height="48"
                                fill="rgba(255, 255, 255, 0.3)"
                                viewBox="0 0 16 16"
                              >
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6m-5.784 6A2.24 2.24 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.3 6.3 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1zM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5" />
                              </svg>
                              <p
                                style={{ color: "#ffffffa8" }}
                                className="mt-2  m-0 small"
                              >
                                {t.noResultsFound}&nbsp;"{searchQuery}"
                              </p>
                            </div>{" "}
                          </div>
                        )}
                    </div>
                  ) : (
                    /* REGULAR LISTS WHEN NO SEARCH */
                    <>
                      {isActiveNowList ? (
                        <ActiveNowList
                          currentChannel={currentChannel}
                          onChannelSelect={handleChannelSelect}
                          channels={channels}
                          currentUser={user}
                          onStartDM={handleStartDM}
                        />
                      ) : (
                        <AllList
                          currentChannel={currentChannel}
                          onChannelSelect={handleChannelSelect}
                          channels={channels}
                          currentUser={user}
                          onStartDM={handleStartDM}
                        />
                      )}
                    </>
                  )}
                </div>

                {/* BOTTOM BACKGROUND WITH TYPING ANIMATION - ALWAYS VISIBLE */}
                {/* <hr /> */}
                <div
                  className="d-flex align-items-center justify-content-center w-100 mt-3 mt-md-2"
                  style={{
                    overflow: "hidden",
                    position: "relative",
                    minHeight: "calc(25vh)",
                  }}
                >
                  {/* Background with proper containment */}
                  <div
                    className="rounded-5"
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: `url(${objects})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      filter: "blur(6px) brightness(0.6)",
                      opacity: 0.2,
                      zIndex: 0,
                      overflow: "hidden",
                      borderRadius: "12px",
                    }}
                  ></div>

                  {/* Centered text */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 1,
                      textAlign: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      height: "100%",
                      padding: "20px",
                    }}
                  >
                    <TypingAnimationComponent></TypingAnimationComponent>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
