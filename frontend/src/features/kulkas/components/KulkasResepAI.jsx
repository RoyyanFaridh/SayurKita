import { useState, useEffect } from "react";
import { ArrowRight, Sparkles, AlertCircle, Loader } from "lucide-react";
import { API_ORIGIN } from "../../../config/api";

export default function KulkasResepAI({ ingredients = [] }) {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ingredients && ingredients.length > 0) {
      fetchRecommendations();
    } else {
      setRecommendations([]);
      setError("");
    }
  }, [ingredients]);

  async function fetchRecommendations() {
    try {
      setLoading(true);
      setError("");

      // Ambil nama-nama bahan dari ingredients
      const ingredientNames = ingredients
        .map((item) => item.nama)
        .filter(Boolean);

      if (ingredientNames.length === 0) {
        setRecommendations([]);
        return;
      }

      const token = localStorage.getItem("token");

      // Kirim request ke proxy /api/recommend di Node.js
      const response = await fetch(`${API_ORIGIN}/api/recommend`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({
          ingredients: ingredientNames,
          top_k: 3, // Ambil 3 rekomendasi teratas
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(
          data.message ||
            "Gagal mendapatkan rekomendasi resep. Pastikan layanan AI aktif.",
        );
        setRecommendations([]);
        return;
      }

      const data = await response.json();

      // Transform response dari AI ke format UI
      // Handle kedua format: dari FastAPI atau format lama
      const resepList = (data.recommendations || data.data || data || [])
        .slice(0, 3)
        .map((resep, idx) => {
          // Support format FastAPI (name, ingredients, match_score)
          // Support format lama (nama, bahan, waktu)
          const namaResep = resep.nama || resep.name || "Resep tanpa judul";
          const bahanResep = resep.bahan || resep.ingredients || [];
          const waktuResep = resep.waktu || resep.time || "—";

          // Parse ingredients jika string (dari FastAPI)
          let bahanArray = bahanResep;
          if (typeof bahanResep === "string") {
            bahanArray = bahanResep
              .split(",")
              .map((b) => b.trim())
              .filter(Boolean);
          }

          return {
            id: resep.id || idx,
            nama: namaResep,
            bahan: bahanArray,
            waktu: waktuResep,
            featured: idx === 0,
          };
        });

      setRecommendations(resepList);
    } catch (err) {
      console.error("Fetch recommendations error:", err);
      setError("Terjadi kesalahan saat memuat rekomendasi resep");
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="overflow-hidden rounded-md border border-neutral-100 bg-white p-4 shadow-xs">
        <div className="flex items-center justify-center gap-2 py-8">
          <Loader size={16} className="animate-spin text-secondary-600" />
          <p className="text-compact-base text-neutral-600">
            Mencari resep terbaik untuk bahan mu...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="overflow-hidden rounded-md border border-neutral-100 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-neutral-100 pb-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-secondary-50 text-secondary-600">
              <Sparkles size={14} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-compact-lg font-semibold leading-snug text-neutral-900">
                Rekomendasi Resep AI
              </h2>
              <p className="mt-0.5 text-compact-sm text-neutral-400">
                Saran dari bahan yang akan kadaluwarsa
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-warning-50 border border-warning-200 rounded-lg">
          <AlertCircle size={16} className="text-warning-600 shrink-0" />
          <p className="text-compact-sm text-warning-700">{error}</p>
        </div>
      </div>
    );
  }

  if (recommendations.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border border-neutral-100 bg-white p-4 shadow-xs">
        <div className="mb-3 flex items-start justify-between gap-3 border-b border-neutral-100 pb-2">
          <div className="flex items-start gap-2.5">
            <div className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-secondary-50 text-secondary-600">
              <Sparkles size={14} strokeWidth={2} />
            </div>
            <div>
              <h2 className="text-compact-lg font-semibold leading-snug text-neutral-900">
                Rekomendasi Resep AI
              </h2>
              <p className="mt-0.5 text-compact-sm text-neutral-400">
                Saran dari bahan yang akan kadaluwarsa
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2.5 px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-lg">
          <AlertCircle size={16} className="text-neutral-500 shrink-0" />
          <p className="text-compact-sm text-neutral-600">
            Tambahkan bahan ke kulkas untuk mendapatkan rekomendasi resep
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-neutral-100 bg-white p-4 shadow-xs">
      <div className="mb-3 flex items-start justify-between gap-3 border-b border-neutral-100 pb-2">
        <div className="flex items-start gap-2.5">
          <div className="mt-px flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-secondary-50 text-secondary-600">
            <Sparkles size={14} strokeWidth={2} />
          </div>

          <div>
            <h2 className="text-compact-lg font-semibold leading-snug text-neutral-900">
              Rekomendasi Resep AI
            </h2>

            <p className="mt-0.5 text-compact-sm text-neutral-400">
              Saran dari bahan yang akan kadaluwarsa
            </p>
          </div>
        </div>

        <button className="inline-flex whitespace-nowrap font-body items-center gap-1 bg-transparent text-compact-base font-medium text-primary-600 transition-colors duration-fast ease-out hover:text-primary-100">
          Lihat semua
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul className="flex flex-col gap-1">
        {recommendations.map((r) => (
          <li
            key={r.id}
            className={`relative flex cursor-pointer items-center justify-between gap-2.5 rounded-md px-3 py-2.5 transition-colors duration-fast ease-out hover:bg-primary-50 ${
              r.featured
                ? "bg-primary-50 before:absolute before:bottom-[6px] before:left-0 before:top-[6px] before:w-0.75 before:rounded-full before:bg-secondary-500"
                : ""
            }`}
          >
            <div className="min-w-0 flex-1">
              <p
                className={`text-compact-lg text-neutral-900 ${
                  r.featured ? "font-bold" : "font-medium"
                }`}
              >
                {r.nama}
              </p>

              <p className="mt-0.5 text-compact-sm text-neutral-600">
                {Array.isArray(r.bahan) && r.bahan.length > 0
                  ? r.bahan.slice(0, 2).join(" · ")
                  : "Resep lainnya"}{" "}
                · {r.waktu}
              </p>
            </div>

            <span
              className={`shrink-0 transition-transform duration-fast ease-out group-hover:translate-x-0.5 ${
                r.featured ? "text-primary-600" : "text-neutral-400"
              }`}
            >
              <ArrowRight size={15} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
