import { useEffect, useState, useCallback } from 'react'
import { api } from '../services/api'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, X, Search, Pencil, Trash2, Loader2, AlertTriangle, BedDouble, Users, DollarSign, DoorOpen } from 'lucide-react'

const TIPOS = [
  { value: 'compartilhado', label: 'Compartilhado' },
  { value: 'privativo',     label: 'Privativo' },
  { value: 'casal',         label: 'Casal' },
  { value: 'suite',         label: 'Suíte' },
]

const EMPTY = { nome: '', tipo: 'compartilhado', capacidade: 1, precoDiaria: '', comodidades: '' }

function QuartoModal({ form, setForm, onSave, onClose, editId, loading }) {
  const [err, setErr] = useState('')
  
  const handle = e => { 
    setErr(''); 
    setForm(f => ({ ...f, [e.target.name]: e.target.value })) 
  }
  
  const submit = async e => {
    e.preventDefault()
    if (!form.nome) { setErr('Nome/Número do quarto é obrigatório.'); return }
    if (!form.precoDiaria) { setErr('Preço da diária é obrigatório.'); return }
    try { await onSave() } catch (e) { setErr(e.message) }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-teal-400" />
            {editId ? 'Editar Quarto' : 'Novo Quarto'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        
        <form onSubmit={submit} className="overflow-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Nome / Número do Quarto *</label>
              <input name="nome" value={form.nome} onChange={handle} placeholder="Ex: Quarto 101 ou Suíte Master" className="input-base" />
            </div>
            
            <div>
              <label className="label">Tipo</label>
              <select name="tipo" value={form.tipo} onChange={handle} className="input-base">
                {TIPOS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            
            <div>
              <label className="label">Capacidade (Pessoas)</label>
              <input name="capacidade" type="number" min="1" value={form.capacidade} onChange={handle} className="input-base" />
            </div>

            <div className="col-span-2">
              <label className="label">Preço da Diária (R$) *</label>
              <input name="precoDiaria" type="number" step="0.01" min="0" value={form.precoDiaria} onChange={handle} placeholder="0,00" className="input-base" />
            </div>

            <div className="col-span-2">
              <label className="label">Comodidades</label>
              <input name="comodidades" value={form.comodidades} onChange={handle}
                placeholder="Ex: Wi-Fi, Ar Condicionado, TV Smart" className="input-base" />
              <p className="text-xs text-slate-600 mt-1">Separe por vírgula</p>
            </div>
          </div>
          {err && <p className="text-sm text-red-400 flex items-center gap-2 mt-3"><AlertTriangle className="w-4 h-4" />{err}</p>}
        </form>

        <div className="px-6 py-4 border-t border-white/5 flex gap-3 justify-end shrink-0">
          <button onClick={onClose} className="btn-ghost">Cancelar</button>
          <button onClick={submit} disabled={loading} className="btn-primary flex items-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Salvando…</> : editId ? 'Salvar' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Quartos() {
  const [quartos, setQuartos]     = useState([])
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]       = useState(null)
  const [form, setForm]           = useState(EMPTY)
  const [busca, setBusca]         = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const carregar = useCallback(async () => {
    try { setQuartos(await api.getQuartos()) } catch { toast.error('Erro ao carregar quartos.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { carregar() }, [carregar])

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowModal(true) }
  const openEdit = (q) => {
    setForm({ 
      nome: q.nome, 
      tipo: q.tipo || 'compartilhado', 
      capacidade: q.capacidade || 1, 
      precoDiaria: q.precoDiaria || '', 
      comodidades: q.comodidades || '' 
    })
    setEditId(q.id); setShowModal(true)
  }

  const salvar = async () => {
    setSaving(true)
    try {
      const body = {
        ...form,
        capacidade: +form.capacidade,
        precoDiaria: parseFloat(form.precoDiaria)
      }

      if (editId) await api.atualizarQuarto(editId, body)
      else        await api.criarQuarto(body)
      
      setShowModal(false)
      toast.success(editId ? 'Quarto atualizado!' : 'Quarto cadastrado com sucesso!')
      await carregar()
    } catch (err) {
      toast.error(err.message)
      throw err
    } finally { setSaving(false) }
  }

  const confirmarDesativar = async () => {
    try {
      await api.deletarQuarto(confirmId)
      toast.success('Quarto desativado/removido.')
      await carregar()
    } catch { toast.error('Erro ao desativar quarto.') }
    finally { setConfirmId(null) }
  }

  const lista = quartos.filter(q =>
    q.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (q.comodidades||'').toLowerCase().includes(busca.toLowerCase()) ||
    (q.tipo||'').toLowerCase().includes(busca.toLowerCase())
  )

  const tagColors = [
    'bg-teal-500/15 text-teal-400',
    'bg-mint-500/15 text-mint-400',
    'bg-amber-500/15 text-amber-400',
    'bg-purple-500/15 text-purple-400',
    'bg-blue-500/15 text-blue-400',
  ]

  return (
    <Layout title="Quartos" subtitle="Gerencie as acomodações do hostel">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input placeholder="Buscar por nome, tipo ou comodidade…" value={busca} onChange={e => setBusca(e.target.value)} className="input-base !pl-10" />
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Quarto
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4 font-medium">{lista.length} quarto{lista.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-400 animate-spin" /></div>
      ) : lista.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <DoorOpen className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhum quarto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lista.map((q, i) => {
            const tags = (q.comodidades||'').split(',').map(s => s.trim()).filter(Boolean)
            const tipoLabel = TIPOS.find(t => t.value === q.tipo)?.label || q.tipo

            return (
              <div key={q.id}
                className="glass rounded-2xl p-5 hover:border-white/10 transition-all animate-slide-up"
                style={{ animationDelay:`${i*40}ms`, opacity:0, animationFillMode:'forwards' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0">
                    <BedDouble className="w-5 h-5 text-teal-400" />
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(q)} className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all" title="Editar">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setConfirmId(q.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Desativar">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-display font-semibold text-white text-base leading-tight">{q.nome}</h3>
                <p className="text-xs text-teal-400 mt-1 font-medium">{tipoLabel}</p>
                
                <div className="mt-3 space-y-2">
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-500 shrink-0" /> 
                    Capacidade: {q.capacidade} pessoa{q.capacidade > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-slate-400 flex items-center gap-2">
                    <DollarSign className="w-3.5 h-3.5 text-slate-500 shrink-0" /> 
                    Diária: <span className="text-white font-medium">R$ {parseFloat(q.precoDiaria || 0).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </p>
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-4 pt-4 border-t border-white/5">
                    {tags.map((tag, ti) => (
                      <span key={ti} className={`text-xs px-2 py-0.5 rounded-lg font-medium ${tagColors[ti % tagColors.length]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <QuartoModal form={form} setForm={setForm} onSave={salvar} onClose={() => setShowModal(false)} editId={editId} loading={saving} />
      )}
      {confirmId && (
        <ConfirmDialog
          title="Remover Quarto"
          message="Tem certeza que deseja remover este quarto do sistema? Esta ação pode afetar reservas existentes."
          onConfirm={confirmarDesativar}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </Layout>
  )
}