import { ArrowRight, Sparkles } from 'lucide-react'
import styles from './KulkasResepAI.module.css'

// Nanti dari hasil TF-IDF backend
const RESEP = [
  {
    id: 1,
    nama: 'Sayur Lodeh Bayam Tahu Tempe',
    bahan: ['Bayam segar', 'Tahu putih', 'Tempe'],
    waktu: '30 mnt',
    featured: true,
  },
  {
    id: 2,
    nama: 'Sayur Bening Bayam Tahu',
    bahan: ['Bayam segar', 'Tahu putih'],
    waktu: '20 mnt',
    featured: false,
  },
  {
    id: 3,
    nama: 'Tumis Toge Tahu',
    bahan: ['Toge', 'Tahu putih', 'Cabai merah'],
    waktu: '15 mnt',
    featured: false,
  },
]

export default function KulkasResepAI() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.iconWrap}>
            <Sparkles size={14} strokeWidth={2} />
          </div>
          <div>
            <h2 className={styles.title}>Rekomendasi Resep AI</h2>
            <p className={styles.subtitle}>Saran dari bahan yang akan kadaluwarsa</p>
          </div>
        </div>
        <button className={styles.link}>
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>

      <ul className={styles.list}>
        {RESEP.map(r => (
          <li key={r.id} className={`${styles.row} ${r.featured ? styles.featured : ''}`}>
            <div className={styles.info}>
              <p className={`${styles.nama} ${r.featured ? styles.namaFeatured : ''}`}>
                {r.nama}
              </p>
              <p className={`${styles.meta} ${r.featured ? styles.metaFeatured : ''}`}>
                {r.bahan.join(' · ')} · {r.waktu}
              </p>
            </div>
            <span className={`${styles.arrow} ${r.featured ? styles.arrowFeatured : ''}`}>
              <ArrowRight size={15} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}