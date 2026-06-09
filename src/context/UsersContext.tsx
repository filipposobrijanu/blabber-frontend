// context/UsersContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useMemo,
} from "react";
import { User } from "../types/chat";

interface UsersContextType {
  users: Record<string, User>;
  getUserById: (userId: string) => User | undefined;
  setUser: (user: User | null) => void;
  setUsers: (users: User[]) => void;
  getUsersByIds: (userIds: string[]) => User[];
  onlineUsers: User[];
  setOnlineUsers: (users: User[]) => void;
}

const UsersContext = createContext<UsersContextType | undefined>(undefined);

interface UsersProviderProps {
  children: ReactNode;
}

export const UsersProvider: React.FC<UsersProviderProps> = React.memo(
  ({ children }) => {
    const [users, setUsersState] = useState<Record<string, User>>({});
    const [onlineUsers, setOnlineUsersState] = useState<User[]>([]);

    const getUserById = useCallback(
      (userId: string): User | undefined => {
        return users[userId];
      },
      [users],
    );

    const getUsersByIds = useCallback(
      (userIds: string[]): User[] => {
        return userIds.map((id) => users[id]).filter(Boolean) as User[];
      },
      [users],
    );

    const setUser = useCallback((user: User | null) => {
      if (user === null) {
        setUsersState({});
        setOnlineUsersState([]);
      } else {
        setUsersState((prev) => ({
          ...prev,
          [user.id]: user,
        }));
      }
    }, []);

    const setUsers = useCallback((usersArray: User[]) => {
      setUsersState((prev) => {
        const newUsers = { ...prev };
        usersArray.forEach((user) => {
          newUsers[user.id] = user;
        });
        return newUsers;
      });
    }, []);

    const setOnlineUsers = useCallback((usersArray: User[]) => {
      setOnlineUsersState(usersArray);
      setUsersState((prev) => {
        const newUsers = { ...prev };
        usersArray.forEach((user) => {
          if (newUsers[user.id]) {
            newUsers[user.id] = { ...newUsers[user.id], isOnline: true };
          } else {
            newUsers[user.id] = user;
          }
        });
        return newUsers;
      });
    }, []);

    const value: UsersContextType = useMemo(
      () => ({
        users,
        getUserById,
        getUsersByIds,
        setUser,
        setUsers,
        onlineUsers,
        setOnlineUsers,
      }),
      [
        users,
        onlineUsers,
        getUserById,
        getUsersByIds,
        setUser,
        setUsers,
        setOnlineUsers,
      ],
    );

    return (
      <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
    );
  },
);

export const useUsersContext = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }
  return context;
};
