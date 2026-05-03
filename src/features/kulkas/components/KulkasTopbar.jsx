import { Refrigerator, Plus } from 'lucide-react'
import styles from './KulkasTopbar.module.css'

export default function KulkasTopbar({ totalItems, onTambah }) {
  return (
    <div className={styles.topbar}>
      <div className={styles.left}>
        <Refrigerator size={18} strokeWidth={1.75} className={styles.icon} />
        <div>
          <h1 className={styles.title}>Lihat Kulkas</h1>
          <p className={styles.sub}>{totalItems} bahan tersimpan</p>
        </div>
      </div>
      <button className={styles.btnPrimary} onClick={onTambah}>
        <Plus size={14} strokeWidth={2.5} /> Tambah Bahan
      </button>
    </div>
  )
}