const TESTIMONIALS = [
  {
    initials: 'SR',
    name: 'Sri Rahayu',
    role: 'Ibu rumah tangga, Condongcatur',
    review:
      'Sejak pakai SayurKita, sayuran di kulkas saya hampir tidak pernah terbuang. Notifikasi kedaluwarsanya sangat membantu, dan senang bisa bagikan kelebihan ke tetangga.',
    rating: 5,
  },
  {
    initials: 'BH',
    name: 'Budi Hartono',
    role: 'Pemilik warung, Baciro',
    review:
      'Sering ada sisa nasi dan lauk setelah jam makan siang. Dulu dibuang, sekarang bisa saya posting di Feed dan habis dalam 30 menit. Lebih lega dan tidak mubazir.',
    rating: 5,
  },
  {
    initials: 'AM',
    name: 'Aminah',
    role: 'Mahasiswi, Sleman',
    review:
      'Aplikasinya simpel banget. Saya bisa ambil surplus makanan dari warga sekitar yang gratis, lumayan banget buat anak kos. Poin Berkahnya juga seru dikumpulkan.',
    rating: 5,
  },
];

function StarRating({ count = 5 }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 1.5L9.545 5.674L14 6.09L10.75 8.926L11.764 13.31L8 11.02L4.236 13.31L5.25 8.926L2 6.09L6.455 5.674L8 1.5Z"
            fill="#E8A320"
          />
        </svg>
      ))}
    </div>
  );
}

export default function DariKomunitas() {
  return (
    <section
      id="komunitas"
      style={{
        backgroundColor: 'var(--bg-base)',
        paddingBlock: 'clamp(4rem, 8vw, 7rem)',
      }}
    >
      <style>{`
        .komunitas-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }
        @media (max-width: 900px) {
          .komunitas-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
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
                Dari Komunitas
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
            Kata mereka yang sudah{' '}
            <span style={{ color: 'var(--accent-primary)' }}>merasakan manfaatnya</span>
          </h2>

          <p
            className="m-0"
            style={{
              fontSize: 'clamp(0.9rem, 1.2vw, 1.0625rem)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
            }}
          >
            Dari ibu rumah tangga, pemilik warung, hingga anak kos. SayurKita membantu semua orang berkontribusi mengurangi sampah pangan.
          </p>
        </div>

        {/* Cards */}
        <div className="komunitas-grid">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="flex flex-col justify-between"
              style={{
                backgroundColor: 'white',
                borderRadius: '1.25rem',
                border: '1px solid #EAEAEA',
                boxShadow: '2px 2px 10px rgba(0,0,0,0.06)',
                padding: 'clamp(1.5rem, 2.5vw, 2rem)',
                gap: '1.5rem',
              }}
            >
              {/* Rating + review */}
              <div className="flex flex-col gap-4">
                <StarRating count={t.rating} />
                <p
                  className="m-0"
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                  }}
                >
                  "{t.review}"
                </p>
              </div>

              {/* Avatar + name */}
              <div className="flex items-center gap-3">
                <div
                  className="flex items-center justify-center rounded-full font-bold shrink-0"
                  style={{
                    width: '2.625rem',
                    height: '2.625rem',
                    backgroundColor: '#E4F2E8',
                    color: '#2A5C40',
                    fontSize: '0.8125rem',
                    fontFamily: 'var(--font-body)',
                  }}
                >
                  {t.initials}
                </div>
                <div className="flex flex-col gap-0.5">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 'clamp(0.875rem, 1vw, 0.9375rem)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    {t.name}
                  </span>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    {t.role}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}