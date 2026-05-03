import { Search, Filter, ChevronDown } from 'lucide-react'
import styles from './KulkasToolbar.module.css'

const KATEGORI_LIST = ['Semua', 'Sayur', 'Protein', 'Bumbu']

export default function KulkasToolbar({ search, onSearch, kategori, onKategori, sortBy, onSort }) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.searchWrap}>
        <Search size={13} strokeWidth={2} className={styles.searchIcon} />
        <input
          className={styles.searchInput}
          placeholder="Cari bahan…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      <div className={styles.filterRow}>
        {KATEGORI_LIST.map(k => (
          <button
            key={k}
            className={`${styles.chip} ${kategori === k ? styles.chipActive : ''}`}
            onClick={() => onKategori(k)}
          >
            {k}
          </button>
        ))}
      </div>

      <div className={styles.sortWrap}>
        <Filter size={12} strokeWidth={2} />
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={e => onSort(e.target.value)}
        >
          <option value="exp">Urutkan: Kadaluwarsa</option>
          <option value="nama">Urutkan: Nama</option>
        </select>
        <ChevronDown size={12} strokeWidth={2} className={styles.chevron} />
      </div>
    </div>
  )
}