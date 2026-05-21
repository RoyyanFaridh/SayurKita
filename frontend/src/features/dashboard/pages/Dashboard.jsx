import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import AlertsSection from "../components/AlertsSection";
import StatsGrid from "../components/StatsGrid";
// import ExpiryAlertWidget from "../components/ExpiryAlertWidget";
// import IngredientSummaryWidget from "../components/IngredientSummaryWidget";
import KulkasDashWidget from "../components/KulkasDashWidget";
import ResepWidget from "../components/ResepWidget";
import SurplusDashWidget from "../components/SurplusDashWidget";
import PostingWidget from "../components/PostingWidget";
import { API_ORIGIN } from "../../../config/api";

const GMAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY ?? "";

// ─── Lokasi helpers ───────────────────────────────────────────────────────────
function guessCityFromCoords(lat, lng) {
  const KOTA = [
    { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
    { name: "Sleman",     lat: -7.7165, lng: 110.3559 },
    { name: "Bantul",     lat: -7.8912, lng: 110.3286 },
    { name: "Jakarta",    lat: -6.2088, lng: 106.8456 },
    { name: "Surabaya",   lat: -7.2575, lng: 112.7521 },
    { name: "Bandung",    lat: -6.9175, lng: 107.6191 },
    { name: "Semarang",   lat: -6.9932, lng: 110.4203 },
    { name: "Medan",      lat:  3.5952, lng:  98.6722 },
    { name: "Makassar",   lat: -5.1477, lng: 119.4327 },
    { name: "Denpasar",   lat: -8.6705, lng: 115.2126 },
  ];
  let nearest = KOTA[0];
  let minDist = Infinity;
  for (const kota of KOTA) {
    const d = Math.hypot(lat - kota.lat, lng - kota.lng);
    if (d < minDist) { minDist = d; nearest = kota; }
  }
  return nearest.name;
}

function getFormattedDate() {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const DEFAULT_DATE = getFormattedDate()

async function reverseGeocode(lat, lng) {
  if (!GMAPS_API_KEY) return guessCityFromCoords(lat, lng);
  try {
    const res = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GMAPS_API_KEY}&language=id`,
    );
    const data = await res.json();
    if (!data.results?.length) return guessCityFromCoords(lat, lng);
    for (const result of data.results) {
      const city = result.address_components?.find(
        (c) => c.types?.includes("administrative_area_level_2") || c.types?.includes("locality"),
      );
      if (city) return city.long_name;
    }
    return guessCityFromCoords(lat, lng);
  } catch {
    return guessCityFromCoords(lat, lng);
  }
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 11) return 'Selamat pagi,'
  if (hour < 15) return 'Selamat siang,'
  if (hour < 18) return 'Selamat sore,'
  return 'Selamat malam,'
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading]             = useState(true);
  const [fetchError, setFetchError]       = useState(false);

  const [userCoords, setUserCoords] = useState(null);
  const [location, setLocation]     = useState("Mendeteksi lokasi…");
  const [locating, setLocating]     = useState(true);

  const navigate = useNavigate();

  // ─── Fetch /api/dashboard/summary ────────────────────────────────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      setLoading(true);
      setFetchError(false);

      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/login"); return; }

        const res = await fetch(`${API_ORIGIN}/api/dashboard/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        if (!res.ok) {
          console.error("Gagal fetch dashboard:", res.status);
          if (!cancelled) setFetchError(true);
          return;
        }

        const json = await res.json();

        if (!cancelled && json?.success && json?.data) {
          setDashboardData(json.data);        
        } else if (!cancelled) {
          setFetchError(true);
        }
      } catch (err) {
        console.error("fetchDashboard error:", err);
        if (!cancelled) setFetchError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDashboard();
    return () => { cancelled = true; };
  }, [navigate]);

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
      () => { setLocation("Yogyakarta"); setLocating(false); },
    );
  }, []);

  useEffect(() => { handleLocate(); }, [handleLocate]);

  const userName        = dashboardData?.user?.name ?? "…";
  const statsData       = dashboardData?.stats       ?? null;
  const kulkasPreview   = Array.isArray(dashboardData?.kulkasPreview)
                            ? dashboardData.kulkasPreview
                            : [];

  const locationDisplay = locating ? (
    <span className="inline-flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-(--text-muted) animate-pulse" />
      Mendeteksi…
    </span>
  ) : location;

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-primary-200 border-t-primary-600 animate-spin" />
          <p className="text-compact-base text-(--text-muted)">Memuat dashboard…</p>
        </div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-center">
          <p className="text-compact-lg font-semibold text-(--text-primary)">Gagal memuat data</p>
          <p className="text-compact-sm text-(--text-muted)">Pastikan server berjalan dan coba refresh halaman.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 rounded-md text-compact-base font-medium text-white bg-primary-600 hover:bg-primary-700 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border-b border-(--border-subtle) flex items-center justify-between px-7 py-4 sticky top-0 z-10 max-[640px]:hidden">
        <div>
          <p className="text-compact-base text-(--text-muted)">{getGreeting()}</p>
          <h1 className="text-xl font-bold leading-snug text-(--text-primary)">{userName}</h1>
          <p className="text-compact-sm mt-1 text-(--text-muted)">
            {DEFAULT_DATE} · {locationDisplay}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="relative w-9 h-9 rounded-md border flex items-center justify-center cursor-pointer transition-colors duration-150 bg-(--bg-alt) border-(--border-default) text-(--text-secondary) hover:bg-(--bg-surface-3)"
            aria-label="Notifikasi"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 2a5 5 0 015 5v3.5l1.5 2h-13L4 10.5V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" />
              <path d="M7.5 15a1.5 1.5 0 003 0" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-danger-500 border-[1.5px] border-white" />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-5 px-7 py-6 pb-10 max-[640px]:gap-4 max-[640px]:p-0 max-[640px]:pb-8">

        {/* Header Mobile */}
        <div className="hidden max-[640px]:block px-4 pt-4 pb-5 rounded-b-xl bg-(--bg-dark)">
          <p className="text-compact-sm text-(--text-on-dark-muted)">Selamat pagi,</p>
          <h1 className="text-xl font-bold leading-snug text-(--text-on-dark)">{userName}</h1>
          <p className="text-compact-xs mt-1 text-(--text-on-dark-faint)">
            {DEFAULT_DATE} · {locationDisplay}
          </p>
        </div>

        <div className="max-[640px]:px-4"><AlertsSection /></div>

        <div className="max-[640px]:px-4">
          <StatsGrid stats={statsData} />
        </div>

        <div className="grid grid-cols-2 gap-5 max-[900px]:grid-cols-1 max-[640px]:px-4">
          <div className="flex flex-col gap-5">
            <KulkasDashWidget items={kulkasPreview} />
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
