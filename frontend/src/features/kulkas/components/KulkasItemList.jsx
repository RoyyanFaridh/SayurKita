import { Refrigerator, Snowflake, ThermometerSun } from 'lucide-react'

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

function StorageChip({ storage }) {
  const s = STORAGE_ICON[storage] ?? STORAGE_ICON.kulkas
  const Icon = s.Icon
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full text-compact-sm font-medium text-(--text-brand)">
      {s.label}
    </span>
  )
}

function ExpBadge({ expLabel, expType }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-3 py-1 mx-2 text-compact-xs font-medium ${expBadgeClass[expType]}`}>
      {expLabel}
    </span>
  )
}

export default function KulkasItemList({ items, onEdit }) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border border-(--border-subtle) bg-white shadow-xs max-sm:hidden">
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-compact-lg" style={{ color: 'var(--text-muted)' }}>
          <Refrigerator size={32} strokeWidth={1} style={{ color: 'var(--text-disabled)' }} />
          <p>Tidak ada bahan ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-(--border-subtle) bg-white shadow-xs max-sm:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Nama Bahan', 'Kategori', 'Penyimpanan', 'Jumlah', 'Kadaluwarsa', ''].map(col => (
                <th
                  key={col}
                  className="whitespace-nowrap border-b border-(--border-subtle) bg-(--bg-alt) px-4 py-3 text-center text-compact-sm font-semibold"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                className="border-b border-(--border-subsub) transition-colors duration-150 last:border-b-0 hover:bg-(--bg-alt)"
              >
                <td className="px-4 py-3 text-center align-middle text-compact-base font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
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
      </div>

      {/* Mobile cards */}
      <div className="hidden flex-col gap-2 max-sm:flex">
        {items.map(item => {
          const borderClass = {
            danger:  'border-l-danger-400',
            warning: 'border-l-warning-400',
            ok:      'border-l-success-400',
            fresh:   'border-l-success-400',
          }
          return (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-md border border-(--border-subtle) border-l-[3px] bg-white px-4 py-3 shadow-xs ${borderClass[item.expType]}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-compact-lg font-medium capitalize" style={{ color: 'var(--text-primary)' }}>
                  {item.nama}
                </p>
                <p className="mt-0.5 text-compact-sm" style={{ color: 'var(--text-muted)' }}>
                  {KATEGORI_LABEL[item.kategori] ?? item.kategori}
                  {item.jumlah && item.jumlah !== '-' ? ` · ${item.jumlah}` : ''}
                  {' · '}{STORAGE_ICON[item.storage]?.label ?? 'Kulkas'}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
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
          )
        })}
      </div>
    </>
  )
}