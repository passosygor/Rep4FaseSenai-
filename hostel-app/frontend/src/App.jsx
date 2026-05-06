import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastContainer } from './components/Toast'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Cadastro from './pages/Cadastro'

// Novas importações com a nomenclatura do Hotel
import Reservas from './pages/Reservas'
import Hospedes from './pages/Hospedes'
import Usuarios from './pages/Usuarios'
import Quartos from './pages/Quartos'

function PrivateRoute({ children }) {
  const { usuario } = useAuth()
  return usuario ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const { usuario } = useAuth()
  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/cadastro" element={usuario ? <Navigate to="/" replace /> : <Cadastro />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      
      {/* Novas rotas do Hotel */}
      <Route path="/reservas" element={<PrivateRoute><Reservas /></PrivateRoute>} />
      <Route path="/hospedes" element={<PrivateRoute><Hospedes /></PrivateRoute>} />
      {/* Quartos: componente em Usuarios.jsx; menu do Layout usa /quartos */}
      <Route path="/quartos" element={<PrivateRoute><Quartos /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><Usuarios /></PrivateRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <ToastContainer />
    </AuthProvider>
  )
}