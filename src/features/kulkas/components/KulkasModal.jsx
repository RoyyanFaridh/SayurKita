import { X } from 'lucide-react'
import styles from './KulkasModal.module.css'

export default function KulkasModal({ item, onClose }) {
  const isEdit = !!item

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>

        <div className={styles.header}>
          <h3 className={styles.title}>{isEdit ? 'Edit Bahan' : 'Tambah Bahan'}</h3>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Tutup">
            <X size={16} />
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.field}>
            <label className={styles.label}>Nama bahan</label>
            <input
              className={styles.input}
              defaultValue={item?.nama}
              placeholder="cth. Bayam segar"
            />
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label className={styles.label}>Kategori</label>
              <select className={styles.input} defaultValue={item?.kategori || 'Sayur'}>
                {['Sayur', 'Protein', 'Bumbu', 'Lainnya'].map(k => (
                  <option key={k}>{k}</option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Jumlah</label>
              <input
                className={styles.input}
                defaultValue={item?.jumlah}
                placeholder="cth. 1 ikat"
              />
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Kadaluwarsa</label>
            <input className={styles.input} type="date" defaultValue={item?.exp} />
          </div>
        </div>

        <div className={styles.footer}>
          {isEdit && (
            <button className={styles.btnDanger} onClick={onClose}>Hapus</button>
          )}
          <div className={styles.footerRight}>
            <button className={styles.btnOutline} onClick={onClose}>Batal</button>
            <button className={styles.btnPrimary} onClick={onClose}>Simpan</button>
          </div>
        </div>

      </div>
    </div>
  )
}