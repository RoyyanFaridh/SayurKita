import React, { useState, useMemo, useEffect } from 'react'
import { X, ExternalLink, ChefHat, Leaf, AlertCircle, CheckCircle2, Plus } from 'lucide-react'
import { parseIngredients, parseSteps, categoryColor } from '../../../utils/resepUtils'
import { API_ORIGIN } from '../../../config/api'

// ─── Helpers ────────────────────────────────────────────────────────────────

const satuanPattern =
  /^[\d\s,./½¼¾]*\s*(siung|buah|lembar|sendok|sdm|sdt|gram|g|kg|ml|liter|l|cup|genggam|ikat|batang|biji|butir|sm|bks|sachet|ruas|cm|potong|iris|helai)?\s*/i

function normalizeNama(s) {
  return s.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
}

function stripSatuan(s) {
  return normalizeNama(s).replace(satuanPattern, '').trim()
}

function fuzzyMatch(a, b) {
  const na = normalizeNama(a)
  const nb = normalizeNama(b)

  // 1. substring match
  if (nb.includes(na) || (na.includes(nb) && nb.length >= 4)) return true

  // 2. token match: semua kata dari string pendek ada di string panjang
  //    menangani kasus kata sisipan seperti "penyedap rasa sapi" vs "penyedap sapi"
  const shorter = na.length <= nb.length ? na : nb
  const longer  = na.length <= nb.length ? nb : na
  const tokens  = shorter.split(' ').filter(t => t.length >= 3)
  return tokens.length > 0 && tokens.every(t => longer.includes(t))
}

function fuzzyMatchBahan(resepBahan, stokNama) {
  const cleanResep = stripSatuan(resepBahan)
  const cleanStok  = normalizeNama(stokNama)
  if (!cleanResep || cleanResep.length < 2) return false
  return fuzzyMatch(cleanResep, cleanStok)
}

function findMasterMatch(resepBahan, masterData) {
  if (!masterData?.length) return null

  const cleanResep = stripSatuan(resepBahan)
  const exact = masterData.find((m) => normalizeNama(m.nama) === cleanResep)
  if (exact) return exact

  const candidates = masterData.filter(
    (m) => fuzzyMatch(cleanResep, normalizeNama(m.nama))
  )
  return candidates.length
    ? candidates.sort((a, b) => b.nama.length - a.nama.length)[0]
    : null
}

// ─── Sub-components ──────────────────────────────────────────────────────────

/**
 * Satu baris bahan — dipakai di DETAIL (inline stok) dan SUCCESS (karbon breakdown)
 */
function BahanRow({ index, total, left, right }) {
  const isLast = index === total - 1
  return (
    <li
      className="flex items-center justify-between gap-3 py-2"
      style={{ borderBottom: isLast ? 'none' : '0.5px solid var(--border-subsub)' }}
    >
      <span className="text-compact-base capitalize" style={{ color: 'var(--text-primary)' }}>
        {left}
      </span>
      <div className="flex items-center gap-2 shrink-0">{right}</div>
    </li>
  )
}

/**
 * Indikator stok per bahan: centang, silang + tombol tambah
 */
function StokIndikator({ bahan, onTambah }) {
  if (bahan.adaDiStok) {
    return (
      <>
        <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>
          {bahan.stokMatch.nama} · {bahan.stokMatch.jumlah}
        </span>
        <CheckCircle2 size={14} strokeWidth={2} style={{ color: 'var(--text-success)' }} />
      </>
    )
  }

  return (
    <>
      <AlertCircle size={14} strokeWidth={2} style={{ color: 'var(--color-danger-700)' }} />
      <button
        className="inline-flex items-center gap-1 rounded-sm border px-2.5 py-1 text-compact-xs font-medium transition-all duration-150 hover:bg-(--bg-surface-2)"
        style={{ borderColor: 'var(--border-default)', color: 'var(--text-brand)', background: 'transparent' }}
        onClick={onTambah}
      >
        <Plus size={11} strokeWidth={2} />
        Tambah
      </button>
    </>
  )
}

/**
 * Tampilan hasil karbon setelah log disimpan
 */
function CarbonResult({ recipe, result }) {
  return (
    <div className="flex flex-col items-center gap-5 py-4 text-center">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ background: 'var(--bg-success-subtle)' }}
      >
        <Leaf size={28} strokeWidth={1.5} style={{ color: 'var(--text-success)' }} />
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-compact-xl font-semibold m-0" style={{ color: 'var(--text-primary)' }}>
          Log memasak disimpan
        </p>
        <p className="text-compact-sm m-0" style={{ color: 'var(--text-muted)' }}>
          Estimasi jejak karbon dari resep{' '}
          <span className="capitalize font-medium">{recipe.name}</span>:
        </p>
      </div>

      <div
        className="w-full flex flex-col items-center gap-1 py-4 rounded-md"
        style={{ background: 'var(--bg-success-subtle)', border: '0.5px solid var(--border-subtle)' }}
      >
        <span className="text-3xl font-semibold" style={{ color: 'var(--text-success)' }}>
          {result.totalKarbon.toFixed(2)}
        </span>
        <span className="text-compact-sm" style={{ color: 'var(--text-success)' }}>
          kg CO₂e (estimasi)
        </span>
      </div>

      <ul className="list-none p-0 m-0 w-full flex flex-col gap-0">
        {result.bahanUsed.map((b, i) => (
          <BahanRow
            key={i}
            index={i}
            total={result.bahanUsed.length}
            left={b.nama}
            right={
              <span className="text-compact-xs" style={{ color: 'var(--text-muted)' }}>
                {b.karbon_co2e > 0 ? `${b.karbon_co2e.toFixed(3)} kg CO₂e` : '—'}
              </span>
            }
          />
        ))}
      </ul>

      <p className="text-compact-xs m-0" style={{ color: 'var(--text-disabled)' }}>
        Estimasi sangat kasar — flat per bahan, bukan per gram. Data karbon belum terverifikasi sumbernya.
      </p>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

const STEPS = { DETAIL: 'detail', SUCCESS: 'success' }

export default function ResepModal({ recipe, onClose, userIngredients = [], masterData = [], onTambahBahan, onCookingLogged }) {
  const [step, setStep]       = useState(STEPS.DETAIL)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const [result, setResult]   = useState(null)

  // Reset state saat resep berganti
  useEffect(() => {
    setStep(STEPS.DETAIL)
    setError(null)
    setResult(null)
    setLoading(false)
  }, [recipe?.id])

  const ingredients = recipe ? parseIngredients(recipe.ingredients_raw) : []
  const steps       = recipe ? parseSteps(recipe.steps_raw) : []
  const catStyle    = recipe
    ? (categoryColor[recipe.category?.toLowerCase()] ?? {
        background: 'var(--bg-surface-2)',
        color: 'var(--text-secondary)',
      })
    : {}

  const bahanAnalysis = useMemo(() => {
    if (!recipe) return []
    return ingredients.map((bahan) => {
      const stokMatch   = userIngredients.find((s) => fuzzyMatchBahan(bahan, s.nama))
      const masterMatch = findMasterMatch(bahan, masterData)
      return {
        rawNama:    bahan,
        stokMatch,
        masterMatch,
        adaDiStok:  !!stokMatch,
        karbonCo2e: masterMatch?.karbon_co2e ?? 0,
      }
    })
  }, [recipe, ingredients, userIngredients, masterData])

  if (!recipe) return null

  const semuaTerpenuhi = bahanAnalysis.every((b) => b.adaDiStok)
  const jumlahKurang   = bahanAnalysis.filter((b) => !b.adaDiStok).length

  const handlePakaiResep = async () => {
    setLoading(true)
    setError(null)

    const bahanUsed   = bahanAnalysis.map((b) => ({ nama: b.rawNama, karbon_co2e: b.karbonCo2e }))
    const totalKarbon = parseFloat(bahanUsed.reduce((sum, b) => sum + b.karbon_co2e, 0).toFixed(3))

    try {
      const token = localStorage.getItem('token')
      const res   = await fetch(`${API_ORIGIN}/api/cooking-logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resepNama: recipe.name, resepId: recipe.id ?? null, bahanUsed }),
      })
      const data = await res.json()
      if (!data.success) throw new Error(data.message)

      setResult({ totalKarbon, bahanUsed })
      setStep(STEPS.SUCCESS)
      onCookingLogged?.()
    } catch (err) {
      setError(err.message || 'Gagal menyimpan log memasak.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-500 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.55)' }}
      onClick={onClose}
    >
      <div
        className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl flex flex-col"
        style={{ background: 'var(--bg-surface-1)', maxHeight: '88vh', boxShadow: '0 -2px 24px rgba(0,0,0,0.12)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle — mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
        </div>

        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-5 pt-4 pb-4 border-b"
          style={{ borderColor: 'var(--border-subtle)' }}
        >
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <h3
              className="text-compact-xl font-semibold m-0 capitalize leading-snug"
              style={{ color: 'var(--text-primary)' }}
            >
              {step === STEPS.SUCCESS ? 'Resep dipakai!' : recipe.name}
            </h3>

            {step === STEPS.DETAIL && (
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className="text-compact-xs font-medium px-2.5 py-0.5 rounded-full capitalize"
                  style={catStyle}
                >
                  {recipe.category ?? 'Umum'}
                </span>
                {recipe.match_score != null && (
                  <span
                    className="text-compact-xs font-medium px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'var(--bg-surface-2)',
                      color: 'var(--text-brand)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {(recipe.match_score * 100).toFixed(0)}% cocok dengan bahanmu
                  </span>
                )}
                {ingredients.length > 0 && (
                  <span
                    className="text-compact-xs px-2.5 py-0.5 rounded-full"
                    style={{
                      background: 'var(--bg-surface-2)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    {ingredients.length} bahan · {steps.length} langkah
                  </span>
                )}
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="shrink-0 p-1.5 rounded-md border-0 bg-transparent cursor-pointer transition-colors duration-150 hover:bg-(--bg-surface-2)"
            style={{ color: 'var(--text-muted)' }}
            aria-label="Tutup modal"
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto px-5 py-5 flex flex-col gap-6">

          {/* STEP: DETAIL */}
          {step === STEPS.DETAIL && (
            <>
              {/* Bahan-bahan + indikator stok inline */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h4
                    className="text-compact-sm font-semibold uppercase tracking-wide m-0"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    Bahan-bahan
                  </h4>
                  {jumlahKurang > 0 && (
                    <span
                      className="text-compact-xs flex items-center gap-1"
                      style={{ color: 'var(--color-danger-700)' }}
                    >
                      <AlertCircle size={12} strokeWidth={2} />
                      {jumlahKurang} belum di stok
                    </span>
                  )}
                  {semuaTerpenuhi && ingredients.length > 0 && (
                    <span
                      className="text-compact-xs flex items-center gap-1"
                      style={{ color: 'var(--text-success)' }}
                    >
                      <CheckCircle2 size={12} strokeWidth={2} />
                      Semua bahan tersedia
                    </span>
                  )}
                </div>

                <ul className="list-none p-0 m-0 flex flex-col gap-0">
                  {bahanAnalysis.map((bahan, i) => (
                    <BahanRow
                      key={i}
                      index={i}
                      total={bahanAnalysis.length}
                      left={
                        <span className="flex items-center gap-2">
                          <span
                            className="shrink-0 text-compact-xs font-medium w-5 text-right"
                            style={{ color: 'var(--text-muted)' }}
                          >
                            {i + 1}.
                          </span>
                          {bahan.rawNama}
                        </span>
                      }
                      right={
                        <StokIndikator
                          bahan={bahan}
                          onTambah={() => {
                            onTambahBahan?.(bahan.rawNama)
                            onClose()
                          }}
                        />
                      }
                    />
                  ))}
                </ul>
              </section>

              {/* Cara membuat */}
              <section>
                <h4
                  className="text-compact-sm font-semibold uppercase tracking-wide m-0 mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cara membuat
                </h4>
                <ol className="list-none p-0 m-0 flex flex-col gap-4">
                  {steps.map((s, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span
                        className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-compact-xs font-semibold mt-0.5"
                        style={{
                          background: 'var(--color-secondary-500)',
                          color: 'var(--color-primary-900)',
                          minWidth: '1.5rem',
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-compact-base leading-relaxed"
                        style={{ color: 'var(--text-primary)' }}
                      >
                        {s.replace(/^\d+\)\s*/, '')}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>

              {error && (
                <p className="text-compact-sm m-0" style={{ color: 'var(--color-danger-700)' }}>
                  {error}
                </p>
              )}
            </>
          )}

          {/* STEP: SUCCESS */}
          {step === STEPS.SUCCESS && result && (
            <CarbonResult recipe={recipe} result={result} />
          )}
        </div>

        {/* Footer */}
        <div
          className="px-5 py-4 border-t flex items-center gap-3"
          style={{
            borderColor: 'var(--border-subtle)',
            justifyContent: recipe.url || step !== STEPS.DETAIL ? 'space-between' : 'flex-end',
          }}
        >
          {step === STEPS.DETAIL && recipe.url && (
            <a
              href={recipe.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-compact-sm font-medium transition-colors duration-150"
              style={{ color: 'var(--text-brand)' }}
            >
              <ChefHat size={14} strokeWidth={2} />
              Lihat di Cookpad
              <ExternalLink size={12} strokeWidth={2} />
            </a>
          )}

          {step === STEPS.DETAIL && (
            <button
              onClick={handlePakaiResep}
              disabled={!semuaTerpenuhi || loading}
              className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 text-compact-sm font-semibold border-0 cursor-pointer transition-all duration-150"
              style={{
                background: semuaTerpenuhi ? 'var(--color-primary-600)' : 'var(--bg-surface-3)',
                color: semuaTerpenuhi ? '#fff' : 'var(--text-disabled)',
                cursor: semuaTerpenuhi && !loading ? 'pointer' : 'not-allowed',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Leaf size={14} strokeWidth={2} />
              {loading ? 'Menyimpan…' : semuaTerpenuhi ? 'Pakai Resep Ini' : 'Cek Bahan'}
            </button>
          )}

          {step === STEPS.SUCCESS && (
            <button
              onClick={onClose}
              className="ml-auto rounded-md px-4 py-2 text-compact-sm font-semibold border-0 cursor-pointer transition-all duration-150"
              style={{ background: 'var(--color-primary-600)', color: '#fff' }}
            >
              Selesai
            </button>
          )}
        </div>
      </div>
    </div>
  )
}