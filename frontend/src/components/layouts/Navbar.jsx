import { useState, useEffect } from 'react';

const NAV_LINKS = [
  { href: '#fitur', label: 'Fitur' },
  { href: '#cara-kerja', label: 'Cara Kerja' },
  { href: '#komunitas', label: 'Komunitas' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[200] bg-white border-b transition-shadow duration-200 ${scrolled ? 'shadow-md' : 'shadow-none'}`}
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <div
          className="mx-auto flex items-center justify-between h-16 md:h-20"
          style={{
            maxWidth: '1920px',
            paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
          }}
        >
          <a
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-2xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Sayur<span style={{ color: 'var(--accent-primary)' }}>Kita.</span>
          </a>

          <ul className="hidden md:flex items-center gap-8 m-0 p-0 list-none">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-base font-medium transition-colors duration-150"
                  style={{ color: 'var(--text-primary)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-4">
            <a
              href="/login"
              className="text-base font-medium transition-colors duration-150"
              style={{ color: 'var(--text-primary)' }}
              onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-primary)'}
              onMouseLeave={e => e.currentTarget.style.color = 'var(--text-primary)'}
            >
              Masuk
            </a>
            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:-translate-y-px"
              style={{ backgroundColor: 'var(--bg-card-dark)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--accent-primary-hover)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--bg-card-dark)'}
            >
              Daftar
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex md:hidden h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-lg relative z-[201]"
          >
            <span className={`block h-[2px] w-[22px] rounded transition-all duration-300 ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }} />
            <span className={`block h-[2px] w-[22px] rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }} />
            <span className={`block h-[2px] w-[22px] rounded transition-all duration-300 ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} style={{ backgroundColor: 'var(--text-primary)' }} />
          </button>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[198] md:hidden transition-all duration-300"
        style={{
          backgroundColor: 'rgba(0,0,0,0.35)',
          backdropFilter: 'blur(4px)',
          opacity: menuOpen ? 1 : 0,
          pointerEvents: menuOpen ? 'auto' : 'none',
        }}
        onClick={closeMenu}
      />

      <div
        id="mobile-menu"
        className="fixed top-0 right-0 bottom-0 z-[199] md:hidden flex flex-col transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{
          width: 'min(320px, 85vw)',
          backgroundColor: 'var(--bg-base)',
          boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
          transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        }}
      >
        <div
          className="flex items-center justify-between h-16 px-6 border-b shrink-0"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <a
            href="/"
            onClick={closeMenu}
            className="text-xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Sayur<span style={{ color: 'var(--accent-primary)' }}>Kita.</span>
          </a>
          <button
            onClick={closeMenu}
            aria-label="Tutup menu"
            className="flex items-center justify-center w-9 h-9 rounded-lg transition-colors duration-150"
            style={{ backgroundColor: 'var(--color-neutral-100)' }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 2L14 14M14 2L2 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="flex flex-col px-6 pt-6 gap-1 flex-1">
          {NAV_LINKS.map(({ href, label }, i) => (
            <a
              key={href}
              href={href}
              onClick={closeMenu}
              className="flex items-center justify-between py-4 border-b text-lg font-semibold transition-all duration-200 group"
              style={{
                color: 'var(--text-primary)',
                borderColor: 'var(--border-subtle)',
                transitionDelay: menuOpen ? `${i * 0.05}s` : '0s',
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
              }}
            >
              <span>{label}</span>
              <svg
                width="16" height="16" viewBox="0 0 16 16" fill="none"
                className="opacity-30 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-1"
              >
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          ))}
        </nav>

        <div
          className="flex flex-col gap-3 px-6 pb-10 pt-6 shrink-0 transition-all duration-200"
          style={{
            transitionDelay: menuOpen ? '0.15s' : '0s',
            opacity: menuOpen ? 1 : 0,
            transform: menuOpen ? 'translateY(0)' : 'translateY(8px)',
          }}
        >
          <a
            href="/login"
            onClick={closeMenu}
            className="w-full text-center rounded-xl px-6 py-4 text-base font-semibold border transition-colors duration-150"
            style={{
              color: 'var(--text-primary)',
              borderColor: 'var(--border-subtle)',
            }}
          >
            Masuk
          </a>
          <a
            href="/register"
            onClick={closeMenu}
            className="w-full text-center rounded-xl px-6 py-4 text-base font-semibold text-white transition-all duration-150 active:scale-[0.98]"
            style={{ backgroundColor: 'var(--bg-card-dark)' }}
          >
            Daftar
          </a>
        </div>
      </div>
    </>
  );
}