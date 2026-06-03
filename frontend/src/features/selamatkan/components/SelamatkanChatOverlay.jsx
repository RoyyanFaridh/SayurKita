import { useState, useEffect, useRef } from 'react'
import { X, Send, User } from 'lucide-react'
import { io } from 'socket.io-client'
import { API_ORIGIN } from '../../../config/api'

export default function SelamatkanChatOverlay({ item, currentUserId, onClose }) {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)
  const socketRef = useRef(null)

  // Fetch messages history
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${API_ORIGIN}/api/surplus/${item.id}/chat`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        const data = await res.json()
        if (data.success) {
          setMessages(data.data)
        }
      } catch (error) {
        console.error('Failed to load messages', error)
      } finally {
        setLoading(false)
      }
    }
    fetchMessages()
  }, [item.id])

  // Setup Socket.io for Real-time chat
  useEffect(() => {
    socketRef.current = io(API_ORIGIN)

    // Join spesifik room untuk post ini
    socketRef.current.emit('joinChat', item.id)

    // Listen untuk pesan baru
    const handleNewMessage = (msg) => {
      setMessages((prev) => {
        // Cegah duplikasi jika socket tidak sengaja terpanggil 2x
        if (prev.some(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
    }

    socketRef.current.on('newMessage', handleNewMessage)

    return () => {
      if (socketRef.current) {
        socketRef.current.off('newMessage', handleNewMessage)
        socketRef.current.emit('leaveChat', item.id)
        socketRef.current.disconnect()
      }
    }
  }, [item.id])

  // Auto-scroll ke bawah saat ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()

    const typedMessage = inputText.trim()
    if (!typedMessage || sending) return

    setSending(true)
    setInputText('') // Optimistic clear supaya user tidak tergoda pencet lagi

    const token = localStorage.getItem('token')
    try {
      const res = await fetch(`${API_ORIGIN}/api/surplus/${item.id}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: typedMessage })
      })
      const data = await res.json()
      if (!data.success) {
        setInputText(typedMessage) // Kembalikan teks kalau server menolak
      }
    } catch (error) {
      console.error('Failed to send message', error)
      setInputText(typedMessage) // Kembalikan teks kalau network error
    } finally {
      setSending(false)
    }
  }

  // Tentukan judul header berdasarkan siapa user saat ini (Pemilik / Klaimer)
  const isOwner = String(currentUserId) === String(item.userId)
  const targetName = isOwner ? 'Pengklaim' : item.pemilik

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white rounded-2xl shadow-xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        style={{ height: '80vh', maxHeight: '600px' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-b border-emerald-100">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full bg-primary-200 text-emerald-700 flex flex-col items-center justify-center shrink-0">
              <User size={20} strokeWidth={2.5} />
            </div>
            <div className="min-w-0">
              <h3 className="text-compact-base font-semibold text-emerald-900 truncate">Chat dengan {targetName}</h3>
              <p className="text-compact-xs text-emerald-700/80 truncate">Terkait: {item.nama}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-emerald-700/60 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <span className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-2"></span>
              <p className="text-compact-sm">Memuat obrolan...</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <p className="text-compact-sm bg-slate-200/50 px-3 py-1.5 rounded-full">Belum ada pesan. Sapa sekarang!</p>
            </div>
          ) : (
            messages.map((msg, idx) => {
              const isMe = String(msg.senderId) === String(currentUserId)
              const senderName = msg.sender?.name || (isMe ? 'Anda' : targetName)

              return (
                <div key={msg.id || idx} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                  {!isMe && <span className="text-compact-xs text-slate-500 ml-1 mb-0.5 font-medium">{senderName}</span>}
                  <div
                    className={`px-3 py-2 rounded-2xl text-compact-sm shadow-sm ${
                      isMe
                        ? 'bg-primary-600 text-white rounded-tr-sm'
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                    }`}
                  >
                    {msg.message}
                  </div>
                  <span className="text-compact-xs text-slate-400 mt-1 mx-1">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-100">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tulis pesan..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-800 text-compact-sm rounded-full outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || sending}
              className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white shrink-0 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {sending
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Send size={18} className="ml-1" />
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}