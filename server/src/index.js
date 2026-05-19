require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const ingredientRoutes = require("./routes/ingredientRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    success: true,
    message: "API SayurKita aktif - Jangan Buang, Jadikan Berkah.",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || "http://localhost:8003";

app.post("/api/recommend", async (req, res) => {
  try {
    let upstream;
    try {
      upstream = await fetch(`${AI_SERVICE_URL}/recommend-ai`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req.body),
      });
    } catch (fetchErr) {
      console.error("Fetch error connecting to AI service:", fetchErr.message);
      return res.status(502).json({
        success: false,
        message:
          "Layanan AI tidak dapat dijangkau. Pastikan FastAPI berjalan di port 8003.",
        error: fetchErr.message,
      });
    }

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : null;
    } catch (parseErr) {
      console.error("JSON parse error:", parseErr.message);
      return res.status(502).json({
        success: false,
        message: "Respons layanan AI tidak valid (format bukan JSON).",
        error: "Invalid JSON response from AI service",
      });
    }

    if (!upstream.ok) {
      return res.status(upstream.status).json({
        success: false,
        message: payload?.message || "Layanan AI mengembalikan error.",
        detail: payload,
      });
    }

    return res.status(upstream.status).json(payload);
  } catch (err) {
    console.error("Proxy /api/recommend:", err);
    return res.status(502).json({
      success: false,
      message: "Terjadi kesalahan saat menghubungi layanan AI.",
      error: err.message,
    });
  }
});

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
