require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

const authRoutes              = require("./routes/authRoutes");
const ingredientRoutes        = require("./routes/ingredientRoutes");
const ingredientsMasterRoutes = require('./routes/ingredientMasterRoutes');
const dashboardRoutes         = require("./routes/dashboardRoutes");
const recommendRoutes         = require("./routes/recommendRoutes");
const surplusRoutes           = require("./routes/surplusRoutes");
const cookingLogRoutes        = require("./routes/cookingLogRoutes");
const poinRoutes              = require("./routes/poinRoutes");
const statsRoutes             = require("./routes/statsRoutes");

const app    = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT   = process.env.PORT || 5000;

const ALLOWED_ORIGINS = [
  "https://sayurkita-berkah.netlify.app",
  "http://localhost:5173",
  "http://localhost:3000",
];

const corsOptions = {
  origin: ALLOWED_ORIGINS,
  credentials: true,
};

// ─── Socket.io Setup ────────────────────────────────────────────────
const io = new Server(server, {
  cors: corsOptions,
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log(`[Socket.io] Client connected: ${socket.id}`);

  socket.on("joinChat", (postId) => {
    socket.join(`chat_${postId}`);
    console.log(`[Socket.io] Socket ${socket.id} joined room chat_${postId}`);
  });

  socket.on("leaveChat", (postId) => {
    socket.leave(`chat_${postId}`);
    console.log(`[Socket.io] Socket ${socket.id} left room chat_${postId}`);
  });

  socket.on("disconnect", () => {
    console.log(`[Socket.io] Client disconnected: ${socket.id}`);
  });
});

// ─── Middleware ──────────────────────────────────────────────────────
app.use(cors(corsOptions));
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// ─── Routes ─────────────────────────────────────────────────────────
app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API SayurKita aktif - Jangan Buang, Jadikan Berkah.",
  });
});


app.use("/api/auth",               authRoutes);
app.use("/api/ingredients",        ingredientRoutes);
app.use("/api/ingredients-master", ingredientsMasterRoutes);
app.use("/api/dashboard",          dashboardRoutes);
app.use("/api/recommend",          recommendRoutes);
app.use("/api/surplus",            surplusRoutes);
app.use("/api/cooking-logs",       cookingLogRoutes);
app.use("/api/poin",               poinRoutes);
app.use("/api/stats",              statsRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
  });
});

const { runExpiryNotifier, runExpiryCheck } = require('../src/utils/expiryNotifier');

app.get('/api/test-expiry', async (_req, res) => {
  const total = await runExpiryCheck();
  res.json({ success: true, message: `Email dikirim ke ${total} user` });
});

runExpiryNotifier();

server.listen(PORT, () => {
  console.log(`SayurKita server running on http://localhost:${PORT}`);
  console.log(`[Socket.io] WebSocket server ready on port ${PORT}`);
});