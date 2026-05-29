const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Pastikan folder untuk menyimpan upload sudah ada
const uploadDir = path.join(__dirname, "../../public/uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi storage Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "surplus-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Filter khusus untuk file gambar
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
    return cb(null, true);
  } else {
    return cb(new Error("Hanya file gambar (jpg, jpeg, png) yang diperbolehkan!"), false);
  }
};

// Batasan ukuran file (Maks 2MB)
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: fileFilter,
});

module.exports = upload;
