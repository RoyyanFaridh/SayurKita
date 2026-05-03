import { ArrowRight } from 'lucide-react'
import styles from './PostingWidget.module.css'

const POSTINGS = [
  {
    id: 1,
    name: 'Rendang Sisa Lebaran',
    statusLabel: 'Aktif',
    statusType: 'aktif',
    sub: 'Menunggu klaim',
    note: 'Jika tidak diklaim, otomatis akan dikirim ke Mitra Organik',
  },
]

export default function PostingWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Posting Aktifmu</h2>
        <button className={styles.link}>
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
      <ul className={styles.list}>
        {POSTINGS.map(p => (
          <li key={p.id} className={styles.item}>
            <div className={styles.row}>
              <div className={styles.thumb} aria-hidden="true" />
              <div className={styles.info}>
                <p className={styles.name}>{p.name}</p>
                <p className={styles.sub}>{p.sub}</p>
              </div>
              <span className={`${styles.badge} ${styles[`badge_${p.statusType}`]}`}>
                {p.statusLabel}
              </span>
            </div>
            {p.note && <p className={styles.note}>{p.note}</p>}
          </li>
        ))}
      </ul>
    </div>
  )
}