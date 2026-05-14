import { useState, useEffect } from 'react';

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
      if (window.innerWidth > 768) {
        setMenuOpen(false);
      }
    };

    window.addEventListener('resize', onResize);

    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-200 border-b border-(--border-subtle) bg-white transition-shadow duration-200 ${scrolled ? 'shadow-md' : ''}`}
      >
        <div className="container mx-auto flex h-21 max-w-480 items-center justify-between px-[clamp(2rem,6vw,8rem)]">
          
          <a
            href="/"
            onClick={closeMenu}
            className="shrink-0 text-2xl font-bold text-(--text-primary)"
          >
            Sayur
            <span className="text-(--accent-primary)">
              Kita.
            </span>
          </a>

          <ul className="hidden items-center gap-8 md:flex">
            <li>
              <a
                href="#fitur"
                className="text-base text-(--text-primary) transition-colors duration-150 hover:text-(--accent-primary)"
              >
                Fitur
              </a>
            </li>

            <li>
              <a
                href="#cara-kerja"
                className="text-base text-(--text-primary) transition-colors duration-150 hover:text-(--accent-primary)"
              >
                Cara Kerja
              </a>
            </li>

            <li>
              <a
                href="#komunitas"
                className="text-base text-(--text-primary) transition-colors duration-150 hover:text-(--accent-primary)"
              >
                Komunitas
              </a>
            </li>
          </ul>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="/login"
              className="text-base text-(--text-primary) transition-colors duration-150 hover:text-(--accent-primary)"
            >
              Masuk
            </a>

            <a
              href="/register"
              className="inline-flex items-center justify-center rounded-xl bg-(--bg-card-dark) px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-(--accent-primary-hover) hover:-translate-y-px"
            >
              Daftar
            </a>
          </div>

          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.25 rounded-lg md:hidden"
          >
            <span
              className={`block h-[2px] w-5.5 rounded bg-(--text-primary) transition-all duration-300 ${menuOpen ? 'translate-y-1.75 rotate-45' : ''}`}
            />

            <span
              className={`block h-[2px] w-5.5 rounded bg-(--text-primary) transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
            />

            <span
              className={`block h-[2px] w-5.5 rounded bg-(--text-primary) transition-all duration-300 ${menuOpen ? '-translate-y-1.75 -rotate-45' : ''}`}
            />
          </button>
        </div>
      </nav>
    </>
  );
}