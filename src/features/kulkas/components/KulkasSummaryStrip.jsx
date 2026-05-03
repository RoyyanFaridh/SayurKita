import styles from './KulkasSummaryStrip.module.css'

const SUMMARY_CONFIG = [
  { type: 'danger',  label: 'Kritis'    },
  { type: 'warning', label: 'Perhatian' },
  { type: 'ok',      label: 'Oke'       },
  { type: 'fresh',   label: 'Segar'     },
]

export default function KulkasSummaryStrip({ counts }) {
  return (
    <div className={styles.strip}>
      {SUMMARY_CONFIG.map(({ type, label }) => (
        <div key={type} className={`${styles.card} ${styles['card_' + type]}`}>
          <p className={styles.count}>{counts[type]}</p>
          <p className={styles.label}>{label}</p>
        </div>
      ))}
    </div>
  )
}