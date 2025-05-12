//bd.sql

-- =========================================
-- Base de datos para gestión de juzgado
-- =========================================


-- 1. Crear base de datos

CREATE TABLE password_reset_token (
  id SERIAL PRIMARY KEY,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE
);


-- =========================================
-- 2. Catálogos y tablas maestras
-- =========================================

-- Tabla de Roles
CREATE TABLE rol (
    id_rol            VARCHAR(50) PRIMARY KEY  -- p.ej. 'Administrador', 'Juez', etc.
);

INSERT INTO rol (id_rol) VALUES 
  ('Administrador'),
  ('Juez'),
  ('Secretario'),
  ('Abogado'),
  ('Funcionario'),
  ('Cliente');

-- =========================================
-- 3. Usuarios y sus roles
-- =========================================

-- Tabla Usuarios
CREATE TABLE usuario (
    id_usuario        SERIAL PRIMARY KEY,
    nombre            VARCHAR(100) NOT NULL,
    apellido          VARCHAR(100) NOT NULL,
    correo            VARCHAR(100) UNIQUE NOT NULL,
    password_hash     VARCHAR(60) NOT NULL,         -- almacenar sólo hash (bcrypt, Argon2, etc.)
    telefono          VARCHAR(20),
    calle             VARCHAR(150),
    ciudad            VARCHAR(100),
    codigo_postal     VARCHAR(20),
    estado_usuario    VARCHAR(10) CHECK (estado_usuario IN ('Activo','Inactivo')) NOT NULL DEFAULT 'Activo',
    fecha_registro    TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia Usuario–Rol (para roles múltiples)
CREATE TABLE usuario_rol (
    id_usuario        INT    NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
    id_rol            VARCHAR(50) NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT,
    PRIMARY KEY (id_usuario, id_rol)
);


-- =========================================
-- 4. Entidades Externas (p.ej. testigos no registrados)
-- =========================================

CREATE TABLE entidad_externa (
    id_entidad        SERIAL PRIMARY KEY,
    nombre            VARCHAR(200) NOT NULL,
    tipo_entidad      VARCHAR(50) CHECK (tipo_entidad IN ('Testigo','Perito','Otro')) NOT NULL
);

-- =========================================
-- 5. Expedientes y su historial de estados
-- =========================================

CREATE TABLE expediente (
    id_expediente     SERIAL PRIMARY KEY,
    numero_expediente VARCHAR(50) UNIQUE NOT NULL,
    descripcion       TEXT,
    fecha_creacion    DATE NOT NULL,
    fecha_cierre      DATE,  -- se llena al pasar a 'Cerrado'
    estado_actual     VARCHAR(20) CHECK (estado_actual IN ('Abierto','En proceso','Cerrado')) NOT NULL DEFAULT 'Abierto',
    id_usuario_creador INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    id_juez_responsable INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Historial de estados del expediente
CREATE TABLE expediente_estado_historial (
    id_historial      SERIAL PRIMARY KEY,
    id_expediente     INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
    estado_anterior   VARCHAR(20) NOT NULL,
    estado_nuevo      VARCHAR(20) NOT NULL,
    fecha_cambio      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- =========================================
-- 6. Audiencias
-- =========================================

CREATE TABLE audiencia (
    id_audiencia      SERIAL PRIMARY KEY,
    id_expediente     INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
    fecha             TIMESTAMP NOT NULL,
    duracion          INTERVAL,
    ubicacion         VARCHAR(255),
    estado            VARCHAR(20) CHECK (estado IN ('Pendiente','Realizada','Cancelada')) NOT NULL DEFAULT 'Pendiente',
    id_juez           INT REFERENCES usuario(id_usuario) ON DELETE RESTRICT
    observacion       TEXT
);

-- =========================================
-- 7. Partes involucradas
-- =========================================

CREATE TABLE parte_involucrada (
    id_parte          SERIAL PRIMARY KEY,
    id_expediente     INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    id_entidad        INT REFERENCES entidad_externa(id_entidad) ON DELETE SET NULL,
    tipo_parte        VARCHAR(20) CHECK (tipo_parte IN ('Demandante','Demandado','Testigo','Perito')) NOT NULL,
    CONSTRAINT chk_parte_entidad_usuario
      CHECK (
        (tipo_parte IN ('Testigo','Perito') AND id_entidad IS NOT NULL AND id_usuario IS NULL)
        OR
        (tipo_parte IN ('Demandante','Demandado') AND id_usuario IS NOT NULL AND id_entidad IS NULL)
      )
);

-- =========================================
-- 8. Documentos y versionado
-- =========================================

-- Tabla principal de documentos (metadatos)
CREATE TABLE documento (
    id_documento      SERIAL PRIMARY KEY,
    titulo            VARCHAR(255) NOT NULL,
    filename          VARCHAR(255) NOT NULL,       -- nombre original + extensión
    contenido         BYTEA,                        -- binario PDF, Word, etc.
    tipo_documento    VARCHAR(20) CHECK (tipo_documento IN ('Sentencia','Informe','Memorial','Resolución','Otro')) NOT NULL,
    fecha_subida      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    firma_digital     BOOLEAN NOT NULL DEFAULT FALSE,
    id_expediente     INT REFERENCES expediente(id_expediente) ON DELETE SET NULL,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Documentos versionados
CREATE TABLE documento_version (
    id_version        SERIAL PRIMARY KEY,
    id_documento      INT NOT NULL REFERENCES documento(id_documento) ON DELETE CASCADE,
    numero_version    INT NOT NULL,
    contenido         BYTEA NOT NULL,
    fecha_version     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    comentario        TEXT
);

CREATE UNIQUE INDEX ux_documento_version ON documento_version(id_documento, numero_version);

-- =========================================
-- 9. Memoriales y Trámites
-- =========================================

CREATE TABLE memorial (
    id_memorial       SERIAL PRIMARY KEY,
    titulo            VARCHAR(255) NOT NULL,
    descripcion       TEXT,
    fecha_presentacion DATE NOT NULL,
    estado            VARCHAR(20) CHECK (estado IN ('Pendiente','Aceptado','Rechazado')) NOT NULL DEFAULT 'Pendiente',
    id_expediente     INT REFERENCES expediente(id_expediente) ON DELETE SET NULL,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE tramite (
    id_tramite        SERIAL PRIMARY KEY,
    descripcion       TEXT,
    fecha_creacion    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    id_expediente     INT REFERENCES expediente(id_expediente) ON DELETE SET NULL
);

-- =========================================
-- 10. Reportes
-- =========================================

CREATE TABLE reporte (
    id_reporte        SERIAL PRIMARY KEY,
    tipo              VARCHAR(50) NOT NULL,
    contenido         TEXT NOT NULL,
    fecha             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- =========================================
-- 11. Auditoría automática via triggers
-- =========================================

-- Tabla de auditoría de acciones
CREATE TABLE auditoria (
    id_auditoria      SERIAL PRIMARY KEY,
    tabla_afectada    VARCHAR(100) NOT NULL,
    id_registro       TEXT,                      -- pk del registro afectado
    accion            VARCHAR(50) NOT NULL,       -- INSERT, UPDATE, DELETE
    datos_antes       JSONB,                     -- datos previos (para UPDATE/DELETE)
    datos_despues     JSONB,                     -- datos nuevos  (para INSERT/UPDATE)
    id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
    fecha             TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


-- =========================================
-- Fin del script
-- =========================================
