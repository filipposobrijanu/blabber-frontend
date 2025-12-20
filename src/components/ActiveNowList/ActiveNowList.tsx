import React, { useState, useEffect, useMemo, useCallback, memo } from "react";
import { User, Channel } from "../../types/chat";
import { useShopContext } from "../../hooks/useShopContext";
import { activeNowTranslations } from "./ActiveNowListTranslations";
import { useFriends } from "../../context/FriendsContext";
import { motion } from "framer-motion";
import { useUsersContext } from "../../context/UsersContext";

interface ActiveNowListProps {
  currentChannel: Channel | null;
  onChannelSelect: (channel: Channel) => void;
  channels: Channel[];
  currentUser: User;
  isLoading?: boolean;
  onStartDM: (userId: string) => void;
}

// Memoized UserItem component - prevents unnecessary re-renders
const UserItem = memo(
  ({
    user,
    onStartDM,
    t,
  }: {
    user: User;
    onStartDM: (userId: string) => void;
    t: (typeof activeNowTranslations)[keyof typeof activeNowTranslations];
  }) => {
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = useCallback(() => setIsHovered(true), []);
    const handleMouseLeave = useCallback(() => setIsHovered(false), []);
    const handleDMClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onStartDM(user.id);
      },
      [onStartDM, user.id]
    );

    const userImage = useMemo(
      () =>
        user.image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
          user.username || "User"
        )}&background=random`,
      [user.image, user.username]
    );

    return (
      <div
        className="user-item d-flex align-items-center gap-2 p-2 rounded-5"
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
              backgroundColor: ["#20b92d", "#26db35ff", "#20b92d"],
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
            className="px-2 py-1 text-white rounded-4"
            style={{
              background: "rgba(32, 185, 45, 0.2)",
              fontSize: "0.7rem",
            }}
          >
            {t.onlineStatus}
          </small>
        </div>

        {/* DM Button */}
        <button
          onClick={handleDMClick}
          className="btn btn-sm rounded-5 flex-shrink-0 d-flex align-items-center justify-content-center"
          style={{
            background: isHovered
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
  }
);

UserItem.displayName = "UserItem";

// Memoized Skeleton component
const ActiveNowSkeleton = memo(() => {
  const skeletons = useMemo(() => Array.from({ length: 4 }), []);

  return (
    <div className="active-now-list h-100">
      <div className="users-container h-100">
        <div
          className="d-flex flex-column gap-1"
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
                      className="skeleton-blink2 rounded-4"
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
                    className="skeleton-blink rounded-4"
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

ActiveNowSkeleton.displayName = "ActiveNowSkeleton";

// Memoized EmptyState component
const EmptyState = memo(
  ({
    t,
  }: {
    t: (typeof activeNowTranslations)[keyof typeof activeNowTranslations];
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
          aria-label={t.noOneOnlineMessage}
        >
          <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022zM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816zM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 2.16-1.275zM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
        </svg>
        <p className="text-white m-0 small px-2">{t.noOneOnlineMessage}</p>
      </div>
    </div>
  )
);

EmptyState.displayName = "EmptyState";

export const ActiveNowList: React.FC<ActiveNowListProps> = ({
  currentUser,
  onStartDM,
}) => {
  const [isLoadingSkeleton, setIsLoadingSkeleton] = useState(true);
  const { selectedLanguage } = useShopContext();
  const { onlineFriends } = useFriends();
  const { onlineUsers } = useUsersContext();

  // Memoize translation to prevent recalculation
  const t = useMemo(
    () =>
      activeNowTranslations[
        selectedLanguage.code as keyof typeof activeNowTranslations
      ],
    [selectedLanguage.code]
  );

  // Memoize active friends list with optimized filtering
  const userFriends = useMemo(() => {
    // Create a Set of friend IDs for O(1) lookups
    const currentUserFriendIds = new Set(
      onlineFriends?.map((friend) => friend.id) || []
    );

    // Early return if no friends or online users
    if (!onlineUsers.length || !currentUserFriendIds.size) {
      return [];
    }

    // Filter users in a single pass
    const friends: User[] = [];

    for (const user of onlineUsers) {
      if (
        user.isOnline &&
        user.id !== currentUser.id &&
        currentUserFriendIds.has(user.id)
      ) {
        friends.push({
          id: user.id,
          username: user.username,
          email: user.email || "",
          image: user.image,
          isOnline: true,
          dateOfBirth: user.dateOfBirth || new Date(),
          currentChannelId: user.currentChannelId || "1",
        });
      }
    }

    return friends;
  }, [onlineUsers, onlineFriends, currentUser.id]);

  // Memoize the container style
  const containerStyle = useMemo(
    () => ({
      height: "100%",
      overflowY: "auto" as const,
    }),
    []
  );

  // Handle loading state effect
  useEffect(() => {
    let mounted = true;

    if (onlineFriends !== undefined) {
      const timer = setTimeout(() => {
        if (mounted) {
          setIsLoadingSkeleton(false);
        }
      }, 500);

      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    }

    return () => {
      mounted = false;
    };
  }, [onlineFriends]);

  // Memoize the DM handler to prevent recreation - MUST BE CALLED BEFORE ANY CONDITIONAL RETURNS
  const handleStartDM = useCallback(
    (userId: string) => {
      onStartDM(userId);
    },
    [onStartDM]
  );

  // Render loading skeleton
  if (isLoadingSkeleton) {
    return <ActiveNowSkeleton />;
  }

  // Early return for empty state
  if (userFriends.length === 0) {
    return <EmptyState t={t} />;
  }

  return (
    <div className="h-100">
      <div className="users-container h-100">
        <div className="d-flex flex-column gap-1" style={containerStyle}>
          <div className="channel-group d-flex flex-column gap-2">
            <div className="d-flex m-0 mb-1">
              <h6 className="d-flex m-0 mb-0 text-white">
                {t.online}&nbsp;&nbsp;&nbsp;—&nbsp;&nbsp;&nbsp;
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
