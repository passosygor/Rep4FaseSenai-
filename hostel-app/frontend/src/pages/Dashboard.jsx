import { useEffect, useState } from 'react'
import { api } from '../services/api'
import Layout from '../components/Layout'
import { toast } from '../components/Toast'
import { Users, BedDouble, CalendarDays, Loader2, TrendingUp } from 'lucide-react'

export default function Dashboard() {
  const [stats, setStats] = useState({ hospedes: 0, quartos: 0, reservas: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregarDados() {
      try {
        // Chamando as funções com os nomes novos que definimos no api.js
        const [h, q, r] = await Promise.all([
          api.getHospedes(),
          api.getQuartos(), // Aqui era o antigo getUsuarios/getProfissionais
          api.getReservas()
        ])
        
        setStats({
          hospedes: h.length,
          quartos: q.length,
          reservas: r.length
        })
      } catch (err) {
        toast.error("Erro ao carregar indicadores do painel.")
      } finally {
        setLoading(false)
      }
    }
    carregarDados()
  }, [])

  const cards = [
    { label: 'Total de Hóspedes', value: stats.hospedes, icon: Users, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Quartos Disponíveis', value: stats.quartos, icon: BedDouble, color: 'text-teal-400', bg: 'bg-teal-500/10' },
    { label: 'Reservas Ativas', value: stats.reservas, icon: CalendarDays, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  return (
    <Layout title="Painel Geral" subtitle="Visão geral do seu Hostel">
      {loading ? (
        <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-teal-400 animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card, i) => (
            <div key={i} className="glass rounded-2xl p-6 border border-white/5 animate-slide-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm font-medium">{card.label}</p>
                  <h3 className="text-3xl font-display font-bold text-white mt-2">{card.value}</h3>
                </div>
                <div className={`p-3 rounded-xl ${card.bg} border border-white/5`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-mint-400">
                <TrendingUp className="w-3 h-3" />
                <span>Atualizado em tempo real</span>
              </div>
            </div>
          ))}

          {/* Espaço para um gráfico ou lista de check-ins futuros */}
          <div className="md:col-span-3 glass rounded-2xl p-8 border border-white/5 mt-2">
            <h4 className="text-white font-display font-semibold mb-1">Bem-vindo ao sistema de gestão</h4>
            <p className="text-slate-400 text-sm">Utilize o menu lateral para gerenciar suas reservas e acomodações.</p>
          </div>
        </div>
      )}
    </Layout>
  )
}