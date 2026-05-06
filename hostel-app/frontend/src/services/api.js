// src/services/api.js
const BASE = '/api'

async function req(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.erro || 'Erro na requisição')
  return data
}

export const api = {
  // Auth
  login: (body) => req('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  cadastrar: (body) => req('/auth/cadastro', { method: 'POST', body: JSON.stringify(body) }),

  // Hóspedes (Antigo Clientes)
  getHospedes: () => req('/hospedes'),
  criarHospede: (body) => req('/hospedes', { method: 'POST', body: JSON.stringify(body) }),
  atualizarHospede: (id, body) => req(`/hospedes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletarHospede: (id) => req(`/hospedes/${id}`, { method: 'DELETE' }),

  // Quartos (Antigo Profissionais)
  getQuartos: () => req('/quartos'),
  criarQuarto: (body) => req('/quartos', { method: 'POST', body: JSON.stringify(body) }),
  atualizarQuarto: (id, body) => req(`/quartos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletarQuarto: (id) => req(`/quartos/${id}`, { method: 'DELETE' }),

  // Reservas (Antigo Agendamentos)
  getReservas: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return req(`/reservas${q ? '?' + q : ''}`)
  },
  verificarDisponibilidade: (params) => req('/reservas/disponibilidade?' + new URLSearchParams(params).toString()),
  criarReserva: (body) => req('/reservas', { method: 'POST', body: JSON.stringify(body) }),
  atualizarReserva: (id, body) => req(`/reservas/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  cancelarReserva: (id) => req(`/reservas/${id}`, { method: 'DELETE' }),
}