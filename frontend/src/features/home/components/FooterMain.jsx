const FOOTER_LINKS = [
  {
    heading: 'Produk',
    links: [
      { label: 'Kulkas Digital', href: '#fitur' },
      { label: 'Feed Surplus', href: '#fitur' },
      { label: 'Poin Berkah', href: '#fitur' },
    ],
  },
  {
    heading: 'Perusahaan',
    links: [
      { label: 'Tentang Kami', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Karir', href: '#' },
    ],
  },
  {
    heading: 'Dukungan',
    links: [
      { label: 'Pusat Bantuan', href: '#' },
      { label: 'Hubungi Kami', href: '#' },
      { label: 'Kebijakan Privasi', href: '#' },
    ],
  },
];

export default function FooterMain() {
  return (
    <footer
      style={{
        backgroundColor: '#1B3A2D',
        paddingBlock: 'clamp(3.5rem, 6vw, 5rem)',
        borderRadius: '1.25rem 1.25rem 0 0',
      }}
    >
      <style>{`
        .footer-grid {
          display: grid;
          grid-template-columns: 1.5fr repeat(3, 1fr);
          gap: clamp(2rem, 4vw, 4rem);
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 2.5rem;
          }
          .footer-brand {
            grid-column: 1 / -1;
          }
        }
        @media (max-width: 540px) {
          .footer-grid {
            grid-template-columns: 1fr;
          }
          .footer-brand {
            grid-column: auto;
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
        <div className="footer-grid">
          {/* Brand col */}
          <div className="footer-brand flex flex-col gap-5">
            <a
              href="/"
              className="text-2xl font-bold w-fit"
              style={{ color: 'white' }}
            >
              Sayur<span style={{ color: 'var(--accent-primary)' }}>Kita.</span>
            </a>

            <p
              className="m-0"
              style={{
                fontSize: 'clamp(0.8125rem, 1vw, 0.9375rem)',
                color: 'rgba(255,255,255,0.55)',
                lineHeight: '1.7',
                maxWidth: '30ch',
              }}
            >
              Platform food rescue Indonesia. Kelola bahan makanan, selamatkan surplus, kurangi sampah pangan bersama komunitas.
            </p>

            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl font-semibold w-fit transition-all duration-150"
              style={{
                backgroundColor: 'var(--accent-primary)',
                color: '#1B3A2D',
                fontSize: '0.875rem',
                padding: '0.75rem 1.5rem',
              }}
            >
              Mulai Gratis
            </a>
          </div>

          {/* Nav cols */}
          {FOOTER_LINKS.map((col, i) => (
            <div key={i} className="flex flex-col gap-4">
              <span
                className="font-semibold"
                style={{
                  fontSize: '0.75rem',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                {col.heading}
              </span>
              <ul className="flex flex-col gap-3 m-0 p-0" style={{ listStyle: 'none' }}>
                {col.links.map((link, j) => (
                  <li key={j}>
                    <a
                      href={link.href}
                      className="transition-colors duration-150"
                      style={{
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.6)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => e.currentTarget.style.color = 'white'}
                      onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}