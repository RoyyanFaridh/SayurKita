const STATS = [
  {
    value: '1.200+',
    unit: 'user',
    label: 'Anggota aktif yang bergabung untuk menyelamatkan',
  },
  {
    value: '38',
    unit: 'ton',
    label: 'Makanan berhasil diselamatkan dari pembuangan',
  },
  {
    value: '54',
    unit: 'ton CO₂',
    label: 'Emisi karbon berhasil dicegah dari pembusukan pangan',
  },
];

export default function StatsSection() {
  return (
    <section style={{ background: 'var(--bg-dark)' }}>
      <div
        className="container grid grid-cols-3 relative mx-auto max-[768px]:grid-cols-1 max-[768px]:gap-0 max-[768px]:py-12"
        style={{ maxWidth: '1920px', paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))' }}
      >
        {STATS.map((s, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 px-10 py-8 relative max-[768px]:flex-row max-[768px]:items-center max-[768px]:gap-6 max-[768px]:px-0 max-[768px]:py-6 max-[768px]:border-b max-[768px]:border-white/8 last:max-[768px]:border-b-0 last:max-[768px]:pb-0 first:max-[768px]:pt-0 first:pl-0 last:pr-0"
          >
            <div className="flex items-baseline gap-2 flex-wrap max-[768px]:flex-col max-[768px]:items-start max-[768px]:gap-1 max-[768px]:min-w-30 max-[768px]:shrink-0 max-[480px]:min-w-25">
              <span
                className="font-bold leading-none tracking-tight"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(2.5rem, 4vw, 3.75rem)', color: 'var(--text-on-dark)', letterSpacing: 'var(--tracking-tight)' }}
              >
                {s.value}
              </span>
              <span
                className="font-semibold leading-none"
                style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.875rem, 1.5vw, 1.125rem)', color: 'var(--accent-primary)' }}
              >
                {s.unit}
              </span>
            </div>
            <p
              className="m-0 max-w-[28ch] max-[768px]:max-w-full"
              style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)', color: 'rgba(255,255,255,0.5)', lineHeight: 'var(--leading-normal)' }}
            >
              {s.label}
            </p>
            {i < STATS.length - 1 && (
              <span
                className="absolute right-0 top-1/2 -translate-y-1/2 w-px max-[768px]:hidden"
                style={{ height: '60%', background: 'var(--border-dark)' }}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}