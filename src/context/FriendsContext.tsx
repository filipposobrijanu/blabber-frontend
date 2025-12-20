import React, { createContext, useContext, useState, useCallback } from "react";
import { Friend, FriendRequest, User } from "../types/chat";
import { useUsersContext } from "./UsersContext";

interface FriendsContextType {
  friends: Friend[];
  friendRequests: FriendRequest[];
  onlineFriends: User[];
  addFriend: (friend: Friend) => void;
  removeFriend: (friendId: string) => void;
  addFriendRequest: (request: FriendRequest) => void;
  removeFriendRequest: (requestId: string) => void;
  refreshFriends: () => Promise<void>;
  refreshFriendRequests: () => Promise<void>;
}

const FriendsContext = createContext<FriendsContextType | undefined>(undefined);

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { users, onlineUsers } = useUsersContext();

  const [friends, setFriends] = useState<Friend[]>([]);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);

  const onlineFriends = React.useMemo(() => {
    console.log("🔄 FRIENDS CONTEXT - onlineUsers count:", onlineUsers?.length);

    if (!friends.length || !onlineUsers?.length) return [];

    return friends
      .filter((friend) =>
        onlineUsers.some((onlineUser) => onlineUser.id === friend.friendId)
      )
      .map((friend) => {
        const userData = onlineUsers.find((u) => u.id === friend.friendId);
        return {
          id: friend.friendId,
          username:
            friend.username || userData?.username || `User ${friend.friendId}`,
          email: userData?.email || "",
          image:
            friend.image ||
            userData?.image ||
            `https://ui-avatars.com/api/?name=${
              friend.username || "User"
            }&background=random`,
          isOnline: true,
          dateOfBirth: userData?.dateOfBirth || new Date(),
          currentChannelId: userData?.currentChannelId || "1",
        } as User;
      });
  }, [friends, onlineUsers]);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const addFriend = useCallback((friend: Friend) => {
    setFriends((prev) => {
      const exists = prev.some((f) => f.id === friend.id);
      if (exists) return prev;
      return [...prev, friend];
    });
  }, []);

  const removeFriend = useCallback((friendId: string) => {
    setFriends((prev) => prev.filter((f) => f.friendId !== friendId));
  }, []);

  const addFriendRequest = useCallback((request: FriendRequest) => {
    setFriendRequests((prev) => {
      const exists = prev.some((r) => r.id === request.id);
      if (exists) return prev;
      return [...prev, request];
    });
  }, []);

  const removeFriendRequest = useCallback((requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
  }, []);

  const refreshFriends = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        console.warn("⚠️ No user ID found");
        return;
      }

      console.log(`🔄 Refreshing friends for user: ${user.id}`);

      const response = await fetch(`${API_URL}/api/friends/${user.id}`);

      if (!response.ok) {
        console.error(
          `❌ Friends fetch failed with status ${response.status}`,
          await response.text()
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setFriends(data.friends);
        console.log("✅ Friends refreshed:", data.friends.length);
      }
    } catch (error) {
      console.error("Error refreshing friends:", error);
    }
  }, [API_URL]);

  const refreshFriendRequests = useCallback(async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user.id) {
        console.warn("⚠️ No user ID found");
        return;
      }

      console.log(`🔄 Refreshing friend requests for user: ${user.id}`);

      const response = await fetch(
        `${API_URL}/api/friends/requests/${user.id}`
      );

      if (!response.ok) {
        console.error(
          `❌ Friend requests fetch failed with status ${response.status}`,
          await response.text()
        );
        return;
      }

      const data = await response.json();

      if (data.success) {
        setFriendRequests(data.requests);
        console.log(
          "✅ Friend requests refreshed:",
          data.requests.length,
          data.requests
        );
      }
    } catch (error) {
      console.error("Error refreshing friend requests:", error);
    }
  }, [API_URL]);

  return (
    <FriendsContext.Provider
      value={{
        friends,
        friendRequests,
        onlineFriends,
        addFriend,
        removeFriend,
        addFriendRequest,
        removeFriendRequest,
        refreshFriends,
        refreshFriendRequests,
      }}
    >
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  const context = useContext(FriendsContext);
  if (context === undefined) {
    throw new Error("useFriends must be used within a FriendsProvider");
  }
  return context;
};
