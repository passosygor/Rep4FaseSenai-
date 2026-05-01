import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  Sparkles, LayoutDashboard, CalendarCheck, Users, Briefcase,
  LogOut, ChevronRight, User
} from 'lucide-react'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Painel' },
  { to: '/agendamentos', icon: CalendarCheck, label: 'Agendamentos' },
  { to: '/clientes', icon: Users, label: 'Clientes' },
  { to: '/profissionais', icon: Briefcase, label: 'Profissionais' },
]

export default function Layout({ children, title, subtitle }) {
  const { usuario, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => { logout(); navigate('/login') }

  return (
    <div className="min-h-screen bg-navy-950 flex">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 flex flex-col glass border-r border-white/5 relative z-20">
        {/* Logo */}
        <div className="px-6 py-7 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5 text-teal-400" />
            </div>
            <div>
              <p className="font-display font-bold text-white text-sm leading-none">SparkClean</p>
              <p className="text-slate-500 text-xs mt-0.5">Gestão de Faxina</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wider px-3 mb-3">Menu</p>
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
                ${isActive
                  ? 'bg-teal-500/15 text-teal-400 border border-teal-500/25'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-teal-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                  <span className="flex-1">{label}</span>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-teal-500/60" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Usuário */}
        <div className="px-4 pb-5 border-t border-white/5 pt-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 border border-teal-500/30 flex items-center justify-center shrink-0">
              <User className="w-4 h-4 text-teal-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200 truncate">{usuario?.nome}</p>
              <p className="text-xs text-slate-500 capitalize">{usuario?.perfil}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sair"
              className="text-slate-500 hover:text-red-400 transition-colors p-1 rounded-lg hover:bg-red-500/10"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 border-b border-white/5 glass shrink-0">
          <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
          {subtitle && <p className="text-slate-400 text-sm mt-0.5">{subtitle}</p>}
        </header>

        {/* Page body */}
        <div className="flex-1 overflow-auto p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
