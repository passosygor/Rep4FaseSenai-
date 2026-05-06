import { useEffect, useState, useCallback, useMemo } from 'react'
import { api } from '../services/api'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import {
  Plus, X, Search, Pencil, Trash2, Loader2, AlertTriangle, BedDouble, Users,
  DollarSign, DoorOpen, Filter, Wrench, Sparkles, CheckCircle2,
} from 'lucide-react'

/** Valores enviados ao backend (FE_TIPO_TO_DB no servidor) */
const TIPOS = [
  { value: 'compartilhado', label: 'Compartilhado' },
  { value: 'privativo', label: 'Privativo' },
  { value: 'casal', label: 'Casal' },
  { value: 'suite', label: 'Suíte' },
]

/** statusAtual no Prisma / API */
const STATUS_QUARTO = [
  { value: 'disponivel', label: 'Disponível' },
  { value: 'manutencao', label: 'Manutenção' },
  { value: 'limpeza', label: 'Limpeza' },
]

const STATUS_STYLE = {
  disponivel: {
    label: 'Disponível',
    bg: 'bg-teal-500/12 border-teal-500/30',
    text: 'text-teal-400',
    Icon: CheckCircle2,
  },
  manutencao: {
    label: 'Manutenção',
    bg: 'bg-amber-500/12 border-amber-500/30',
    text: 'text-amber-400',
    Icon: Wrench,
  },
  limpeza: {
    label: 'Limpeza',
    bg: 'bg-violet-500/12 border-violet-500/30',
    text: 'text-violet-400',
    Icon: Sparkles,
  },
}

const EMPTY = {
  nome: '',
  tipo: 'compartilhado',
  capacidade: 2,
  precoDiaria: '',
  statusAtual: 'disponivel',
}

function QuartoModal({ form, setForm, onSave, onClose, editId, loading }) {
  const [err, setErr] = useState('')

  const handle = (e) => {
    setErr('')
    const { name, value } = e.target
    setForm((f) => ({ ...f, [name]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!form.nome?.trim()) {
      setErr('Número ou nome do quarto é obrigatório.')
      return
    }
    if (form.precoDiaria === '' || form.precoDiaria == null) {
      setErr('Preço da diária é obrigatório.')
      return
    }
    try {
      await onSave()
    } catch (e2) {
      setErr(e2.message)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-teal-400" />
            {editId ? 'Editar quarto' : 'Novo quarto'}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={submit} className="overflow-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Número / identificação *</label>
              <input
                name="nome"
                value={form.nome}
                onChange={handle}
                placeholder="Ex: 101, 201, Suíte Master"
                className="input-base"
                autoComplete="off"
              />
              <p className="text-xs text-slate-600 mt-1">Enviado à API como número do quarto.</p>
            </div>

            <div>
              <label className="label">Categoria (tipo)</label>
              <select name="tipo" value={form.tipo} onChange={handle} className="input-base">
                {TIPOS.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Capacidade (pessoas)</label>
              <input
                name="capacidade"
                type="number"
                min="1"
                value={form.capacidade}
                onChange={handle}
                className="input-base"
              />
            </div>

            <div>
              <label className="label">Status no hostel</label>
              <select name="statusAtual" value={form.statusAtual} onChange={handle} className="input-base">
                {STATUS_QUARTO.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Diária (R$) *</label>
              <input
                name="precoDiaria"
                type="number"
                step="0.01"
                min="0"
                value={form.precoDiaria}
                onChange={handle}
                placeholder="0,00"
                className="input-base"
              />
            </div>
          </div>

          {err && (
            <p className="text-sm text-red-400 flex items-center gap-2 mt-4">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              {err}
            </p>
          )}
        </form>

        <div className="px-6 py-4 border-t border-white/5 flex gap-3 justify-end shrink-0">
          <button type="button" onClick={onClose} className="btn-ghost">
            Cancelar
          </button>
          <button type="button" onClick={submit} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Salvando…
              </>
            ) : editId ? (
              'Salvar'
            ) : (
              'Cadastrar'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Quartos() {
  const [quartos, setQuartos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY)
  const [busca, setBusca] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const carregar = useCallback(async () => {
    try {
      setQuartos(await api.getQuartos())
    } catch {
      toast.error('Erro ao carregar quartos.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const openNew = () => {
    setForm(EMPTY)
    setEditId(null)
    setShowModal(true)
  }

  const openEdit = (q) => {
    setForm({
      nome: q.nome ?? '',
      tipo: TIPOS.some((t) => t.value === q.tipo) ? q.tipo : 'compartilhado',
      capacidade: q.capacidade ?? 2,
      precoDiaria: q.precoDiaria != null && q.precoDiaria !== '' ? String(q.precoDiaria) : '',
      statusAtual: STATUS_QUARTO.some((s) => s.value === q.statusAtual) ? q.statusAtual : 'disponivel',
    })
    setEditId(q.id)
    setShowModal(true)
  }

  const salvar = async () => {
    setSaving(true)
    try {
      const preco = String(form.precoDiaria).replace(',', '.')
      const body = {
        nome: form.nome.trim(),
        tipo: form.tipo,
        capacidade: Math.max(1, +form.capacidade),
        precoDiaria: preco,
        statusAtual: form.statusAtual,
      }

      if (editId) await api.atualizarQuarto(editId, body)
      else await api.criarQuarto(body)

      setShowModal(false)
      toast.success(editId ? 'Quarto atualizado.' : 'Quarto cadastrado.')
      await carregar()
    } catch (err) {
      toast.error(err.message)
      throw err
    } finally {
      setSaving(false)
    }
  }

  const confirmarDesativar = async () => {
    try {
      await api.deletarQuarto(confirmId)
      toast.success('Quarto desativado.')
      await carregar()
    } catch {
      toast.error('Erro ao desativar quarto.')
    } finally {
      setConfirmId(null)
    }
  }

  const lista = useMemo(() => {
    return quartos.filter((q) => {
      const texto = `${q.nome ?? ''} ${q.tipo ?? ''}`.toLowerCase()
      if (busca && !texto.includes(busca.toLowerCase())) return false
      if (filtroStatus && q.statusAtual !== filtroStatus) return false
      if (filtroTipo && q.tipo !== filtroTipo) return false
      return true
    })
  }, [quartos, busca, filtroStatus, filtroTipo])

  return (
    <Layout title="Quartos" subtitle="Cadastro, preços e status das acomodações">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              placeholder="Buscar por número ou tipo…"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="input-base !pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500 pointer-events-none" />
            <select
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              className="input-base !pl-9 min-w-[160px]"
            >
              <option value="">Todos os status</option>
              {STATUS_QUARTO.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
          <select
            value={filtroTipo}
            onChange={(e) => setFiltroTipo(e.target.value)}
            className="input-base min-w-[160px]"
          >
            <option value="">Todos os tipos</option>
            {TIPOS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <button type="button" onClick={openNew} className="btn-primary flex items-center gap-2 ml-auto">
            <Plus className="w-4 h-4" />
            Novo quarto
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-600 mb-4 font-medium">
        {lista.length} quarto{lista.length !== 1 ? 's' : ''} listado{lista.length !== 1 ? 's' : ''}
      </p>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-7 h-7 text-teal-400 animate-spin" />
        </div>
      ) : lista.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center border border-white/5">
          <DoorOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhum quarto encontrado.</p>
          <p className="text-slate-600 text-sm mt-2">Ajuste os filtros ou cadastre um novo quarto.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lista.map((q, i) => {
            const tipoLabel = TIPOS.find((t) => t.value === q.tipo)?.label || q.tipo
            const st = STATUS_STYLE[q.statusAtual] || STATUS_STYLE.disponivel
            const StIcon = st.Icon

            return (
              <div
                key={q.id}
                className="glass rounded-2xl p-5 border border-white/5 hover:border-white/10 transition-all animate-slide-up"
                style={{ animationDelay: `${i * 40}ms`, opacity: 0, animationFillMode: 'forwards' }}
              >
                <div className="flex items-start justify-between mb-3 gap-2">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <BedDouble className="w-5 h-5 text-teal-400" />
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg border font-medium shrink-0 ${st.bg} ${st.text}`}
                  >
                    <StIcon className="w-3 h-3" />
                    {st.label}
                  </span>
                </div>

                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-display font-semibold text-white text-base leading-tight truncate">
                      Quarto {q.nome}
                    </h3>
                    <p className="text-xs text-teal-400 mt-1 font-medium">{tipoLabel}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEdit(q)}
                      className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmId(q.id)}
                      className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Desativar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2 pt-3 border-t border-white/5">
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Até {q.capacidade} pessoa{q.capacidade > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    Diária:{' '}
                    <span className="text-white font-medium">
                      R${' '}
                      {Number(q.precoDiaria ?? 0).toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <QuartoModal
          form={form}
          setForm={setForm}
          onSave={salvar}
          onClose={() => setShowModal(false)}
          editId={editId}
          loading={saving}
        />
      )}
      {confirmId && (
        <ConfirmDialog
          title="Desativar quarto"
          message="O quarto deixa de aparecer nas listagens ativas. Reservas antigas permanecem no histórico."
          onConfirm={confirmarDesativar}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </Layout>
  )
}