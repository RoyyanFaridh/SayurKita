import { Check } from "lucide-react";

export default function StepIndicator({ steps }) {
  return (
    <div className="flex items-start w-full">
      {steps.map((s, i) => (
        <div
          key={s.num}
          className="flex flex-col items-center gap-1.5 flex-1 relative min-w-0"
        >
          <div
            className="w-8.5 h-8.5 rounded-full border-2 text-sm font-semibold flex items-center justify-center relative z-10 transition-[background,border-color,color] duration-200 shrink-0"
            style={
              s.done
                ? {
                    background: "var(--accent-primary)",
                    borderColor: "var(--accent-primary)",
                    color: "var(--color-primary-900)",
                  }
                : s.active
                  ? {
                      background: "var(--color-primary-900)",
                      borderColor: "var(--color-primary-900)",
                      color: "#ffffff",
                    }
                  : {
                      background: "#ffffff",
                      borderColor: "var(--border-subtle)",
                      color: "var(--color-neutral-400)",
                    }
            }
          >
            {s.done ? <Check size={14} strokeWidth={2.5} /> : s.num}
          </div>

          <span
            className="text-compact-sm text-center w-full px-1 leading-snug"
            style={{
              color: s.active
                ? "var(--text-primary)"
                : "var(--color-neutral-400)",
              fontWeight: s.active ? 600 : 500,
            }}
          >
            {s.label}
          </span>

          {i < steps.length - 1 && (
            <div
              className="absolute top-4.25 left-[calc(50%+18px)] right-[calc(-50%+18px)] h-[2px] z-0 transition-[background] duration-200"
              style={{
                background: s.done
                  ? "var(--accent-primary)"
                  : "var(--border-subtle)",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
}
