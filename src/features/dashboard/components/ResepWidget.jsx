import styles from './ResepWidget.module.css'
import { ArrowRight } from 'lucide-react'

const RESEP = [
  { id: 1, name: 'Sayur Lodeh Bayam Tahu Tempe', ingredients: ['Bayam segar', 'Tahu putih', 'Tempe'], featured: true },
  { id: 2, name: 'Sayur Bening Bayam Tahu',       ingredients: ['Bayam segar', 'Tahu putih'],          featured: false },
]

export default function ResepWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Resep Rekomendasi AI</h2>
          <p className={styles.subtitle}>Saran resep dari bahan yang akan basi:</p>
        </div>
        <button className={styles.link}>
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
      <ul className={styles.list}>
        {RESEP.map(r => (
          <li key={r.id} className={`${styles.row} ${r.featured ? styles.featured : ''}`}>
            <div className={styles.info}>
              <p className={`${styles.name} ${r.featured ? styles.nameFeatured : ''}`}>{r.name}</p>
              <p className={`${styles.ing}  ${r.featured ? styles.ingFeatured  : ''}`}>{r.ingredients.join(' · ')}</p>
            </div>
            <span className={`${styles.arrow} ${r.featured ? styles.arrowFeatured : ''}`}>
              <ArrowRight size={16} strokeWidth={2} />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}