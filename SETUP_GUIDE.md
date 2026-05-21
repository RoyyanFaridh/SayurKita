# 🚀 SayurKita - Setup & Running Guide

## 📋 Prerequisites (Persiapan Awal)

Pastikan sudah install:

- **Node.js** v18+ (check: `node -v`)
- **npm** atau **pnpm** (check: `npm -v`)
- **PostgreSQL** (running & accessible)
- **Python** 3.8+ (untuk AI service)
- **Git** (optional, untuk version control)

---

## 📁 Project Structure

```
d:\SayurKita\
├── server/          (Node.js + Express + Prisma)
├── frontend/        (React + Vite)
└── ai/              (FastAPI + Python)
```

---

## 🔧 **STEP 1: Setup PostgreSQL Database**

### 1.1 Pastikan PostgreSQL Running

- **Windows**: Buka PostgreSQL Application atau Services
- **Mac**: `brew services start postgresql`
- **Linux**: `sudo systemctl start postgresql`

### 1.2 Create Database

```bash
# Login ke PostgreSQL
psql -U postgres

# Dalam psql console
CREATE DATABASE sayurkita;
```

Atau jika sudah ada, cukup pastikan eksistensinya.

---

## 🛠️ **STEP 2: Setup Backend (Node.js)**

### 2.1 Masuk ke folder server

```bash
cd d:\SayurKita\server
```

### 2.2 Install Dependencies

```bash
npm install
```

### 2.3 Setup Environment Variables

Buat file `.env` di folder `server/`:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sayurkita"
JWT_SECRET="your-secret-key-min-32-chars-long-here"
PORT=5000
AI_SERVICE_URL="http://localhost:8003"
```

**Tips:**

- Ganti `password` dengan password PostgreSQL kamu
- JWT_SECRET bisa sembarang string (minimal 32 karakter untuk security)
- Jangan commit `.env` ke git!

### 2.4 Jalankan Prisma Migration

```bash
npx prisma migrate deploy
```

**Atau jika setup pertama kali:**

```bash
npx prisma migrate dev --name init
```

Output yang diharapkan:

```
✔ Generated Prisma Client
✔ Migrations applied
```

### 2.5 (Optional) Setup Prisma Studio - untuk manage data via GUI

```bash
npx prisma studio
```

Browser otomatis terbuka di `http://localhost:5555` - bisa lihat/edit data langsung.

### 2.6 Start Backend Server

```bash
npm start
```

Expected output:

```
SayurKita server running on http://localhost:5000
```

✅ **Backend siap!**

---

## 💻 **STEP 3: Setup Frontend (React + Vite)**

### 3.1 Buka terminal baru, masuk ke folder frontend

```bash
cd d:\SayurKita\frontend
```

### 3.2 Install Dependencies

```bash
npm install
```

### 3.4 Setup Environment Variables

Buat file `.env` di folder `frontend/`:

```env
VITE_API_URL="http://localhost:5000"
```

Catatan:
- Jika backend menggunakan port berbeda (misalnya 5001), sesuaikan nilai VITE_API_URL
- Jangan commit .env ke git

### 3.3 Start Development Server

```bash
npm run dev
```

Expected output:

```
  VITE v5.0.0  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

✅ **Frontend siap!** Buka browser ke `http://localhost:5173`

---

## 🤖 **STEP 4: Setup AI Service (FastAPI) - OPTIONAL**

Jika mau test rekomendasi resep dari AI, setup FastAPI:

### 4.1 Masuk ke folder ai

```bash
cd d:\SayurKita\ai
```

### 4.2 (Optional) Create Virtual Environment

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac/Linux
python3 -m venv venv
source venv/bin/activate
```

### 4.3 Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 4.4 Start FastAPI Server

```bash
python app/main.py
```

Expected output:

```
INFO:     Application startup complete
INFO:     Uvicorn running on http://127.0.0.1:8003
```

✅ **AI Service siap!**

---

## 🧪 **STEP 5: Testing the App**

Sekarang semua service running:

- Backend: http://localhost:5000
- Frontend: http://localhost:5173
- AI Service: http://localhost:8003 (optional)

### 5.1 Akses aplikasi

Buka browser → `http://localhost:5173`

### 5.2 Register User Baru

1. Click "Daftar"
2. Isi form:
   - Nama: `Test User`
   - Email: `test@example.com`
   - No. HP: `081234567890` atau `+62812345678`
   - Password: `password123`
3. Click "Lanjut"

### 5.3 Verify OTP

1. Lihat terminal backend - OTP akan di-log di console
2. Contoh: `OTP for user: 123456`
3. Copy OTP tersebut ke app
4. Click "Verifikasi"

### 5.4 Login

1. Gunakan email/no.hp + password yang tadi
2. Seharusnya masuk ke Dashboard

### 5.5 Test Kulkas Feature

1. Click "Lihat Kulkas"
2. Click "Tambah Bahan" (tombol + di atas kanan)
3. Isi form:
   - Nama Bahan: `Bayam` (pilih dari dropdown)
   - Kapan Dibeli: "Hari ini"
   - Simpan di: Pilih "Kulkas"
4. Click "Simpan Bahan"
5. Bahan seharusnya muncul di list

### 5.6 Test Expiry Alerts

1. Edit salah satu bahan yang baru ditambah
2. Di modal, pilih "Kapan Dibeli" → "Satu minggu lalu"
   (Ini akan membuat expDate menjadi besok/dalam 3 hari)
3. Click "Simpan Bahan"
4. Kembali ke Dashboard
5. Di bagian atas, seharusnya ExpiryAlertWidget muncul dengan warning/danger

### 5.7 Test Resep AI (jika AI service running)

1. Di Lihat Kulkas, scroll ke bawah → "Rekomendasi Resep AI"
2. Seharusnya muncul saran resep berdasarkan bahan yang ada
3. Jika AI service tidak running → akan tampil pesan error yang user-friendly

### 5.8 Test Logout

1. Click user profile (atas kanan di desktop) atau menu
2. Click "Logout"
3. Seharusnya redirect ke login page

---

## 🐛 **Troubleshooting**

### Problem 1: "Cannot connect to PostgreSQL"

**Solution:**

```bash
# Check PostgreSQL is running
psql -U postgres

# Create database if not exists
CREATE DATABASE sayurkita;
```

### Problem 2: "JWT_SECRET is not configured"

**Solution:** Tambahkan ke `.env` file di server folder:

```env
JWT_SECRET="your-super-secret-key-here-at-least-32-chars-long"
```

### Problem 3: "CORS error" atau "Cannot reach http://localhost:5000"

**Solution:**

- Pastikan backend server sedang running (Terminal 1)
- Check file `server/src/index.js` sudah setup CORS dengan `http://localhost:5173`

### Problem 4: "AI service not found" ketika test resep

**Solution:**

- AI service optional - app akan berjalan normal tanpa itu
- Jika mau test, jalankan `python app/main.py` di folder `ai/`

### Problem 5: "Module not found" di Python

**Solution:**

```bash
cd ai
pip install -r requirements.txt
```

### Problem 6: Port 5000/5173/8003 sudah terpakai

**Solution:**

- Cari process yang pakai port tersebut
- Ganti port di `.env` atau code
- **Windows:** `netstat -ano | findstr :5000`
- **Mac/Linux:** `lsof -i :5000`

### Problem 7: OTP tidak terlihat di console backend

**Solution:** OTP di-log saat user submit form register/resend

- Check console terminal backend untuk baris: `OTP for user:`
- Jika tidak ada, check database langsung via `psql` atau Prisma Studio

---

## 📊 **Architecture Overview**

```
┌─────────────────────────────────────────────┐
│         Browser (React + Vite)              │
│         http://localhost:5173               │
│  ┌──────────────────────────────────────┐   │
│  │ Dashboard → Kulkas → Resep           │   │
│  └──────────────────────────────────────┘   │
└──────────────┬──────────────────────────────┘
               │ (HTTP/HTTPS)
               ↓
┌──────────────────────────────────────────────┐
│      Node.js Backend (Express)               │
│      http://localhost:5000                   │
│  ┌──────────────────────────────────────┐    │
│  │ /api/auth      (Login, Register)     │    │
│  │ /api/ingredients (CRUD)              │    │
│  │ /api/recommend (proxy to AI)         │    │
│  └──────────────────────────────────────┘    │
└──────┬───────────────────────┬───────────────┘
       │                       │
       ↓                       ↓
   ┌───────────┐          ┌──────────────┐
   │PostgreSQL │          │ FastAPI (AI) │
   │ Database  │          │  Port 8003   │
   │ Port 5432 │          └──────────────┘
   └───────────┘
```

---

## ✅ **Checklist Setup Selesai**

- [ ] PostgreSQL running
- [ ] Database `sayurkita` created
- [ ] Backend `.env` configured
- [ ] Backend `npm install` selesai
- [ ] Backend `npx prisma migrate deploy` selesai
- [ ] Backend running di port 5000
- [ ] Frontend `npm install` selesai
- [ ] Frontend running di port 5173
- [ ] (Optional) AI service running di port 8003
- [ ] Bisa akses http://localhost:5173
- [ ] Bisa register & login
- [ ] Bisa add bahan ke kulkas
- [ ] Bisa lihat dashboard dengan alerts

---

## 🚀 **Quick Start Summary**

**Terminal 1 - Backend:**

```bash
cd d:\SayurKita\server
npm install
npm start
# Running on http://localhost:5000
```

**Terminal 2 - Frontend:**

```bash
cd d:\SayurKita\frontend
npm install
npm run dev
# Running on http://localhost:5173
```

**Terminal 3 - AI (Optional):**

```bash
cd d:\SayurKita\ai
pip install -r requirements.txt
python app/main.py
# Running on http://localhost:8003
```

Buka browser → `http://localhost:5173` dan mulai testing! 🎉

---

## 💡 **Tips & Tricks**

### Development Mode

- Frontend hot-reload: Auto refresh saat save file (Vite)
- Backend hot-reload: Install `nodemon` untuk auto restart
  ```bash
  npm install -g nodemon
  nodemon src/index.js
  ```

### Database Management

- GUI: `npx prisma studio` → Open http://localhost:5555
- CLI: `psql -U postgres -d sayurkita`

### Testing API Directly

- Use Postman atau Thunder Client (VS Code extension)
- Import endpoints dari `postman/collections/` jika ada

### Debug Mode

- Backend: Add console.log di code, lihat output di terminal
- Frontend: F12 → DevTools → Console
- Prisma: Enable logging: `DEBUG=* npm start`

---

## 📚 **Useful Commands**

```bash
# Backend
npm install              # Install dependencies
npm start               # Start server
npm run dev             # Start with nodemon (auto-reload)
npx prisma studio      # Open database GUI
npx prisma migrate dev --name <name>  # Create migration

# Frontend
npm install             # Install dependencies
npm run dev             # Start dev server
npm run build           # Build for production
npm run preview         # Preview production build

# Database
psql -U postgres        # Connect to PostgreSQL
\l                      # List databases
\d                      # List tables
```

---

## 🆘 **Getting Help**

Jika ada error:

1. Check console (terminal) untuk error messages
2. Check `.env` file setup
3. Verify port tidak conflict
4. Clear node_modules & install ulang jika perlu
5. Restart semua services

---

**Happy Testing! 🎉**
