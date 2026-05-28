import { Leaf, Clock, AlertTriangle, XCircle } from 'lucide-react';

const CONDITIONS = [
  {
    accent: '#2A5C40',
    indicatorColor: '#2A5C40',
    tagBg: '#F6FBF8',
    tagColor: '#2A5C40',
    icon: Leaf,
    iconColor: '#2A5C40',
    status: 'Masih Segar',
    tag: 'Aman dikonsumsi',
    description: 'Bahan makananmu masih dalam kondisi prima. Simpan dengan benar agar tetap segar lebih lama.',
    days: '> 5 hari',
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
    description: 'Prioritaskan penggunaan atau segera bagikan ke sekitar sebelum terlambat.',
    days: '2–4 hari',
    tips: [
      'Masak dalam 1–2 hari ke depan',
      'Bagikan ke tetangga jika tidak terpakai',
      'Cek saran resep darurat SayurKita',
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
    tag: 'Hari ini / besok',
    description: 'Sudah sangat mendekati kedaluwarsa. Masak sekarang atau donasikan hari ini.',
    days: '0–1 hari',
    tips: [
      'Masak atau olah hari ini juga',
      'Donasikan sebelum tidak layak',
      'Hubungi penerima terdekat via SayurKita',
    ],
  },
  {
    accent: '#8B2020',
    indicatorColor: '#B91C1C',
    tagBg: '#FEF2F2',
    tagColor: '#B91C1C',
    icon: XCircle,
    iconColor: '#B91C1C',
    status: 'Kadaluwarsa',
    tag: 'Sudah melewati batas',
    description: 'Periksa kondisi fisik dengan teliti. Jangan dikonsumsi jika ada tanda kerusakan.',
    days: 'Lewat batas',
    tips: [
      'Periksa kondisi fisik secara seksama',
      'Olah menjadi kompos jika sudah rusak',
      'Jangan konsumsi tanpa pemeriksaan',
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
      <style>{`
        .kondisi-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 900px) {
          .kondisi-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 540px) {
          .kondisi-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

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
            SayurKita membantu kamu memantau kondisi setiap bahan makanan — dari yang masih segar hingga yang perlu segera ditangani.
          </p>
        </div>

        {/* Cards */}
        <div className="kondisi-grid">
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
                <div style={{ height: '4px', backgroundColor: c.accent }} />

                <div
                  className="flex flex-col gap-4"
                  style={{ padding: 'clamp(1.25rem, 1.5vw, 1.5rem)', flex: 1 }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="flex items-center justify-center rounded-xl"
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        minWidth: '2.5rem',
                        backgroundColor: c.tagBg,
                        border: `1px solid ${c.accent}40`,
                      }}
                    >
                      <Icon size={16} style={{ color: c.iconColor }} />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span
                        style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: c.indicatorColor,
                          flexShrink: 0,
                          display: 'block',
                        }}
                      />
                      <span
                        className="font-semibold"
                        style={{
                          fontSize: '0.7rem',
                          color: c.indicatorColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {c.days}
                      </span>
                    </div>
                  </div>

                  <span
                    className="font-bold"
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(0.95rem, 1.2vw, 1.0625rem)',
                      color: 'var(--text-primary)',
                      lineHeight: 1.2,
                    }}
                  >
                    {c.status}
                  </span>

                  <p
                    className="m-0"
                    style={{
                      fontSize: 'clamp(0.775rem, 0.9vw, 0.8125rem)',
                      color: 'var(--text-secondary)',
                      lineHeight: '1.6',
                    }}
                  >
                    {c.description}
                  </p>

                  <ul
                    className="m-0 flex flex-col gap-1.5"
                    style={{ paddingLeft: 0, listStyle: 'none' }}
                  >
                    {c.tips.map((tip, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2"
                        style={{
                          fontSize: 'clamp(0.7rem, 0.8vw, 0.75rem)',
                          color: 'var(--text-secondary)',
                          lineHeight: '1.5',
                        }}
                      >
                        <span
                          style={{
                            width: '0.875rem',
                            height: '0.875rem',
                            minWidth: '0.875rem',
                            borderRadius: '50%',
                            backgroundColor: c.tagBg,
                            border: `1px solid ${c.accent}50`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginTop: '1px',
                            flexShrink: 0,
                          }}
                        >
                          <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                            <path d="M0.5 2.5L2 4L5.5 0.5" stroke={c.iconColor} strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </span>
                        {tip}
                      </li>
                    ))}
                  </ul>

                  <div
                    className="inline-flex items-center gap-1.5 w-fit rounded-full"
                    style={{
                      backgroundColor: c.tagBg,
                      padding: '0.35rem 0.75rem',
                      marginTop: 'auto',
                    }}
                  >
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: c.indicatorColor,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      className="font-medium"
                      style={{
                        fontSize: '0.7rem',
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