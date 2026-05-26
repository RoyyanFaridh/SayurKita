import { Refrigerator, HandHeart, Gift } from 'lucide-react';

const FEATURES = [
  {
    icon: Refrigerator,
    iconBg: '#F6FBF8',
    iconBorder: '#A8D4B5',
    iconColor: '#3a7d52',
    tag: 'Kelola Bahan Makanan',
    tagBg: '#F6FBF8',
    tagColor: '#657F6D',
    title: 'Kulkas Digital',
    description:
      'Catat bahan makananmu, pantau tanggal kedaluwarsa, dan dapatkan saran resep otomatis sebelum bahan terbuang sia-sia.',
    points: [
      'Notifikasi bahan mendekati kedaluwarsa',
      'Saran resep dari bahan yang tersedia',
      'Riwayat pengelolaan bahan makanan',
    ],
  },
  {
    icon: HandHeart,
    iconBg: '#FDF6E9',
    iconBorder: '#E8A320',
    iconColor: '#b07d12',
    tag: 'Bagikan ke Sekitar',
    tagBg: '#FDF6E9',
    tagColor: '#b07d12',
    title: 'Selamatkan Surplus',
    description:
      'Punya makanan surplus? Bagikan ke tetangga atau donasikan ke komunitas sekitar sebelum terbuang.',
    points: [
      'Temukan penerima di radius terdekat',
      'Koordinasi pickup langsung via chat',
      'Lacak dampak donasi makananmu',
    ],
  },
  {
    icon: Gift,
    iconBg: '#F9EFEA',
    iconBorder: '#C4622D',
    iconColor: '#C4622D',
    tag: 'Reward & Komunitas',
    tagBg: '#F9EFEA',
    tagColor: '#C4622D',
    title: 'Poin Berkah',
    description:
      'Setiap aksi penyelamatan pangan menghasilkan poin yang bisa ditukar hadiah nyata dan dampak sosial.',
    points: [
      'Kumpulkan poin dari setiap donasi',
      'Tukar poin dengan reward menarik',
      'Naiki leaderboard komunitas',
    ],
  },
];

export default function FiturUtama() {
  return (
    <section
      style={{
        backgroundColor: 'var(--bg-base)',
        paddingBlock: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
        }}
      >
        {/* Header */}
        <div
          className="flex flex-col gap-4 mb-14 max-[640px]:mb-10"
          style={{ maxWidth: '52ch' }}
        >
          <span
                className="inline-flex items-center w-fit font-bold uppercase"
                style={{
                    color: 'var(--color-tertiary-600)',
                    fontSize: 'var(--text-fluid-xs)',
                    letterSpacing: '0.25em',
                }}
            >
                Fitur Utama
            </span>

          <h2
            className="font-extrabold leading-tight m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              color: 'var(--text-primary)',
              letterSpacing: '-0.02em',
            }}
          >
            Semua yang kamu butuhkan,{' '}
            <span style={{ color: 'var(--accent-primary)' }}>dalam satu tempat</span>
          </h2>

          <p
            className="m-0"
            style={{
              fontSize: 'clamp(0.9rem, 1.2vw, 1.0625rem)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Dari pantau kulkas sampai bagikan surplus, SayurKita dirancang agar menyelamatkan pangan terasa mudah dan bermakna.
          </p>
        </div>

        {/* Cards grid */}
        <div
          className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-5"
        >
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex flex-col"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.25rem',
                  border: '1px solid #EAEAEA',
                  boxShadow: '2px 2px 10px rgba(0,0,0,0.06)',
                  padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                  gap: '1.25rem',
                }}
              >
                {/* Icon */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.625rem',
                    backgroundColor: f.iconBg,
                    border: `1px solid ${f.iconBorder}`,
                    flexShrink: 0,
                  }}
                >
                  <Icon size={20} style={{ color: f.iconColor }} />
                </div>

                {/* Title + desc */}
                <div className="flex flex-col gap-2 flex-1">
                  <h3
                    className="m-0 font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(1.1rem, 1.5vw, 1.375rem)',
                      color: 'var(--text-primary)',
                      letterSpacing: '-0.01em',
                    }}
                  >
                    {f.title}
                  </h3>
                  <p
                    className="m-0"
                    style={{
                      fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.65',
                    }}
                  >
                    {f.description}
                  </p>
                </div>

                {/* Points */}
                <ul
                  className="m-0 flex flex-col gap-2"
                  style={{ paddingLeft: 0, listStyle: 'none' }}
                >
                  {f.points.map((pt, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-2"
                      style={{
                        fontSize: 'clamp(0.75rem, 0.9vw, 0.875rem)',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.5',
                      }}
                    >
                      <span
                        style={{
                          width: '1rem',
                          height: '1rem',
                          minWidth: '1rem',
                          borderRadius: '50%',
                          backgroundColor: f.iconBg,
                          border: `1px solid ${f.iconBorder}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginTop: '1px',
                        }}
                      >
                        <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                          <path d="M1 3L2.5 4.5L6 1" stroke={f.iconColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>

                {/* Tag pill */}
                <div
                  className="inline-flex items-center gap-2 w-fit rounded-full"
                  style={{
                    backgroundColor: f.tagBg,
                    padding: '0.4rem 0.875rem',
                    marginTop: 'auto',
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: f.iconColor,
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="font-medium"
                    style={{
                      fontSize: '0.75rem',
                      color: f.tagColor,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {f.tag}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}