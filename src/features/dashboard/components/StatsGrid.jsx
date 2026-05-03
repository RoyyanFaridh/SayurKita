import { Refrigerator, Clock, TrendingUp, Leaf } from 'lucide-react'
import styles from './StatsGrid.module.css'

const STATS = [
  {
    id: 'kulkas',
    label: 'Bahan di kulkas',
    value: '6',
    valueUnit: 'bahan',
    badge: '+2 bahan',
    badgeType: 'green',
    // note: '2 perlu perhatian segera',
    noteType: 'danger',
    Icon: Refrigerator,
    iconType: 'green',
  },
  {
    id: 'posting',
    label: 'Posting aktif',
    value: '1',
    valueUnit: 'postingan',
    badge: '47 mnt tersisa',
    badgeType: 'amber',
    Icon: Clock,
    iconType: 'amber',
  },
  {
    id: 'surplus',
    label: 'Surplus diselamatkan',
    value: '12',
    valueUnit: 'surplus',
    badge: '+2 April ini',
    badgeType: 'teal',
    Icon: TrendingUp,
    iconType: 'teal',
  },
  {
    id: 'karbon',
    label: 'Karbon diselamatkan',
    value: '2',
    valueUnit: 'kg',
    badge: 'April ini',
    badgeType: 'lime',
    Icon: Leaf,
    iconType: 'lime',
  },
]

export default function StatsGrid() {
  return (
    <div className={styles.grid}>
      {STATS.map(({ id, Icon, iconType, value, valueUnit, label, badge, badgeType, note, noteType }) => (
        <div key={id} className={styles.card}>
          <div className={styles.header}>
            <div className={`${styles.icon} ${styles[`icon_${iconType}`]}`}>
              <Icon size={16} strokeWidth={1.75} />
            </div>
            <p className={styles.label}>{label}</p>
          </div>

          <div className={styles.valueRow}>
            <p className={styles.value}>
              {value}
              {valueUnit && <span className={styles.unit}> {valueUnit}</span>}
            </p>
          </div>

          <span className={`${styles.badge} ${styles[`badge_${badgeType}`]}`}>
            {badge}
          </span>

          {note && (
            <p className={`${styles.note}${noteType === 'danger' ? ` ${styles.noteDanger}` : ''}`}>
              {note}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}