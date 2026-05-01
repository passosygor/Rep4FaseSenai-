import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import { Sparkles, Mail, Lock, AlertCircle, Loader2 } from 'lucide-react'
import  Cadastro from '../pages/Cadastro'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErro('')
    if (!form.email) return setErro('Informe o e-mail.')
    if (!form.senha) return setErro('Informe a senha.')
    setLoading(true)
    try {
      const usuario = await api.login(form)
      login(usuario)
      navigate('/')
    } catch (err) {
      setErro(err.message || 'Credenciais inválidas. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center relative overflow-hidden">
      {/* Blobs decorativos */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-mint-500/8 blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-teal-500/4 blur-[160px] pointer-events-none" />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(rgba(20,184,166,0.08) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(20,184,166,0.08) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      <div className="text-center relative z-10 w-full max-w-md px-6 animate-fade-in">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-teal-500/15 border border-teal-500/30 mb-4 shadow-lg shadow-teal-500/10">
            <Sparkles className="w-8 h-8 text-teal-400" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white tracking-tight">SparkClean</h1>
          <p className="text-slate-400 text-sm mt-1 font-body">Sistema de Gestão de Faxina</p>
        </div>

        {/* Card */}
        <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
          <h2 className="text-lg font-display font-semibold text-white mb-6">Entrar no sistema</h2>

          {/* Alerta de erro */}
          {erro && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-3.5 mb-5 animate-slide-up">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{erro}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Email */}
            <div className='text-left'>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="seu@email.com"
                  value={form.email}
                  onChange={handle}
                  className="input-base !pl-10"
                />
              </div>
            </div>

            {/* Senha */}
            <div className='text-left'>
              <label className="label">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  name="senha"
                  type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={form.senha}
                  onChange={handle}
                  className="input-base !pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</>
              ) : 'Entrar'}
            </button>
          </form>

          {/* Dica de credenciais / Cadastro */}
          <div className="mt-6 p-3.5 bg-teal-500/8 border border-teal-500/20 rounded-xl text-center">
          <p className="text-xs text-teal-400 font-semibold mb-1.5">Não possui conta?</p>
  
          <button 
          type="button"
          /* Aqui você coloca a rota para onde a pessoa deve ir (ex: '/cadastro' ou '/registrar') */
          onClick={() => navigate('/cadastro')} 
          className="block w-full text-center text-xs text-slate-400 hover:text-teal-400 transition-colors font-mono py-1 px-1 rounded hover:bg-teal-500/10"
             >
            Clique aqui e faça seu cadastro!
              </button>
            </div>
          </div>

        <p className="text-center text-xs text-slate-600 mt-6 font-body">
          © {new Date().getFullYear()} SparkClean — Todos os direitos reservados
        </p>
      </div>
    </div>
  )
}
