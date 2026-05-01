# 🏥 Sistema de Gestão - Clínica

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

Este projeto é um sistema Full-Stack desenvolvido para gerenciar agendamentos de consultas e cadastro de usuários de uma clínica, resolvendo problemas de conflitos de horários e desorganização, cumprindo os requisitos da atividade avaliativa do SENAI (Desempenho).

---

## ⚙️ Pré-requisitos
Para rodar este projeto em uma máquina nova, você precisará ter instalado:
1. **[Node.js](https://nodejs.org/)** (v18 ou superior)
2. **[PostgreSQL](https://www.postgresql.org/)** (e a interface pgAdmin)

---

## 🚀 Passo a Passo para Rodar o Projeto

### Passo 1: Configurar o Banco de Dados
1. Abra o **pgAdmin** e faça o login.
2. Crie um novo banco de dados chamado **`projetinho`** (ou o nome de sua preferência).

### Passo 2: Configurar e Rodar o Back-end
Abra um terminal, navegue até a pasta raiz do projeto e siga os passos rigorosamente abaixo:

```bash
# 1. Entre na pasta do back-end
cd backend

# 2. Instale as dependências (Atenção: Utilizamos o Prisma na versão 6 para compatibilidade com o schema.prisma)
npm install
npm install prisma@6 @prisma/client@6

# 3. Configure o Banco de Dados
# Crie um arquivo chamado .env na raiz da pasta backend e insira o link de conexão abaixo
# (Lembre-se de trocar "postgres" e "123456" pelo seu usuário e senha do pgAdmin):
# DATABASE_URL="postgresql://postgres:123456@localhost/projetinho"

# 4. Sincronize o banco de dados e crie as tabelas
npx prisma db push

# 5. Inicie o servidor do back-end
npm run dev

-- Apertar Crtl + Shift + V