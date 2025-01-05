import http from "http";
import path from "path";
import express from "express";
import { Server as SocketIOServer, Socket } from "socket.io";
import Logger from "./utils/logger";

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server);
const logger = new Logger();

app.use(express.static(path.join(__dirname, "../../client/public")));

const db = new Map<string, string[]>();

io.on("connection", (socket: Socket) => {
  logger.info(`New socket connection: ${socket.id}`);

  socket.on(
    "chat:join",
    (
      { username, chat }: { username: string; chat: string },
      callback: ({ success, message }: { success: boolean; message?: string }) => void
    ) => {
      const chatData = db.get(chat);
      if (!chatData) {
        db.set(chat, [username]);
        callback({ success: true });
      } else {
        if (chatData.includes(username)) {
          callback({
            success: false,
            message: "This username is already taken. Please choose another name.",
          });
          return;
        } else {
          chatData.push(username);
          callback({ success: true });
        }
      }

      socket.join(chat);

      logger.info(`${username} joined chat: ${chat}`);

      socket.to(chat).emit("message", {
        sender: null,
        message: `${username} has joined the chat`,
        timestamp: new Date(),
      });

      socket.on("chat:get-info", () => {
        socket.emit("chat-info", db.get(chat));
      });

      socket.on("chat:message", ({ message: incomingMsg }: { message: string }) => {
        io.to(chat).emit("message", {
          sender: username,
          message: incomingMsg,
          timestamp: new Date(),
        });
      });

      socket.on("disconnect", (reason) => {
        logger.info(`Socket ${socket.id} disconnected due to ${reason}`);

        db.set(
          chat,
          db.get(chat)!.filter((u) => u !== username)
        );

        socket.to(chat).emit("message", {
          sender: null,
          message: `${username} has left the chat`,
          timestamp: new Date(),
        });
      });
    }
  );
});

const PORT = 3000;
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});
