const STEPS = [
  {
    number: '01',
    title: 'Daftar & Atur Profil',
    description: 'Buat akun gratis, atur lokasi dan preferensi makananmu dalam hitungan detik.',
  },
  {
    number: '02',
    title: 'Kelola atau Bagikan',
    description: 'Tambah bahan ke Kulkas Digital atau posting surplus ke Feed agar bisa diambil warga sekitar.',
  },
  {
    number: '03',
    title: 'Kumpulkan Poin Berkah',
    description: 'Setiap aksi penyelamatan pangan menghasilkan poin yang bisa ditukar hadiah nyata.',
  },
];

export default function CaraKerja() {
  return (
    <section
      id="cara-kerja"
      style={{
        backgroundColor: '#F5F5F5',
        paddingBlock: 'clamp(3rem, 5vw, 4.5rem)',
      }}
    >
      <div
        className="mx-auto"
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
        }}
      >
        {/* Header + Steps dalam satu baris di desktop */}
        <div className="cara-kerja-layout">
          <style>{`
            .cara-kerja-layout {
              display: grid;
              grid-template-columns: 1fr 2fr;
              gap: clamp(3rem, 6vw, 6rem);
              align-items: center;
            }
            .cara-kerja-steps {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              position: relative;
            }
            .cara-kerja-step {
              padding: clamp(1.5rem, 2vw, 2rem);
              border-left: 1px solid #E0E0E0;
            }
            .cara-kerja-step:first-child {
              border-left: none;
            }
            @media (max-width: 900px) {
              .cara-kerja-layout {
                grid-template-columns: 1fr;
                gap: 2.5rem;
              }
              .cara-kerja-steps {
                grid-template-columns: 1fr;
              }
              .cara-kerja-step {
                border-left: none;
                border-top: 1px solid #E0E0E0;
                padding: 1.25rem 0;
              }
              .cara-kerja-step:first-child {
                border-top: none;
                padding-top: 0;
              }
            }
          `}</style>

          {/* Kiri — label + headline + CTA */}
          <div className="flex flex-col gap-5">
            <span
                className="inline-flex items-center w-fit font-bold uppercase"
                style={{
                    color: 'var(--color-tertiary-600)',
                    fontSize: 'var(--text-fluid-xs)',
                    letterSpacing: '0.25em',
                }}
            >
                Cara Kerja
            </span>

            <h2
              className="font-extrabold leading-tight m-0"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}
            >
              Mulai dalam{' '}
              <span style={{ color: 'var(--accent-primary)' }}>3 langkah</span>
            </h2>

            <p
              className="m-0"
              style={{
                fontSize: 'clamp(0.875rem, 1.1vw, 1rem)',
                color: 'var(--text-secondary)',
                lineHeight: 'var(--leading-relaxed)',
                maxWidth: '32ch',
              }}
            >
              Tidak perlu ribet. Siapa pun bisa langsung berkontribusi hari ini.
            </p>
          </div>

          {/* Kanan — steps */}
          <div className="cara-kerja-steps">
            {STEPS.map((step, i) => (
              <div key={i} className="cara-kerja-step flex flex-col gap-3">
                <span
                  className="font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(2rem, 3vw, 2.75rem)',
                    color: '#1B3A2D',
                    lineHeight: 1,
                    opacity: 0.15,
                  }}
                >
                  {step.number}
                </span>

                <h3
                  className="m-0 font-bold"
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(0.95rem, 1.2vw, 1.0625rem)',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {step.title}
                </h3>

                <p
                  className="m-0"
                  style={{
                    fontSize: 'clamp(0.8rem, 0.9vw, 0.875rem)',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.6',
                  }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}