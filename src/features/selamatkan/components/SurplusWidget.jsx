import styles from './SurplusWidget.module.css';

export default function SurplusWidget({ item }) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.label}>Surplus baru disekitarmu</span>
      </div>
      <p className={styles.itemName}>{item.nama} – {item.jarak}</p>
      <p className={styles.itemSub}>{item.pemilik} – {item.waktu}</p>
    </div>
  );
}