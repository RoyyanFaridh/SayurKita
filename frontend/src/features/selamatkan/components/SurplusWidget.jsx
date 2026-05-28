export default function SurplusWidget({ item }) {
  return (
    <div
      className="flex w-55 max-w-full flex-col gap-1 rounded-md px-4 py-3 box-border overflow-hidden
                 max-md:w-45 max-md:px-3 max-md:py-2
                 max-[480px]:w-[125px] max-[480px]:gap-0.5 max-[480px]:px-2.5 max-[480px]:py-1.5"
      style={{
        background:  'var(--bg-surface-1)',
        borderWidth: '1px',
        borderStyle: 'solid',
        borderColor: 'var(--border-subtle)',
        boxShadow:   'var(--shadow-sm)',
      }}
    >

      {/* Live indicator + label */}
      <div className="flex items-center gap-2 max-[480px]:gap-1.5">
        <span
          className="shrink-0 animate-pulse rounded-full"
          style={{
            width: '8px', height: '8px',
            background: 'var(--color-primary-400)',
            flexShrink: 0,
          }}
        />
        <span
          className="overflow-hidden text-ellipsis whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize:   'clamp(0.625rem, 2.5vw, 0.75rem)',
            color:      'var(--text-secondary)',
          }}
        >
          Surplus baru disekitarmu
        </span>
      </div>

      {/* Nama + jarak */}
      <p
        className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-bold leading-tight"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(0.75rem, 3.5vw, 1rem)',
          color:      'var(--text-primary)',
        }}
      >
        {item.nama} – {item.jarak}
      </p>

      <p
        className="m-0 overflow-hidden text-ellipsis whitespace-nowrap"
        style={{
          fontFamily: 'var(--font-body)',
          fontSize:   'clamp(0.625rem, 2.5vw, 0.75rem)',
          color:      'var(--text-muted)',
        }}
      >
        {item.pemilik} – {item.waktu}
      </p>

    </div>
  )
}