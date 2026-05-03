import styles from './Stats.module.css';

const STATS = [
  {
    value: '1.200+',
    unit: 'user',
    label: 'Anggota aktif yang bergabung untuk menyelamatkan',
  },
  {
    value: '38',
    unit: 'ton',
    label: 'Makanan berhasil diselamatkan dari pembuangan',
  },
  {
    value: '54',
    unit: 'ton CO₂',
    label: 'Emisi karbon berhasil dicegah dari pembusukan pangan',
  },
];

export default function StatsSection() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.inner}`}>
        {STATS.map((s, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.valueRow}>
              <span className={styles.value}>{s.value}</span>
              <span className={styles.unit}>{s.unit}</span>
            </div>
            <p className={styles.label}>{s.label}</p>
            {i < STATS.length - 1 && <span className={styles.divider} aria-hidden="true" />}
          </div>
        ))}
      </div>
    </section>
  );
}