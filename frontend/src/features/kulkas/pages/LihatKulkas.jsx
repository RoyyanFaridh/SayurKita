import { useState } from 'react'
import { Plus } from 'lucide-react'

import KulkasTopbar from '../components/KulkasTopbar'
import KulkasSummaryStrip from '../components/KulkasSummaryStrip'
import KulkasAlertBanner from '../components/KulkasAlertBanner'
import KulkasToolbar from '../components/KulkasToolbar'
import KulkasItemList from '../components/KulkasItemList'
import KulkasResepAI from '../components/KulkasResepAI'
import KulkasModal from '../components/KulkasModal'

const ITEMS = [
  { id: 1, nama: 'Bayam Segar', kategori: 'Sayur', jumlah: '1 ikat', exp: '2026-05-03', expLabel: 'Besok!', expType: 'danger' },
  { id: 2, nama: 'Tahu Putih', kategori: 'Protein', jumlah: '4 potong', exp: '2026-05-04', expLabel: '2 hari', expType: 'warning' },
  { id: 3, nama: 'Tempe', kategori: 'Protein', jumlah: '1 papan', exp: '2026-05-07', expLabel: '5 hari', expType: 'ok' },
  { id: 4, nama: 'Santan Kara', kategori: 'Bumbu', jumlah: '2 sachet', exp: '2026-05-14', expLabel: '12 hari', expType: 'fresh' },
  { id: 5, nama: 'Wortel', kategori: 'Sayur', jumlah: '3 buah', exp: '2026-05-10', expLabel: '8 hari', expType: 'fresh' },
  { id: 6, nama: 'Telur Ayam', kategori: 'Protein', jumlah: '6 butir', exp: '2026-05-16', expLabel: '14 hari', expType: 'fresh' },
  { id: 7, nama: 'Cabai Merah', kategori: 'Bumbu', jumlah: '100 g', exp: '2026-05-05', expLabel: '3 hari', expType: 'warning' },
  { id: 8, nama: 'Toge', kategori: 'Sayur', jumlah: '200 g', exp: '2026-05-03', expLabel: 'Besok!', expType: 'danger' },
]

const EXP_ORDER = {
  danger: 0,
  warning: 1,
  ok: 2,
  fresh: 3,
}

export default function LihatKulkas() {
  const [search, setSearch] = useState('')
  const [kategori, setKategori] = useState('Semua')
  const [sortBy, setSortBy] = useState('exp')
  const [modal, setModal] = useState(null)

  const filtered = ITEMS
    .filter(i => (
      (kategori === 'Semua' || i.kategori === kategori) &&
      i.nama.toLowerCase().includes(search.toLowerCase())
    ))
    .sort((a, b) =>
      sortBy === 'exp'
        ? EXP_ORDER[a.expType] - EXP_ORDER[b.expType]
        : a.nama.localeCompare(b.nama)
    )

  const counts = {
    danger: ITEMS.filter(i => i.expType === 'danger').length,
    warning: ITEMS.filter(i => i.expType === 'warning').length,
    ok: ITEMS.filter(i => i.expType === 'ok').length,
    fresh: ITEMS.filter(i => i.expType === 'fresh').length,
  }

  return (
    <>
      <KulkasTopbar
        totalItems={ITEMS.length}
        onTambah={() => setModal('add')}
      />

      <div className="flex flex-col gap-5 px-7 pb-10 pt-6 max-sm:gap-4 max-sm:px-0 max-sm:pb-8 max-sm:pt-0">
        <div className="hidden items-center justify-between rounded-b-xl bg-primary-600 px-4 pb-5 pt-4 max-sm:flex">
          <div>
            <h1 className="text-xl font-bold leading-snug text-white">
              Lihat Kulkas
            </h1>

            <p className="mt-0.5 text-compact-xs text-white/35">
              {ITEMS.length} bahan tersimpan
            </p>
          </div>

          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/20 bg-white/15 text-white"
            onClick={() => setModal('add')}
          >
            <Plus size={14} strokeWidth={2.5} />
          </button>
        </div>

        <div className="max-sm:px-4">
          <KulkasSummaryStrip counts={counts} />
        </div>

        <div className="max-sm:px-4">
          <KulkasAlertBanner count={counts.danger} />
        </div>

        <div className="max-sm:px-4">
          <KulkasToolbar
            search={search}
            onSearch={setSearch}
            kategori={kategori}
            onKategori={setKategori}
            sortBy={sortBy}
            onSort={setSortBy}
          />
        </div>

        <div className="max-sm:px-4">
          <KulkasItemList
            items={filtered}
            onEdit={item => setModal(item)}
          />
        </div>

        <div className="max-sm:px-4">
          <KulkasResepAI />
        </div>
      </div>

      {modal && (
        <KulkasModal
          item={modal === 'add' ? null : modal}
          onClose={() => setModal(null)}
        />
      )}
    </>
  )
}