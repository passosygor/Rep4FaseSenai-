import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    try {
      const saved = localStorage.getItem('faxina_usuario')
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const login = (dados) => {
    localStorage.setItem('faxina_usuario', JSON.stringify(dados))
    setUsuario(dados)
  }

  const logout = () => {
    localStorage.removeItem('faxina_usuario')
    setUsuario(null)
  }

  return (
    <AuthContext.Provider value={{ usuario, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
