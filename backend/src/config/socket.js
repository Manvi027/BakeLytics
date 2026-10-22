let ioInstance = null;

export const initSocket = (io) => {
  ioInstance = io;

  io.on("connection", (socket) => {
    // Client joins room for their user ID so notifications are targeted
    socket.on("joinUserRoom", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
      }
    });

    socket.on("disconnect", () => {
      // client disconnected
    });
  });
};

export const getIO = () => {
  return ioInstance;
};

// Emit notification to a specific user and broadcast to their active sessions
export const emitNotification = (userId, notification) => {
  if (ioInstance && userId) {
    ioInstance.to(`user_${userId}`).emit("notification", notification);
    ioInstance.to(`user_${userId}`).emit("inventoryUpdate", notification);
  }
};
