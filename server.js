const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const crypto = require("crypto");
const path = require("path");

const app = express();
const httpServer = createServer(app);

const CORS_ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["capacitor://localhost", "ionic://localhost", "http://localhost"];

const io = new Server(httpServer, {
  cors: {
    origin: CORS_ORIGINS,
    methods: ["GET", "POST"],
  },
});

const PORT = process.env.PORT || 3000;

// --- In-memory state ---

const rooms = new Map();

function generateInviteCode() {
  return crypto.randomBytes(3).toString("hex");
}

// --- CORS for native apps ---

app.use((_req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// --- Static files ---

app.use(express.static(path.join(__dirname, "public")));

// --- REST API ---

app.use(express.json());

app.post("/api/rooms", (_req, res) => {
  const inviteCode = generateInviteCode();
  rooms.set(inviteCode, {
    createdAt: Date.now(),
    messages: [],
    members: new Map(),
  });
  res.json({ inviteCode });
});

app.get("/api/rooms/:code/exists", (req, res) => {
  res.json({ exists: rooms.has(req.params.code) });
});

// --- Socket.IO ---

io.on("connection", (socket) => {
  let currentRoom = null;
  let currentName = null;

  socket.on("join-room", ({ inviteCode, username }, callback) => {
    const room = rooms.get(inviteCode);
    if (!room) {
      return callback({ ok: false, error: "ルームが見つかりません" });
    }

    const nameTaken = [...room.members.values()].some(
      (n) => n === username && [...room.members.keys()].find((k) => room.members.get(k) === n) !== socket.id,
    );
    if (nameTaken) {
      return callback({ ok: false, error: "この名前は既に使われています" });
    }

    currentRoom = inviteCode;
    currentName = username;
    room.members.set(socket.id, username);
    socket.join(inviteCode);

    callback({
      ok: true,
      history: room.messages.slice(-100),
    });

    io.to(inviteCode).emit("members-updated", getMemberList(inviteCode));
    io.to(inviteCode).emit("system-message", {
      text: `${username} が参加しました`,
      timestamp: Date.now(),
    });
  });

  socket.on("chat-message", ({ text }) => {
    if (!currentRoom || !currentName) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    const msg = {
      id: crypto.randomUUID(),
      sender: currentName,
      text: text.slice(0, 2000),
      timestamp: Date.now(),
    };
    room.messages.push(msg);

    if (room.messages.length > 500) {
      room.messages = room.messages.slice(-300);
    }

    io.to(currentRoom).emit("chat-message", msg);
  });

  socket.on("typing", () => {
    if (!currentRoom || !currentName) return;
    socket.to(currentRoom).emit("typing", { username: currentName });
  });

  socket.on("stop-typing", () => {
    if (!currentRoom || !currentName) return;
    socket.to(currentRoom).emit("stop-typing", { username: currentName });
  });

  socket.on("disconnect", () => {
    if (!currentRoom) return;
    const room = rooms.get(currentRoom);
    if (!room) return;

    room.members.delete(socket.id);
    io.to(currentRoom).emit("members-updated", getMemberList(currentRoom));
    io.to(currentRoom).emit("system-message", {
      text: `${currentName} が退出しました`,
      timestamp: Date.now(),
    });

    if (room.members.size === 0) {
      setTimeout(() => {
        const r = rooms.get(currentRoom);
        if (r && r.members.size === 0) {
          rooms.delete(currentRoom);
        }
      }, 30 * 60 * 1000);
    }
  });
});

function getMemberList(inviteCode) {
  const room = rooms.get(inviteCode);
  if (!room) return [];
  return [...room.members.values()];
}

// --- Start ---

httpServer.listen(PORT, () => {
  console.log(`Chat server running on http://localhost:${PORT}`);
});
