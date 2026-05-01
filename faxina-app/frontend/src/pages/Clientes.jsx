import { useEffect, useState, useCallback } from 'react'
import { api } from '../services/api'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import ConfirmDialog from '../components/ConfirmDialog'
import { Plus, X, Users, Search, Pencil, Trash2, Loader2, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react'

const EMPTY = { nome:'', email:'', telefone:'', cpf:'', endereco:'', cidade:'', uf:'', observacoes:'' }

function ClienteModal({ form, setForm, onSave, onClose, editId, loading }) {
  const [err, setErr] = useState('')
  const handle = e => { setErr(''); setForm(f => ({ ...f, [e.target.name]: e.target.value })) }
  const submit = async e => {
    e.preventDefault()
    if (!form.nome) { setErr('Nome é obrigatório.'); return }
    try { await onSave() } catch (e) { setErr(e.message) }
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="glass w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 shrink-0">
          <h3 className="font-display font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-teal-400" />
            {editId ? 'Editar Cliente' : 'Novo Cliente'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={submit} className="overflow-auto flex-1 px-6 py-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="label">Nome Completo / Razão Social *</label>
              <input name="nome" value={form.nome} onChange={handle} placeholder="Nome do cliente" className="input-base" />
            </div>
            <div>
              <label className="label">E-mail</label>
              <input name="email" type="email" value={form.email} onChange={handle} placeholder="email@exemplo.com" className="input-base" />
            </div>
            <div>
              <label className="label">Telefone</label>
              <input name="telefone" value={form.telefone} onChange={handle} placeholder="(48) 99999-9999" className="input-base" />
            </div>
            <div>
              <label className="label">CPF / CNPJ</label>
              <input name="cpf" value={form.cpf} onChange={handle} placeholder="000.000.000-00" className="input-base" />
            </div>
            <div>
              <label className="label">Cidade</label>
              <input name="cidade" value={form.cidade} onChange={handle} placeholder="Florianópolis" className="input-base" />
            </div>
            <div className="col-span-2">
              <label className="label">Endereço</label>
              <input name="endereco" value={form.endereco} onChange={handle} placeholder="Rua, número, bairro" className="input-base" />
            </div>
            <div>
              <label className="label">UF</label>
              <input name="uf" value={form.uf} onChange={handle} placeholder="SC" maxLength={2} className="input-base uppercase" />
            </div>
            <div>
              <label className="label">Observações</label>
              <input name="observacoes" value={form.observacoes} onChange={handle} placeholder="Preferências..." className="input-base" />
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

export default function Clientes() {
  const [clientes, setClientes] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId]     = useState(null)
  const [form, setForm]         = useState(EMPTY)
  const [busca, setBusca]       = useState('')
  const [confirmId, setConfirmId] = useState(null)

  const carregar = useCallback(async () => {
    try { setClientes(await api.getClientes()) } catch { toast.error('Erro ao carregar clientes.') }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { carregar() }, [carregar])

  const openNew  = () => { setForm(EMPTY); setEditId(null); setShowModal(true) }
  const openEdit = (c) => {
    setForm({ nome:c.nome, email:c.email||'', telefone:c.telefone||'', cpf:c.cpf||'', endereco:c.endereco||'', cidade:c.cidade||'', uf:c.uf||'', observacoes:c.observacoes||'' })
    setEditId(c.id); setShowModal(true)
  }

  const salvar = async () => {
    setSaving(true)
    try {
      if (editId) await api.atualizarCliente(editId, form)
      else        await api.criarCliente(form)
      setShowModal(false)
      toast.success(editId ? 'Cliente atualizado!' : 'Cliente cadastrado com sucesso!')
      await carregar()
    } catch (err) {
      toast.error(err.message)
      throw err
    } finally { setSaving(false) }
  }

  const confirmarDesativar = async () => {
    try {
      await api.deletarCliente(confirmId)
      toast.success('Cliente desativado.')
      await carregar()
    } catch { toast.error('Erro ao desativar cliente.') }
    finally { setConfirmId(null) }
  }

  const lista = clientes.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase()) ||
    (c.email||'').toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <Layout title="Clientes" subtitle="Cadastro e histórico de clientes">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input placeholder="Buscar por nome ou e-mail…" value={busca} onChange={e => setBusca(e.target.value)} className="input-base !pl-10" />
        </div>
        <button onClick={openNew} className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" /> Novo Cliente
        </button>
      </div>

      <p className="text-xs text-slate-600 mb-4 font-medium">{lista.length} cliente{lista.length !== 1 ? 's' : ''}</p>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-7 h-7 text-teal-400 animate-spin" /></div>
      ) : lista.length === 0 ? (
        <div className="glass rounded-2xl p-16 text-center">
          <Users className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 font-medium">Nenhum cliente encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {lista.map((c, i) => (
            <div key={c.id}
              className="glass rounded-2xl p-5 hover:border-white/10 transition-all animate-slide-up"
              style={{ animationDelay:`${i*40}ms`, opacity:0, animationFillMode:'forwards' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/20 flex items-center justify-center shrink-0">
                  <span className="text-teal-400 font-display font-bold text-sm">{c.nome[0].toUpperCase()}</span>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(c)} className="p-1.5 text-slate-500 hover:text-teal-400 hover:bg-teal-500/10 rounded-lg transition-all" title="Editar">
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setConfirmId(c.id)} className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="Desativar">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <h3 className="font-display font-semibold text-white text-sm leading-tight">{c.nome}</h3>
              {c.cpf && <p className="text-xs text-slate-500 mt-0.5 font-mono">{c.cpf}</p>}
              <div className="mt-3 space-y-1.5">
                {c.email    && <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate"><Mail   className="w-3 h-3 text-slate-600 shrink-0" />{c.email}</p>}
                {c.telefone && <p className="text-xs text-slate-400 flex items-center gap-1.5"><Phone  className="w-3 h-3 text-slate-600 shrink-0" />{c.telefone}</p>}
                {c.cidade   && <p className="text-xs text-slate-400 flex items-center gap-1.5"><MapPin className="w-3 h-3 text-slate-600 shrink-0" />{c.cidade}{c.uf?`, ${c.uf}`:''}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <ClienteModal form={form} setForm={setForm} onSave={salvar} onClose={() => setShowModal(false)} editId={editId} loading={saving} />
      )}
      {confirmId && (
        <ConfirmDialog
          title="Desativar Cliente"
          message="O cliente será desativado. Seus agendamentos anteriores continuarão registrados."
          onConfirm={confirmarDesativar}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </Layout>
  )
}
