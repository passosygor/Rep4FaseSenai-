import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../services/api'
import Layout from '../components/Layout'
import {
  CalendarCheck, Users, Briefcase, TrendingUp,
  Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2
} from 'lucide-react'

const statusConfig = {
  agendado:      { label: 'Agendado',      color: 'text-teal-400',  bg: 'bg-teal-500/10  border-teal-500/25' },
  em_andamento:  { label: 'Em Andamento',  color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/25' },
  concluido:     { label: 'Concluído',     color: 'text-mint-400',  bg: 'bg-mint-500/10  border-mint-500/25' },
  cancelado:     { label: 'Cancelado',     color: 'text-red-400',   bg: 'bg-red-500/10   border-red-500/25' },
}

const tipoLabel = {
  residencial: '🏠 Residencial',
  comercial:   '🏢 Comercial',
  posObra:     '🔨 Pós-obra',
  manutencao:  '🔧 Manutenção',
}

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <div className={`glass rounded-2xl p-6 animate-slide-up ${delay}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
          <p className={`text-3xl font-display font-bold mt-1 ${color}`}>{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl ${color === 'text-teal-400' ? 'bg-teal-500/15' : color === 'text-mint-400' ? 'bg-mint-500/15' : 'bg-amber-500/15'}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { usuario } = useAuth()
  const [agendamentos, setAgendamentos] = useState([])
  const [clientes, setClientes] = useState([])
  const [profissionais, setProfissionais] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.getAgendamentos(), api.getClientes(), api.getProfissionais()])
      .then(([a, c, p]) => { setAgendamentos(a); setClientes(c); setProfissionais(p) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const proximos = agendamentos.filter(a => a.status === 'agendado').slice(0, 5)
  const concluidos = agendamentos.filter(a => a.status === 'concluido').length
  const hoje = agendamentos.filter(a => {
    const d = new Date(a.dataHoraInicio)
    const n = new Date()
    return d.toDateString() === n.toDateString()
  }).length

  if (loading) return (
    <Layout title="Painel" subtitle={`Bem-vindo, ${usuario?.nome}`}>
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-teal-400 animate-spin" />
      </div>
    </Layout>
  )

  return (
    <Layout title="Painel" subtitle={`Bem-vindo de volta, ${usuario?.nome}! 👋`}>
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={CalendarCheck} label="Agendamentos" value={agendamentos.length} color="text-teal-400" delay="stagger-1" />
        <StatCard icon={CheckCircle2}  label="Concluídos"   value={concluidos}         color="text-mint-400" delay="stagger-2" />
        <StatCard icon={Users}         label="Clientes"     value={clientes.length}    color="text-teal-400" delay="stagger-3" />
        <StatCard icon={Briefcase}     label="Profissionais" value={profissionais.length} color="text-amber-400" delay="stagger-4" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximos agendamentos */}
        <div className="lg:col-span-2 glass rounded-2xl p-6 animate-slide-up stagger-3">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-teal-400" /> Próximos Agendamentos
            </h2>
            <Link to="/agendamentos" className="text-xs text-teal-400 hover:text-teal-300 flex items-center gap-1 transition-colors">
              Ver todos <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {proximos.length === 0 ? (
            <div className="text-center py-8">
              <CalendarCheck className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="text-slate-500 text-sm">Nenhum agendamento futuro.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {proximos.map((ag) => {
                const cfg = statusConfig[ag.status] || statusConfig.agendado
                const dt = new Date(ag.dataHoraInicio)
                return (
                  <div key={ag.id} className="flex items-center gap-4 p-3.5 rounded-xl bg-white/3 hover:bg-white/5 transition-colors">
                    <div className="text-center shrink-0 w-12">
                      <p className="text-xs text-slate-500">{dt.toLocaleDateString('pt-BR', { weekday: 'short' })}</p>
                      <p className="text-lg font-display font-bold text-white leading-none">{dt.getDate()}</p>
                      <p className="text-xs text-slate-500">{dt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-200 truncate">{ag.cliente.nome}</p>
                      <p className="text-xs text-slate-500 truncate">{ag.profissional.nome} · {tipoLabel[ag.tipoServico] || ag.tipoServico}</p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium shrink-0 ${cfg.bg} ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Ações rápidas */}
        <div className="space-y-4">
          <div className="glass rounded-2xl p-6 animate-slide-up stagger-4">
            <h2 className="font-display font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-mint-400" /> Ações Rápidas
            </h2>
            <div className="space-y-2">
              {[
                { to: '/agendamentos', label: 'Novo Agendamento', icon: CalendarCheck, color: 'teal' },
                { to: '/clientes', label: 'Cadastrar Cliente', icon: Users, color: 'mint' },
                { to: '/profissionais', label: 'Novo Profissional', icon: Briefcase, color: 'amber' },
              ].map(({ to, label, icon: Icon, color }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/3 hover:bg-white/6 border border-white/5 hover:border-teal-500/20 transition-all group"
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${color === 'teal' ? 'bg-teal-500/15' : color === 'mint' ? 'bg-mint-500/15' : 'bg-amber-500/15'}`}>
                    <Icon className={`w-4 h-4 ${color === 'teal' ? 'text-teal-400' : color === 'mint' ? 'text-mint-400' : 'text-amber-400'}`} />
                  </div>
                  <span className="text-sm text-slate-300 group-hover:text-white transition-colors">{label}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-slate-400 ml-auto transition-colors" />
                </Link>
              ))}
            </div>
          </div>

          {/* Hoje */}
          <div className="glass rounded-2xl p-5 animate-slide-up stagger-5 border border-teal-500/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Hoje</p>
                <p className="text-xl font-display font-bold text-white">{hoje} serviço{hoje !== 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
