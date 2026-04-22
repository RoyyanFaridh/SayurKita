import { HERO, KULKAS_ITEMS, POIN_BERKAH_HERO, SURPLUS_HERO } from '../../data/content';
import KulkasWidget from '../../features/kulkas/KulkasWidget';
import SurplusWidget from '../../features/selamatkan/SurplusWidget';
import PoinBerkahWidget from '../../features/poin/PoinBerkahWidget';
import styles from './Hero.module.css';
import { Dot } from 'lucide-react';

export default function Hero() {
  const avatarColors = [
    { bg: 'var(--color-pastel-pink)',   color: 'var(--color-pastel-pink-text)' },
    { bg: 'var(--color-pastel-blue)',   color: 'var(--color-pastel-blue-text)' },
    { bg: 'var(--color-pastel-yellow)', color: 'var(--color-pastel-yellow-text)' },
    { bg: 'var(--color-pastel-orange)', color: 'var(--color-pastel-orange-text)' },
    { bg: 'var(--color-pastel-green)',  color: 'var(--color-pastel-green-text)' },
  ];

  return (
    <section className={styles.hero} id="hero">
      <div className={`container ${styles.inner}`}>

        <div className={styles.copy}>
          <span className={styles.badge}>
            <Dot /> {HERO.badge}
          </span>

          <h1 className={styles.headline}>
            {HERO.headline[0]}<br />
            <span className={styles.headlineGreen}>{HERO.headline[1]}</span>{' '}
            <span className={`heading-display ${styles.headlineAccent}`}>
              {HERO.headlineAccent}
            </span>
          </h1>

          <p className={styles.sub}>{HERO.subheadline}</p>

          <div className={styles.actions}>
           <a href="#daftar" className="btn btn--primary btn--lg">
              {HERO.ctaPrimary}
            </a>
            <div className={styles.socialProof}>
              <div className={styles.avatarStack}>
                {['SR','DK','BJ','AP','MW'].map((ini, i) => (
                  <span
                    key={i}
                    className={styles.avatar}
                    style={{
                      zIndex: 5 - i,
                      backgroundColor: avatarColors[i].bg,
                      color: avatarColors[i].color,
                    }}
                  >
                    {ini}
                  </span>
                ))}
              </div>
              <span className={styles.proofText}>
                <strong>{HERO.socialProof.highlight}</strong> {HERO.socialProof.rest}
              </span>
            </div>
          </div>
        </div>


        <div className={styles.widgetWrap}>

          <div className={styles.poinCardWrap}>
            <PoinBerkahWidget data={POIN_BERKAH_HERO} />
          </div>

          <div className={styles.kulkasWrap}>
            <KulkasWidget items={KULKAS_ITEMS} />
          </div>

          <div className={styles.surplusWrap}>
            <SurplusWidget item={SURPLUS_HERO} />
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className={styles.bgDeco} aria-hidden="true" />
    </section>
  );
}
