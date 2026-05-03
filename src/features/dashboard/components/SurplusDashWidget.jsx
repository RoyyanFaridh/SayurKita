import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import styles from './SurplusDashWidget.module.css'

const SURPLUS = [
  { id: 1, name: 'Nasi Kotak Sisa Acara RT', by: 'Sari',   qty: '10 box',  status: 'segar' },
  { id: 2, name: 'Rendang sisa lebaran',      by: 'Sri',    qty: '2 porsi', status: 'segar' },
  { id: 3, name: 'Sayur campur',              by: 'Joko',   qty: 'Banyak',  status: 'mau-basi' },
  { id: 4, name: 'Nasi Kemarin',              by: 'Aminah', qty: '4 porsi', status: 'basi' },
]

const STATUS_MAP = {
  'segar':    { cls: 'label-kondisi--segar',   label: 'Segar' },
  'mau-basi': { cls: 'label-kondisi--mau-exp', label: 'Mau basi' },
  'basi':     { cls: 'label-kondisi--basi',    label: 'Basi' },
}

export default function SurplusDashWidget() {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleGroup}>
          <h2 className={styles.title}>Surplus Dekatmu</h2>
          <p className={styles.live}>
            <span className={styles.liveDot} aria-hidden="true" />
            Live · Aktivitas komunitas
          </p>
        </div>
        <button className={styles.link}>
          Lihat semua <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
      <ul className={styles.list}>
        {SURPLUS.map(({ id, name, by, qty, status }) => (
          <li key={id} className={styles.row}>
            <div className={styles.info}>
              <p className={styles.name}>{name}</p>
              <p className={styles.by}>{by} · {qty}</p>
            </div>
            <span className={`label-kondisi ${STATUS_MAP[status].cls}`}>
              {STATUS_MAP[status].label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}