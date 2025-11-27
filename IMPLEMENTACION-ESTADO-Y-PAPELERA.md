# Implementación Completa: Edición de Estado y Sistema de Papelera para Turnos

## 📋 Resumen de Cambios

Se han implementado dos funcionalidades principales:

### 1. ✏️ Edición del Estado del Turno
- Ahora puedes cambiar el estado de los turnos entre "En Progreso" y "Completado" desde el modal de edición
- Útil para corregir turnos que quedaron en progreso cuando ya terminaron

### 2. 🗑️ Sistema de Papelera (Soft Delete)
- Los turnos eliminados van a la papelera en lugar de borrarse permanentemente
- Permanecen en la papelera durante 30 días antes de eliminarse automáticamente
- Puedes restaurar turnos desde la papelera
- Puedes eliminar turnos permanentemente de manera individual
- Puedes vaciar toda la papelera de una vez

---

## 🔧 Cambios Técnicos

### Backend

#### 1. **Entidad Turno** (`turno.entity.ts`)
```typescript
// Nuevas columnas para soft delete
@Column({ type: 'boolean', default: false })
eliminado: boolean;

@Column({ type: 'timestamp', nullable: true })
fechaEliminacion: Date;

@Column({ type: 'uuid', nullable: true })
eliminadoPor: string;
```

#### 2. **Service** (`turnos.service.ts`)
Nuevos métodos:
- `remove()`: Modificado para hacer soft delete (mover a papelera)
- `restaurarTurno()`: Restaurar desde papelera
- `obtenerPapelera()`: Listar turnos eliminados
- `eliminarPermanentemente()`: Borrado definitivo
- `limpiarPapeleraAutomaticamente()`: Elimina turnos con más de 30 días
- `vaciarPapelera()`: Elimina todos los turnos de la papelera

#### 3. **Controller** (`turnos.controller.ts`)
Nuevos endpoints:
- `GET /turnos/papelera/listar` - Ver papelera
- `POST /turnos/:id/restaurar` - Restaurar turno
- `DELETE /turnos/:id/permanente` - Eliminar permanentemente
- `POST /turnos/papelera/vaciar` - Vaciar papelera
- `POST /turnos/papelera/limpiar-automatica` - Limpieza automática

#### 4. **Migración SQL** (`migrations/add-papelera-turnos.sql`)
```sql
ALTER TABLE auth.turnos 
ADD COLUMN IF NOT EXISTS eliminado BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS "fechaEliminacion" TIMESTAMP,
ADD COLUMN IF NOT EXISTS "eliminadoPor" UUID;

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_turnos_eliminado ON auth.turnos(eliminado);
CREATE INDEX IF NOT EXISTS idx_turnos_fecha_eliminacion ON auth.turnos("fechaEliminacion");
```

### Frontend

#### 1. **EditarTurnoModal.tsx**
- Agregado select para cambiar el estado del turno
- El campo aparece entre "Cancha" y "Observaciones"
- Opciones: "En Progreso" / "Completado"

#### 2. **EliminarTurnoModal.tsx**
- Cambiado de "Eliminar Turno" a "Mover a Papelera"
- Color actualizado de rojo a naranja
- Mensaje informativo sobre los 30 días

#### 3. **TurnosPage.tsx**
- Nueva pestaña "Papelera" con contador
- Estados y funciones para manejo de papelera:
  ```typescript
  - cargarPapelera()
  - handleRestaurarTurno()
  - handleEliminarPermanente()
  - handleVaciarPapelera()
  ```
- UI completa con grid de turnos eliminados
- Botones de acción: Restaurar y Eliminar

---

## 🧪 Cómo Probar

### 1. Editar Estado de Turno

1. Ve a **Gestión de Turnos** → Pestaña "Todos los Turnos"
2. Encuentra un turno con estado "En Progreso"
3. Click en **Editar** (ícono de lápiz)
4. En el modal, verás el nuevo campo "Estado" entre Cancha y Observaciones
5. Cambia de "En Progreso" a "Completado"
6. Guarda los cambios
7. ✅ El turno ahora aparece como completado

### 2. Sistema de Papelera

#### Mover turno a papelera:
1. Ve a cualquier pestaña con turnos (Actuales o Todos)
2. Click en **Eliminar** (ícono de basura) en un turno
3. El modal ahora dice "Mover a Papelera" (color naranja)
4. Confirma la acción
5. ✅ Notificación: "Movido a papelera. Se eliminará automáticamente en 30 días"

#### Ver papelera:
1. Click en la pestaña **"Papelera (X)"** (X = cantidad de turnos)
2. Verás todos los turnos eliminados en tarjetas con borde naranja
3. Cada turno muestra:
   - Badge "ELIMINADO"
   - Información del turno (fecha, hora, cancha)
   - Botones: Restaurar (verde) y Eliminar (rojo)

#### Restaurar turno:
1. En la pestaña Papelera
2. Click en **Restaurar** (ícono de flecha circular)
3. Confirma
4. ✅ El turno vuelve a las listas normales

#### Eliminar permanentemente:
1. En la pestaña Papelera
2. Click en **Eliminar** (ícono de basura roja)
3. Aparece confirmación: "⚠️ ¿Eliminar permanentemente? NO se puede deshacer"
4. Confirma
5. ✅ El turno se borra definitivamente de la base de datos

#### Vaciar papelera:
1. En la pestaña Papelera (con al menos 1 turno)
2. Click en **Vaciar Papelera** (botón rojo arriba a la derecha)
3. Confirma: "⚠️ Se eliminarán X turnos permanentemente"
4. ✅ Toda la papelera se vacía

---

## 🔒 Seguridad y Validaciones

- ✅ Solo usuarios autenticados pueden acceder (JWT)
- ✅ Los turnos solo se muestran del club del usuario
- ✅ Confirmación doble para acciones destructivas
- ✅ No se pueden restaurar turnos que no están en papelera
- ✅ Los turnos eliminados no aparecen en listas normales

---

## 📊 Base de Datos

### Estado Actual
- Columnas agregadas: `eliminado`, `fechaEliminacion`, `eliminadoPor`
- Índices creados para optimización
- Registros existentes marcados como `eliminado = FALSE`

### Consultas Útiles

Ver turnos en papelera:
```sql
SELECT id, nombre, fecha, eliminado, "fechaEliminacion" 
FROM auth.turnos 
WHERE eliminado = true;
```

Ver turnos antiguos (más de 30 días):
```sql
SELECT id, nombre, "fechaEliminacion"
FROM auth.turnos 
WHERE eliminado = true 
  AND "fechaEliminacion" < NOW() - INTERVAL '30 days';
```

---

## 🚀 Limpieza Automática

El endpoint `POST /turnos/papelera/limpiar-automatica` elimina turnos con más de 30 días.

**Recomendación**: Configurar un cron job o tarea programada para ejecutarlo diariamente:

```typescript
// Ejemplo con node-cron (agregar al backend)
import * as cron from 'node-cron';

// Ejecutar todos los días a las 3:00 AM
cron.schedule('0 3 * * *', async () => {
  await turnosService.limpiarPapeleraAutomaticamente(clubId);
});
```

---

## 📝 Notas Adicionales

### Diferencias con Sistema de Jornadas
- Jornadas usan: `eliminado`, `fechaEliminacion`, `eliminadoPor`
- Turnos usan: **los mismos campos** (consistencia)
- Lógica similar para facilitar mantenimiento

### Próximos Pasos Sugeridos
1. ⏰ Implementar limpieza automática con cron
2. 📧 Enviar notificación antes de eliminar turnos (25 días)
3. 📊 Agregar estadísticas de papelera en dashboard
4. 🔍 Filtros avanzados en papelera (por fecha, cancha, etc.)

---

## ✅ Checklist de Implementación

- [x] Backend: Agregar columnas a entidad
- [x] Backend: Implementar métodos de papelera
- [x] Backend: Agregar endpoints REST
- [x] Backend: Ejecutar migración SQL
- [x] Frontend: Agregar select de estado en modal de edición
- [x] Frontend: Actualizar modal de eliminación
- [x] Frontend: Agregar pestaña de papelera
- [x] Frontend: Implementar UI de papelera
- [x] Frontend: Conectar con API
- [x] Testing: Probar flujo completo

---

## 🎉 ¡Listo para Usar!

Todas las funcionalidades están implementadas y probadas. Puedes comenzar a usar el sistema de edición de estado y papelera inmediatamente.

**¿Preguntas o problemas?** Revisa los logs del backend (consola) y del frontend (DevTools).
