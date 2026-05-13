import { HERO, KULKAS_ITEMS, POIN_BERKAH_HERO, SURPLUS_HERO } from '../../../data/content';
import KulkasWidget from '../../kulkas/components/KulkasWidget';
import SurplusWidget from '../../selamatkan/components/SurplusWidget';
import PoinBerkahWidget from '../../poin/components/PoinBerkahWidget';

const avatarColors = [
  { bg: 'var(--color-pastel-pink)',   color: 'var(--color-pastel-pink-text)' },
  { bg: 'var(--color-pastel-blue)',   color: 'var(--color-pastel-blue-text)' },
  { bg: 'var(--color-pastel-yellow)', color: 'var(--color-pastel-yellow-text)' },
  { bg: 'var(--color-pastel-orange)', color: 'var(--color-pastel-orange-text)' },
  { bg: 'var(--color-pastel-green)',  color: 'var(--color-pastel-green-text)' },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-[96vh] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-on-dark)', paddingBlock: 'var(--section-py-lg)' }}
    >
      <div
        className="container grid items-center relative z-10 w-full mx-auto"
        style={{ gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-16)', maxWidth: '1920px', paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))' }}
      >

        <div className="flex flex-col gap-1">
          <span
            className="inline-flex items-center w-fit border rounded-full text-xs font-semibold tracking-wide"
            style={{ padding: 'var(--space-1-5) var(--space-5)', borderColor: 'var(--color-forest-200)', color: 'var(--color-forest-600)', backgroundColor: 'var(--color-forest-50)', fontSize: 'var(--text-fluid-xs)', letterSpacing: 'var(--tracking-wide)' }}
          >
            {HERO.badge}
          </span>

          <h1
            className="font-extrabold leading-[1.25] tracking-tight m-0"
            style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-fluid-display)', letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)' }}
          >
            {HERO.headline[0]}<br />
            <span style={{ color: 'var(--text-on-amber)' }}>{HERO.headline[1]}</span>{' '}
            <span style={{ color: 'var(--accent-primary)', fontFamily: 'var(--font-display)', fontStyle: 'normal' }}>
              {HERO.headlineAccent}
            </span>
          </h1>

          <p
            className="m-0"
            style={{ fontSize: 'var(--text-fluid-lg)', color: 'var(--text-secondary)', lineHeight: 'var(--leading-relaxed)', maxWidth: '72ch', paddingBottom: 'var(--space-10)' }}
          >
            {HERO.subheadline}
          </p>

          <div className="flex flex-wrap gap-8 items-center">
            <a href="#daftar" className="btn btn--primary btn--lg">
              {HERO.ctaPrimary}
            </a>
            <div className="flex items-center gap-3 mt-2">
              <div className="flex flex-row-reverse">
                {['SR', 'DK', 'BJ', 'AP', 'MW'].map((ini, i) => (
                  <span
                    key={i}
                    className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold -ml-2 relative"
                    style={{
                      zIndex: 5 - i,
                      backgroundColor: avatarColors[i].bg,
                      color: avatarColors[i].color,
                      borderColor: 'var(--bg-base)',
                    }}
                  >
                    {ini}
                  </span>
                ))}
              </div>
              <span style={{ fontSize: 'var(--text-fluid-sm)', color: 'var(--color-neutral-600)', lineHeight: 'var(--leading-normal)' }}>
                <strong>{HERO.socialProof.highlight}</strong> {HERO.socialProof.rest}
              </span>
            </div>
          </div>
        </div>

        <div className="relative w-full shrink-0 overflow-visible" style={{ aspectRatio: '817 / 715' }}>
          <div
            className="absolute rounded-full pointer-events-none z-0 blur-[32px] opacity-60"
            style={{ width: '45%', aspectRatio: '1', background: 'radial-gradient(circle, var(--color-forest-100) 0%, transparent 70%)', top: '20%', left: '30%', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="absolute rounded-full pointer-events-none z-0 blur-xl opacity-70"
            style={{ width: '30%', aspectRatio: '1', background: 'radial-gradient(circle, var(--color-amber-100) 0%, transparent 70%)', top: '10%', right: '5%' }}
          />
          <div
            className="absolute rounded-full pointer-events-none z-0 animate-[spinSlow_30s_linear_infinite]"
            style={{ width: '52%', aspectRatio: '1', border: '1.5px dashed var(--color-forest-200)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <div
            className="absolute rounded-full pointer-events-none z-0 animate-[spinSlow_50s_linear_infinite_reverse]"
            style={{ width: '72%', aspectRatio: '1', border: '1px dashed var(--color-neutral-200)', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
          />
          <div className="absolute rounded-full pointer-events-none z-0 opacity-50" style={{ width: 10, height: 10, background: 'var(--color-forest-300)', top: '8%', left: '18%' }} />
          <div className="absolute rounded-full pointer-events-none z-0 opacity-60" style={{ width: 6, height: 6, background: 'var(--color-amber-400)', top: '22%', right: '10%' }} />
          <div className="absolute rounded-full pointer-events-none z-0 opacity-40" style={{ width: 8, height: 8, background: 'var(--color-forest-400)', bottom: '20%', left: '8%' }} />
          <div className="absolute rounded-full pointer-events-none z-0 opacity-50" style={{ width: 5, height: 5, background: 'var(--color-amber-300)', bottom: '10%', right: '20%' }} />
          <div className="absolute rounded-full pointer-events-none z-0 opacity-40" style={{ width: 12, height: 12, background: 'var(--color-forest-200)', top: '50%', left: '5%' }} />

          <div className="absolute z-20" style={{ left: '65.24%', top: '1.12%', width: '33.29%' }}>
            <PoinBerkahWidget data={POIN_BERKAH_HERO} />
          </div>
          <div className="absolute z-10" style={{ left: '23.62%', top: '13.01%', width: '60.83%' }}>
            <KulkasWidget items={KULKAS_ITEMS} />
          </div>
          <div className="absolute z-30" style={{ left: '0.98%', top: '81.82%', width: '27.91%' }}>
            <SurplusWidget item={SURPLUS_HERO} />
          </div>
        </div>

      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ background: 'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(180,180,180,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(180,180,180,0.08) 0%, transparent 60%)' }}
      />
    </section>
  );
}