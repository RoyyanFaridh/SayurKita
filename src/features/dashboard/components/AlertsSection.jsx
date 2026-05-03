import styles from './AlertsSection.module.css'

const ALERTS = [
  { id: 1, type: 'danger',  title: 'Bayam segar kadaluwarsa besok',     sub: 'Segera masak atau posting sebagai surplus', btnLabel: 'Tangani' },
  { id: 2, type: 'warning', title: 'Tahu putih kadaluwarsa 2 hari lagi', sub: 'Segera masak atau posting sebagai surplus', btnLabel: 'Lihat' },
]

export default function AlertsSection() {
  if (!ALERTS.length) return null
  return (
    <div className={styles.wrapper}>
      {ALERTS.map(a => (
        <div key={a.id} className={`${styles.alert} ${styles[a.type]}`}>
          <span className={styles.dot} />
          <div className={styles.text}>
            <p className={styles.title}>{a.title}</p>
            <p className={styles.sub}>{a.sub}</p>
          </div>
          <button className={`${styles.btn} ${styles[`btn_${a.type}`]}`}>{a.btnLabel}</button>
        </div>
      ))}
    </div>
  )
}