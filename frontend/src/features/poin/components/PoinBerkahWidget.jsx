const HARI = ["S", "S", "R", "K", "J", "S", "M"];

export default function PoinBerkahWidget({ data }) {
  return (
    <div
      className="
        bg-white border border-neutral-100
        rounded-xl shadow-sm
        px-4 py-3
        w-[240px] max-w-full
      "
    >
      <p className="text-[10px] font-semibold uppercase tracking-wide text-neutral-400">
        Total Poin Berkah
      </p>

      <p className="my-1 text-3xl font-bold leading-[1.1] text-primary-900">
        {data.total.toLocaleString("id-ID")}
      </p>

      <p className="text-[11px] text-neutral-500">
        {data.tambahan}
      </p>

      <p className="mt-4 mb-2 text-[10px] text-neutral-400">
        Streak minggu ini
      </p>

      <div className="flex gap-1">
        {HARI.map((hari, i) => (
          <div
            key={i}
            className={`
              flex items-center justify-center
              w-7 h-7 rounded-full
              text-[11px] font-semibold
              transition-all

              ${
                i < 4
                  ? "bg-secondary-400 text-primary-900"
                  : i === 4
                    ? "bg-white text-primary-900 outline outline-2 outline-secondary-400 -outline-offset-2"
                    : "bg-neutral-100 text-neutral-400"
              }
            `}
          >
            {hari}
          </div>
        ))}
      </div>
    </div>
  );
}