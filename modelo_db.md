# Modelo Entidad–Relación (ER): Usuarios, Skills, Iniciativas (Ideas/Proyectos) y Matching por Perfil

Este documento define un **modelo ER** para:
- Gestionar **usuarios** y sus **skills** (con nivel/experiencia).
- Permitir que **cualquier usuario** cree **ideas o proyectos** (aquí llamados **iniciativas**).
- Permitir **comentarios** sobre iniciativas para “madurar” la idea/proyecto (con hilos).
- Definir **perfiles requeridos** por iniciativa.
- Definir **skills requeridos** por perfil (con pesos, mínimos y obligatoriedad).
- Habilitar la **búsqueda del usuario más adecuado** para un perfil según sus skills.

---

## 1) Alcance y decisiones de diseño

### 1.1 Unificación Idea/Proyecto
Se usa una sola entidad **INICIATIVA** con un atributo `tipo`:
- `IDEA`
- `PROYECTO`

Esto simplifica consultas, comentarios, perfiles y matching.

### 1.2 Skills con atributos
La relación usuario-skill necesita atributos como:
- nivel
- años de experiencia

Por eso se usa una tabla puente **USUARIO_SKILL** (N:M con atributos).

### 1.3 Perfiles requeridos con skill weighting
Un perfil requerido tiene skills con:
- peso de importancia
- nivel mínimo (opcional)
- si es obligatorio (hard requirement)

Por eso se usa **PERFIL_SKILL_REQUERIDO**.

---

## 2) Entidades y atributos

### 2.1 USUARIO
**Propósito:** representar personas del sistema.

**Campos sugeridos:**
- `id_usuario` (PK)
- `nombre`
- `email`
- `bio` (opcional)
- `seniority` (opcional)
- `disponibilidad` (opcional)
- `activo` (bool)
- `created_at`

---

### 2.2 SKILL
**Propósito:** catálogo normalizado de skills.

**Campos sugeridos:**
- `id_skill` (PK)
- `nombre`
- `categoria` (opcional)

---

### 2.3 USUARIO_SKILL (Tabla puente N:M + atributos)
**Propósito:** asociar skills a usuarios con nivel/experiencia.

**Campos sugeridos:**
- `id_usuario` (PK, FK → USUARIO)
- `id_skill` (PK, FK → SKILL)
- `nivel` (ej: 1–5 o 1–10)
- `anios_experiencia` (opcional)
- `evidencia_url` (opcional)
- `last_updated_at`

---

### 2.4 INICIATIVA (Idea/Proyecto)
**Propósito:** representar ideas o proyectos creados por usuarios.

**Campos sugeridos:**
- `id_iniciativa` (PK)
- `tipo` (IDEA|PROYECTO)
- `titulo`
- `descripcion`
- `estado` (ej: BORRADOR | VALIDANDO | EN_EJECUCION | CERRADO)
- `created_by` (FK → USUARIO)
- `created_at`

---

### 2.5 INICIATIVA_PARTICIPANTE (Opcional, recomendado)
**Propósito:** registrar participación de usuarios en una iniciativa (colaboradores, mentors, etc.).

**Campos sugeridos:**
- `id_iniciativa` (PK, FK → INICIATIVA)
- `id_usuario` (PK, FK → USUARIO)
- `rol` (OWNER | COLABORADOR | MENTOR, etc.)
- `joined_at`

---

### 2.6 COMENTARIO
**Propósito:** permitir comentarios para madurar iniciativas, soportando hilos.

**Campos sugeridos:**
- `id_comentario` (PK)
- `id_iniciativa` (FK → INICIATIVA)
- `id_usuario` (FK → USUARIO) *(autor del comentario)*
- `contenido`
- `created_at`
- `parent_id` (FK → COMENTARIO, nullable) *(para responder otro comentario)*

---

### 2.7 PERFIL_REQUERIDO
**Propósito:** definir perfiles necesarios para una iniciativa (roles / perfiles a cubrir).

**Campos sugeridos:**
- `id_perfil` (PK)
- `id_iniciativa` (FK → INICIATIVA)
- `nombre_perfil` (ej: Backend, Data Analyst, UX)
- `descripcion`
- `cantidad` (número de personas requeridas)
- `prioridad` (1–5)
- `estado` (ABIERTO | CUBIERTO | PAUSADO)

---

### 2.8 PERFIL_SKILL_REQUERIDO (Tabla puente N:M + atributos)
**Propósito:** definir skills requeridos por perfil con pesos mínimos y obligatoriedad.

**Campos sugeridos:**
- `id_perfil` (PK, FK → PERFIL_REQUERIDO)
- `id_skill` (PK, FK → SKILL)
- `peso` (0–1 o 1–100)
- `nivel_minimo` (opcional)
- `obligatorio` (bool)

---

## 3) Relaciones y cardinalidades

- **USUARIO (1) — (N) INICIATIVA**
  - Un usuario puede crear muchas iniciativas.
  - Una iniciativa tiene un creador (`created_by`).

- **USUARIO (N) — (M) SKILL** vía **USUARIO_SKILL**
  - Un usuario tiene muchos skills, y un skill puede pertenecer a muchos usuarios.

- **INICIATIVA (1) — (N) COMENTARIO**
  - Una iniciativa recibe muchos comentarios.

- **USUARIO (1) — (N) COMENTARIO**
  - Un usuario puede escribir muchos comentarios.

- **INICIATIVA (1) — (N) PERFIL_REQUERIDO**
  - Una iniciativa puede requerir varios perfiles.

- **PERFIL_REQUERIDO (N) — (M) SKILL** vía **PERFIL_SKILL_REQUERIDO**
  - Un perfil requiere varios skills y un skill se requiere en varios perfiles.

- *(Opcional)* **INICIATIVA (N) — (M) USUARIO** vía **INICIATIVA_PARTICIPANTE**
  - Usuarios pueden participar en iniciativas con roles.

---

## 4) Diagrama ER (Mermaid)

> Pega este bloque en un visor Mermaid.

```mermaid
erDiagram
  USUARIO {
    int id_usuario PK
    string nombre
    string email
    string bio
    string seniority
    string disponibilidad
    boolean activo
    datetime created_at
  }

  SKILL {
    int id_skill PK
    string nombre
    string categoria
  }

  USUARIO_SKILL {
    int id_usuario PK, FK
    int id_skill PK, FK
    int nivel
    int anios_experiencia
    string evidencia_url
    datetime last_updated_at
  }

  INICIATIVA {
    int id_iniciativa PK
    string tipo  "IDEA|PROYECTO"
    string titulo
    string descripcion
    string estado
    int created_by FK
    datetime created_at
  }

  INICIATIVA_PARTICIPANTE {
    int id_iniciativa PK, FK
    int id_usuario PK, FK
    string rol
    datetime joined_at
  }

  COMENTARIO {
    int id_comentario PK
    int id_iniciativa FK
    int id_usuario FK
    string contenido
    datetime created_at
    int parent_id FK
  }

  PERFIL_REQUERIDO {
    int id_perfil PK
    int id_iniciativa FK
    string nombre_perfil
    string descripcion
    int cantidad
    int prioridad
    string estado
  }

  PERFIL_SKILL_REQUERIDO {
    int id_perfil PK, FK
    int id_skill PK, FK
    float peso
    int nivel_minimo
    boolean obligatorio
  }

  %% Relaciones
  USUARIO ||--o{ INICIATIVA : crea
  USUARIO ||--o{ COMENTARIO : escribe
  INICIATIVA ||--o{ COMENTARIO : recibe

  USUARIO ||--o{ USUARIO_SKILL : tiene
  SKILL   ||--o{ USUARIO_SKILL : pertenece

  INICIATIVA ||--o{ PERFIL_REQUERIDO : requiere
  PERFIL_REQUERIDO ||--o{ PERFIL_SKILL_REQUERIDO : define
  SKILL ||--o{ PERFIL_SKILL_REQUERIDO : solicitado

  INICIATIVA ||--o{ INICIATIVA_PARTICIPANTE : incluye
  USUARIO ||--o{ INICIATIVA_PARTICIPANTE : participa

  COMENTARIO ||--o{ COMENTARIO : responde_a