-- ============================================================
--  HOTEL-DB  |  Sistema de Gestão Hoteleira
-- ============================================================
-- No PostgreSQL, crie o banco com hífen entre aspas (igual ao DATABASE_URL):
--   CREATE DATABASE "hotel-db";
-- Em seguida conecte-se a esse banco e execute este script (ou use Prisma: npm run db:push).

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. USUÁRIOS E HÓSPEDES
-- ============================================================

-- Usuários (Funcionários do Hotel)
CREATE TABLE IF NOT EXISTS "Usuario" (
  "id"           SERIAL PRIMARY KEY,
  "nome"         VARCHAR(120)  NOT NULL,
  "email"        VARCHAR(120)  NOT NULL UNIQUE,
  "senha"        VARCHAR(255)  NOT NULL, 
  "perfil"       VARCHAR(20)   NOT NULL DEFAULT 'recepcionista' CHECK ("perfil" IN ('admin', 'recepcionista', 'gerente')),
  "ativo"        BOOLEAN       NOT NULL DEFAULT TRUE,
  "criadoEm"     TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm" TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- Hóspedes (Antigo Cliente)
CREATE TABLE IF NOT EXISTS "Hospede" (
  "id"           SERIAL PRIMARY KEY,
  "nome"         VARCHAR(120)  NOT NULL,
  "email"        VARCHAR(120)  UNIQUE,
  "telefone"     VARCHAR(20),
  "documento"    VARCHAR(20)   UNIQUE, -- Pode ser CPF ou Passaporte
  "endereco"     VARCHAR(255),
  "cidade"       VARCHAR(80),
  "uf"           CHAR(2),
  "observacoes"  TEXT,
  "ativo"        BOOLEAN       NOT NULL DEFAULT TRUE,
  "criadoEm"     TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm" TIMESTAMP     NOT NULL DEFAULT NOW()
);

-- ============================================================
-- 2. QUARTOS E RESERVAS
-- ============================================================

-- Quartos (Antigo Profissional)
CREATE TABLE IF NOT EXISTS "Quarto" (
  "id"           SERIAL PRIMARY KEY,
  "numero"       VARCHAR(10)   NOT NULL UNIQUE,
  "tipo"         VARCHAR(50)   NOT NULL CHECK ("tipo" IN ('Standard', 'Luxo', 'Suite', 'Master')),
  "capacidade"   INTEGER       NOT NULL DEFAULT 2,
  "valorDiaria"  NUMERIC(10,2) NOT NULL,
  "statusAtual"  VARCHAR(20)   NOT NULL DEFAULT 'disponivel' CHECK ("statusAtual" IN ('disponivel', 'manutencao', 'limpeza')),
  "ativo"        BOOLEAN       NOT NULL DEFAULT TRUE
);

-- Reservas (Antigo Agendamento)
CREATE TABLE IF NOT EXISTS "Reserva" (
  "id"             SERIAL PRIMARY KEY,
  "hospedeId"      INTEGER       NOT NULL REFERENCES "Hospede"("id") ON DELETE RESTRICT,
  "quartoId"       INTEGER       NOT NULL REFERENCES "Quarto"("id") ON DELETE RESTRICT,
  "responsavelId"  INTEGER       NOT NULL REFERENCES "Usuario"("id") ON DELETE RESTRICT, -- Quem fez/alterou a reserva
  "dataCheckIn"    DATE          NOT NULL,
  "dataCheckOut"   DATE          NOT NULL,
  "status"         VARCHAR(20)   NOT NULL DEFAULT 'confirmada' 
                                 CHECK ("status" IN ('pendente', 'confirmada', 'check_in', 'check_out', 'cancelada')),
  "valorTotal"     NUMERIC(10,2),
  "observacoes"    TEXT,
  "criadoEm"       TIMESTAMP     NOT NULL DEFAULT NOW(),
  "atualizadoEm"   TIMESTAMP     NOT NULL DEFAULT NOW(),
  CONSTRAINT chk_datas CHECK ("dataCheckOut" > "dataCheckIn")
);

-- Índice para busca rápida de disponibilidade
CREATE INDEX IF NOT EXISTS idx_reserva_datas 
  ON "Reserva" ("quartoId", "dataCheckIn", "dataCheckOut");

-- ============================================================
-- 3. AUDITORIA E RASTREABILIDADE
-- ============================================================

-- Tabela de Histórico (Log de movimentações nas reservas)
CREATE TABLE IF NOT EXISTS "HistoricoReserva" (
  "id"             SERIAL PRIMARY KEY,
  "reservaId"      INTEGER NOT NULL,
  "usuarioId"      INTEGER NOT NULL REFERENCES "Usuario"("id"),
  "acao"           VARCHAR(20) NOT NULL, -- INSERT, UPDATE, CANCELAMENTO
  "statusAntigo"   VARCHAR(20),
  "statusNovo"     VARCHAR(20),
  "dataMovimento"  TIMESTAMP NOT NULL DEFAULT NOW(),
  "detalhes"       TEXT
);

-- Função do Trigger de Auditoria
CREATE OR REPLACE FUNCTION fn_auditar_reserva()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO "HistoricoReserva" ("reservaId", "usuarioId", "acao", "statusNovo", "detalhes")
        VALUES (NEW.id, NEW."responsavelId", 'CRIACAO', NEW.status, 'Reserva criada');
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (OLD.status IS DISTINCT FROM NEW.status) THEN
            INSERT INTO "HistoricoReserva" ("reservaId", "usuarioId", "acao", "statusAntigo", "statusNovo", "detalhes")
            VALUES (NEW.id, NEW."responsavelId", 'ALTERACAO_STATUS', OLD.status, NEW.status, 'Status alterado');
        END IF;
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger de Auditoria
CREATE TRIGGER trg_auditoria_reserva
AFTER INSERT OR UPDATE ON "Reserva"
FOR EACH ROW EXECUTE FUNCTION fn_auditar_reserva();

-- ============================================================
-- 4. PREVENÇÃO DE OVERBOOKING E ALERTAS
-- ============================================================

-- Função para impedir Overbooking no mesmo quarto
CREATE OR REPLACE FUNCTION fn_prevenir_overbooking()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM "Reserva"
    WHERE "quartoId" = NEW."quartoId"
      AND "status" NOT IN ('cancelada', 'check_out')
      AND "id" <> COALESCE(NEW.id, -1)
      AND (NEW."dataCheckIn" < "dataCheckOut" AND NEW."dataCheckOut" > "dataCheckIn")
  ) THEN
    RAISE EXCEPTION 'Overbooking detectado! O quarto % já possui reserva para este período.', NEW."quartoId";
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger de Overbooking
CREATE TRIGGER trg_prevenir_overbooking
BEFORE INSERT OR UPDATE ON "Reserva"
FOR EACH ROW EXECUTE FUNCTION fn_prevenir_overbooking();

-- View para Painel de Alertas (Gestão de Disponibilidade)
-- Calcula a taxa de ocupação para os próximos 30 dias
CREATE OR REPLACE VIEW vw_alerta_ocupacao AS
WITH Dias AS (
    SELECT generate_series(CURRENT_DATE, CURRENT_DATE + interval '30 days', '1 day')::date AS data_alvo
),
TotalQuartos AS (
    SELECT COUNT(*) as total FROM "Quarto" WHERE "ativo" = TRUE AND "statusAtual" != 'manutencao'
)
SELECT 
    d.data_alvo,
    t.total AS quartos_disponiveis_total,
    COUNT(r.id) AS quartos_reservados,
    ROUND((COUNT(r.id)::numeric / NULLIF(t.total, 0)) * 100, 2) AS taxa_ocupacao_percentual,
    CASE 
        WHEN COUNT(r.id) >= t.total THEN 'ALERTA VERMELHO: Risco de Overbooking (100% Ocupado)'
        WHEN ROUND((COUNT(r.id)::numeric / NULLIF(t.total, 0)) * 100, 2) >= 80 THEN 'ALERTA AMARELO: Baixa Disponibilidade (> 80%)'
        ELSE 'NORMAL'
    END AS status_alerta
FROM Dias d
CROSS JOIN TotalQuartos t
LEFT JOIN "Reserva" r 
    ON d.data_alvo >= r."dataCheckIn" 
    AND d.data_alvo < r."dataCheckOut" 
    AND r.status NOT IN ('cancelada')
GROUP BY d.data_alvo, t.total
ORDER BY d.data_alvo;

-- ============================================================
-- 5. SEEDS (DADOS INICIAIS)
-- ============================================================

INSERT INTO "Usuario" ("nome","email","senha","perfil") VALUES
  ('Admin Hotel', 'admin@hotel.com', 'admin123', 'admin'),
  ('João Recepção', 'joao@hotel.com', 'joao123', 'recepcionista')
ON CONFLICT ("email") DO NOTHING;

INSERT INTO "Quarto" ("numero", "tipo", "capacidade", "valorDiaria") VALUES
  ('101', 'Standard', 2, 150.00),
  ('102', 'Standard', 2, 150.00),
  ('201', 'Luxo', 3, 250.00),
  ('301', 'Suite', 4, 400.00)
ON CONFLICT ("numero") DO NOTHING;

INSERT INTO "Hospede" ("nome","email","telefone","documento","cidade","uf") VALUES
  ('Carlos Silva', 'carlos@email.com', '(48) 99999-0001', '111.222.333-44', 'São Paulo', 'SP'),
  ('Marina Costa', 'marina@email.com', '(48) 99999-0002', '555.666.777-88', 'Curitiba', 'PR')
ON CONFLICT ("documento") DO NOTHING;

-- View Geral para o Frontend (Intuitiva para o usuário)
CREATE OR REPLACE VIEW vw_gestao_reservas AS
SELECT
  r."id" AS reserva_id,
  h."nome" AS hospede,
  q."numero" AS quarto,
  q."tipo" AS tipo_quarto,
  r."dataCheckIn",
  r."dataCheckOut",
  r."status",
  r."valorTotal",
  u."nome" AS responsavel_registro
FROM "Reserva" r
JOIN "Hospede" h ON h."id" = r."hospedeId"
JOIN "Quarto" q ON q."id" = r."quartoId"
JOIN "Usuario" u ON u."id" = r."responsavelId";