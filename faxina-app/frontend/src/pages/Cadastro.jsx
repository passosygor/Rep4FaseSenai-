import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../services/api'
// Importamos o ícone 'User' para o campo de nome
import { Sparkles, Mail, Lock, AlertCircle, Loader2, User } from 'lucide-react'

export default function Cadastro() {
  const navigate = useNavigate()
  // Adicionei o 'nome' no estado inicial do formulário
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [loading, setLoading] = useState(false)

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const submit = async (e) => {
    e.preventDefault()
    setErro('')
    
    // Validações
    if (!form.nome) return setErro('Informe o seu nome.')
    if (!form.email) return setErro('Informe o e-mail.')
    if (!form.senha) return setErro('Informe a senha.')
    if (form.senha.length < 6) return setErro('A senha deve ter no mínimo 6 caracteres.')

    setLoading(true)
    try {
      // ATENÇÃO: Aqui você deve usar a função da sua API que faz o CADASTRO.
      // Exemplo: await api.cadastrar(form) ou api.register(form)
      await api.cadastrar(form) 
      
      // Se deu certo, avisa o usuário e manda ele para a tela de login
      alert('Cadastro realizado com sucesso! Faça seu login.')
      navigate('/login')
      
    } catch (err) {
      setErro(err.message || 'Erro ao realizar o cadastro. Tente novamente.')
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
          <h2 className="text-lg font-display font-semibold text-white mb-6">Criar nova conta</h2>

          {/* Alerta de erro */}
          {erro && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/25 rounded-xl p-3.5 mb-5 animate-slide-up">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-sm text-red-300">{erro}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-5">
            {/* Nome */}
            <div className='text-left'>
              <label className="label">Nome Completo</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  name="nome"
                  type="text"
                  placeholder="Seu nome"
                  value={form.nome}
                  onChange={handle}
                  className="input-base !pl-10"
                />
              </div>
            </div>

            {/* Email */}
            <div className='text-left'>
              <label className="label">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
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
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                <input
                  name="senha"
                  type="password"
                  autoComplete="new-password"
                  placeholder="Mínimo 6 caracteres"
                  value={form.senha}
                  onChange={handle}
                  className="input-base !pl-10"
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Cadastrando...</>
              ) : 'Cadastrar'}
            </button>
          </form>

          {/* Dica / Voltar para Login */}
          <div className="mt-6 p-3.5 bg-teal-500/8 border border-teal-500/20 rounded-xl text-center">
            <p className="text-xs text-teal-400 font-semibold mb-1.5">Já possui uma conta?</p>
            <button 
              type="button"
              onClick={() => navigate('/login')} 
              className="block w-full text-center text-xs text-slate-400 hover:text-teal-400 transition-colors font-mono py-1 px-1 rounded hover:bg-teal-500/10"
            >
              Clique aqui para entrar!
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