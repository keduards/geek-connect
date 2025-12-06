# Model Comparison: modelo_db.md vs Implementation

## ✅ Implemented Features

### 1. USUARIO (User/Profile)
- ✅ `profiles` table with: user_id, display_name, role, skills, bio
- ✅ Auto-created on first visit
- ✅ Can view and edit profile

### 2. SKILL
- ✅ Skills stored as array in profiles
- ✅ Can add/remove skills in onboarding and profile

### 3. INICIATIVA (Initiative/Post)
- ✅ `collab_posts` table with: title, description, tipo (IDEA/PROYECTO)
- ✅ Estado field (BORRADOR, VALIDANDO, EN_EJECUCION, CERRADO)
- ✅ Created by user (author_id)
- ✅ Can create and view initiatives

### 4. COMENTARIO (Comments)
- ✅ Comments system for initiatives
- ✅ Can add comments to posts
- ✅ Shows comment author and timestamp
- ✅ Threaded comments support (parent_id field available)

### 5. INICIATIVA_PARTICIPANTE (Participants)
- ✅ Participants system
- ✅ Can join initiatives as COLABORADOR
- ✅ Tracks who joined when

## 📝 Simplified/Partial Implementation

### 1. USUARIO_SKILL
- ⚠️ Skills stored as simple array, not normalized table
- ⚠️ No nivel (level) or años_experiencia (years) tracking yet
- Can be enhanced later if needed

### 2. PERFIL_REQUERIDO
- ⚠️ Simplified to `role_needed` field
- ⚠️ No separate PERFIL_REQUERIDO table with cantidad, prioridad
- Can be enhanced later

### 3. PERFIL_SKILL_REQUERIDO
- ⚠️ Skills required stored as simple array
- ⚠️ No peso (weight), nivel_minimo, obligatorio fields
- Can be enhanced later

## 🎯 Core Features Working

1. ✅ Users can create initiatives (IDEA or PROYECTO)
2. ✅ Users can comment on initiatives
3. ✅ Users can join/participate in initiatives
4. ✅ Skills-based matching (simplified)
5. ✅ Profile management
6. ✅ All data stored locally (localStorage)

## 🔄 Next Steps (if needed)

To fully match modelo_db.md:
1. Add skill levels and experience tracking
2. Create PERFIL_REQUERIDO table structure
3. Add skill weighting system
4. Enhance matching algorithm with weights

But for MVP/mockup purposes, current implementation covers the core functionality!

