# Migración: Estados del Personal Configurables

## Descripción
Esta migración implementa un sistema completo de gestión de estados personalizados para el personal del club.

## Características Implementadas

### Backend
1. **Entidad `EstadoPersonal`**
   - Campos: nombre, color, activo, esOcupado, esSistema, descripción
   - Relación con Club y Personal
   - Protección de estados del sistema

2. **CRUD Completo**
   - Crear, listar, editar, eliminar estados
   - Activar/desactivar estados
   - Inicializar estados del sistema
   - Validaciones de seguridad

3. **Automatización de Estados**
   - Al crear turno con personal → estado cambia a "Ocupado"
   - Al editar turno y quitar personal → vuelve a "Disponible"
   - Al agregar personal a turno → cambia a "Ocupado"
   - Al completar turno → libera personal a "Disponible"
   - Al eliminar turno → libera personal asignado

### Frontend
1. **Página ConfiguracionEstadosPage**
   - Tabla con todos los estados
   - Crear/Editar estados con selector de color
   - Eliminar estados (con protección de sistema)
   - Activar/Desactivar estados
   - Botón "Inicializar Sistema"

2. **Integración en ConfiguracionPage**
   - Nueva card "Estados del Personal" en sección Sistema
   - Navegación directa a gestión de estados

3. **Estados Dinámicos en PersonalPage**
   - Dropdown carga estados activos desde API
   - Colores dinámicos según configuración

## Pasos para Aplicar la Migración

### 1. Ejecutar Migración SQL
```bash
# Opción A: Usando psql
psql -U postgres -d turnos_db -f backend/auth-service/migrations/add-estados-personal.sql

# Opción B: Desde Docker (si usas docker-compose)
docker exec -i turnos-postgres psql -U postgres -d turnos_db < backend/auth-service/migrations/add-estados-personal.sql
```

### 2. Inicializar Estados del Sistema
Hacer una petición POST al endpoint:
```bash
POST http://localhost:3000/estados-personal/inicializar
Authorization: Bearer {tu_token}
```

O desde el frontend:
1. Ir a **Configuración** → **Sistema**
2. Click en **Estados del Personal**
3. Click en botón **Inicializar Sistema**

Esto creará los 4 estados base:
- ✅ **Disponible** (Verde #10B981) - Sistema
- ⚠️ **Ocupado** (Amarillo #F59E0B) - Sistema
- 💤 **Descanso** (Púrpura #8B5CF6)
- ⚫ **Inactivo** (Gris #6B7280)

### 3. Migrar Datos Existentes (Opcional)
Si ya tienes personal con estados, ejecuta:
```sql
-- Mapear estados antiguos a nuevos IDs
UPDATE auth.personal p
SET estado_id = (
  SELECT e.id FROM auth.estados_personal e 
  WHERE e.nombre = INITCAP(p.estado) 
  AND e."clubId" = p.club_id::INTEGER
  LIMIT 1
)
WHERE p.estado_id IS NULL;
```

## Uso del Sistema

### Gestión de Estados (Administrador)
1. Navegar a: **Configuración** → **Sistema** → **Estados del Personal**
2. Ver tabla con todos los estados
3. **Crear nuevo estado:**
   - Click en "Crear Estado"
   - Ingresar nombre (ej: "En Capacitación")
   - Seleccionar color del badge
   - Marcar si es "Ocupado" (no disponible para turnos)
   - Agregar descripción (opcional)
4. **Editar estado:** Click en ícono de lápiz
5. **Eliminar estado:** Click en ícono de basura (solo estados personalizados)
6. **Activar/Desactivar:** Click en el badge de estado

### Automatización en Turnos
El sistema cambia automáticamente los estados:

```typescript
// Al crear turno
POST /turnos { personal_asignado: ['uuid1', 'uuid2'] }
→ Personal cambia a "Ocupado" automáticamente

// Al editar turno
PATCH /turnos/:id { personal_asignado: ['uuid1'] } // Se quitó uuid2
→ uuid2 vuelve a "Disponible"
→ uuid1 queda en "Ocupado"

// Al completar turno
PATCH /turnos/:id/estado { estado: 'completada' }
→ Todo el personal asignado vuelve a "Disponible"

// Al eliminar turno
DELETE /turnos/:id
→ Personal asignado vuelve a "Disponible"
```

### API Endpoints

#### Estados del Personal
```bash
# Listar todos
GET /estados-personal
GET /estados-personal?soloActivos=true

# Obtener uno
GET /estados-personal/:id

# Crear
POST /estados-personal
Body: {
  nombre: "En Capacitación",
  color: "#3B82F6",
  esOcupado: true,
  descripcion: "Personal en proceso de capacitación"
}

# Actualizar
PATCH /estados-personal/:id
Body: { nombre: "Nuevo Nombre", color: "#EF4444" }

# Eliminar (solo estados personalizados)
DELETE /estados-personal/:id

# Activar/Desactivar
PATCH /estados-personal/:id/toggle-activo

# Inicializar estados del sistema
POST /estados-personal/inicializar
```

## Notas Importantes

### Estados del Sistema
Los estados marcados como `esSistema: true` tienen protecciones especiales:
- ❌ No se pueden eliminar
- ❌ No se pueden desactivar si están activos
- ✅ Se pueden editar (nombre, color, descripción)

### Campo esOcupado
- Si `esOcupado: true` → Personal no aparece como disponible para asignar a turnos
- Los estados del sistema "Disponible" (false) y "Ocupado" (true) están preconfigurados
- Útil para estados como "En Capacitación", "Enfermo", etc.

### Migración Gradual
El campo `estado` (string) se mantiene temporalmente para compatibilidad:
- ✅ Se sincroniza automáticamente con `estado_id`
- ✅ Permite migración gradual sin romper código existente
- 🔮 Se puede eliminar en futuras versiones

## Rollback (Si es Necesario)

```sql
-- Eliminar columna estado_id
ALTER TABLE auth.personal DROP COLUMN IF EXISTS estado_id;

-- Eliminar tabla
DROP TABLE IF EXISTS auth.estados_personal CASCADE;
```

## Testing

### Test Manual
1. Crear un turno con personal asignado
2. Verificar en PersonalPage que el estado cambió a "Ocupado"
3. Editar el turno y quitar el personal
4. Verificar que volvió a "Disponible"
5. Crear estados personalizados en ConfiguracionEstadosPage
6. Verificar que aparecen en dropdown de PersonalPage

### Test Automatizado
```bash
cd backend/auth-service
npm run test
```

## Troubleshooting

### Error: "Estado no encontrado"
- Ejecutar POST `/estados-personal/inicializar` para crear estados del sistema

### Personal no cambia de estado
- Verificar logs del backend
- Verificar que el estado "Ocupado" existe y está activo

### No aparece la página ConfiguracionEstadosPage
- Verificar que la ruta está agregada en `App.tsx`
- Limpiar caché del navegador (Ctrl+Shift+R)

## Próximas Mejoras
- [ ] Transiciones automáticas de estados basadas en horarios
- [ ] Historial de cambios de estado por personal
- [ ] Notificaciones cuando personal cambia de estado
- [ ] Estados por tipo de personal (Caddies vs Boleadores)
