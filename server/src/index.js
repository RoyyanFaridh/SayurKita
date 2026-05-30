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

const app    = express();
const server = http.createServer(app);
const prisma = new PrismaClient();
const PORT   = process.env.PORT || 5000;

// ─── Socket.io Setup ────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH"],
    credentials: true,
  },
});

// Simpan instance io ke app agar bisa diakses dari controller via req.app.get("io")
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
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Serve static folder untuk akses gambar yang diupload
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

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
  });
});

// ─── Bootstrap: Pastikan ekstensi PostGIS aktif sebelum server listen ──
async function bootstrap() {
  try {
    // Aktifkan ekstensi PostGIS secara aman — IF NOT EXISTS mencegah error
    // jika ekstensi sudah terpasang sebelumnya
    await prisma.$executeRawUnsafe(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    console.log("[Bootstrap] Ekstensi PostGIS berhasil diaktifkan.");
  } catch (err) {
    // Non-fatal: jika Railway sudah punya PostGIS atau tidak support,
    // server tetap bisa jalan untuk fitur non-spasial
    console.warn("[Bootstrap] Peringatan PostGIS:", err.message);
  }

  // Server baru listen SETELAH bootstrap selesai
  server.listen(PORT, () => {
    console.log(`SayurKita server running on http://localhost:${PORT}`);
    console.log(`[Socket.io] WebSocket server ready on port ${PORT}`);
  });
}

bootstrap();
