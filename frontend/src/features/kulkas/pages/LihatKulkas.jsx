import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { API_ORIGIN } from "../../../config/api";

import KulkasTopbar from "../components/KulkasTopbar";
import KulkasSummaryStrip from "../components/KulkasSummaryStrip";
import KulkasToolbar from "../components/KulkasToolbar";
import KulkasItemList from "../components/KulkasItemList";
import KulkasResepAI from "../components/KulkasResepAI";
import KulkasModal from "../components/KulkasModal";

const EXP_ORDER = {
  danger: 0,
  warning: 1,
  ok: 2,
  fresh: 3,
};

function getExpType(expDate) {
  if (!expDate) return "ok";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expDate);
  exp.setHours(0, 0, 0, 0);
  const diff = Math.round((exp - today) / 86400000);
  if (diff <= 0) return "danger";
  if (diff <= 1) return "danger";
  if (diff <= 3) return "warning";
  return "fresh";
}

function formatExpLabel(expDate) {
  if (!expDate) return "Tidak tahu";
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const exp = new Date(expDate);
  exp.setHours(0, 0, 0, 0);
  const diff = Math.round((exp - today) / 86400000);
  if (diff <= 0) return "Sudah kadaluwarsa";
  if (diff === 1) return "Besok!";
  if (diff <= 3) return `${diff} hari`;
  return `${diff} hari`;
}

export default function LihatKulkas() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("Semua");
  const [sortBy, setSortBy] = useState("exp");
  const [modal, setModal] = useState(null);

  // Fetch ingredients saat component mount
  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Anda belum login");
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_ORIGIN}/api/ingredients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Gagal mengambil data");
        setLoading(false);
        return;
      }

      const data = await response.json();

      // Transform data ke format yang sesuai dengan UI
      const transformedItems = (data.data || []).map((item) => ({
        ...item,
        expType: getExpType(item.expDate),
        expLabel: formatExpLabel(item.expDate),
      }));

      setItems(transformedItems);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Terjadi kesalahan saat mengambil data");
      setLoading(false);
    }
  }

  async function handleSaveModal(data, action) {
    await fetchIngredients();
    setModal(null);
  }

  const filtered = items
    .filter(i => i.nama.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) =>
      sortBy === "exp"
        ? EXP_ORDER[a.expType] - EXP_ORDER[b.expType]
        : a.nama.localeCompare(b.nama)
    );

  const counts = {
    total:   items.length,
    danger:  items.filter((i) => i.expType === "danger").length,
    warning: items.filter((i) => i.expType === "warning").length,
    ok:      items.filter((i) => i.expType === "ok").length,
    fresh:   items.filter((i) => i.expType === "fresh").length,
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-compact-lg text-(--text-secondary)">
          Memuat data kulkas...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-compact-lg text-(--text-danger) font-semibold">
            {error}
          </p>
          <button
            onClick={fetchIngredients}
            className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg text-compact-base font-medium hover:bg-primary-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <KulkasTopbar totalItems={items.length} onTambah={() => setModal("add")} />

      <div className="flex flex-col gap-5 px-7 pb-10 pt-6 max-sm:gap-4 max-sm:px-0 max-sm:pb-8 max-sm:pt-0">
        <div className="hidden items-center justify-between rounded-b-xl bg-primary-600 px-4 pb-5 pt-4 max-sm:flex">
          <div>
            <h1 className="text-xl font-bold leading-snug text-white">
              Lihat Kulkas
            </h1>

            <p className="mt-1 text-compact-xs text-white/35">
              {items.length} bahan tersimpan
            </p>
          </div>

          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/15 text-white"
            onClick={() => setModal("add")}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-sm:px-4">
          <KulkasSummaryStrip counts={counts} />
        </div>

        <div className="max-sm:px-4">
          <KulkasToolbar
            search={search}
            onSearch={setSearch}
            kategori={kategori}
            onKategori={setKategori}
            sortBy={sortBy}
            onSort={setSortBy}
          />
        </div>

        <div className="max-sm:px-4">
          <KulkasItemList items={filtered} onEdit={(item) => setModal(item)} />
        </div>

        <div className="max-sm:px-4">
          <KulkasResepAI ingredients={items} />
        </div>
      </div>

      {modal && (
        <KulkasModal
          item={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={handleSaveModal}
        />
      )}
    </>
  );
}
