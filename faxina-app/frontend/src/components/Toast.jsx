// src/components/Toast.jsx
import { useEffect, useState } from 'react'
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react'

const icons = {
  success: { Icon: CheckCircle2, color: 'text-mint-400',  bg: 'bg-mint-500/10  border-mint-500/25' },
  error:   { Icon: XCircle,      color: 'text-red-400',   bg: 'bg-red-500/10   border-red-500/25'  },
  warning: { Icon: AlertTriangle,color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25'},
  info:    { Icon: Info,         color: 'text-teal-400',  bg: 'bg-teal-500/10  border-teal-500/25' },
}

export function Toast({ message, type = 'info', onClose, duration = 3500 }) {
  const [visible, setVisible] = useState(true)
  const cfg = icons[type] || icons.info

  useEffect(() => {
    const t = setTimeout(() => { setVisible(false); setTimeout(onClose, 300) }, duration)
    return () => clearTimeout(t)
  }, [duration, onClose])

  return (
    <div className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-xl max-w-sm
      transition-all duration-300 ${cfg.bg} ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <cfg.Icon className={`w-4 h-4 shrink-0 mt-0.5 ${cfg.color}`} />
      <p className="text-sm text-slate-200 flex-1">{message}</p>
      <button onClick={() => { setVisible(false); setTimeout(onClose, 300) }}
        className="text-slate-500 hover:text-slate-300 transition-colors">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  )
}

// Container global de toasts
let _addToast = null

export function ToastContainer() {
  const [toasts, setToasts] = useState([])

  useEffect(() => {
    _addToast = (msg, type) => {
      const id = Date.now() + Math.random()
      setToasts(t => [...t, { id, message: msg, type }])
    }
    return () => { _addToast = null }
  }, [])

  const remove = (id) => setToasts(t => t.filter(x => x.id !== id))

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 items-end">
      {toasts.map(t => (
        <Toast key={t.id} message={t.message} type={t.type} onClose={() => remove(t.id)} />
      ))}
    </div>
  )
}

export const toast = {
  success: (msg) => _addToast?.(msg, 'success'),
  error:   (msg) => _addToast?.(msg, 'error'),
  warning: (msg) => _addToast?.(msg, 'warning'),
  info:    (msg) => _addToast?.(msg, 'info'),
}
