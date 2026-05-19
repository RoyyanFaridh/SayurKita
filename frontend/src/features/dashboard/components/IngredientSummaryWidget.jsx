import { useState, useEffect } from "react";
import { Package, AlertTriangle, CheckCircle2 } from "lucide-react";
import { API_ORIGIN } from "../../../config/api";

export default function IngredientSummaryWidget() {
  const [summary, setSummary] = useState({
    total: 0,
    safe: 0,
    critical: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_ORIGIN}/api/ingredients/stats/summary`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        setLoading(false);
        return;
      }

      const data = await response.json();
      setSummary(data.data || { total: 0, safe: 0, critical: 0 });
      setLoading(false);
    } catch (err) {
      console.error("Fetch summary error:", err);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white rounded-lg border border-(--border-subtle) p-4 h-24 animate-pulse"
          >
            <div className="bg-(--bg-alt) h-8 w-8 rounded mb-2" />
            <div className="bg-(--bg-alt) h-6 w-12 rounded mb-1" />
            <div className="bg-(--bg-alt) h-4 w-20 rounded" />
          </div>
        ))}
      </div>
    );
  }

  const stats = [
    {
      label: "Total Bahan",
      value: summary.total,
      icon: Package,
      color: "primary",
      bgColor: "bg-primary-50",
      textColor: "text-primary-600",
      borderColor: "border-primary-200",
    },
    {
      label: "Aman",
      value: summary.safe,
      icon: CheckCircle2,
      color: "success",
      bgColor: "bg-success-50",
      textColor: "text-success-600",
      borderColor: "border-success-200",
    },
    {
      label: "Kritis",
      value: summary.critical,
      icon: AlertTriangle,
      color: "danger",
      bgColor: "bg-danger-50",
      textColor: "text-danger-600",
      borderColor: "border-danger-200",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className={`rounded-lg border ${stat.bgColor} ${stat.borderColor} p-4 flex flex-col gap-2`}
          >
            <Icon size={20} className={stat.textColor} strokeWidth={1.75} />
            <p className="text-compact-sm text-(--text-muted) font-medium">
              {stat.label}
            </p>
            <p className={`text-2xl font-bold ${stat.textColor}`}>
              {stat.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
