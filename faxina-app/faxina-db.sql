-- ============================================================
--  FAXINA-DB  |  Sistema de Gestão para Empresa de Limpeza
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Usuários
CREATE TABLE IF NOT EXISTS "Usuario" (
  "id"           SERIAL PRIMARY KEY,
  "nome"         VARCHAR(120)  NOT NULL,
  "email"        VARCHAR(120)  NOT NULL UNIQUE,
  "senha"        VARCHAR(255)  NOT NULL, 
  "perfil"       VARCHAR(20)   NOT NULL DEFAULT 'atendente',
  "ativo"        BOOLEAN       NOT NULL DEFAULT TRUE,
  "criadoEm"     TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm" TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Clientes (Aumentado para VARCHAR(20) para suportar CNPJ formatado)
CREATE TABLE IF NOT EXISTS "Cliente" (
  "id"           SERIAL PRIMARY KEY,
  "nome"         VARCHAR(120)  NOT NULL,
  "email"        VARCHAR(120)  UNIQUE,
  "telefone"     VARCHAR(20),
  "cpf"          VARCHAR(20)   UNIQUE, -- Aumentado de 14 para 20
  "endereco"     VARCHAR(255),
  "cidade"       VARCHAR(80),
  "uf"           CHAR(2),
  "observacoes"  TEXT,
  "ativo"        BOOLEAN       NOT NULL DEFAULT TRUE,
  "criadoEm"     TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm" TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Profissionais
CREATE TABLE IF NOT EXISTS "Profissional" (
  "id"              SERIAL PRIMARY KEY,
  "nome"            VARCHAR(120)  NOT NULL,
  "email"           VARCHAR(120)  UNIQUE,
  "telefone"        VARCHAR(20),
  "cpf"             VARCHAR(20)   UNIQUE, -- Aumentado para segurança
  "especialidades"  TEXT,
  "ativo"           BOOLEAN       NOT NULL DEFAULT TRUE,
  "criadoEm"        TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm"    TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Agendamentos
CREATE TABLE IF NOT EXISTS "Agendamento" (
  "id"             SERIAL PRIMARY KEY,
  "clienteId"      INTEGER       NOT NULL REFERENCES "Cliente"("id") ON DELETE RESTRICT,
  "profissionalId" INTEGER       NOT NULL REFERENCES "Profissional"("id") ON DELETE RESTRICT,
  "tipoServico"    VARCHAR(20)   NOT NULL CHECK ("tipoServico" IN ('residencial','comercial','posObra','manutencao')),
  "dataHoraInicio" TIMESTAMP     NOT NULL,
  "dataHoraFim"    TIMESTAMP     NOT NULL,
  "status"         VARCHAR(20)   NOT NULL DEFAULT 'agendado'
                                 CHECK ("status" IN ('agendado','em_andamento','concluido','cancelado')),
  "endereco"       VARCHAR(255),
  "valorTotal"     NUMERIC(10,2),
  "observacoes"    TEXT,
  "criadoEm"       TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm"   TIMESTAMP     NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_horario CHECK ("dataHoraFim" > "dataHoraInicio")
);

-- Índice
CREATE INDEX IF NOT EXISTS idx_agendamento_profissional_horario
  ON "Agendamento" ("profissionalId", "dataHoraInicio", "dataHoraFim");

-- Função de Conflito
CREATE OR REPLACE FUNCTION fn_conflito_agendamento(
  p_profissional_id INTEGER,
  p_inicio           TIMESTAMP,
  p_fim              TIMESTAMP,
  p_excluir_id       INTEGER DEFAULT NULL
) RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM "Agendamento"
    WHERE "profissionalId" = p_profissional_id
      AND "status" NOT IN ('cancelado')
      AND ("id" <> COALESCE(p_excluir_id, -1))
      AND (
           p_inicio  < "dataHoraFim"
        AND p_fim    > "dataHoraInicio"
      )
  );
$$ LANGUAGE SQL STABLE;

-- ─────────────────────────────────────────────────────────────
-- SEEDS (DADOS INICIAIS)
-- ─────────────────────────────────────────────────────────────

INSERT INTO "Usuario" ("nome","email","senha","perfil") VALUES
  ('Administrador', 'admin@faxina.com', 'admin123', 'admin'),
  ('Ana Atendente', 'ana@faxina.com', 'ana123', 'atendente')
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Profissional" ("nome","email","telefone","cpf","especialidades") VALUES
  ('Maria da Silva', 'maria@faxina.com', '(48) 99101-0001', '111.222.333-01', 'Residencial, Pós-obra'),
  ('João Ferreira', 'joao@faxina.com', '(48) 99101-0002', '111.222.333-02', 'Comercial, Industrial')
ON CONFLICT ("cpf") DO NOTHING;

INSERT INTO "Cliente" ("nome","email","telefone","cpf","endereco","cidade","uf") VALUES
  ('Empresa ABC Ltda', 'contato@abc.com', '(48) 3333-0001', '12.345.678/0001-99', 'Rua das Flores, 100', 'Florianópolis', 'SC'),
  ('Roberto Oliveira', 'roberto@email.com', '(48) 99200-0001', '222.333.444-01', 'Av. Central, 250, Apto 3', 'Tubarão', 'SC'),
  ('Clínica SaudaVida', 'admin@saudavida.com', '(48) 3333-0002', '98.765.432/0001-11', 'Rua dos Médicos, 45', 'Criciúma', 'SC')
ON CONFLICT ("cpf") DO NOTHING;

-- View
CREATE OR REPLACE VIEW vw_agenda AS
SELECT
  a."id",
  c."nome" AS cliente,
  p."nome" AS profissional,
  a."tipoServico",
  a."dataHoraInicio",
  a."dataHoraFim",
  a."status",
  a."valorTotal"
FROM "Agendamento" a
JOIN "Cliente" c ON c."id" = a."clienteId"
JOIN "Profissional" p ON p."id" = a."profissionalId";