import { Flame } from 'lucide-react'

export default function KulkasAlertBanner({ count }) {
  if (!count) return null

  return (
    <div className="flex items-center gap-3 rounded-md border border-danger-200 bg-danger-50 px-4 py-3 text-compact-lg text-danger-500 max-[480px]:flex-wrap max-[480px]:gap-2">
      <Flame
        size={15}
        strokeWidth={2}
        className="shrink-0"
      />

      <span className="flex-1">
        <strong>{count} bahan</strong> kadaluwarsa besok — segera masak atau posting sebagai surplus
      </span>

      <button className="shrink-0 whitespace-nowrap rounded-sm bg-danger-500 px-4 py-1.5 font-body text-compact-base font-medium text-white transition-opacity duration-fast ease-out hover:opacity-85">
        Posting Sekarang
      </button>
    </div>
  )
}