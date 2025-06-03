-- =========================================
-- Base de datos para gestión de juzgado
-- =========================================

-- ================================
-- 1. Catálogos y tipos ENUM globales
-- ================================

-- Tipo ENUM para estado de usuario
CREATE TYPE public.enum_usuario_estado_usuario AS ENUM (
  'Activo',
  'Inactivo'
);

-- Tipo ENUM para estado actual del expediente
CREATE TYPE public.enum_expediente_estado_actual AS ENUM (
  'Abierto',
  'En proceso',
  'Cerrado'
);

-- Tipo ENUM para estado de la audiencia
CREATE TYPE public.enum_audiencia_estado AS ENUM (
  'Pendiente',
  'Realizada',
  'Cancelada'
);

-- Tipo ENUM para estado de un memorial
CREATE TYPE public.enum_memorial_estado AS ENUM (
  'Pendiente',
  'Aceptado',
  'Rechazado'
);

-- ================================
-- 2. Catálogos y tablas maestras
-- ================================

-- Tabla de Roles
CREATE TABLE rol (
  id_rol VARCHAR(50) PRIMARY KEY  -- p. ej. 'admin', 'juez', 'abogado', 'cliente'
);

INSERT INTO rol (id_rol) VALUES
  ('admin'),
  ('juez'),
  ('abogado'),
  ('cliente');


-- =========================================
-- 3. Usuarios y sus roles
-- =========================================

-- Tabla Usuarios, usando ENUM para estado_usuario
CREATE TABLE usuario (
  id_usuario      SERIAL PRIMARY KEY,
  nombre          VARCHAR(100) NOT NULL,
  apellido        VARCHAR(100) NOT NULL,
  correo          VARCHAR(100) UNIQUE NOT NULL,
  password_hash   VARCHAR(60) NOT NULL,        -- almacenar solo hash (bcrypt, Argon2, etc.)
  telefono        VARCHAR(20),
  calle           VARCHAR(150),
  ciudad          VARCHAR(100),
  codigo_postal   VARCHAR(20),
  estado_usuario  public.enum_usuario_estado_usuario NOT NULL DEFAULT 'Activo',
  fecha_registro  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tabla intermedia Usuario–Rol (para asignar múltiples roles)
CREATE TABLE usuario_rol (
  id_usuario INT NOT NULL REFERENCES usuario(id_usuario) ON DELETE CASCADE,
  id_rol     VARCHAR(50) NOT NULL REFERENCES rol(id_rol) ON DELETE RESTRICT,
  PRIMARY KEY (id_usuario, id_rol)
);

-- Tabla de tokens para restablecer contraseña
CREATE TABLE password_reset_token (
  id         SERIAL PRIMARY KEY,
  token      VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  id_usuario INT REFERENCES usuario(id_usuario) ON DELETE CASCADE
);

-- =========================================
-- 4. Entidades Externas (p. ej. testigos no registrados)
-- =========================================

CREATE TABLE entidad_externa (
  id_entidad   SERIAL PRIMARY KEY,
  nombre       VARCHAR(200) NOT NULL,
  tipo_entidad VARCHAR(50)
    CHECK (tipo_entidad IN ('Testigo', 'Perito', 'Otro'))
    NOT NULL
);

-- =========================================
-- 5. Expedientes y su historial de estados
-- =========================================

-- Tabla Expediente, usando ENUM para estado_actual
CREATE TABLE expediente (
  id_expediente       SERIAL PRIMARY KEY,
  numero_expediente   VARCHAR(50) UNIQUE NOT NULL,
  descripcion         TEXT,
  fecha_creacion      DATE NOT NULL,
  fecha_cierre        DATE,  -- se llena al pasar a 'Cerrado'
  estado_actual       public.enum_expediente_estado_actual NOT NULL DEFAULT 'Abierto',
  id_usuario_creador  INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  id_juez_responsable INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Historial de estados del expediente
CREATE TABLE expediente_estado_historial (
  id_historial    SERIAL PRIMARY KEY,
  id_expediente   INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
  estado_anterior VARCHAR(20) NOT NULL,
  estado_nuevo    VARCHAR(20) NOT NULL,
  fecha_cambio    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario      INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- =========================================
-- 6. Audiencias
-- =========================================

-- Tabla Audiencia, usando ENUM para estado
CREATE TABLE audiencia (
  id_audiencia  SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
  fecha         TIMESTAMP NOT NULL,
  duracion      INTERVAL,
  ubicacion     VARCHAR(255),
  estado        public.enum_audiencia_estado NOT NULL DEFAULT 'Pendiente',
  id_juez       INT REFERENCES usuario(id_usuario) ON DELETE RESTRICT,
  observacion   TEXT
);

-- =========================================
-- 7. Partes involucradas
-- =========================================

CREATE TABLE parte_involucrada (
  id_parte      SERIAL PRIMARY KEY,
  id_expediente INT NOT NULL REFERENCES expediente(id_expediente) ON DELETE CASCADE,
  id_usuario    INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  id_entidad    INT REFERENCES entidad_externa(id_entidad) ON DELETE SET NULL,
  tipo_parte    VARCHAR(20) NOT NULL
    CHECK (tipo_parte IN ('Demandante', 'Demandado', 'Testigo', 'Perito')),
  CONSTRAINT chk_parte_entidad_usuario
    CHECK (
      (tipo_parte IN ('Testigo', 'Perito') AND id_entidad IS NOT NULL AND id_usuario IS NULL)
      OR
      (tipo_parte IN ('Demandante', 'Demandado') AND id_usuario IS NOT NULL AND id_entidad IS NULL)
    )
);

-- =========================================
-- 8. Documentos y versionado
-- =========================================

-- Tabla principal de documentos (metadatos)
CREATE TABLE documento (
  id_documento   SERIAL PRIMARY KEY,
  titulo         VARCHAR(255) NOT NULL,
  filename       VARCHAR(255) NOT NULL,  -- nombre original + extensión
  contenido      BYTEA,                  -- binario PDF, Word, etc.
  tipo_documento VARCHAR(20) NOT NULL
    CHECK (tipo_documento IN ('Sentencia', 'Informe', 'Memorial', 'Resolución', 'Otro')),
  fecha_subida   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  firma_digital  BOOLEAN NOT NULL DEFAULT FALSE,
  id_expediente  INT REFERENCES expediente(id_expediente) ON DELETE SET NULL,
  id_usuario     INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- Documentos versionados
CREATE TABLE documento_version (
  id_version     SERIAL PRIMARY KEY,
  id_documento   INT NOT NULL REFERENCES documento(id_documento) ON DELETE CASCADE,
  numero_version INT NOT NULL,
  contenido      BYTEA NOT NULL,
  fecha_version  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comentario     TEXT
);

CREATE UNIQUE INDEX ux_documento_version
  ON documento_version(id_documento, numero_version);

-- =========================================
-- 9. Memoriales y Trámites
-- =========================================

-- Tabla Memorial, usando ENUM para estado
CREATE TABLE memorial (
  id_memorial       SERIAL PRIMARY KEY,
  titulo            VARCHAR(255) NOT NULL,
  descripcion       TEXT,
  fecha_presentacion DATE NOT NULL,
  estado            public.enum_memorial_estado NOT NULL DEFAULT 'Pendiente',
  id_expediente     INT REFERENCES expediente(id_expediente) ON DELETE SET NULL,
  id_usuario        INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

CREATE TABLE tramite (
  id_tramite     SERIAL PRIMARY KEY,
  descripcion    TEXT,
  fecha_creacion TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario     INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  id_expediente  INT REFERENCES expediente(id_expediente) ON DELETE SET NULL
);

-- =========================================
-- 10. Reportes
-- =========================================

CREATE TABLE reporte (
  id_reporte  SERIAL PRIMARY KEY,
  tipo        VARCHAR(50) NOT NULL,
  contenido   TEXT NOT NULL,
  fecha       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  id_usuario  INT REFERENCES usuario(id_usuario) ON DELETE SET NULL
);

-- =========================================
-- 11. Auditoría automática via triggers
-- =========================================

CREATE TABLE auditoria (
  id_auditoria  SERIAL PRIMARY KEY,
  tabla_afectada VARCHAR(100) NOT NULL,
  id_registro    TEXT,                      -- PK del registro afectado
  accion         VARCHAR(50) NOT NULL,       -- INSERT, UPDATE, DELETE
  datos_antes    JSONB,                     -- datos previos (para UPDATE/DELETE)
  datos_despues  JSONB,                     -- datos nuevos (para INSERT/UPDATE)
  id_usuario     INT REFERENCES usuario(id_usuario) ON DELETE SET NULL,
  fecha          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- 12. Datos iniciales
-- =========================================

-- Inserts iniciales en tabla usuario
INSERT INTO usuario (nombre, apellido, correo, password_hash, estado_usuario, fecha_registro)
VALUES
  ('Ernesto', 'Lumbreras',    'admin1@gmail.com',   '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Angélica', 'Araujo',      'admin2@gmail.com',   '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Jerónimo', 'Trillo',      'juez1@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Lázaro',    'Feliu',       'juez2@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Gracia',    'Tolosa',      'juez3@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Arsenio',   'Bou',         'juez4@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Gema',      'Serrano',     'juez5@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('María Del Carmen', 'Samper','juez6@gmail.com',   '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Milagros',  'Murillo',     'juez7@gmail.com',    '$2b$12$vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Fortunata', 'Mateu',       'juez8@gmail.com',    '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Carlito',   'Torralba',    'juez9@gmail.com',    '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Nazario',   'Cerezo',      'juez10@gmail.com',   '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Áurea',     'Alemán',      'abogado1@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Leocadia',  'Pelayo',      'abogado2@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Ana Belén', 'Peñas',       'abogado3@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Josefa',    'Lago',        'abogado4@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Macarena',  'Sevilla',     'abogado5@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Anna',      'Luján',       'abogado6@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Moisés',    'Cornejo',     'abogado7@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Tito',      'Mayo',        'abogado8@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Martina',   'Blanco',      'abogado9@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Bonifacio', 'Vergara',     'abogado10@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Catalina',  'Noguera',     'cliente1@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Borja',     'Casado',      'cliente2@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Berta',     'Exposito',    'cliente3@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Iván',      'Jaén',        'cliente4@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Maura',     'Segura',      'cliente5@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Amado',     'Batalla',     'cliente6@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Seve',      'Otero',       'cliente7@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Luciana',   'Marti',       'cliente8@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Arsenio',   'Losa',        'cliente9@gmail.com', '$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Amarilis',  'Barón',       'cliente10@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Dorita',    'Ruano',       'cliente11@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Alex',      'Hernández',   'cliente12@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Álvaro',    'Valderrama',  'cliente13@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Nadia',     'Cabañas',     'cliente14@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Apolonia',  'Blazquez',    'cliente15@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Otilia',    'Barreda',     'cliente16@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Remedios',  'Feijoo',      'cliente17@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Jordana',   'Urrutia',     'cliente18@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Nieves',    'Botella',     'cliente19@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Pastora',   'Bustamante',  'cliente20@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Consuela',  'Solsona',     'cliente21@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Fortunata', 'Ledesma',     'cliente22@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Alejandra', 'Lago',        'cliente23@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Teobaldo',  'Rico',        'cliente24@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Rodolfo',   'Belda',       'cliente25@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Horacio',   'Tamayo',      'cliente26@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Narciso',   'Guardia',     'cliente27@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Abilio',    'Almagro',     'cliente28@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Esther',    'Portillo',    'cliente29@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP),
  ('Amílcar',   'Melero',      'cliente30@gmail.com','$2b$12\vELnsQ..yURMsfvUM94g3uXhokXLqfRxq9FhE6t8ffPawAQ7BL9vq', 'Activo', CURRENT_TIMESTAMP);

-- Inserts para la relación usuario_rol
INSERT INTO usuario_rol (id_usuario, id_rol)
VALUES
  ((SELECT id_usuario FROM usuario WHERE correo = 'admin1@gmail.com'), 'admin'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'admin2@gmail.com'), 'admin'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez1@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez2@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez3@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez4@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez5@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez6@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez7@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez8@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez9@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'juez10@gmail.com'), 'juez'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado1@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado2@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado3@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado4@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado5@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado6@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado7@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado8@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado9@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'abogado10@gmail.com'), 'abogado'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente1@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente2@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente3@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente4@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente5@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente6@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente7@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente8@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente9@gmail.com'),  'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente10@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente11@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente12@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente13@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente14@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente15@gmail.com'), 'cliente'),
  ((SELECT id_usuario	 FROM usuario WHERE correo = 'cliente16@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente17@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente18@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente19@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente20@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente21@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente22@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente23@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente24@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente25@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente26@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente27@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente28@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente29@gmail.com'), 'cliente'),
  ((SELECT id_usuario FROM usuario WHERE correo = 'cliente30@gmail.com'), 'cliente');
