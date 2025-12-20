import React, { useCallback, memo } from "react";
import { FriendRequest } from "../../types/chat";
import { FriendRequestItemTranslations } from "./FriendRequestItemTranslations";
import { useShopContext } from "../../hooks/useShopContext";

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (requestId: string) => void;
  onReject: (requestId: string) => void;
}

const DefaultAvatar = memo(() => (
  <div
    className="rounded-circle d-flex align-items-center justify-content-center"
    style={{
      backgroundColor: "#292929ff",
      width: "36px",
      height: "36px",
      border: "2px solid rgba(255, 255, 255, 0.1)",
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
));

DefaultAvatar.displayName = "DefaultAvatar";

export const FriendRequestItem: React.FC<FriendRequestItemProps> = memo(
  ({ request, onAccept, onReject }) => {
    const fromUser = request.fromUser;
    const { selectedLanguage } = useShopContext();

    const t =
      FriendRequestItemTranslations[
        selectedLanguage.code as keyof typeof FriendRequestItemTranslations
      ];

    // Early return for missing data
    if (!fromUser) {
      console.warn("⚠️ FriendRequestItem: fromUser is missing", request);
      return null;
    }

    const username = fromUser.username || t.unknownUser;
    const displayName = fromUser.username || t.user;

    const handleAccept = useCallback(() => {
      onAccept(request.id);
    }, [onAccept, request.id]);

    const handleReject = useCallback(() => {
      onReject(request.id);
    }, [onReject, request.id]);

    const handleImageError = useCallback(
      (e: React.SyntheticEvent<HTMLImageElement>) => {
        const target = e.target as HTMLImageElement;
        target.style.display = "none";
      },
      []
    );

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "#17682aff";
      },
      []
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.background = "#1f8a38ff";
      },
      []
    );

    return (
      <div className="d-flex align-items-center justify-content-between p-2 rounded-5 mb-2 channel_buttt">
        <div className="d-flex align-items-center gap-2">
          <div className="position-relative">
            {fromUser.image ? (
              <img
                src={fromUser.image}
                width="36"
                height="36"
                className="rounded-circle"
                alt={displayName}
                style={{
                  objectFit: "cover",
                  border: "2px solid rgba(255, 255, 255, 0.1)",
                }}
                onError={handleImageError}
                loading="lazy"
              />
            ) : (
              <DefaultAvatar />
            )}
          </div>
          <div className="flex-grow-1 min-width-0">
            <div
              className="text-white fw-semibold text-truncate"
              style={{
                maxWidth: "clamp(110px, 50vw, 250px)",
              }}
            >
              {username}
            </div>
            <small style={{ color: "#ffffffa8" }}>
              {t.wantsToBeYourFriend}
            </small>
          </div>
        </div>
        <div className="d-flex gap-1 flex-shrink-0">
          <button
            className="btn btn-sm p-1 px-2 rounded-4 accept-button"
            style={{
              background: "#1f8a38ff",
              color: "white",
              fontSize: "0.8rem",
              transition: "all 0.15s ease",
            }}
            onClick={handleAccept}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            {t.accept}
          </button>
          <button
            className="btn btn-sm btn-outline-light p-1 px-2 rounded-4"
            style={{
              color: "white",
              fontSize: "0.8rem",
              transition: "all 0.15s ease",
            }}
            onClick={handleReject}
          >
            {t.reject}
          </button>
        </div>
      </div>
    );
  }
);

FriendRequestItem.displayName = "FriendRequestItem";
