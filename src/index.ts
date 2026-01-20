import { WebSocketServer } from "ws";
import fs from "fs";

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

console.log(`WebSocket server is starting on ws://localhost:${PORT}...`);

wss.on("connection", (socket) => {
  console.log("✅ New client connected");

  const file = fs.createWriteStream("meeting.webm");
  console.log("📁 File stream created for meeting.webm");

  socket.on("message", (data) => {
    file.write(data);
    console.log(`📦 Received chunk of size: random bytes`);
  });

  socket.on("close", () => {
    file.end();
    console.log("❌ Client disconnected, file saved as meeting.webm");
  });

  socket.on("error", (err) => {
    console.error("⚠️ Socket error:", err);
  });
});

wss.on("listening", () => {
  console.log(`🚀 WebSocket server listening on ws://localhost:${PORT}`);
});

wss.on("error", (err) => {
  console.error("⚠️ WebSocket server error:", err);
});
