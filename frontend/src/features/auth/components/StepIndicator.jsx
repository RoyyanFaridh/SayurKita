import { Check } from "lucide-react";

export default function StepIndicator({ steps }) {
  return (
    // FIX 8: role="list" untuk screen reader — ini adalah daftar langkah progress
    <div className="flex items-start w-full" role="list" aria-label="Langkah pendaftaran">
      {steps.map((s, i) => (
        <div
          key={s.num}
          className="flex flex-col items-center gap-1.5 flex-1 relative min-w-0"
          role="listitem"
          // FIX 8: aria-current="step" pada step aktif
          aria-current={s.active ? "step" : undefined}
        >
          {/* Step circle */}
          <div
            className={[
              // FIX 6: w-8.5 h-8.5 dipertahankan — asumsi dikonfigurasi di project
              "w-8.5 h-8.5 rounded-full border-2 text-sm font-semibold",
              "flex items-center justify-center relative z-10 shrink-0",
              "transition-[background-color,border-color,color] duration-200",
              // FIX 1, 2, 3, 5: Semua warna via Tailwind conditional class
              // FIX 5: --color-forest-900 konsisten dengan AuthInput & tombol
              s.done
                ? "bg-(--accent-primary) border-(--accent-primary) text-(--color-forest-900)"
                : s.active
                  ? "bg-(--color-forest-900) border-(--color-forest-900) text-white"
                  : "bg-(--bg-input,white) border-(--border-subtle) text-neutral-400",
            ].join(" ")}
          >
            {s.done
              ? <Check size={14} strokeWidth={2.5} aria-hidden="true" />
              : <span aria-hidden="true">{s.num}</span>
            }

            <span className="sr-only">
              {s.done ? `Langkah ${s.num} selesai` : s.active ? `Langkah ${s.num} aktif` : `Langkah ${s.num} belum dimulai`}
            </span>
          </div>

          <span
            className={[
              "text-xs text-center w-full px-1 leading-snug",
              s.active
                ? "font-semibold text-(--text-primary)"
                : "font-medium text-neutral-400",
            ].join(" ")}
          >
            {s.label}
          </span>

          {i < steps.length - 1 && (
            <div
              className={[
                "absolute top-4.25 z-0 h-[2px]",
                "left-[calc(50%+18px)] right-[calc(-50%+18px)]",
                "transition-[background-color] duration-200",
                s.done ? "bg-(--accent-primary)" : "bg-(--border-subtle)",
              ].join(" ")}
              aria-hidden="true"
            />
          )}
        </div>
      ))}
    </div>
  );
}