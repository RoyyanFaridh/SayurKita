import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 768) setMenuOpen(false); };
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
      <nav className={`${styles.nav} ${scrolled ? styles.navScrolled : ''}`}>
        <div className={`container ${styles.inner}`}>

          <a href="/" className={styles.logo} onClick={closeMenu}>
            Sayur<span className={styles.logoAccent}>Kita.</span>
          </a>

          <ul className={styles.links}>
            <li><a href="#fitur">Fitur</a></li>
            <li><a href="#cara-kerja">Cara Kerja</a></li>
            <li><a href="#komunitas">Komunitas</a></li>
          </ul>

          <div className={styles.auth}>
            <a href="/login" className={styles.masuk}>Masuk</a>
            <a href="/register" className="btn btn--primary">Daftar</a>
          </div>

          <button
            className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
          >
            <span className={styles.bar} />
            <span className={styles.bar} />
            <span className={styles.bar} />
          </button>

        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <ul className={styles.mobileLinks}>
          <li><a href="#fitur"      onClick={closeMenu}>Fitur</a></li>
          <li><a href="#cara-kerja" onClick={closeMenu}>Cara Kerja</a></li>
          <li><a href="#komunitas"  onClick={closeMenu}>Komunitas</a></li>
        </ul>

        <div className={styles.mobileAuth}>
          <a href="/login"    className={`btn btn--ghost   btn--lg ${styles.mobileBtn}`} onClick={closeMenu}>Masuk</a>
          <a href="/register" className={`btn btn--primary btn--lg ${styles.mobileBtn}`} onClick={closeMenu}>Daftar Sekarang</a>
        </div>
      </div>

      {menuOpen && (
        <div
          className={styles.backdrop}
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
    </>
  );
}