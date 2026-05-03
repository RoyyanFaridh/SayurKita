import { Refrigerator } from 'lucide-react'
import styles from './KulkasItemList.module.css'

const EXP_LABEL_MAP = {
  danger:  'Segera!',
  warning: 'Perhatian',
  ok:      'Oke',
  fresh:   'Segar',
}

function Badge({ expType }) {
  return (
    <span className={`${styles.badge} ${styles['badge_' + expType]}`}>
      {EXP_LABEL_MAP[expType]}
    </span>
  )
}

export default function KulkasItemList({ items, onEdit }) {
  if (items.length === 0) {
    return (
      <div className={styles.tableWrap}>
        <div className={styles.empty}>
          <Refrigerator size={32} strokeWidth={1} className={styles.emptyIcon} />
          <p>Tidak ada bahan ditemukan</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* ── Desktop table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Nama Bahan</th>
              <th className={styles.th}>Kategori</th>
              <th className={styles.th}>Jumlah</th>
              <th className={styles.th}>Kadaluwarsa</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className={styles.tr}>
                <td className={styles.tdName}>{item.nama}</td>
                <td className={styles.td}>
                  <span className={styles.kategoriPill}>{item.kategori}</span>
                </td>
                <td className={styles.td}>{item.jumlah}</td>
                <td className={styles.td}>{item.expLabel}</td>
                <td className={styles.td}><Badge expType={item.expType} /></td>
                <td className={styles.tdAction}>
                  <button className={styles.editBtn} onClick={() => onEdit(item)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile card list ── */}
      <div className={styles.cardList}>
        {items.map(item => (
          <div key={item.id} className={`${styles.card} ${styles['card_' + item.expType]}`}>
            <div className={styles.cardLeft}>
              <p className={styles.cardName}>{item.nama}</p>
              <p className={styles.cardMeta}>{item.kategori} · {item.jumlah}</p>
            </div>
            <div className={styles.cardRight}>
              <span className={`${styles.badge} ${styles['badge_' + item.expType]}`}>
                {item.expLabel}
              </span>
              <button className={styles.editBtn} onClick={() => onEdit(item)}>Edit</button>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}