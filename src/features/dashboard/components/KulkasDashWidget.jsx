import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './KulkasDashWidget.module.css'

const ITEMS = [
  { id: 1, name: 'Bayam segar', expLabel: 'Besok!', expType: 'danger' },
  { id: 2, name: 'Tahu putih',  expLabel: '2 hari',  expType: 'warning' },
  { id: 3, name: 'Tempe',       expLabel: '5 hari',  expType: 'ok' },
  { id: 4, name: 'Santan Kara', expLabel: '12 hari', expType: 'fresh' },
]

export default function KulkasDashWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>Lihat Kulkas</h2>
        <Link to="/kulkas" className={styles.link}>
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </Link>
      </div>
      <ul className={styles.list}>
        {ITEMS.map(({ id, name, expLabel, expType }) => (
          <li key={id} className={styles.row}>
            <span className={styles.name}>{name}</span>
            <span className={`${styles.badge} ${styles[expType]}`}>{expLabel}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}