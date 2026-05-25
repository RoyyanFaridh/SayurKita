import { useState, useEffect, useRef } from 'react'
import { ChevronRight, LogOut } from 'lucide-react'

export default function UserBlock({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const triggerRef = useRef(null)
  const dropdownRef = useRef(null)

  function updateCoords() {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setCoords({
      top: rect.top,
      left: rect.right + 8,
    })
  }

  function handleToggle() {
    if (!open) updateCoords()
    setOpen((v) => !v)
  }

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e) {
      if (
        triggerRef.current?.contains(e.target) ||
        dropdownRef.current?.contains(e.target)
      ) return
      setOpen(false)
    }

    function handleScroll() {
      updateCoords()
    }

    document.addEventListener('mousedown', handleClickOutside)
    window.addEventListener('scroll', handleScroll, true)
    window.addEventListener('resize', handleScroll)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', handleScroll)
    }
  }, [open])

  return (
    <div className="border-b border-primary-700">

      {/* Dropdown — fixed, di luar flow sidebar, tidak ter-clip overflow */}
      {open && (
        <div
          ref={dropdownRef}
          style={{ top: coords.top, left: coords.left }}
          className="fixed z-9999 min-w-50 overflow-hidden rounded-lg border border-white/10 bg-primary-800 shadow-xl animate-in fade-in slide-in-from-left-2 duration-150"
        >
          {/* Header info user */}
          <div className="border-b border-white/8 px-3.5 py-3">
            <div className="mb-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary-700 text-compact-sm font-semibold tracking-wide text-primary-200">
              {user.initials}
            </div>
            <p className="text-compact-base font-semibold text-white">{user.name}</p>
            <p className="text-compact-xs text-white/45">{user.role}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            <button
              onClick={() => { setOpen(false); onLogout(); }}
              className="flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-3.5 py-2.5 text-compact-base font-medium text-red-400/80 transition-colors duration-100 hover:bg-red-400/10 hover:text-red-400"
            >
              <LogOut size={14} strokeWidth={1.75} />
              Keluar
            </button>
          </div>
        </div>
      )}

      {/* Trigger */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        className={`flex w-full cursor-pointer items-center gap-2.5 border-none bg-transparent px-5 py-4 text-left transition-colors duration-fast ease-out hover:bg-white/5 ${
          open ? 'bg-white/7' : ''
        }`}
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-700 text-compact-sm font-semibold tracking-wide text-primary-200">
          {user.initials}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-compact-lg font-semibold leading-snug text-white">
            {user.name}
          </p>
          <p className="text-compact-xs text-white/60">{user.role}</p>
        </div>
        <ChevronRight
          size={14}
          strokeWidth={2}
          className={`shrink-0 transition-all duration-200 ${
            open ? 'translate-x-0.5 text-white/60' : 'text-white/35'
          }`}
        />
      </button>
    </div>
  )
}