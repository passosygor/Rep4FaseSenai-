import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem('hostel_usuario')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (dados) => {
    localStorage.setItem('hostel_usuario', JSON.stringify(dados))
    setUsuario(dados)
  }

  const logout = () => {
    localStorage.removeItem('hostel_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)