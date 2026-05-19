import { useState, useEffect } from "react";
import { AlertCircle, Zap, ChefHat } from "lucide-react";
import { API_ORIGIN } from "../../../config/api";

export default function ExpiryAlertWidget() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpiryAlerts();
  }, []);

  async function fetchExpiryAlerts() {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Token tidak ditemukan");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_ORIGIN}/api/ingredients/alerts/expiry`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Gagal mengambil data");
        setLoading(false);
        return;
      }

      const data = await response.json();
      setAlerts(data.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Fetch expiry alerts error:", err);
      setError("Terjadi kesalahan saat mengambil data");
      setLoading(false);
    }
  }

  if (loading) {
    return null; // Jangan tampilkan apa-apa saat loading
  }

  if (alerts.length === 0) {
    return null; // Jangan tampilkan widget jika tidak ada alert
  }

  return (
    <div className="flex flex-col gap-3">
      {alerts.slice(0, 2).map((alert) => (
        <div
          key={alert.id}
          className={`relative overflow-hidden rounded-lg px-4 py-3.5 border-l-4 flex items-start justify-between gap-3 ${
            alert.alertStatus === "danger"
              ? "bg-danger-50 border-l-danger-500"
              : "bg-warning-50 border-l-warning-500"
          }`}
        >
          <div className="flex items-start gap-3 min-w-0 flex-1">
            <div
              className={`mt-0.5 shrink-0 ${
                alert.alertStatus === "danger"
                  ? "text-danger-600"
                  : "text-warning-600"
              }`}
            >
              <AlertCircle size={18} strokeWidth={2} />
            </div>

            <div className="min-w-0 flex-1">
              <p
                className={`text-compact-base font-semibold ${
                  alert.alertStatus === "danger"
                    ? "text-danger-900"
                    : "text-warning-900"
                }`}
              >
                {alert.daysRemaining === 0
                  ? `${alert.nama} — kadaluwarsa hari ini!`
                  : `${alert.nama} — sisa ${alert.daysRemaining} hari`}
              </p>

              <p
                className={`text-compact-xs mt-1 ${
                  alert.alertStatus === "danger"
                    ? "text-danger-700"
                    : "text-warning-700"
                }`}
              >
                Jangan biarkan terbuang! Masak sekarang dengan ide resep AI.
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              // Bisa di-extend untuk scroll ke KulkasResepAI atau navigate
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-compact-xs font-semibold transition-all duration-150 ${
              alert.alertStatus === "danger"
                ? "bg-danger-100 text-danger-700 hover:bg-danger-200"
                : "bg-warning-100 text-warning-700 hover:bg-warning-200"
            }`}
          >
            <ChefHat size={14} strokeWidth={2} />
            Cari Resep
          </button>
        </div>
      ))}

      {alerts.length > 2 && (
        <div className="px-4 py-2 rounded-lg bg-neutral-50 border border-neutral-200">
          <p className="text-compact-xs text-neutral-600">
            <span className="font-semibold">{alerts.length - 2} item lagi</span>{" "}
            yang akan kadaluwarsa
          </p>
        </div>
      )}
    </div>
  );
}
