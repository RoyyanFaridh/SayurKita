import styles from './PoinBerkahWidget.module.css';

const HARI = [
  { label: 'S', aktif: true },
  { label: 'S', aktif: true },
  { label: 'R', aktif: true },
  { label: 'K', aktif: true },
  { label: 'J', aktif: true },
  { label: 'S', aktif: false },
  { label: 'M', aktif: false },
];

export default function PoinBerkahWidget({ data }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>Poin Berkah</span>
      <p className={styles.value}>{data.total.toLocaleString('id-ID')}</p>
      <p className={styles.tambah}>{data.tambahan}</p>
      <div className={styles.streak}>
        {HARI.map((hari, i) => (
          <span key={i} className={`${styles.hari} ${hari.aktif ? styles.aktif : styles.nonaktif}`}>
            {hari.label}
          </span>
        ))}
      </div>
    </div>
  );
}