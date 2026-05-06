# 🧹 SparkClean — Sistema de Gestão de Faxina

Interface moderna e completa para gerenciar agendamentos, clientes e profissionais de limpeza.

---

## 🚀 Como Rodar o Projeto (passo a passo)

### ✅ Pré-requisitos — instale antes de tudo

| O que instalar | Link |
|---|---|
| **Node.js 18+** | https://nodejs.org (baixe a versão LTS) |
| **PostgreSQL 15+** | https://www.postgresql.org/download |
| **pgAdmin 4** | https://www.pgadmin.org/download |

> Depois de instalar o Node.js, abra o terminal e verifique:
> ```bash
> node -v   # deve mostrar v18 ou superior
> npm -v    # deve mostrar 9 ou superior
> ```

---

### 🗄️ Passo 1 — Criar o banco de dados no pgAdmin

1. Abra o **pgAdmin 4** e conecte ao servidor PostgreSQL local.
2. No painel esquerdo, clique com botão direito em **Databases → Create → Database**.
3. No campo **Database**, digite: `faxina-db` → clique em **Save**.
4. Clique com botão direito no banco `faxina-db` → **Query Tool**.
5. No editor que abrir, **copie e cole todo o conteúdo** do arquivo `faxina-db.sql`.
6. Clique no botão ▶ **Execute** (ou pressione `F5`).
7. Você verá as tabelas e dados criados na aba "Messages".

---

### ⚙️ Passo 2 — Configurar e iniciar o Backend

Abra um terminal (Prompt de Comando, PowerShell ou Terminal):

```bash
# Entre na pasta do backend
cd faxina-app/backend

# Copie o arquivo de configuração
cp .env.example .env
```

Agora **abra o arquivo `.env`** em qualquer editor de texto e edite a linha:
```
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/faxina-db"
```
Substitua `SUA_SENHA` pela senha que você definiu ao instalar o PostgreSQL.

Depois, de volta no terminal:

```bash
# Instale as dependências do projeto
npm install

# Gere o cliente do Prisma (ORM)
npx prisma generate

# Sincronize o schema com o banco
npx prisma db push

# Popule o banco com dados de exemplo
npm run db:seed

# Inicie o servidor
npm run dev
```

Se tudo correu bem, você verá:
```
🚀 Servidor rodando em http://localhost:3001
```

> 💡 **Dica:** Deixe este terminal aberto. O backend precisa estar rodando.

---

### 🎨 Passo 3 — Iniciar o Frontend

Abra **um segundo terminal** (sem fechar o primeiro):

```bash
# Entre na pasta do frontend
cd faxina-app/frontend

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev
```

Você verá:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**Acesse no navegador:** http://localhost:5173

---

### 🔑 Credenciais de acesso

| E-mail | Senha | Perfil |
|---|---|---|
| admin@faxina.com | admin123 | Administrador |
| ana@faxina.com | ana123 | Atendente |
| carlos@faxina.com | carlos123 | Supervisor |

---

## 📁 Estrutura do Projeto

```
faxina-app/
├── faxina-db.sql          ← Script SQL (banco + tabelas + dados)
├── docs/
│   └── DOCUMENTACAO.md   ← Requisitos, casos de teste, endpoints
├── backend/               ← API Node.js + Express + Prisma
│   ├── .env.example       ← Configuração (copiar para .env)
│   ├── package.json
│   ├── prisma/
│   │   ├── schema.prisma  ← Modelos do banco
│   │   └── seed.js        ← Dados de exemplo
│   └── src/
│       ├── index.js       ← Servidor principal
│       └── routes/        ← auth, clientes, profissionais, agendamentos
└── frontend/              ← React + Tailwind CSS + Vite
    └── src/
        ├── pages/         ← Login, Dashboard, Agendamentos, Clientes, Profissionais
        ├── components/    ← Layout, Toast, ConfirmDialog
        ├── context/       ← AuthContext (sessão do usuário)
        └── services/      ← api.js (chamadas HTTP)
```

---

## 🛠️ Comandos úteis

### Backend
```bash
npm run dev          # Inicia com hot-reload
npm run db:seed      # Repovoar banco (apaga e recria os dados)
npm run db:studio    # Abre interface visual do Prisma no navegador
npx prisma db push   # Sincroniza schema sem migrations
```

### Frontend
```bash
npm run dev          # Modo desenvolvimento
npm run build        # Gera versão de produção em /dist
npm run preview      # Pré-visualiza a build de produção
```

---

## ❓ Problemas comuns

**"Cannot connect to database"**
→ Verifique se o PostgreSQL está rodando e se a senha no `.env` está correta.

**"Port 3001 already in use"**
→ Algum outro processo está usando a porta. Encerre-o ou mude `PORT=3002` no `.env`.

**"prisma generate" falha**
→ Execute `npm install` primeiro para garantir que o pacote `prisma` está instalado.

**Página em branco no frontend**
→ Confirme que o backend está rodando em `http://localhost:3001` antes de abrir o frontend.
