import styles from './KulkasWidget.module.css';
import { ArrowRight } from 'lucide-react';

const kondisiConfig = {
  'mau-exp': { className: styles.badgeMauExp },
  'segar-2': { className: styles.badgeWarning },
  'segar-5': { className: styles.badgeSegar },
  'segar':   { className: styles.badgeSegar },
};

export default function KulkasWidget({ items }) {
  return (
    <div className={styles.card}>
      <p className={styles.title}>LihatKulkas</p>
      <ul className={styles.list}>
        {items.map((item, i) => (
          <li key={i} className={styles.item}>
            <span className={styles.itemName}>{item.nama}</span>
            <span className={`${styles.badge} ${kondisiConfig[item.kondisi]?.className}`}>
              {item.exp}
            </span>
          </li>
        ))}
      </ul>
      <div className={styles.resepCard}>
        <span className={styles.resepLabel}>Saran resep dari bahan diatas:</span>
        <div className={styles.resepRow}>
          <span className={styles.resepName}>Sayur Bening Bayam Tahu</span>
          <ArrowRight size={18} color="var(--accent-primary)" />
        </div>
      </div>
    </div>
  );
}