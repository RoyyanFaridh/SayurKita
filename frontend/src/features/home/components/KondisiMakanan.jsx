import { Leaf, Clock, AlertTriangle } from 'lucide-react';

const CONDITIONS = [
  {
    accent: '#2A5C40',
    indicatorColor: '#657F6D',
    tagBg: '#F6FBF8',
    tagColor: '#657F6D',
    icon: Leaf,
    iconColor: '#2A5C40',
    status: 'Segar',
    tag: 'Aman dikonsumsi',
    title: 'Bahan dalam kondisi baik',
    description:
      'Bahan makananmu masih dalam kondisi prima. Simpan dengan benar agar tetap segar lebih lama.',
    days: 'lebih dari 5 hari',
    tips: [
      'Simpan di bagian paling dingin kulkas',
      'Jauhkan dari bahan berbau tajam',
      'Gunakan wadah tertutup rapat',
    ],
  },
  {
    accent: '#E8A320',
    indicatorColor: '#E8A320',
    tagBg: '#FDF6E9',
    tagColor: '#b07d12',
    icon: Clock,
    iconColor: '#b07d12',
    status: 'Segera Gunakan',
    tag: 'Hampir kedaluwarsa',
    title: 'Bahan mendekati batas waktu',
    description:
      'Beberapa bahan mulai mendekati kedaluwarsa. Prioritaskan penggunaan atau segera bagikan ke sekitar.',
    days: '1–2 hari lagi',
    tips: [
      'Masak hari ini atau besok',
      'Bagikan ke tetangga jika tidak terpakai',
      'Cek saran resep dari SayurKita',
    ],
  },
  {
    accent: '#C4622D',
    indicatorColor: '#C4622D',
    tagBg: '#F9EFEA',
    tagColor: '#C4622D',
    icon: AlertTriangle,
    iconColor: '#C4622D',
    status: 'Perlu Tindakan',
    tag: 'Jangan dibuang dulu',
    title: 'Bahan perlu segera ditangani',
    description:
      'Bahan ini sudah melewati batas optimal. Cek kondisi fisik, masih bisa diolah atau donasikan sekarang.',
    days: 'Hari ini',
    tips: [
      'Periksa kondisi fisik bahan',
      'Olah menjadi kompos jika sudah rusak',
      'Donasikan sebelum tidak layak',
    ],
  },
];

export default function KondisiMakanan() {
  return (
    <section
      style={{
        backgroundColor: '#F5F5F5',
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
            className="inline-flex items-center w-fit border rounded-full font-semibold"
            style={{
              padding: 'var(--space-1-5) var(--space-5)',
              borderColor: 'var(--color-forest-200)',
              color: 'var(--color-forest-600)',
              backgroundColor: 'var(--color-forest-50)',
              fontSize: 'var(--text-fluid-xs)',
              letterSpacing: 'var(--tracking-wide)',
            }}
          >
            Kondisi Makanan
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
            Tahu kapan harus bertindak,{' '}
            <span style={{ color: 'var(--accent-primary)' }}>sebelum terlambat</span>
          </h2>

          <p
            className="m-0"
            style={{
              fontSize: 'clamp(0.9rem, 1.2vw, 1.0625rem)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            SayurKita membantu kamu memantau kondisi setiap bahan makanan, dari yang masih segar hingga yang perlu segera ditangani.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-3 gap-6 max-[900px]:grid-cols-1 max-[900px]:gap-5">
          {CONDITIONS.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="flex flex-col"
                style={{
                  backgroundColor: 'white',
                  borderRadius: '1.25rem',
                  border: '1px solid #EAEAEA',
                  boxShadow: '2px 2px 10px rgba(0,0,0,0.06)',
                  overflow: 'hidden',
                }}
              >
                {/* Top accent bar */}
                <div style={{ height: '4px', backgroundColor: c.accent }} />

                <div
                  className="flex flex-col gap-5"
                  style={{ padding: 'clamp(1.5rem, 2.5vw, 2rem)' }}
                >
                  {/* Status row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex items-center justify-center rounded-xl"
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          backgroundColor: c.tagBg,
                          border: `1px solid ${c.accent}40`,
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} style={{ color: c.iconColor }} />
                      </div>
                      <span
                        className="font-bold"
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: 'clamp(1rem, 1.3vw, 1.125rem)',
                          color: 'var(--text-primary)',
                        }}
                      >
                        {c.status}
                      </span>
                    </div>

                    {/* Circle indicator */}
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: c.indicatorColor,
                          flexShrink: 0,
                          display: 'block',
                        }}
                      />
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: '0.75rem',
                          color: c.indicatorColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.days}
                      </span>
                    </div>
                  </div>

                  {/* Title + desc */}
                  <div className="flex flex-col gap-2">
                    <h3
                      className="m-0 font-bold"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: 'clamp(1.05rem, 1.4vw, 1.25rem)',
                        color: 'var(--text-primary)',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {c.title}
                    </h3>
                    <p
                      className="m-0"
                      style={{
                        fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.65',
                      }}
                    >
                      {c.description}
                    </p>
                  </div>

                  {/* Tips */}
                  <ul className="m-0 flex flex-col gap-2" style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {c.tips.map((tip, j) => (
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
                            backgroundColor: c.tagBg,
                            border: `1px solid ${c.accent}60`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1px',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="7" height="6" viewBox="0 0 7 6" fill="none">
                            <path d="M1 3L2.5 4.5L6 1" stroke={c.iconColor} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>

                  {/* Tag pill */}
                  <div
                    className="inline-flex items-center gap-2 w-fit rounded-full"
                    style={{
                      backgroundColor: c.tagBg,
                      padding: '0.4rem 0.875rem',
                      marginTop: 'auto',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        backgroundColor: c.indicatorColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-medium"
                      style={{
                        fontSize: '0.75rem',
                        color: c.tagColor,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {c.tag}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}