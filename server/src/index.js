require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");
const ingredientsMasterRoutes = require('./routes/ingredientMasterRoutes')
const dashboardRoutes = require("./routes/dashboardRoutes");
const recommendRoutes = require("./routes/recommendRoutes");
const surplusRoutes = require("./routes/surplusRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

// Serve static folder untuk akses gambar yang diupload
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API SayurKita aktif - Jangan Buang, Jadikan Berkah.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);
app.use('/api/ingredients-master', ingredientsMasterRoutes)
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/surplus", surplusRoutes);

app.use((err, _req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    success: false,
    message: "Terjadi kesalahan pada server.",
  });
});

app.listen(PORT, () => {
  console.log(`SayurKita server running on http://localhost:${PORT}`);
});
