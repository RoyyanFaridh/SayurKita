import { useState, useEffect, useCallback } from "react";
import AlertsSection from "../components/AlertsSection";
import StatsGrid from "../components/StatsGrid";
import ExpiryAlertWidget from "../components/ExpiryAlertWidget";
import IngredientSummaryWidget from "../components/IngredientSummaryWidget";
import KulkasDashWidget from "../components/KulkasDashWidget";
import ResepWidget from "../components/ResepWidget";
import SurplusDashWidget from "../components/SurplusDashWidget";
import PostingWidget from "../components/PostingWidget";
import { API_ORIGIN } from "../../../config/api";

const DEFAULT_USER = {
  name: "User",
};

const DEFAULT_DATE = "Hari ini";

const GMAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

function guessCityFromCoords(lat, lng) {
  const KOTA = [
    { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
    { name: "Sleman", lat: -7.7165, lng: 110.3559 },
    { name: "Bantul", lat: -7.8912, lng: 110.3286 },
    { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
    { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
    { name: "Bandung", lat: -6.9175, lng: 107.6191 },
    { name: "Semarang", lat: -6.9932, lng: 110.4203 },
    { name: "Medan", lat: 3.5952, lng: 98.6722 },
    { name: "Makassar", lat: -5.1477, lng: 119.4327 },
    { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  ];
  let nearest = KOTA[0];
  let minDist = Infinity;
  for (const kota of KOTA) {
    const d = Math.hypot(lat - kota.lat, lng - kota.lng);
    if (d < minDist) {
      minDist = d;
      nearest = kota;
    }
  }
  return nearest.name;
}

async function reverseGeocode(lat, lng) {
  if (!GMAPS_API_KEY) return guessCityFromCoords(lat, lng);
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GMAPS_API_KEY}&language=id`,
    );
    const data = await res.json();
    if (!data.results?.length) return guessCityFromCoords(lat, lng);
    for (const result of data.results) {
      const city = result.address_components.find(
        (c) =>
          c.types.includes("administrative_area_level_2") ||
          c.types.includes("locality"),
      );
      if (city) return city.long_name;
    }
    return guessCityFromCoords(lat, lng);
  } catch {
    return guessCityFromCoords(lat, lng);
  }
}

export default function Dashboard() {
  const [user, setUser] = useState(DEFAULT_USER);
  const [userCoords, setUserCoords] = useState(null);
  const [location, setLocation] = useState("Mendeteksi lokasi…");
  const [locating, setLocating] = useState(true);

  // Fetch user data dari /api/auth/me
  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await fetch(`${API_ORIGIN}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data) {
            setUser(data.data);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    }

    fetchUser();
  }, []);

  const handleLocate = useCallback(async () => {
    if (!navigator.geolocation) {
      setLocation("Lokasi tidak tersedia");
      setLocating(false);
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserCoords(coords);
        const city = await reverseGeocode(coords.lat, coords.lng);
        setLocation(city);
        setLocating(false);
      },
      () => {
        setLocation("Yogyakarta");
        setLocating(false);
      },
    );
  }, []);

  useEffect(() => {
    handleLocate();
  }, [handleLocate]);

  const locationDisplay = locating ? (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-(--text-muted) animate-pulse" />
      Mendeteksi…
    </span>
  ) : (
    location
  );

  return (
    <>
      <div className="bg-white border-b border-(--border-subtle) flex items-center justify-between px-7 py-4 sticky top-0 z-10 max-[640px]:hidden">
        <div>
          <p className="text-compact-base text-(--text-muted)">Selamat pagi,</p>
          <h1 className="text-xl font-bold leading-snug text-(--text-primary)">
            {user.name}
          </h1>
          <p className="text-compact-sm mt-0.5 text-(--text-muted)">
            {DEFAULT_DATE} · {locationDisplay}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-md px-3 py-2 text-compact-lg cursor-text select-none w-55 border bg-(--bg-alt) border-(--border-default) text-(--text-muted)">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="6"
                cy="6"
                r="4.5"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <line
                x1="9.5"
                y1="9.5"
                x2="12"
                y2="12"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span>Cari bahan, resep, selamatkan…</span>
          </div>
          <button
            className="relative w-9 h-9 rounded-md border flex items-center justify-center cursor-pointer transition-colors duration-150 bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:bg-(--bg-surface-3)"
            aria-label="Notifikasi"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 2a5 5 0 015 5v3.5l1.5 2h-13L4 10.5V7a5 5 0 015-5z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 15a1.5 1.5 0 003 0"
                stroke="currentColor"
                strokeWidth="1.5"
              />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger-500 border-[1.5px] border-white" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-5 px-7 py-6 pb-10 max-[640px]:gap-4 max-[640px]:p-0 max-[640px]:pb-8">
        <div className="hidden max-[640px]:block px-4 pt-4 pb-5 rounded-b-xl bg-(--bg-dark)">
          <p className="text-compact-sm text-(--text-on-dark-muted)">
            Selamat pagi,
          </p>
          <h1 className="text-xl font-bold leading-snug text-(--text-on-dark)">
            {user.name}
          </h1>
          <p className="text-compact-xs mt-0.5 text-(--text-on-dark-faint)">
            {DEFAULT_DATE} · {locationDisplay}
          </p>
        </div>

        <div className="max-[640px]:px-4">
          <AlertsSection />
        </div>
        <div className="max-[640px]:px-4">
          <IngredientSummaryWidget />
        </div>
        <div className="max-[640px]:px-4">
          <ExpiryAlertWidget />
        </div>
        <div className="max-[640px]:px-4">
          <StatsGrid />
        </div>

        <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1 max-[640px]:px-4">
          <div className="flex flex-col gap-5">
            <KulkasDashWidget />
            <ResepWidget />
          </div>
          <div className="flex flex-col gap-5">
            <SurplusDashWidget userCoords={userCoords} />
            <PostingWidget />
          </div>
        </div>
      </div>
    </>
  );
}
