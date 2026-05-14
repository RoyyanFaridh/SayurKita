export default function SurplusWidget({ item }) {
  return (
    <div className="flex w-55 max-w-full flex-col gap-1 rounded-md border border-neutral-50 bg-white px-4 py-3 shadow-sm box-border max-md:w-45 max-md:px-3 max-md:py-2 max-[480px]:w-31.25 max-[480px]:gap-0.75 max-[480px]:px-[10px] max-[480px]:py-[6px] max-[360px]:w-27.5 max-[360px]:px-2 max-[360px]:py-1.25">
      
      <div className="flex items-center gap-2">
        <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-forest-500 max-md:h-1.5 max-md:w-1.5" />

        <span className="overflow-hidden text-ellipsis whitespace-nowrap font-body text-xs text-secondary max-md:text-[0.65rem] max-[480px]:text-[0.6rem] max-[360px]:text-[0.55rem]">
          Surplus baru disekitarmu
        </span>
      </div>

      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-body text-base font-bold leading-tight text-primary max-md:text-[0.8rem] max-[480px]:text-compact-base max-[360px]:text-[0.7rem]">
        {item.nama} – {item.jarak}
      </p>

      <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap font-body text-xs text-muted max-md:text-[0.65rem] max-[480px]:text-[0.6rem] max-[360px]:text-[0.55rem]">
        {item.pemilik} – {item.waktu}
      </p>
    </div>
  )
}