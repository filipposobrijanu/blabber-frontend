import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "../types/chat";

export const useSocket = (url: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket<
    ServerToClientEvents,
    ClientToServerEvents
  > | null>(null);

  useEffect(() => {
    // Create socket connection
    socketRef.current = io(url);

    socketRef.current.on("connect", () => {
      setIsConnected(true);
      console.log("Connected to server");
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
      console.log("Disconnected from server");
    });

    // Cleanup function
    return () => {
      socketRef.current?.disconnect();
    };
  }, [url]);

  return { socket: socketRef.current, isConnected };
};
