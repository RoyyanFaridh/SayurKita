export default function AuthLayout({
  children,
  eyebrow,
  title,
  highlight,
  subtitle
}) {
  return (
    <div className="grid min-h-screen grid-cols-[420px_1fr] max-[900px]:grid-cols-[280px_1fr] max-[640px]:grid-cols-1 max-[640px]:grid-rows-[auto_1fr]">

      <aside className="bg-(--color-forest-900) flex flex-col px-10 py-10 sticky top-0 h-screen max-[900px]:px-8 max-[640px]:static max-[640px]:h-auto max-[640px]:flex-row max-[640px]:items-center max-[640px]:justify-between max-[640px]:gap-4 max-[640px]:px-5 max-[640px]:py-6 max-[400px]:px-4 max-[400px]:py-5">
        
        <a href="/" className="font-bold text-white text-xl">
          Sayur<span className="text-(--accent-primary)">Kita.</span>
        </a>

        <div className="flex-1 flex flex-col justify-center gap-4 max-[640px]:hidden">
          <p className="text-xs font-semibold tracking-wider uppercase text-(--color-forest-200)">
            {eyebrow}
          </p>

          <h1 className="font-display font-bold leading-tight text-white text-[clamp(2.25rem,3.5vw,3.25rem)]">
            {title}{' '}
            {highlight && (
              <span className="text-(--accent-primary) italic block">
                {highlight}
              </span>
            )}
          </h1>

          <p className="text-sm text-(--color-forest-200) max-w-[28ch]">
            {subtitle}
          </p>
        </div>

        <p className="text-xs text-(--color-forest-200) max-[640px]:hidden">
          © 2025 SayurKita
        </p>
      </aside>

      <main className="bg-white flex items-center justify-center py-16 px-8 overflow-y-auto max-[640px]:items-start max-[640px]:px-5 max-[640px]:pt-10 max-[640px]:pb-10 max-[400px]:px-4">
        <div className="w-full max-w-120 flex flex-col gap-6">
          {children}
        </div>
      </main>

    </div>
  );
}