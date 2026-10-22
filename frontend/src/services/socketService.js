import { io } from "socket.io-client";

let socketInstance = null;

export const getSocket = () => {
  if (!socketInstance) {
    // Connect to backend (proxied in dev or direct localhost:5000 fallback)
    socketInstance = io("/", {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
    });

    socketInstance.on("connect", () => {
      console.log("[WebSocket] Connected successfully with ID:", socketInstance.id);
      const userRaw = localStorage.getItem("bakelytics_user");
      if (userRaw) {
        try {
          const user = JSON.parse(userRaw);
          if (user?.id) {
            socketInstance.emit("joinUserRoom", user.id);
          }
        } catch (e) {
          // ignore
        }
      }
    });

    socketInstance.on("connect_error", (err) => {
      console.warn("[WebSocket] Connection fallback/warning:", err.message);
    });
  }

  return socketInstance;
};

export const joinUserSocketRoom = (userId) => {
  const socket = getSocket();
  if (socket && userId) {
    socket.emit("joinUserRoom", userId);
  }
};
