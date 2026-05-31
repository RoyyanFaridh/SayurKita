import { useEffect, useState } from 'react';
import { Users, Leaf, Wind } from 'lucide-react';

const BORDER_SUBTLE = 'rgba(255,255,255,0.08)';
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function StatsSection() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalSaved: 0,
    totalKarbonTon: 0,
  });

  useEffect(() => {
    fetch(`${API_URL}/api/stats`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success) setStats(json.data);
      })
      .catch((err) => console.error('Stats fetch error:', err));
  }, []);

  const STATS = [
    {
      value: stats.totalUsers.toLocaleString('id-ID') + '+',
      unit: 'user',
      label: 'Anggota aktif bergabung untuk menyelamatkan pangan',
      icon: Users,
    },
    {
      value: stats.totalSaved.toLocaleString('id-ID'),
      unit: 'porsi',
      label: 'Makanan berhasil diselamatkan dari pembuangan',
      icon: Leaf,
    },
    {
      value: stats.totalKarbonTon.toLocaleString('id-ID'),
      unit: 'kg CO₂',
      label: 'Emisi karbon berhasil dicegah dari pembusukan pangan',
      icon: Wind,
    },
  ];

  return (
    <section style={{ background: 'var(--bg-dark)' }}>
      <style>{`
        .stat-item {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: clamp(1.25rem, 2vw, 1.75rem) clamp(1.25rem, 2.5vw, 2rem);
        }
        .stat-item:first-child { padding-left: 0; }
        .stat-item:last-child  { padding-right: 0; }
        .stat-item + .stat-item { border-left: 1px solid ${BORDER_SUBTLE}; }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: 1fr !important; }
          .stat-item { padding-left: 0 !important; padding-right: 0 !important; border-left: none !important; }
          .stat-item + .stat-item { border-left: none !important; border-top: 1px solid ${BORDER_SUBTLE}; }
        }
      `}</style>

      <div
        className="stats-grid mx-auto"
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
          paddingBlock: 'clamp(2.5rem, 4vw, 3.5rem)',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
        }}
      >
        {STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="stat-item">
              <div
                className="shrink-0 flex items-center justify-center rounded-xl"
                style={{
                  width: '2.75rem',
                  height: '2.75rem',
                  minWidth: '2.75rem',
                  background: 'rgba(255,255,255,0.06)',
                }}
              >
                <Icon size={20} style={{ color: 'var(--accent-primary)' }} />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span
                    className="font-bold leading-none"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
                      color: 'var(--text-on-dark)',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="font-semibold"
                    style={{
                      fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                      color: 'var(--accent-primary)',
                    }}
                  >
                    {s.unit}
                  </span>
                </div>
                <p
                  className="m-0"
                  style={{
                    fontSize: 'clamp(0.75rem, 0.9vw, 0.8125rem)',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: '1.5',
                  }}
                >
                  {s.label}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}