import { HERO, KULKAS_ITEMS, POIN_BERKAH_HERO, SURPLUS_HERO } from '../../../data/content';
import KulkasWidget from '../../kulkas/components/KulkasWidget';
import SurplusWidget from '../../selamatkan/components/SurplusWidget';
import PoinBerkahWidget from '../../poin/components/PoinBerkahWidget';

const avatarColors = [
  { bg: '#fce4ec', color: '#880e4f' },
  { bg: '#e3f2fd', color: '#0d47a1' },
  { bg: '#fffde7', color: '#f57f17' },
  { bg: '#fff3e0', color: '#e65100' },
  { bg: '#e8f5e9', color: '#1b5e20' },
];

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex items-center justify-center overflow-hidden max-[899px]:pt-28 max-[899px]:pb-12 max-[1439px]:pt-28 max-[1439px]:pb-12 max-[1439px]:min-h-[88vh]"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div
        className="
          container relative z-10 w-full mx-auto
          grid grid-cols-1 gap-10
          min-[1440px]:grid-cols-[1.1fr_0.9fr]
          min-[1440px]:gap-16
          min-[1440px]:min-h-[96vh]
          min-[1440px]:items-center
        "
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
        }}
      >
        <div className="flex flex-col gap-5 items-center text-center min-[1440px]:items-start min-[1440px]:text-left">
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
            {HERO.badge}
          </span>

          <h1
            className="font-extrabold leading-tight tracking-tight m-0"
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'var(--text-fluid-display)',
              letterSpacing: 'var(--tracking-tight)',
              color: 'var(--text-primary)',
            }}
          >
            {HERO.headline[0]}
            <br />
            <span style={{ color: 'var(--text-primary)' }}>
              {HERO.headline[1]}
            </span>{' '}
            <span
              className="not-italic"
              style={{
                color: 'var(--accent-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {HERO.headlineAccent}
            </span>
          </h1>

          <p
            className="m-0"
            style={{
              fontSize: 'var(--text-fluid-lg)',
              color: 'var(--text-secondary)',
              lineHeight: 'var(--leading-relaxed)',
              maxWidth: '52ch',
            }}
          >
            {HERO.subheadline}
          </p>

          <div className="flex flex-col min-[1440px]:flex-row items-center gap-4 w-full min-[1440px]:w-auto">
            <a
              href="#daftar"
              className="
                btn btn--primary btn--lg
                w-full
                min-[900px]:w-auto
                min-[900px]:px-8
                min-[900px]:py-3
                min-[1440px]:px-10
              "
            >
              {HERO.ctaPrimary}
            </a>

            <div className="flex items-center gap-3 justify-center min-[1440px]:justify-start">
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

              <span
                style={{
                  fontSize: 'var(--text-fluid-sm)',
                  color: 'var(--color-neutral-600)',
                  lineHeight: 'var(--leading-normal)',
                  whiteSpace: 'nowrap',
                }}
              >
                <strong>{HERO.socialProof.highlight}</strong>{' '}
                {HERO.socialProof.rest}
              </span>
            </div>
          </div>
        </div>

        {/* Widget hanya tampil di desktop besar >=1440px */}
        <div
          className="relative w-full shrink-0 overflow-visible hidden min-[1440px]:block"
          style={{ aspectRatio: '817 / 715' }}
        >
          <div
            className="absolute rounded-full pointer-events-none z-0 blur-[32px] opacity-60"
            style={{
              width: '45%',
              aspectRatio: '1',
              background:
                'radial-gradient(circle, var(--color-forest-100) 0%, transparent 70%)',
              top: '20%',
              left: '30%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 blur-xl opacity-70"
            style={{
              width: '30%',
              aspectRatio: '1',
              background:
                'radial-gradient(circle, var(--color-amber-100) 0%, transparent 70%)',
              top: '10%',
              right: '5%',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 animate-[spinSlow_30s_linear_infinite]"
            style={{
              width: '52%',
              aspectRatio: '1',
              border: '1.5px dashed var(--color-forest-200)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 animate-[spinSlow_50s_linear_infinite_reverse]"
            style={{
              width: '72%',
              aspectRatio: '1',
              border: '1px dashed var(--color-neutral-200)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 opacity-50"
            style={{
              width: 10,
              height: 10,
              background: 'var(--color-forest-300)',
              top: '8%',
              left: '18%',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 opacity-60"
            style={{
              width: 6,
              height: 6,
              background: 'var(--color-amber-400)',
              top: '22%',
              right: '10%',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 opacity-40"
            style={{
              width: 8,
              height: 8,
              background: 'var(--color-forest-400)',
              bottom: '20%',
              left: '8%',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 opacity-50"
            style={{
              width: 5,
              height: 5,
              background: 'var(--color-amber-300)',
              bottom: '10%',
              right: '20%',
            }}
          />

          <div
            className="absolute rounded-full pointer-events-none z-0 opacity-40"
            style={{
              width: 12,
              height: 12,
              background: 'var(--color-forest-200)',
              top: '50%',
              left: '5%',
            }}
          />

          <div
            className="absolute z-20"
            style={{ left: '65.24%', top: '2%', width: '33.29%' }}
          >
            <PoinBerkahWidget data={POIN_BERKAH_HERO} />
          </div>

          <div
            className="absolute z-10"
            style={{ left: '23.62%', top: '15%', width: '60.83%' }}
          >
            <KulkasWidget items={KULKAS_ITEMS} />
          </div>

          <div
            className="absolute z-30"
            style={{ left: '0.98%', top: '75%', width: '27.91%' }}
          >
            <SurplusWidget item={SURPLUS_HERO} />
          </div>
        </div>
      </div>

      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 60% 70% at 80% 50%, rgba(180,180,180,0.12) 0%, transparent 60%), radial-gradient(ellipse 40% 50% at 20% 80%, rgba(180,180,180,0.08) 0%, transparent 60%)',
        }}
      />
    </section>
  );
}