const SOCIAL_LINKS = [
  {
    label: 'Instagram',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'TikTok',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
      </svg>
    ),
  },
];

export default function FooterBottom() {
  return (
    <div style={{ backgroundColor: '#10231B' }}>
      <div
        className="mx-auto flex items-center justify-between flex-wrap gap-4"
        style={{
          maxWidth: '1920px',
          paddingInline: 'clamp(var(--space-8), 6vw, var(--space-32))',
          paddingBlock: '1.25rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontSize: '0.8125rem',
            color: '#657F6D',
          }}
        >
          © {new Date().getFullYear()} SayurKita. Dibuat untuk Indonesia.
        </span>

        <div className="flex items-center gap-4">
          {SOCIAL_LINKS.map((s, i) => (
            <a
              key={i}
              href={s.href}
              aria-label={s.label}
              className="transition-colors duration-150"
              style={{ color: '#657F6D' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.8)'}
              onMouseLeave={e => e.currentTarget.style.color = '#657F6D'}
            >
              {s.icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}