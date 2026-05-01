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

  // Clientes
  getClientes: () => req('/clientes'),
  criarCliente: (body) => req('/clientes', { method: 'POST', body: JSON.stringify(body) }),
  atualizarCliente: (id, body) => req(`/clientes/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletarCliente: (id) => req(`/clientes/${id}`, { method: 'DELETE' }),

  // Profissionais
  getProfissionais: () => req('/profissionais'),
  criarProfissional: (body) => req('/profissionais', { method: 'POST', body: JSON.stringify(body) }),
  atualizarProfissional: (id, body) => req(`/profissionais/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deletarProfissional: (id) => req(`/profissionais/${id}`, { method: 'DELETE' }),

  // Agendamentos
  getAgendamentos: (params = {}) => {
    const q = new URLSearchParams(params).toString()
    return req(`/agendamentos${q ? '?' + q : ''}`)
  },
  verificarConflito: (params) => req('/agendamentos/conflito?' + new URLSearchParams(params).toString()),
  criarAgendamento: (body) => req('/agendamentos', { method: 'POST', body: JSON.stringify(body) }),
  atualizarAgendamento: (id, body) => req(`/agendamentos/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  cancelarAgendamento: (id) => req(`/agendamentos/${id}`, { method: 'DELETE' }),
}
