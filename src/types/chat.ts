export interface User {
  id: string;
  username: string;
  email: string;
  isOnline: boolean;
  dateOfBirth: Date;
  lastSeen?: Date | string;
  image: string;
  currentChannelId?: string;
  socketId?: string;
}
export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  status: "pending" | "accepted" | "rejected" | "blocked";
  createdAt: Date;
  fromUser?: {
    id: string;
    username: string;
    email: string;
    image?: string;
    isOnline: boolean;
  };
}

export interface Friend {
  id: string;
  userId: string;
  friendId: string | User;
  friendsSince: Date | string;
  // For populated friend data
  username?: string;
  email?: string;
  image?: string;
  isOnline?: boolean;
  lastSeen?: Date | string;
}
export interface MessageSeen {
  userId: string;
  timestamp: Date;
}

export interface Message {
  id: string;
  content: string;
  userId: string;
  username: string;
  channelId: string;
  userImage: string;
  type: "text" | "image" | "file" | "gif";
  timestamp: Date | string;
  editedAt?: Date | string;
  seenBy: MessageSeen[];
  deliveredTo: string[];
}

export interface Channel {
  id: string;
  name: string;
  bgcolor: string;
  image?: string;
  description?: string;
  isPrivate: boolean;
  createdBy: string;
  members: string[];
  createdAt?: Date | string;
  inviteLink?: string;
  inviteCode?: string;
  isDM?: boolean;
  displayName?: string;
  participants?: Array<{
    userId: string;
    username: string;
    image?: string;
  }>;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  messages: Message[];
}

export interface TypingIndicator {
  userId: string;
  username: string;
  channelId: string;
  isTyping: boolean;
}

// ADD THIS NEW INTERFACE
export interface UnreadUpdate {
  channelId: string;
  count: number;
}
export interface BatchedMessage {
  id: string;
  content: string;
  userId: string;
  username: string;
  channelId: string;
  userImage?: string;
  type: "text" | "image" | "file" | "gif";
  timestamp: Date | string;
  seenBy?: MessageSeen[];
}

export interface MessageBatch {
  channelId: string;
  messages: BatchedMessage[];
  batchSize: number;
}
export interface ServerToClientEvents {
  "user:joined": (user: User, channelId: string) => void;
  "user:left": (user: User, channelId: string) => void;
  "user:updated": (user: User) => void;
  "message:receive": (message: Message) => void;
  "message:updated": (message: Message) => void;
  "message:batch": (data: MessageBatch) => void;
  "message:deleted": (data: { messageId: string; channelId: string }) => void;
  "user:typing": (data: TypingIndicator) => void;
  "user:online": (users: User[]) => void;
  "channel:created": (channel: Channel) => void;
  "channel:updated": (channel: Channel) => void;
  "channel:list": (channelList: Channel[]) => void;
  "message:history": (messageHistory: Message[]) => void;
  "channel:joined": (channel: Channel) => void;
  "channel:create_error": (error: string) => void;
  error: (data: { message: string }) => void;
  "message:seen": (data: {
    messageId: string;
    userId: string;
    username: string;
    timestamp: Date;
    channelId: string;
  }) => void;
  "unread:update": (data: UnreadUpdate) => void; // ADD THIS LINE
  "friend:request:sent": (data: {
    requestId: string;
    fromUser: User;
    toUserId: string;
  }) => void;
  "friend:request:accepted": (data: {
    requestId: string;
    fromUser: User;
    toUser: User;
  }) => void;
  "friend:request:rejected": (data: {
    requestId: string;
    fromUserId: string;
    toUserId: string;
  }) => void;
  "friend:removed": (data: { userId: string; friendId: string }) => void;
  "friends:online": (friends: User[]) => void;
  "dm:channel:created": (data: {
    channel: Channel;
    participants: string[];
  }) => void;
  "message:new": (message: Message) => void;
  "channel:mark-read": (data: { channelId: string; userId: string }) => void;
}

export interface ClientToServerEvents {
  "user:join": (userData: User, channelId?: string) => void;
  "user:logout": (userId?: string) => void;
  "user:update": (userData: User) => void;
  "message:send": (messageData: {
    id?: string;
    content: string;
    userId: string;
    username?: string;
    channelId: string;
    type: "text" | "image" | "file" | "gif";
  }) => void;
  "message:seen": (data: { messageId: string; userId: string }) => void;
  "message:edited": (messageData: {
    id: string;
    content: string;
    channelId: string;
  }) => void;
  "message:new": (messageData: {
    content: string;
    userId: string;
    channelId: string;
    type: "text" | "image" | "file" | "gif";
  }) => void;

  "channel:mark-read": (data: { channelId: string; userId: string }) => void;
  "user:typing": (typingData: TypingIndicator) => void;
  "user:switchChannel": (userId: string, newChannelId: string) => void;
  "channel:join": (channelId: string, userId: string) => void;
  "friend:request:read": (data: { userId: string }) => void;
  "friend:online": (userId: string) => void;
}
