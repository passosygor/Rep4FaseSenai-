import { useEffect, useState, useCallback } from 'react'
import { api } from '../services/api'
import { useAuth } from '../context/AuthContext'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  Plus, X, CalendarDays, AlertTriangle, CheckCircle2,
  Loader2, Search, Pencil, Trash2, Filter, Clock,
  Bed, BedDouble, Users, Star
} from 'lucide-react'

const TIPOS = [
  { value: 'compartilhado', label: 'Compartilhado', icon: Users },
  { value: 'privativo',     label: 'Privativo',     icon: Bed },
  { value: 'casal',         label: 'Casal',         icon: BedDouble },
  { value: 'suite',         label: 'Suíte',         icon: Star },
]

const STATUS_CFG = {
  pendente:   { label: 'Pendente',   bg: 'bg-slate-500/10 border-slate-500/25', text: 'text-slate-400' },
  confirmada: { label: 'Confirmada', bg: 'bg-teal-500/10  border-teal-500/25', text: 'text-teal-400'  },
  check_in:   { label: 'Check-in',   bg: 'bg-amber-500/10 border-amber-500/25', text: 'text-amber-400' },
  check_out:  { label: 'Check-out',  bg: 'bg-mint-500/10  border-mint-500/25', text: 'text-mint-400'  },
  cancelada:  { label: 'Cancelada',  bg: 'bg-red-500/10   border-red-500/25', text: 'text-red-400'   },
}

const STATUS_OPTIONS = ['pendente', 'confirmada', 'check_in', 'check_out', 'cancelada']

const fmtHora = (iso) => new Date(iso).toLocaleTimeString('pt-BR', { hour:'2-digit', minute:'2-digit' })
const toLocal  = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  const pad = n => String(n).padStart(2,'0')
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const EMPTY = {
  hospedeId:'', quartoId:'', tipoQuarto:'compartilhado',
  checkIn:'', checkOut:'', status:'confirmada',
  qtdHospedes: 1, valorTotal:'', observacoes:'',
}

// ── Modal ─────────────────────────────────────────────────────
function ReservaModal({ form, setForm, hospedes, quartos, onSave, onClose, editId, loading }) {
  const [conflito, setConflito] = useState(null)
  const [checando, setChecando] = useState(false)
  const [saveErr, setSaveErr]   = useState('')

  const handle = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
    if (['quartoId','checkIn','checkOut'].includes(name)) setConflito(null)
    setSaveErr('')
  }

  const checarConflito = useCallback(async () => {
    if (!form.quartoId || !form.checkIn || !form.checkOut) return
    setChecando(true)
    try {
      const params = {
        quartoId: form.quartoId,
        checkIn: new Date(form.checkIn).toISOString(),
        checkOut: new Date(form.checkOut).toISOString(),
      }
      if (editId) params.excluirId = editId
      setConflito(await api.verificarDisponibilidade(params))
    } catch { /* silente */ }
    finally { setChecando(false) }
  }, [form.quartoId, form.checkIn, form.checkOut, editId])

  useEffect(() => {
    const t = setTimeout(checarConflito, 400)
    return () => clearTimeout(t)
  }, [checarConflito])

  const submit = async (e) => {
    e.preventDefault()
    setSaveErr('')
    if (conflito?.temConflito) { setSaveErr('Resolva o conflito de disponibilidade antes de salvar.'); return }
    try { await onSave() } catch (err) { setSaveErr(err.message) }
  }

  const dispOk = conflito?.temConflito === false && form.quartoId && form.checkIn && form.checkOut && !checando

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-teal-400" />
            {editId ? 'Editar Reserva' : 'Nova Reserva'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="overflow-auto flex-1 px-6 py-5 space-y-4">
          <div>
            <label className="label">Tipo de Quarto</label>
            <div className="grid grid-cols-4 gap-2">
              {TIPOS.map(({ value, label, icon: Icon }) => (
                <button type="button" key={value}
                  onClick={() => setForm(f => ({...f, tipoQuarto: value}))}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-medium transition-all
                    ${form.tipoQuarto === value
                      ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                      : 'bg-white/3 border-white/8 text-slate-400 hover:border-white/20 hover:text-slate-200'}`}>
                  <Icon className="w-4 h-4" />{label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Hóspede</label>
              <select name="hospedeId" value={form.hospedeId} onChange={handle} className="input-base" required>
                <option value="">Selecionar hóspede</option>
                {hospedes.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Quarto</label>
              <select name="quartoId" value={form.quartoId} onChange={handle} className="input-base" required>
                <option value="">Selecionar quarto</option>
                {quartos.map(q => <option key={q.id} value={q.id}>{q.nome}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Data/Hora Check-in</label>
              <input type="datetime-local" name="checkIn" value={form.checkIn} onChange={handle} className="input-base" required />
            </div>
            <div>
              <label className="label">Data/Hora Check-out</label>
              <input type="datetime-local" name="checkOut" value={form.checkOut} onChange={handle} className="input-base" required />
            </div>
          </div>

          {checando && (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-1">
              <Loader2 className="w-4 h-4 animate-spin text-teal-400" />
              Verificando disponibilidade do quarto…
            </div>
          )}
          {conflito?.temConflito && !checando && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl p-4 animate-slide-up">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-300">⚠️ Quarto Indisponível</p>
                <p className="text-xs text-red-400/80 mt-0.5">{conflito.mensagem}</p>
                <p className="text-xs text-red-500/60 mt-1">Escolha outras datas ou mude o quarto.</p>
              </div>
            </div>
          )}
          {dispOk && (
            <div className="flex items-center gap-2 bg-mint-500/10 border border-mint-500/25 rounded-xl p-3 animate-slide-up">
              <CheckCircle2 className="w-4 h-4 text-mint-400 shrink-0" />
              <p className="text-xs text-mint-400 font-medium">✓ Quarto disponível nestas datas!</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Quantidade de Hóspedes</label>
              <input type="number" name="qtdHospedes" value={form.qtdHospedes} onChange={handle} min="1" className="input-base" />
            </div>
            <div>
              <label className="label">Valor Total (R$)</label>
              <input type="number" name="valorTotal" value={form.valorTotal} onChange={handle} placeholder="0,00" step="0.01" min="0" className="input-base" />
            </div>
          </div>

          {editId && (
            <div>
              <label className="label">Status</label>
              <select name="status" value={form.status} onChange={handle} className="input-base">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CFG[s]?.label || s}</option>)}
              </select>
            </div>
          )}

          <div>
            <label className="label">Observações</label>
            <textarea name="observacoes" value={form.observacoes} onChange={handle} rows={2}
              placeholder="Pedidos especiais, restrições alimentares, berço extra…" className="input-base resize-none" />
          </div>

          {saveErr && (
            <p className="text-sm text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {saveErr}
            </p>
          )}
        </form>

        <div className="px-6 py-4 border-t border-white/5 flex gap-3 justify-end shrink-0">
          <button type="button" onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={submit} disabled={loading || conflito?.temConflito} className="btn-primary flex items-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : editId ? 'Salvar Alterações' : 'Criar Reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Página ────────────────────────────────────────────────────
export default function Reservas() {
  const { usuario } = useAuth()
  const [reservas, setReservas]   = useState([])
  const [hospedes, setHospedes]   = useState([])
  const [quartos, setQuartos]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [busca, setBusca]         = useState('')
  const [filtroTipo, setFiltroTipo]       = useState('')
  const [filtroStatus, setFiltroStatus]   = useState('')
  const [ordemAZ, setOrdemAZ]     = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const carregar = useCallback(async () => {
    try {
      const [r, h, q] = await Promise.all([api.getReservas(), api.getHospedes(), api.getQuartos()])
      setReservas(r); setHospedes(h); setQuartos(q)
    } catch { toast.error('Erro ao carregar dados.') }
    finally { setLoading(false) }
  }, [])

  useEffect(() => { carregar() }, [carregar])

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowModal(true) }
  const openEdit = (res) => {
    setForm({
      hospedeId: res.hospedeId, quartoId: res.quartoId,
      tipoQuarto: res.tipoQuarto, checkIn: toLocal(res.checkIn),
      checkOut: toLocal(res.checkOut), status: res.status,
      qtdHospedes: res.qtdHospedes || 1, valorTotal: res.valorTotal || '', observacoes: res.observacoes || '',
    })
    setEditId(res.id); setShowModal(true)
  }

  const salvar = async () => {
    setSaving(true)
    try {
      if (!usuario?.id) {
        toast.error('Sua sessão expirou. Faça login novamente.')
        throw new Error('Sessão inválida.')
      }
      const body = {
        hospedeId: +form.hospedeId,
        quartoId: +form.quartoId,
        responsavelId: usuario.id,
        qtdHospedes: +form.qtdHospedes,
        checkIn: new Date(form.checkIn).toISOString(),
        checkOut: new Date(form.checkOut).toISOString(),
        status: form.status,
        valorTotal: form.valorTotal ? parseFloat(form.valorTotal) : null,
        observacoes: form.observacoes || undefined,
      }
      if (editId) await api.atualizarReserva(editId, body)
      else        await api.criarReserva(body)
      setShowModal(false)
      toast.success(editId ? 'Reserva atualizada!' : 'Reserva criada com sucesso!')
      await carregar()
    } catch (err) {
      toast.error(err.message)
      throw err
    } finally { setSaving(false) }
  }

  const confirmarCancelamento = async () => {
    try {
      await api.cancelarReserva(confirmId)
      toast.success('Reserva cancelada.')
      await carregar()
    } catch { toast.error('Erro ao cancelar reserva.') }
    finally { setConfirmId(null) }
  }

  let lista = reservas
  if (busca)        lista = lista.filter(r =>
    (r.hospede?.nome || '').toLowerCase().includes(busca.toLowerCase()) ||
    (r.quarto?.nome || '').toLowerCase().includes(busca.toLowerCase()))
  if (filtroTipo)   lista = lista.filter(r => r.tipoQuarto === filtroTipo)
  if (filtroStatus) lista = lista.filter(r => r.status === filtroStatus)
  if (ordemAZ)      lista = [...lista].sort((a,b) => (a.hospede?.nome || '').localeCompare((b.hospede?.nome || ''), 'pt-BR'))

  return (
    <Layout title="Reservas" subtitle="Gerencie todas as estadias agendadas">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input placeholder="Buscar hóspede ou quarto…"
            value={busca} onChange={e => setBusca(e.target.value)} className="input-base !pl-10" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
          <select value={filtroTipo} onChange={e => setFiltroTipo(e.target.value)} className="input-base !pl-9 w-48">
            <option value="">Todos os tipos</option>
            {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
          </select>
        </div>
        <div className="relative">
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} className="input-base pr-8 w-44">
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{STATUS_CFG[s]?.label}</option>)}
          </select>
        </div>
        <button 
          type="button"
          onClick={() => setOrdemAZ(o => !o)}
          className={`input-base flex items-center gap-1.5 !w-fit !px-3 cursor-pointer transition-colors ${
             ordemAZ ? '!border-teal-500/40 !text-teal-400' : 'text-slate-400'
             }`}
                  >
             {ordemAZ ? '🔤 A → Z' : '📅 Por Data'}
            </button>
        <button onClick={openNew} className="btn-primary flex items-center gap-2 ml-auto">
          <Plus className="w-4 h-4" /> Nova Reserva
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4 font-medium">
        {lista.length} reserva{lista.length !== 1 ? 's' : ''} encontrada{lista.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-400 animate-spin" /></div>
      ) : lista.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhuma reserva encontrada.</p>
          <p className="text-slate-600 text-sm mt-1">Ajuste os filtros ou crie uma nova reserva.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {lista.map((res, i) => {
            const cfg = STATUS_CFG[res.status] || STATUS_CFG.confirmada
            const tipo = TIPOS.find(t => t.value === res.tipoQuarto)
            const TipoIcon = tipo?.icon || CalendarDays
            const inicio = new Date(res.checkIn)

            return (
              <div key={res.id}
                className="glass rounded-2xl p-5 hover:border-white/10 transition-all duration-200 animate-slide-up"
                style={{ animationDelay:`${i*35}ms`, opacity:0, animationFillMode:'forwards' }}>
                <div className="flex items-center gap-4">
                  <div className="shrink-0 text-center bg-white/4 rounded-xl px-3 py-2.5 min-w-[56px]">
                    <p className="text-xs text-slate-500 font-medium leading-none mb-0.5">
                      {inicio.toLocaleDateString('pt-BR',{month:'short'}).toUpperCase().replace('.','').slice(0,3)}
                    </p>
                    <p className="text-2xl font-display font-bold text-white leading-none">{inicio.getDate()}</p>
                    <p className="text-xs text-teal-400 font-semibold mt-0.5">{fmtHora(res.checkIn)}</p>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-display font-semibold text-white">{res.hospede?.nome || 'Hóspede Desconhecido'}</p>
                          <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-medium shrink-0 ${cfg.bg} ${cfg.text}`}>
                            {cfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 flex-wrap text-xs text-slate-500">
                          <span className="flex items-center gap-1.5"><Bed className="w-3 h-3" />{res.quarto?.nome || `Quarto ${res.quartoId}`}</span>
                          <span className="flex items-center gap-1.5"><TipoIcon className="w-3 h-3" />{tipo?.label || res.tipoQuarto}</span>
                          <span className="flex items-center gap-1.5"><Clock className="w-3 h-3" />Out: {fmtHora(res.checkOut)}</span>
                          {res.valorTotal && (
                            <span className="text-mint-400 font-semibold">
                              R$ {parseFloat(res.valorTotal).toLocaleString('pt-BR',{minimumFractionDigits:2})}
                            </span>
                          )}
                        </div>
                        {res.observacoes && (
                          <p className="text-xs text-slate-600 mt-1.5 italic truncate max-w-sm">"{res.observacoes}"</p>
                        )}
                        {res.qtdHospedes > 1 && (
                          <p className="text-xs text-slate-600 mt-0.5 truncate max-w-xs">👥 {res.qtdHospedes} Hóspedes</p>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {res.status !== 'cancelada' && res.status !== 'check_out' && (
                          <button onClick={() => openEdit(res)} className="btn-ghost text-xs flex items-center gap-1.5 py-1.5 px-3">
                            <Pencil className="w-3.5 h-3.5" /> Editar
                          </button>
                        )}
                        {res.status === 'confirmada' && (
                          <button onClick={() => setConfirmId(res.id)} className="btn-danger text-xs flex items-center gap-1.5 py-1.5 px-3">
                            <Trash2 className="w-3.5 h-3.5" /> Cancelar
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <ReservaModal
          form={form} setForm={setForm}
          hospedes={hospedes} quartos={quartos}
          onSave={salvar} onClose={() => setShowModal(false)}
          editId={editId} loading={saving}
        />
      )}

      {confirmId && (
        <ConfirmDialog
          title="Cancelar Reserva"
          message="Tem certeza que deseja cancelar esta reserva? O status será alterado para Cancelada."
          onConfirm={confirmarCancelamento}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </Layout>
  )
}