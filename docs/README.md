# 📚 Índice de Documentación - Gestor de Turnos

## Estado del Proyecto
- **🎯 Fase actual**: Setup completo → Iniciando desarrollo
- **📅 Última actualización**: 3 de octubre de 2025
- **✅ Entorno**: Completamente funcional
- **🔄 Próximo hito**: auth-service (Iteración 1-2)

---

## 📋 Documentación del Proyecto

### **🎯 Gestión de Proyectos**
- [`📄 Acta del Proyecto`](gestion-proyectos/acta-proyecto.md) - Charter oficial, stakeholders, alcance
- [`⏱️ Cronograma`](gestion-proyectos/cronograma.md) - Planificación temporal 9 iteraciones
- [`📊 Plan de Seguimiento`](gestion-proyectos/plan-seguimiento.md) - Metodología Scrum híbrida
- [`📋 Cronograma Trello`](gestion-proyectos/cronograma-trello.md) - **[NUEVO]** Tareas detalladas para tablero
- [`👥 Configuración Equipo`](gestion-proyectos/equipo-configuracion.md) - **[NUEVO]** Datos y roles del equipo

### **🏗️ Arquitectura y Sistemas Distribuidos**  
- [`🏛️ Arquitectura Distribuida`](sistemas-distribuidos/arquitectura.md) - Microservicios + Event-driven
- [`🔧 Setup de Desarrollo`](overview/setup-desarrollo.md) - **[NUEVO]** Guía completa instalación
- [`⚙️ Setup Tecnologías`](overview/setup-tecnologias.md) - Configuración ambiente original

### **📖 Documentación Académica**
- [`🎓 Documento Académico`](overview/documento-academico.md) - Reporte para las 3 materias
- [`🗺️ Mapeo por Materias`](overview/mapeo-materias.md) - **[NUEVO]** IHC + IS + SD integradas
- [`👨‍💻 Guía de Desarrollo`](overview/guia-desarrollo.md) - **[NUEVO]** Roadmap teoría → práctica
- [`📝 Registro de Actividades`](overview/registro-actividades.md) - **[NUEVO]** Log del setup completo

### **🎨 Diseño y UX**
- [`📝 Backlog e Iteraciones`](overview/backlog-iteraciones.md) - Historias usuario priorizadas
- [`📊 Casos de Uso`](overview/casos-de-uso.drawio) - Diagrama casos uso (DrawIO)
- [`🗄️ Modelo de Datos`](overview/modelo-datos.drawio) - Diagrama ER (DrawIO)

### **🔍 Calidad y Testing**
- [`✅ Plan de Calidad`](calidad/plan-calidad.md) - Estrategia testing + métricas
- [`📈 Plan de Pruebas`](overview/guia-desarrollo.md#gestión-de-calidad) - Testing pyramid + herramientas

---

## 🚀 Quick Start

### **1. Verificar entorno**
```bash
# Verificar herramientas instaladas
node --version        # v22.18.0
npm --version         # 10.9.3
nest --version        # 11.0.10
docker --version      # 28.3.2
```

### **2. Levantar infraestructura**
```bash
cd infrastructure/
docker compose up -d
```

### **3. Verificar servicios**
- **PostgreSQL**: `localhost:5432` (gestor_admin/gestor_pass)
- **RabbitMQ**: http://localhost:15672 (gestor_admin/gestor_pass)
- **pgAdmin**: http://localhost:8081 (admin@gestor.local/gestor_pass)

### **4. Próximo paso**
```bash
# Crear primer microservicio
cd services/
nest new auth-service
```

---

## 📊 Progress Tracker

### ✅ **Completado**
- [x] **Setup del entorno** (Node.js, Docker, herramientas)
- [x] **Infraestructura base** (PostgreSQL, RabbitMQ, pgAdmin)  
- [x] **Documentación académica** (19 historias usuario + criterios)
- [x] **Planificación metodológica** (Scrum + cronograma 9 iteraciones)
- [x] **Mapeo interdisciplinario** (IHC + IS + SD integradas)

### 🔄 **En progreso**
- [ ] **auth-service** (Iteración 1-2)
- [ ] **Frontend React básico** (Iteración 3-4)
- [ ] **scheduling-service** (Iteración 5-6)

### 📋 **Pendiente**  
- [ ] **Sistema de eventos** (Iteración 7-8)
- [ ] **Notificaciones** (Iteración 7-8)
- [ ] **Reportes avanzados** (Iteración 9)

---

## 🎓 Mapeo por Materias

### **IHC (Interacción Humano-Computador)**
- 🎨 **DCU aplicado**: Historias usuario → Wireframes → Prototipos → Testing
- 📱 **Componentes React**: Design system + UX optimizada  
- 📊 **Métricas UX**: SUS score, task completion rate, response times

### **IS (Ingeniería de Software)**  
- ⚙️ **Metodología ágil**: Scrum híbrido con Kanban
- 🏗️ **Arquitectura limpia**: NestJS + TypeORM + Testing pyramid
- 🔄 **CI/CD**: GitHub Actions + Docker + automated testing

### **SD (Sistemas Distribuidos)**
- 🌐 **Microservicios**: Event-driven architecture + RabbitMQ
- 📈 **Observabilidad**: Prometheus + Grafana + structured logging  
- 🚀 **Escalabilidad**: Docker Swarm/K8s + load balancing

---

## 🔗 Enlaces Rápidos

### **Servicios locales**
- [RabbitMQ Management](http://localhost:15672) - Gestión colas y mensajería
- [pgAdmin](http://localhost:8081) - Administración PostgreSQL
- [Frontend (futuro)](http://localhost:5173) - Aplicación React  

### **Documentos clave**
- [Historias de Usuario](overview/documento-academico.md#tabla-historias-de-usuario) - 19 HU con criterios aceptación
- [Cronograma detallado](gestion-proyectos/cronograma.md#cronograma-detallado) - Planificación 18 semanas  
- [Stack tecnológico](overview/setup-desarrollo.md#herramientas-base-instaladas) - Versiones y configuración

### **Diagramas**
- [Casos de Uso](overview/casos-de-uso.drawio) - Abrir con DrawIO
- [Modelo de Datos](overview/modelo-datos.drawio) - Abrir con DrawIO
- [Arquitectura](sistemas-distribuidos/arquitectura.md#diagrama-de-componentes) - Microservicios + comunicación

---

## 📞 Contacto y Soporte

**Equipo de desarrollo:**
- **Tech Lead**: Carlos Rodríguez
- **Product Owner**: Ana Martínez  
- **QA/DevOps**: Jhoan Góngora

**Canales de comunicación:**
- 📧 **Email**: equipo-gestor@corporacion-caddies.local
- 💬 **Chat**: Teams/Slack (canal #gestor-turnos)
- 📋 **Issues**: GitHub Issues para bugs/features

---

**🎯 Objetivo**: Demostrar integración exitosa de IHC + IS + SD mediante un sistema funcional de gestión de turnos que resuelva necesidades reales de la Corporación de Caddies.

**🚀 Status**: Listo para desarrollar → Iniciando con auth-service