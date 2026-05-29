import { useState } from 'react'
import { Refrigerator, Snowflake, ThermometerSun, ChevronLeft, ChevronRight } from 'lucide-react'

const PAGE_SIZE = 10

const STORAGE_ICON = {
  kulkas:  { Icon: Refrigerator,   label: 'Kulkas'     },
  freezer: { Icon: Snowflake,      label: 'Freezer'    },
  ruang:   { Icon: ThermometerSun, label: 'Suhu Ruang' },
}

const expBadgeClass = {
  danger:  'bg-(--bg-danger-subtle) text-(--color-danger-800)',
  warning: 'bg-(--bg-warning-subtle) text-(--color-warning-800)',
  ok:      'bg-(--bg-success-subtle) text-(--text-success)',
  fresh:   'bg-(--bg-success-subtle) text-(--text-success)',
}

const KATEGORI_LABEL = {
  bumbu:          'Bumbu',
  rempah:         'Rempah',
  sayuran:        'Sayuran',
  buah:           'Buah',
  protein_hewani: 'Protein Hewani',
  protein_nabati: 'Protein Nabati',
  karbohidrat:    'Karbohidrat',
  olahan:         'Olahan',
  lainnya:        'Lainnya',
}

const borderAccent = {
  danger:  'border-l-danger-400',
  warning: 'border-l-warning-400',
  ok:      'border-l-success-400',
  fresh:   'border-l-success-400',
}

function StorageChip({ storage }) {
  const s = STORAGE_ICON[storage] ?? STORAGE_ICON.kulkas
  const { Icon } = s
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-(--bg-subtle) px-2.5 py-1 text-compact-sm font-medium" style={{ color: 'var(--text-brand)' }}>
      <Icon size={12} strokeWidth={1.75} />
      {s.label}
    </span>
  )
}

function ExpBadge({ expLabel, expType }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-compact-xs font-medium ${expBadgeClass[expType]}`}>
      {expLabel}
    </span>
  )
}

function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <div
      className="flex items-center justify-between px-4 py-3 border-t border-(--border-subtle)"
      style={{ background: 'var(--bg-alt)' }}
    >
      <p className="text-compact-sm" style={{ color: 'var(--text-muted)' }}>
        Halaman {page} dari {totalPages}
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onChange(page - 1)}
          disabled={page === 1}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-(--border-default) bg-transparent transition-colors duration-150 hover:bg-(--bg-surface-3) disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft size={14} strokeWidth={2} style={{ color: 'var(--text-secondary)' }} />
        </button>
        <button
          onClick={() => onChange(page + 1)}
          disabled={page === totalPages}
          className="flex h-7 w-7 items-center justify-center rounded-md border border-(--border-default) bg-transparent transition-colors duration-150 hover:bg-(--bg-surface-3) disabled:opacity-40 disabled:cursor-not-allowed"
          aria-label="Halaman berikutnya"
        >
          <ChevronRight size={14} strokeWidth={2} style={{ color: 'var(--text-secondary)' }} />
        </button>
      </div>
    </div>
  )
}

export default function KulkasItemList({ items, onEdit }) {
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(items.length / PAGE_SIZE)
  const offset     = (page - 1) * PAGE_SIZE
  const paginated  = items.slice(offset, offset + PAGE_SIZE)

  // Reset ke halaman 1 kalau items berubah (search/filter) dan halaman aktif jadi out of range
  if (page > totalPages && totalPages > 0) setPage(1)

  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border border-(--border-subtle) bg-white shadow-xs">
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-compact-lg" style={{ color: 'var(--text-muted)' }}>
          <Refrigerator size={32} strokeWidth={1} style={{ color: 'var(--text-disabled)' }} />
          <p>Tidak ada bahan ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Desktop table */}
      <div className="overflow-hidden rounded-md border border-(--border-subtle) bg-white shadow-xs max-sm:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {[
                { label: 'No',          align: 'text-center' },
                { label: 'Nama Bahan',  align: 'text-center'   },
                { label: 'Kategori',    align: 'text-center' },
                { label: 'Penyimpanan', align: 'text-center' },
                { label: 'Jumlah',      align: 'text-center' },
                { label: 'Kadaluwarsa', align: 'text-center' },
                { label: '',            align: 'text-center' },
              ].map(col => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap border-b border-(--border-subtle) bg-(--bg-alt) px-4 py-3 ${col.align} text-compact-sm font-semibold`}
                  style={{ color: 'var(--text-muted)' }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((item, i) => (
              <tr
                key={item.id}
                className="border-b border-(--border-subsub) transition-colors duration-150 last:border-b-0 hover:bg-(--bg-alt)"
              >
                <td className="px-2 py-3 text-center align-middle text-compact-sm" style={{ color: 'var(--text-muted)' }}>
                  {offset + i + 1}
                </td>
                <td className="px-4 py-3 text-left align-middle text-compact-base font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                  {item.nama}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <span className="inline-block rounded-full bg-(--bg-subtle) px-2.5 py-1 text-compact-sm font-medium" style={{ color: 'var(--text-brand)' }}>
                    {KATEGORI_LABEL[item.kategori] ?? item.kategori}
                  </span>
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <StorageChip storage={item.storage} />
                </td>
                <td className="px-4 py-3 text-center align-middle text-compact-base" style={{ color: 'var(--text-secondary)' }}>
                  {item.jumlah}
                </td>
                <td className="px-4 py-3 text-center align-middle">
                  <ExpBadge expLabel={item.expLabel} expType={item.expType} />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-center align-middle">
                  <button
                    className="rounded-sm border border-(--border-default) bg-transparent px-3 py-1 text-compact-sm font-medium transition-all duration-150 hover:bg-(--bg-surface-3)"
                    style={{ color: 'var(--text-secondary)' }}
                    onClick={() => onEdit(item)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>

      {/* Mobile cards */}
      <div className="hidden flex-col gap-2 max-sm:flex">
        {paginated.map((item, i) => (
          <div
            key={item.id}
            className={`flex items-center justify-between gap-3 rounded-md border border-(--border-subtle) border-l-[3px] bg-white px-4 py-3 shadow-xs ${borderAccent[item.expType]}`}
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-compact-lg font-medium capitalize flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                <span className="shrink-0 text-compact-xs font-normal" style={{ color: 'var(--text-muted)' }}>
                  {offset + i + 1}.
                </span>
                {item.nama}
              </p>
              <div className="mt-1 flex items-center gap-1.5 flex-wrap">
                <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>
                  {KATEGORI_LABEL[item.kategori] ?? item.kategori}
                </span>
                {item.jumlah && item.jumlah !== '-' && (
                  <>
                    <span style={{ color: 'var(--border-default)' }}>·</span>
                    <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>
                      {item.jumlah}
                    </span>
                  </>
                )}
                <span style={{ color: 'var(--border-default)' }}>·</span>
                <span className="inline-flex items-center gap-1 text-compact-xs" style={{ color: 'var(--text-muted)' }}>
                  {(() => { const { Icon } = STORAGE_ICON[item.storage] ?? STORAGE_ICON.kulkas; return <Icon size={11} strokeWidth={1.75} /> })()}
                  {STORAGE_ICON[item.storage]?.label ?? 'Kulkas'}
                </span>
              </div>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <ExpBadge expLabel={item.expLabel} expType={item.expType} />
              <button
                className="rounded-sm border border-(--border-default) bg-transparent px-3 py-1 text-compact-sm font-medium transition-all duration-150 hover:bg-(--bg-surface-3)"
                style={{ color: 'var(--text-secondary)' }}
                onClick={() => onEdit(item)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </>
  )
}