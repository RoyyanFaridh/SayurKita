import { Flame } from 'lucide-react'
import styles from './KulkasAlertBanner.module.css'

export default function KulkasAlertBanner({ count }) {
  if (!count) return null
  return (
    <div className={styles.banner}>
      <Flame size={15} strokeWidth={2} className={styles.icon} />
      <span>
        <strong>{count} bahan</strong> kadaluwarsa besok — segera masak atau posting sebagai surplus
      </span>
      <button className={styles.btn}>Posting Sekarang</button>
    </div>
  )
}