const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { sendEmail } = require("../utils/sendEmail");
const { otpTemplate } = require("../utils/emailTemplates");

const prisma = new PrismaClient();
const OTP_LENGTH = 6;
const OTP_EXPIRE_MINUTES = 5;

const generateOtp = () =>
  Math.floor(10 ** (OTP_LENGTH - 1) + Math.random() * 9 * 10 ** (OTP_LENGTH - 1)).toString();

const generateOtpExpiry = () => new Date(Date.now() + OTP_EXPIRE_MINUTES * 60 * 1000);

const normalizePhone = (phone) => {
  if (!phone || typeof phone !== "string") return null;
  const raw = phone.trim().replace(/[^\d+]/g, "");
  let normalized = raw;
  if (raw.startsWith("+62"))     normalized = raw;
  else if (raw.startsWith("62")) normalized = `+${raw}`;
  else if (raw.startsWith("08")) normalized = `+62${raw.slice(1)}`;
  else if (raw.startsWith("8"))  normalized = `+62${raw}`;
  return /^\+62\d{8,13}$/.test(normalized) ? normalized : null;
};

const issueToken = (userId) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not configured.");
  return jwt.sign({ userId }, secret, { expiresIn: "7d" });
};

const resolveIdentity = ({ identity, identifier, email, phone }) => {
  const rawIdentity = identity || identifier;
  if (rawIdentity && typeof rawIdentity === "string") {
    const normalized = rawIdentity.trim();
    if (normalized.includes("@")) return { email: normalized.toLowerCase() };
    return { phone: normalized };
  }
  if (email && typeof email === "string") return { email: email.trim().toLowerCase() };
  if (phone && typeof phone === "string") return { phone: phone.trim() };
  return null;
};

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: "Name, email, phone, dan password wajib diisi." });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedPhone = normalizePhone(phone);

    if (!normalizedPhone) {
      return res.status(400).json({ success: false, message: "Format nomor HP harus menggunakan +62." });
    }

    const existingUser = await prisma.user.findFirst({
      where: { OR: [{ email: normalizedEmail }, { phone: normalizedPhone }] },
    });

    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email atau nomor HP sudah terdaftar." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otpCode = generateOtp();
    const otpExpires = generateOtpExpiry();

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        password: hashedPassword,
        otpCode,
        otpExpires,
      },
      select: { id: true, name: true, email: true, phone: true, isVerified: true, points: true },
    });

    await sendEmail({
      to: normalizedEmail,
      subject: 'Kode OTP SayurKita',
      html: otpTemplate(otpCode, OTP_EXPIRE_MINUTES),
    });
    console.log(`[SayurKita OTP] ${normalizedEmail} -> ${otpCode}`);

    return res.status(201).json({
      success: true,
      message: "Registrasi berhasil. Kode OTP telah dikirim via Email.",
      data: user,
    });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat registrasi." });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { otpCode } = req.body;
    const identity = resolveIdentity(req.body);

    if (!identity || !otpCode) {
      return res.status(400).json({ success: false, message: "Identity (email/phone) dan OTP wajib diisi." });
    }

    if (identity.phone) {
      const normalizedPhone = normalizePhone(identity.phone);
      if (!normalizedPhone) {
        return res.status(400).json({ success: false, message: "Format nomor HP tidak valid." });
      }
      identity.phone = normalizedPhone;
    }

    if (identity.email) identity.email = identity.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: identity });

    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    if (!user.otpCode || !user.otpExpires) {
      return res.status(400).json({ success: false, message: "OTP tidak tersedia. Silakan kirim ulang OTP." });
    }
    if (user.otpExpires < new Date()) {
      return res.status(400).json({ success: false, message: "OTP sudah kedaluwarsa. Silakan kirim ulang OTP." });
    }
    if (user.otpCode !== String(otpCode).trim()) {
      return res.status(400).json({ success: false, message: "OTP tidak valid." });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, otpCode: null, otpExpires: null },
    });

    return res.status(200).json({ success: true, message: "Verifikasi berhasil. Jangan Buang, Jadikan Berkah." });
  } catch (error) {
    console.error("verifyOTP error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat verifikasi OTP." });
  }
};

exports.login = async (req, res) => {
  try {
    const { password } = req.body;
    const identity = resolveIdentity(req.body);

    if (!identity || !password) {
      return res.status(400).json({ success: false, message: "Identity (email/phone) dan password wajib diisi." });
    }

    let user;

    if (identity.phone) {
      const normalizedPhone = normalizePhone(identity.phone);
      if (!normalizedPhone) {
        user = await prisma.user.findFirst({
          where: { name: { equals: identity.phone, mode: "insensitive" } },
        });
      } else {
        user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
      }
    } else if (identity.email) {
      identity.email = identity.email.toLowerCase();
      user = await prisma.user.findUnique({ where: { email: identity.email } });
    }

    if (!user) {
      return res.status(401).json({ success: false, message: "Email/nomor HP/Nama atau password salah." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Email/nomor HP atau password salah." });
    }

    if (!user.isVerified) {
      return res.status(403).json({ success: false, message: "Akun belum terverifikasi. Silakan verifikasi OTP terlebih dahulu." });
    }

    const token = issueToken(user.id);

    return res.status(200).json({
      success: true,
      message: "Login berhasil.",
      token,
      data: { id: user.id, name: user.name, email: user.email, phone: user.phone, points: user.points },
    });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat login." });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const identity = resolveIdentity(req.body);
    if (!identity) {
      return res.status(400).json({ success: false, message: "Identity (email/phone) wajib diisi." });
    }

    if (identity.phone) {
      const normalizedPhone = normalizePhone(identity.phone);
      if (!normalizedPhone) {
        return res.status(400).json({ success: false, message: "Format nomor HP harus menggunakan +62." });
      }
      identity.phone = normalizedPhone;
    }

    if (identity.email) identity.email = identity.email.toLowerCase();

    const user = await prisma.user.findUnique({ where: identity });

    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });
    if (user.isVerified) return res.status(400).json({ success: false, message: "Akun sudah terverifikasi." });

    const otpCode = generateOtp();
    const otpExpires = generateOtpExpiry();

    await prisma.user.update({ where: { id: user.id }, data: { otpCode, otpExpires } });

    await sendEmail({
      to: user.email,
      subject: 'Kode OTP SayurKita',
      html: otpTemplate(otpCode, OTP_EXPIRE_MINUTES),
    });
    console.log(`[SayurKita OTP] Resend ${user.email} -> ${otpCode}`);

    return res.status(200).json({
      success: true,
      message: "OTP baru berhasil dikirim via Email. Jangan Buang, Jadikan Berkah.",
    });
  } catch (error) {
    console.error("resendOTP error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat mengirim ulang OTP." });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { id: true, name: true, email: true, phone: true, points: true, isVerified: true },
    });

    if (!user) return res.status(404).json({ success: false, message: "User tidak ditemukan." });

    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server saat mengambil profil." });
  }
};