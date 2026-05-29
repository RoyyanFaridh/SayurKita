import { useState, useEffect } from "react";
import { NavLink, useLocation, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Refrigerator,
  MapPin,
  Star,
  Bell,
  Flame,
} from "lucide-react";
import { API_ORIGIN } from "../../config/api";
import UserBlock from "../../components/UserBlock";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Beranda", end: true, Icon: LayoutDashboard },
  { to: "/kulkas",    label: "Lihat Kulkas",  Icon: Refrigerator },
  { to: "/selamatkan", label: "Selamatkan!", Icon: MapPin },
  { to: "/poin",      label: "Poin Berkah",  Icon: Star },
];

const DEFAULT_USER = { name: "User", role: "Pengguna", initials: "U" };
const HARI = ["S", "S", "R", "K", "J", "S", "M"];

function getInitials(name) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length > 1
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : name.substring(0, 2).toUpperCase();
}

/**
 * Hitung array 7 boolean (Senin–Minggu minggu ini) yang aktif,
 * berdasarkan lastActiveDate dan streakCount dari API.
 */
function hitungStreakMingguIni(streakCount, lastActiveDate) {
  const active = Array(7).fill(false);
  if (!lastActiveDate || streakCount === 0) return active;

  const last = new Date(lastActiveDate);
  last.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffDays = Math.floor((today - last) / (1000 * 60 * 60 * 24));
  if (diffDays > 1) return active; // streak putus

  const hariIniIndex = (today.getDay() + 6) % 7; // Senin=0, Minggu=6
  const jumlahAktif = Math.min(streakCount, hariIniIndex + 1);
  for (let i = 0; i < jumlahAktif; i++) {
    active[hariIniIndex - i] = true;
  }

  return active;
}

function PoinBlock({ poinData }) {
  const points      = poinData?.points      ?? 0;
  const streakCount = poinData?.streakCount ?? 0;
  const lastActive  = poinData?.lastActiveDate ?? null;

  const aktif        = hitungStreakMingguIni(streakCount, lastActive);
  const hariIniIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="mx-3 mb-2 rounded-lg bg-primary-800 px-3.5 py-3">
      <p className="text-compact-xs font-semibold uppercase tracking-wide text-white/35">
        Total Poin Berkah
      </p>
      <p className="my-0.5 text-2xl font-bold leading-[1.1] text-secondary-400">
        {points.toLocaleString("id-ID")}
      </p>

      {/* Streak count */}
      <div className="flex items-center gap-1.5 mb-3">
        <Flame size={12} strokeWidth={1.75} className="text-secondary-400" />
        <p className="text-compact-xs text-white/60 m-0">
          Streak {streakCount} hari
        </p>
      </div>

      <p className="mb-1.5 text-compact-xs text-white/35">
        Streak minggu ini
      </p>
      <div className="flex gap-1">
        {HARI.map((d, i) => {
          const isToday  = i === hariIniIndex;
          const isAktif  = aktif[i];
          const isFuture = i > hariIniIndex;

          return (
            <div
              key={i}
              className={`flex h-7 w-7 items-center justify-center rounded-full text-compact-xs font-semibold
                ${isFuture
                  ? "bg-white/8 text-white/30"
                  : isAktif && isToday
                    ? "bg-white text-primary-900 outline-2 -outline-offset-2 outline-secondary-400"
                    : isAktif
                      ? "bg-secondary-400 text-primary-900"
                      : "bg-white/8 text-white/35"
                }
              `}
            >
              {d}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NavItems() {
  return (
    <>
      <p className="px-2 pb-1 pt-2 text-compact-xs font-semibold uppercase tracking-wider text-white/35">
        Menu
      </p>
      {NAV_ITEMS.map(({ to, label, end, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-md px-3 py-2.5 text-compact-lg font-medium transition-colors duration-fast ease-out ${
              isActive
                ? "bg-white/14 text-white"
                : "text-white/60 hover:bg-white/8 hover:text-white"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span className={`flex shrink-0 items-center ${isActive ? "opacity-100" : "opacity-70"}`}>
                <Icon size={16} strokeWidth={1.75} />
              </span>
              {label}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

export default function DashboardLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser]             = useState(DEFAULT_USER);
  const [poinData, setPoinData]     = useState(null);
  const location  = useLocation();
  const navigate  = useNavigate();

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/login");
  }

  // Fetch user profile
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_ORIGIN}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.data?.name) {
          setUser({
            name:     data.data.name,
            role:     "Donatur Aktif",
            initials: getInitials(data.data.name),
          });
        }
      })
      .catch(() => {});
  }, []);

  // Fetch poin summary — dipakai PoinBlock sidebar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch(`${API_ORIGIN}/api/poin`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.ok && res.json())
      .then((data) => {
        if (data?.data) setPoinData(data.data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [drawerOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 640) setDrawerOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-neutral-50">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-200 flex w-55 flex-col overflow-y-auto bg-primary-600 pb-4 max-[640px]:hidden">
        <div className="border-b border-primary-700 px-5 pb-4 pt-5 text-xl font-bold text-white">
          Sayur<span className="text-secondary-400">Kita.</span>
        </div>

        <UserBlock user={user} onLogout={handleLogout} />

        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          <NavItems />
        </nav>

        <PoinBlock poinData={poinData} />
      </aside>

      {/* Header mobile */}
      <header className="fixed inset-x-0 top-0 z-200 hidden h-14 items-center justify-between bg-primary-600 px-4 py-3.5 max-sm:flex">
        <button
          className={`flex h-9 w-9 shrink-0 cursor-pointer flex-col items-center justify-center gap-1.25 rounded-md bg-white/9 transition-colors duration-fast ease-out hover:bg-white/15 ${
            drawerOpen
              ? "[&>span:nth-child(1)]:translate-y-1.75 [&>span:nth-child(1)]:rotate-45 [&>span:nth-child(2)]:scale-x-0 [&>span:nth-child(2)]:opacity-0 [&>span:nth-child(3)]:-translate-y-1.75 [&>span:nth-child(3)]:-rotate-45"
              : ""
          }`}
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={drawerOpen}
        >
          <span className="block h-[2px] w-4.5 origin-center rounded bg-white transition-all duration-normal ease-out" />
          <span className="block h-[2px] w-4.5 origin-center rounded bg-white transition-all duration-normal ease-out" />
          <span className="block h-[2px] w-4.5 origin-center rounded bg-white transition-all duration-normal ease-out" />
        </button>

        <span className="flex-1 text-center text-lg font-bold text-white">
          Sayur<span className="text-secondary-400">Kita.</span>
        </span>

        <div className="flex items-center gap-2.5">
          <button
            className="relative flex h-8.5 w-8.5 cursor-pointer items-center justify-center rounded-md bg-white/9 text-white/60"
            aria-label="Notifikasi"
          >
            <Bell size={20} strokeWidth={1.75} />
            <span className="absolute right-0.5 top-0.5 h-1.75 w-1.75 rounded-full border-[1.5px] border-primary-600 bg-danger-500" />
          </button>

          <div className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-full bg-primary-700 text-compact-xs font-semibold tracking-wide text-primary-200">
            {user.initials}
          </div>
        </div>
      </header>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-300 bg-black/55 transition-all duration-normal ease-out ${
          drawerOpen ? "visible opacity-100" : "invisible delay-280 opacity-0"
        }`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden="true"
      />

      {/* Drawer mobile */}
      <div
        className={`fixed inset-y-0 left-0 z-400 flex w-60 flex-col bg-primary-600 transition-transform duration-normal ease-out ${
          drawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-modal="true"
        role="dialog"
        aria-label="Menu navigasi"
      >
        <div className="flex items-center justify-between border-b border-white/7 px-4 pb-4 pt-5">
          <span className="text-xl font-bold text-white">
            Sayur<span className="text-secondary-400">Kita.</span>
          </span>
          <button
            className="flex h-7.5 w-7.5 cursor-pointer items-center justify-center rounded-md bg-white/9 text-white transition-colors duration-fast ease-out hover:bg-white/15"
            onClick={() => setDrawerOpen(false)}
            aria-label="Tutup menu"
          >
            ✕
          </button>
        </div>

        <UserBlock user={user} onLogout={handleLogout} />

        <nav className="flex flex-1 flex-col gap-0.5 px-2.5 py-2.5">
          <NavItems />
        </nav>

        <PoinBlock poinData={poinData} />
      </div>

      <main className="ml-55 flex min-h-screen flex-1 flex-col overflow-x-hidden max-[640px]:ml-0 max-[640px]:pt-14">
        <Outlet />
      </main>
    </div>
  );
}