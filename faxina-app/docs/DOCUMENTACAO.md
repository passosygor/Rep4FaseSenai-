# 📋 SparkClean — Documentação Completa do Sistema

---

## 1. REQUISITOS DE INFRAESTRUTURA

### Software necessário
| Ferramenta | Versão mínima | Download |
|---|---|---|
| Node.js | 18.x LTS | https://nodejs.org |
| npm | 9.x | (incluso no Node.js) |
| PostgreSQL | 15.x | https://www.postgresql.org/download |
| pgAdmin 4 | 7.x | https://www.pgadmin.org/download |
| Git | 2.x | https://git-scm.com |

### Hardware mínimo
- RAM: 4 GB
- Disco: 2 GB livres
- SO: Windows 10+, macOS 12+, Ubuntu 20.04+

---

## 2. COMO INSTALAR E RODAR A APLICAÇÃO

### Passo 1 — Preparar o banco de dados

1. Instale o PostgreSQL e abra o pgAdmin 4.
2. Crie um novo banco de dados chamado `faxina-db`:
   - Clique com botão direito em "Databases" → Create → Database
   - Name: `faxina-db` → Save
3. Abra o Query Tool com o banco `faxina-db` selecionado.
4. Cole e execute o conteúdo do arquivo `faxina-db.sql` (script completo já com seeds).

---

### Passo 2 — Backend

```bash
# 1. Entre na pasta do backend
cd faxina-app/backend

# 2. Copie e edite o .env
cp .env.example .env
# Edite .env com sua senha do PostgreSQL:
# DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/faxina-db"

# 3. Instale as dependências
npm install

# 4. Gere o Prisma Client
npx prisma generate

# 5. Sincronize o schema com o banco (já criado via SQL)
npx prisma db push

# 6. Popule com dados de exemplo (seeds)
npm run db:seed

# 7. Inicie o servidor em modo desenvolvimento
npm run dev
# → Servidor em http://localhost:3001
```

**Alternativa com setup automático:**
```bash
npm run setup   # instala + gera prisma + push + seed
npm run dev
```

---

### Passo 3 — Frontend

```bash
# Em um NOVO terminal
cd faxina-app/frontend

# 1. Instale as dependências
npm install

# 2. Inicie o servidor de desenvolvimento
npm run dev
# → Aplicação em http://localhost:5173
```

---

### Credenciais de acesso

| E-mail | Senha | Perfil |
|---|---|---|
| admin@faxina.com | admin123 | Administrador |
| ana@faxina.com | ana123 | Atendente |
| carlos@faxina.com | carlos123 | Supervisor |

---

## 3. REQUISITOS FUNCIONAIS

### RF-01 — Autenticação
- **RF-01.1** O sistema deve permitir login com e-mail e senha.
- **RF-01.2** Deve exibir mensagem de erro clara para credenciais inválidas ou usuário inativo.
- **RF-01.3** O usuário autenticado deve ter seus dados persistidos na sessão (localStorage).
- **RF-01.4** Deve haver botão de logout visível em todas as telas internas.
- **RF-01.5** Rotas protegidas devem redirecionar para `/login` se não autenticado.

### RF-02 — Tela Principal (Dashboard)
- **RF-02.1** Exibir nome do usuário logado e seu perfil.
- **RF-02.2** Exibir cards de resumo: total de agendamentos, concluídos, clientes, profissionais.
- **RF-02.3** Exibir lista dos próximos agendamentos com data, cliente, profissional e status.
- **RF-02.4** Exibir acesso rápido para criar agendamento, cliente e profissional.
- **RF-02.5** Exibir contador de serviços do dia atual.

### RF-03 — Gestão de Agendamentos
- **RF-03.1** Listar todos os agendamentos ordenados cronologicamente por padrão.
- **RF-03.2** Permitir ordenação alfabética por nome do cliente.
- **RF-03.3** Filtrar por tipo de serviço (Residencial, Comercial, Pós-obra, Manutenção).
- **RF-03.4** Filtrar por status (Agendado, Em Andamento, Concluído, Cancelado).
- **RF-03.5** Buscar agendamentos por nome de cliente ou profissional.
- **RF-03.6** Criar novo agendamento com: cliente, profissional, tipo, datas, endereço, valor e observações.
- **RF-03.7** Verificar automaticamente conflito de horário ao selecionar profissional + datas (em tempo real).
- **RF-03.8** Exibir alerta visual de conflito com informações do agendamento conflitante.
- **RF-03.9** Exibir confirmação visual quando o profissional está disponível no horário.
- **RF-03.10** Bloquear salvamento quando houver conflito detectado.
- **RF-03.11** Editar agendamentos existentes (exceto cancelados/concluídos para campos principais).
- **RF-03.12** Cancelar agendamentos com confirmação do usuário.
- **RF-03.13** A API deve rejeitar conflitos no backend como segunda linha de defesa.

### RF-04 — Gestão de Clientes
- **RF-04.1** Listar clientes ativos ordenados alfabeticamente.
- **RF-04.2** Buscar clientes por nome ou e-mail.
- **RF-04.3** Cadastrar cliente com: nome, e-mail, telefone, CPF/CNPJ, endereço, cidade, UF, observações.
- **RF-04.4** Editar dados do cliente.
- **RF-04.5** Desativar cliente (soft delete — mantém histórico).
- **RF-04.6** Validar unicidade de e-mail e CPF/CNPJ.

### RF-05 — Gestão de Profissionais
- **RF-05.1** Listar profissionais ativos ordenados alfabeticamente.
- **RF-05.2** Buscar por nome ou especialidade.
- **RF-05.3** Cadastrar profissional com: nome, e-mail, telefone, CPF, especialidades.
- **RF-05.4** Editar dados do profissional.
- **RF-05.5** Desativar profissional (soft delete).
- **RF-05.6** Exibir tags coloridas de especialidades no card.

### RF-06 — Histórico
- **RF-06.1** Manter histórico completo de todos os agendamentos (inclusive cancelados/concluídos).
- **RF-06.2** Filtrar agendamentos por status para ver histórico de concluídos.
- **RF-06.3** Soft delete em clientes e profissionais preserva o histórico de agendamentos.

---

## 4. CASOS DE TESTE

### CT-01 — Login com credenciais válidas
- **Pré-condição:** Banco populado com seeds.
- **Ação:** Acessar `/login`, digitar `admin@faxina.com` / `admin123`, clicar em Entrar.
- **Resultado esperado:** Redirecionamento para `/` com nome "Administrador" exibido na sidebar.

### CT-02 — Login com senha incorreta
- **Ação:** Tentar login com `admin@faxina.com` / `senhaErrada`.
- **Resultado esperado:** Mensagem de erro "Senha incorreta." exibida em vermelho. Nenhum redirecionamento.

### CT-03 — Login com e-mail inexistente
- **Ação:** Tentar login com `naoexiste@email.com` / `qualquersenha`.
- **Resultado esperado:** Mensagem "Usuário não encontrado ou inativo."

### CT-04 — Acesso a rota protegida sem login
- **Ação:** Acessar diretamente `/agendamentos` sem estar logado.
- **Resultado esperado:** Redirecionamento automático para `/login`.

### CT-05 — Logout
- **Ação:** Clicar no botão de logout na sidebar.
- **Resultado esperado:** Redirecionamento para `/login`. Tentar voltar via URL redireciona para login.

### CT-06 — Criar agendamento sem conflito
- **Ação:** Criar agendamento para Maria da Silva em data/hora sem nenhum agendamento existente.
- **Resultado esperado:** Badge verde "Profissional disponível" exibido. Agendamento criado com sucesso e aparece na lista.

### CT-07 — Detectar conflito de horário (frontend)
- **Ação:** Ao criar agendamento para João Ferreira, inserir datas que se sobreponham a um agendamento existente.
- **Resultado esperado:** Alerta laranja/vermelho automático com informações do conflito. Botão "Criar Agendamento" desabilitado.

### CT-08 — Detectar conflito de horário (backend)
- **Ação:** Enviar requisição POST para `/api/agendamentos` com datas conflitantes via ferramenta como Insomnia.
- **Resultado esperado:** HTTP 409 com mensagem descrevendo o conflito.

### CT-09 — Filtrar agendamentos por tipo
- **Ação:** Na tela de Agendamentos, selecionar "Comercial" no filtro de tipo.
- **Resultado esperado:** Apenas agendamentos do tipo "comercial" são exibidos.

### CT-10 — Ordenação alfabética
- **Ação:** Clicar no botão de ordenação para alternar para "A→Z".
- **Resultado esperado:** Lista reordenada por nome do cliente (A ao Z).

### CT-11 — Cancelar agendamento
- **Ação:** Clicar em "Cancelar" em um agendamento com status "Agendado". Confirmar no popup.
- **Resultado esperado:** Status atualizado para "Cancelado". Botões de edição/cancelamento removidos.

### CT-12 — Cadastrar cliente com CPF duplicado
- **Ação:** Tentar cadastrar cliente com CPF já existente no banco.
- **Resultado esperado:** Mensagem de erro "Email ou CPF já cadastrado." Modal permanece aberto.

### CT-13 — Busca de agendamentos
- **Ação:** Digitar "Luciana" no campo de busca da tela de Agendamentos.
- **Resultado esperado:** Apenas agendamentos da cliente Luciana Pereira são exibidos.

### CT-14 — Dashboard com dados reais
- **Ação:** Acessar o painel após login.
- **Resultado esperado:** Cards exibem contagens corretas. Lista de próximos agendamentos exibe apenas agendamentos futuros com status "agendado".

### CT-15 — Editar agendamento
- **Ação:** Clicar em "Editar" em um agendamento ativo, alterar o valor e salvar.
- **Resultado esperado:** Agendamento atualizado na lista com novo valor.

---

## 5. ESTRUTURA DO PROJETO

```
faxina-app/
├── faxina-db.sql               ← Script SQL completo (schema + seeds)
├── backend/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma       ← Modelos Prisma
│   │   └── seed.js             ← Script de seed
│   └── src/
│       ├── index.js            ← Servidor Express
│       └── routes/
│           ├── auth.js         ← POST /api/auth/login
│           ├── clientes.js     ← CRUD /api/clientes
│           ├── profissionais.js← CRUD /api/profissionais
│           └── agendamentos.js ← CRUD + conflitos /api/agendamentos
└── frontend/
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── src/
        ├── App.jsx             ← Roteamento
        ├── main.jsx
        ├── index.css
        ├── context/
        │   └── AuthContext.jsx ← Estado de autenticação
        ├── services/
        │   └── api.js          ← Chamadas HTTP
        ├── components/
        │   └── Layout.jsx      ← Sidebar + header
        └── pages/
            ├── Login.jsx       ← Tela de login
            ├── Dashboard.jsx   ← Painel principal
            ├── Agendamentos.jsx← Gestão de agendamentos
            ├── Clientes.jsx    ← Gestão de clientes
            └── Profissionais.jsx← Gestão de profissionais
```

---

## 6. ENDPOINTS DA API

| Método | Rota | Descrição |
|---|---|---|
| POST | /api/auth/login | Autenticar usuário |
| GET | /api/clientes | Listar clientes (ordenado A→Z) |
| POST | /api/clientes | Criar cliente |
| PUT | /api/clientes/:id | Atualizar cliente |
| DELETE | /api/clientes/:id | Desativar cliente |
| GET | /api/profissionais | Listar profissionais |
| POST | /api/profissionais | Criar profissional |
| PUT | /api/profissionais/:id | Atualizar profissional |
| DELETE | /api/profissionais/:id | Desativar profissional |
| GET | /api/agendamentos | Listar agendamentos (com filtros) |
| GET | /api/agendamentos/conflito | Verificar conflito de horário |
| GET | /api/agendamentos/:id | Detalhes de um agendamento |
| POST | /api/agendamentos | Criar agendamento (valida conflito) |
| PUT | /api/agendamentos/:id | Atualizar agendamento |
| DELETE | /api/agendamentos/:id | Cancelar agendamento |

---

## 7. NOTAS TÉCNICAS

- **Sem JWT/tokens:** A autenticação é simples (sem token) conforme solicitado. O estado é mantido via `localStorage`.
- **Conflito de horário:** Verificado em duas camadas — frontend (tempo real, via debounce 400ms) e backend (ao salvar).
- **Soft delete:** Clientes e profissionais desativados não aparecem nas listas mas o histórico de agendamentos é preservado.
- **Senhas:** Armazenadas em texto simples (sem hash) conforme escopo do projeto sem auth complexo.
- **Prisma vs SQL:** O script SQL (`faxina-db.sql`) pode ser usado no pgAdmin diretamente. O `seed.js` do Prisma povoa via código Node.js.
