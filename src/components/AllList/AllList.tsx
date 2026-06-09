import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { User, Channel } from "../../types/chat";
import { useShopContext } from "../../hooks/useShopContext";
import { allListTranslations } from "./AllListTranslations";
import { useFriends } from "../../context/FriendsContext";
import { motion } from "framer-motion";

interface AllListProps {
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  channels: Channel[];
  currentUser: User;
  isLoading?: boolean;
  onStartDM: (userId: string) => void;
}

const UserItem = memo(
  ({
    user,
    onStartDM,
    t,
  }: {
    user: User;
    onStartDM: (userId: string) => void;
    t: (typeof allListTranslations)[keyof typeof allListTranslations];
  }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isButtonHovered, setIsButtonHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleButtonMouseEnter = useCallback(
      () => setIsButtonHovered(true),
      [],
    );
    const handleButtonMouseLeave = useCallback(
      () => setIsButtonHovered(false),
      [],
    );

    const handleDMClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onStartDM(user.id);
      },
      [onStartDM, user.id],
    );

    const userImage = useMemo(
      () =>
        user.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username || "User",
        )}&background=random`,
      [user.image, user.username],
    );

    const badgeStyle = useMemo(
      () => ({
        background: user.isOnline
          ? "rgba(32, 185, 45, 0.2)"
          : "rgba(108, 117, 125, 0.2)",
      }),
      [user.isOnline],
    );

    return (
      <div
        className="user-item d-flex align-items-center justify-content-between gap-2 p-2 rounded-5"
        style={{
          background: isHovered
            ? "rgba(255, 255, 255, 0.1)"
            : "rgba(255, 255, 255, 0.05)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* User Info Section */}
        <div className="d-flex align-items-center gap-2 flex-grow-1">
          {/* User Avatar */}
          <div className="position-relative flex-shrink-0">
            <img
              src={userImage}
              alt={user.username}
              width="36"
              height="36"
              className="rounded-5"
              style={{
                filter: "drop-shadow(0 0 0.2rem #00000031)",
                objectFit: "cover",
              }}
              loading="lazy"
            />
            {/* Online Status Indicator */}
            <motion.div
              animate={{
                backgroundColor: user.isOnline
                  ? ["#20b92d", "#26db35ff", "#20b92d"]
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
            />
          </div>

          {/* User Info */}
          <div className="flex-grow-1 min-w-0">
            <div className="d-flex align-items-center gap-2">
              <span
                className="fw-semibold text-white text-truncate"
                style={{
                  fontSize: "0.9rem",
                  maxWidth: window.innerWidth < 520 ? "110px" : "250px",
                }}
              >
                {user.username}
              </span>
            </div>
          </div>

          {/* User Status Badge */}
          <div className="text-end flex-shrink-0">
            <small
              className="px-2 py-1 text-white rounded-5"
              style={{
                ...badgeStyle,
                fontSize: "0.7rem",
              }}
            >
              {user.isOnline ? t.online : t.offline}
            </small>
          </div>
        </div>

        {/* DM Button */}
        <button
          onClick={handleDMClick}
          onMouseEnter={handleButtonMouseEnter}
          onMouseLeave={handleButtonMouseLeave}
          className="btn btn-sm rounded-5 flex-shrink-0 d-flex align-items-center justify-content-center"
          style={{
            background: isButtonHovered
              ? "rgba(255, 255, 255, 0.2)"
              : "rgba(255, 255, 255, 0.1)",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "white",
            padding: "4px 8px",
            fontSize: "0.75rem",
            transition: "all 0.2s ease",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="currentColor"
            className="bi bi-envelope-at-fill"
            viewBox="0 0 16 16"
            aria-label={t.message}
          >
            <path d="M2 2A2 2 0 0 0 .05 3.555L8 8.414l7.95-4.859A2 2 0 0 0 14 2zm-2 9.8V4.698l5.803 3.546zm6.761-2.97-6.57 4.026A2 2 0 0 0 2 14h6.256A4.5 4.5 0 0 1 8 12.5a4.49 4.49 0 0 1 1.606-3.446l-.367-.225L8 9.586zM16 9.671V4.697l-5.803 3.546.338.208A4.5 4.5 0 0 1 12.5 8c1.414 0 2.675.652 3.5 1.671" />
            <path d="M15.834 12.244c0 1.168-.577 2.025-1.587 2.025-.503 0-1.002-.228-1.12-.648h-.043c-.118.416-.543.643-1.015.643-.77 0-1.259-.542-1.259-1.434v-.529c0-.844.481-1.4 1.26-1.4.585 0 .87.333.953.63h.03v-.568h.905v2.19c0 .272.18.42.411.42.315 0 .639-.415.639-1.39v-.118c0-1.277-.95-2.326-2.484-2.326h-.04c-1.582 0-2.64 1.067-2.64 2.724v.157c0 1.867 1.237 2.654 2.57 2.654h.045c.507 0 .935-.07 1.18-.18v.731c-.219.1-.643.175-1.237.175h-.044C10.438 16 9 14.82 9 12.646v-.214C9 10.36 10.421 9 12.485 9h.035c2.12 0 3.314 1.43 3.314 3.034zm-4.04.21v.227c0 .586.227.8.581.8.31 0 .564-.17.564-.743v-.367c0-.516-.275-.708-.572-.708-.346 0-.573.245-.573.791" />
          </svg>
          <span className="ms-1 d-none d-sm-inline">{t.message}</span>
        </button>
      </div>
    );
  },
);

UserItem.displayName = "UserItem";

const AllListSkeleton = memo(() => {
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  return (
    <div className="all-users-list h-100">
      <div className="users-container h-100">
        <div
          className="d-flex flex-column gap-2"
          style={{ height: "100%", overflowY: "auto" }}
        >
          {skeletons.map((_, index) => {
            const randomWidth = Math.random() * 80 + 60;
            return (
              <div
                key={`skeleton-${index}`}
                className="user-item d-flex align-items-center gap-2 p-2 rounded-5"
                style={{ background: "rgba(255, 255, 255, 0.05)" }}
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
                  />
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
                      className="skeleton-blink2 rounded-5"
                      style={{
                        width: `${randomWidth}px`,
                        height: "16px",
                        backgroundColor: "#ffffffec",
                      }}
                    />
                  </div>
                </div>

                {/* Status Badge Skeleton */}
                <div className="text-end flex-shrink-0">
                  <div
                    className="skeleton-blink rounded-5"
                    style={{
                      width: "50px",
                      height: "20px",
                      backgroundColor: "#adadade8",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

AllListSkeleton.displayName = "AllListSkeleton";

const EmptyState = memo(
  ({
    t,
  }: {
    t: (typeof allListTranslations)[keyof typeof allListTranslations];
  }) => (
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
          className="bi bi-people text-white mb-3"
          viewBox="0 0 16 16"
          aria-label={t.noUsersFound}
        >
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 2.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
        <p className="text-white m-0 small px-2">{t.noUsersFound}</p>
      </div>
    </div>
  ),
);

EmptyState.displayName = "EmptyState";

// Memoized ErrorState component
const ErrorState = memo(
  ({
    error,
    onRetry,
    t,
  }: {
    error: string;
    onRetry: () => void;
    t: (typeof allListTranslations)[keyof typeof allListTranslations];
  }) => (
    <div className="all-users-list h-100">
      <div className="d-flex align-items-center justify-content-center h-100">
        <div className="text-center py-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            fill="currentColor"
            className="bi bi-exclamation-triangle text-warning mb-3"
            viewBox="0 0 16 16"
            aria-label={t.failedToLoadUsers}
          >
            <path d="M7.938 2.016A.13.13 0 0 1 8.002 2a.13.13 0 0 1 .063.016.146.146 0 0 1 .054.057l6.857 11.667c.036.06.035.124.002.183a.163.163 0 0 1-.054.06.116.116 0 0 1-.066.017H1.146a.115.115 0 0 1-.066-.017.163.163 0 0 1-.054-.06.176.176 0 0 1 .002-.183L7.884 2.073a.147.147 0 0 1 .054-.057zm1.044-.45a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566z" />
            <path d="M7.002 12a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 5.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995z" />
          </svg>
          <p className="text-white m-0 small">{error}</p>
          <button
            onClick={onRetry}
            className="btn btn-outline-light btn-sm mt-2 rounded-4"
          >
            {t.retry}
          </button>
        </div>
      </div>
    </div>
  ),
);

ErrorState.displayName = "ErrorState";

export const AllList: React.FC<AllListProps> = ({ onStartDM }) => {
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { selectedLanguage } = useShopContext();
  const { friends, refreshFriends } = useFriends();

  const t = useMemo(
    () =>
      allListTranslations[
        selectedLanguage.code as keyof typeof allListTranslations
      ],
    [selectedLanguage.code],
  );

  const userFriends = useMemo(() => {
    const transformedFriends: User[] = [];

    for (const friend of friends) {
      let friendId: string;
      let friendUsername: string;
      let friendImage: string;
      let isOnline: boolean;

      if (typeof friend.friendId === "object" && friend.friendId !== null) {
        friendId = friend.friendId.id;
        friendUsername =
          friend.friendId.username || `User ${friend.friendId.id}`;
        friendImage = friend.friendId.image || "";
        isOnline = friend.friendId.isOnline || false;
      } else {
        friendId = (friend.friendId as string) || friend.id;
        friendUsername = friend.username || `User ${friendId}`;
        friendImage = friend.image || "";
        isOnline = friend.isOnline || false;
      }

      transformedFriends.push({
        id: friendId,
        username: friendUsername,
        email: "",
        image: friendImage,
        isOnline,
        dateOfBirth: new Date(),
        currentChannelId: "1",
      });
    }

    return transformedFriends;
  }, [friends]);

  const fetchAllUsers = useCallback(async () => {
    let mounted = true;

    try {
      if (mounted) {
        setIsLoadingSkeleton(true);
        setError(null);
      }

      await refreshFriends();

      if (mounted) {
        setIsLoadingSkeleton(false);
      }
    } catch (err) {
      if (mounted) {
        console.error("Error fetching friends:", err);
        setError(err instanceof Error ? err.message : t.failedToLoadUsers);
        setIsLoadingSkeleton(false);
      }
    }
  }, [refreshFriends, t.failedToLoadUsers]);

  const containerStyle = useMemo(
    () => ({
      height: "100%",
      overflowY: "auto" as const,
    }),
    [],
  );

  const handleRetry = useCallback(() => {
    fetchAllUsers();
  }, [fetchAllUsers]);

  const handleStartDM = useCallback(
    (userId: string) => {
      onStartDM(userId);
    },
    [onStartDM],
  );

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      try {
        if (mounted) {
          setIsLoadingSkeleton(true);
          setError(null);
        }

        await refreshFriends();

        if (mounted) {
          setIsLoadingSkeleton(false);
        }
      } catch (err) {
        if (mounted) {
          console.error("Error fetching friends:", err);
          setError(err instanceof Error ? err.message : t.failedToLoadUsers);
          setIsLoadingSkeleton(false);
        }
      }
    };

    loadData();

    return () => {
      mounted = false;
    };
  }, [refreshFriends, t.failedToLoadUsers]);

  if (isLoadingSkeleton) {
    return <AllListSkeleton />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={handleRetry} t={t} />;
  }

  if (userFriends.length === 0) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="all-users-list h-100">
      <div className="users-container h-100">
        <div className="d-flex flex-column gap-2" style={containerStyle}>
          <div className="channel-group d-flex flex-column gap-2">
            <div className="d-flex m-0 mb-1">
              <h6 className="d-flex m-0 mb-0 text-white">
                {t.allFriends}&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;
                {userFriends.length}
              </h6>
            </div>
            {/* Render user items */}
            {userFriends.map((user) => (
              <UserItem
                key={user.id}
                user={user}
                onStartDM={handleStartDM}
                t={t}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
