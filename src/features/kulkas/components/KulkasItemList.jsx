import { Refrigerator } from 'lucide-react'

const EXP_LABEL_MAP = {
  danger: 'Segera!',
  warning: 'Perhatian',
  ok: 'Oke',
  fresh: 'Segar',
}

function Badge({ expType }) {
  const badgeClass = {
    danger: 'bg-danger-50 text-danger-500',
    warning: 'bg-warning-50 text-warning-500',
    ok: 'bg-success-50 text-success-500',
    fresh: 'bg-success-50 text-success-500',
  }

  return (
    <span
      className={`inline-block whitespace-nowrap rounded-full px-3 py-1 text-compact-sm font-medium ${badgeClass[expType]}`}
    >
      {EXP_LABEL_MAP[expType]}
    </span>
  )
}

export default function KulkasItemList({ items, onEdit }) {
  if (items.length === 0) {
    return (
      <div className="overflow-hidden rounded-md border border-neutral-100 bg-white shadow-xs max-sm:hidden">
        <div className="flex flex-col items-center gap-3 px-6 py-12 text-center text-compact-lg text-neutral-400">
          <Refrigerator
            size={32}
            strokeWidth={1}
            className="text-neutral-300"
          />
          <p>Tidak ada bahan ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-hidden rounded-md border border-neutral-100 bg-white shadow-xs max-sm:hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400">
                Nama Bahan
              </th>

              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400">
                Kategori
              </th>

              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400">
                Jumlah
              </th>

              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400">
                Kadaluwarsa
              </th>

              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400">
                Status
              </th>

              <th className="whitespace-nowrap border-b border-neutral-100 bg-neutral-50 px-4 py-3 text-left text-compact-sm font-semibold text-neutral-400"></th>
            </tr>
          </thead>

          <tbody>
            {items.map(item => (
              <tr
                key={item.id}
                className="border-b border-neutral-50 transition-colors duration-instant ease-out last:border-b-0 hover:bg-neutral-50"
              >
                <td className="px-4 py-3 align-middle text-compact-base font-medium text-neutral-900">
                  {item.nama}
                </td>

                <td className="px-4 py-3 align-middle text-compact-base text-neutral-600">
                  <span className="inline-block rounded-full bg-primary-50 px-2.5 py-1 text-compact-sm font-medium text-primary-600">
                    {item.kategori}
                  </span>
                </td>

                <td className="px-4 py-3 align-middle text-compact-base text-neutral-600">
                  {item.jumlah}
                </td>

                <td className="px-4 py-3 align-middle text-compact-base text-neutral-600">
                  {item.expLabel}
                </td>

                <td className="px-4 py-3 align-middle text-compact-base text-neutral-600">
                  <Badge expType={item.expType} />
                </td>

                <td className="whitespace-nowrap px-4 py-3 text-right align-middle text-compact-base text-neutral-600">
                  <button
                    className="rounded-sm border border-neutral-200 bg-transparent px-3 py-1 text-compact-sm font-medium text-neutral-600 transition-all duration-fast ease-out hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900"
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

      <div className="hidden flex-col gap-2 max-sm:flex">
        {items.map(item => {
          const borderClass = {
            danger: 'border-l-danger-400',
            warning: 'border-l-warning-400',
            ok: 'border-l-success-400',
            fresh: 'border-l-success-400',
          }

          return (
            <div
              key={item.id}
              className={`flex items-center justify-between gap-3 rounded-md border border-neutral-100 border-l-[3px] bg-white px-4 py-3 shadow-xs ${borderClass[item.expType]}`}
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-compact-lg font-medium text-neutral-900">
                  {item.nama}
                </p>

                <p className="mt-0.5 text-compact-sm text-neutral-400">
                  {item.kategori} · {item.jumlah}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge expType={item.expType} />

                <button
                  className="rounded-sm border border-neutral-200 bg-transparent px-3 py-1 text-compact-sm font-medium text-neutral-600 transition-all duration-fast ease-out hover:border-neutral-300 hover:bg-neutral-100 hover:text-neutral-900"
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