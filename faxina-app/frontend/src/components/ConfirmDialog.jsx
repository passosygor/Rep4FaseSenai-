// src/components/ConfirmDialog.jsx
import { AlertTriangle, X } from 'lucide-react'

export default function ConfirmDialog({ title, message, onConfirm, onCancel, danger = true }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        <div className="px-6 pt-6 pb-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4
            ${danger ? 'bg-red-500/15 border border-red-500/25' : 'bg-amber-500/15 border border-amber-500/25'}`}>
            <AlertTriangle className={`w-6 h-6 ${danger ? 'text-red-400' : 'text-amber-400'}`} />
          </div>
          <h3 className="font-display font-semibold text-white text-lg">{title}</h3>
          <p className="text-slate-400 text-sm mt-1.5">{message}</p>
        </div>
        <div className="px-6 pb-5 flex gap-3 justify-end">
          <button onClick={onCancel} className="btn-ghost">Cancelar</button>
          <button onClick={onConfirm}
            className={danger ? 'btn-danger px-5 py-2.5' : 'btn-primary'}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}
