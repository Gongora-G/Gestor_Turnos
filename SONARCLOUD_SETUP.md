# 🎯 Configuración de SonarCloud - Gestor de Turnos

## 📋 Pasos para Activar SonarCloud

### 1️⃣ Crear Cuenta en SonarCloud

1. Ve a: https://sonarcloud.io
2. Haz clic en **"Log in"** o **"Start now"**
3. Selecciona **"Sign up with GitHub"**
4. Autoriza el acceso a tu cuenta de GitHub

### 2️⃣ Importar el Repositorio

1. Una vez logueado, haz clic en el botón **"+"** en la esquina superior derecha
2. Selecciona **"Analyze new project"**
3. Busca y selecciona: **`Gongora-G/Gestor_Turnos`**
4. Haz clic en **"Set Up"**

### 3️⃣ Configurar la Organización

Si es tu primera vez:
1. SonarCloud te pedirá crear una organización
2. Usa tu nombre de usuario de GitHub: **`gongora-g`**
3. Selecciona el plan **"Free"** (gratuito para proyectos públicos)

### 4️⃣ Configurar el Token

1. En SonarCloud, ve a tu perfil → **"My Account"** → **"Security"**
2. En la sección **"Tokens"**, crea un nuevo token:
   - Name: `Gestor_Turnos_Token`
   - Type: `Global Analysis Token`
   - Expires in: `No expiration` o `90 days`
3. **COPIA EL TOKEN** (solo se muestra una vez) ⚠️

### 5️⃣ Agregar el Token a GitHub

1. Ve a tu repositorio en GitHub: https://github.com/Gongora-G/Gestor_Turnos
2. Ve a **Settings** → **Secrets and variables** → **Actions**
3. Haz clic en **"New repository secret"**
4. Crea el secret:
   - Name: `SONAR_TOKEN`
   - Value: [pega el token que copiaste]
5. Haz clic en **"Add secret"**

### 6️⃣ Activar GitHub Actions

1. En tu repositorio de GitHub, ve a la pestaña **"Actions"**
2. Si está deshabilitado, haz clic en **"I understand my workflows, go ahead and enable them"**
3. El workflow de SonarCloud se ejecutará automáticamente en el próximo push

### 7️⃣ Hacer Push y Activar Análisis

```bash
git add .
git commit -m "chore: Configurar SonarCloud para análisis de calidad"
git push origin master
```

### 8️⃣ Ver los Resultados

1. Ve a la pestaña **"Actions"** en GitHub
2. Verás el workflow **"SonarCloud Analysis"** ejecutándose
3. Una vez completado, ve a: https://sonarcloud.io/project/overview?id=Gongora-G_Gestor_Turnos
4. ¡Revisa los resultados! 📊

---

## 🔧 Configuración Manual (Alternativa)

Si prefieres análisis local sin GitHub Actions:

### Instalar SonarScanner

**Windows (usando npm):**
```bash
npm install -g sonarqube-scanner
```

**O descargar desde:**
https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/sonarscanner-cli/

### Ejecutar Análisis Local

```bash
sonar-scanner \
  -Dsonar.organization=gongora-g \
  -Dsonar.projectKey=Gongora-G_Gestor_Turnos \
  -Dsonar.sources=. \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.token=TU_TOKEN_AQUI
```

---

## 📊 ¿Qué Analiza SonarCloud?

### Métricas Principales:

- **🐛 Bugs**: Errores que pueden causar fallos
- **🔒 Vulnerabilidades**: Problemas de seguridad
- **💩 Code Smells**: Código que funciona pero está mal escrito
- **📈 Complejidad**: Qué tan difícil es mantener el código
- **🔄 Duplicación**: Código repetido
- **📏 Cobertura**: Porcentaje de código con pruebas

### Quality Gates (Umbrales):

- ✅ **A**: Excelente (0 bugs, 0 vulnerabilidades)
- ✅ **B**: Bueno (pocos problemas menores)
- ⚠️ **C**: Aceptable (algunos code smells)
- ❌ **D**: Pobre (muchos problemas)
- ❌ **E**: Muy pobre (crítico)

---

## 🎓 Para tu Profesor

### Badge de Calidad para el README

Una vez configurado, agrega estos badges al README.md:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=Gongora-G_Gestor_Turnos&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=Gongora-G_Gestor_Turnos)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Gongora-G_Gestor_Turnos&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Gongora-G_Gestor_Turnos)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=Gongora-G_Gestor_Turnos&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=Gongora-G_Gestor_Turnos)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Gongora-G_Gestor_Turnos&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Gongora-G_Gestor_Turnos)
```

### Captura de Pantalla del Dashboard

Toma screenshots de:
1. Dashboard principal con métricas
2. Lista de issues encontrados
3. Issues resueltos (antes/después)
4. Quality Gate pasando ✅

---

## 🆘 Solución de Problemas

### Error: "Project not found"
- Verifica que el `projectKey` sea exactamente: `Gongora-G_Gestor_Turnos`
- Verifica que la organización sea: `gongora-g`

### Error: "Token invalid"
- Genera un nuevo token en SonarCloud
- Actualiza el secret `SONAR_TOKEN` en GitHub

### El análisis no se ejecuta
- Verifica que GitHub Actions esté habilitado
- Revisa los logs en la pestaña "Actions"
- Asegúrate de que el workflow esté en `.github/workflows/`

---

## 📚 Recursos Adicionales

- **Documentación oficial**: https://docs.sonarcloud.io/
- **Reglas TypeScript**: https://rules.sonarsource.com/typescript
- **Quality Gate**: https://docs.sonarcloud.io/improving/quality-gates/

---

## ✅ Checklist

- [ ] Cuenta creada en SonarCloud
- [ ] Repositorio importado
- [ ] Token generado
- [ ] Secret agregado a GitHub
- [ ] Archivos de configuración creados
- [ ] Push realizado
- [ ] Análisis completado
- [ ] Resultados revisados
- [ ] Screenshots tomados para el reporte
- [ ] Badge agregado al README

---

**¡Listo para calidad de software!** 🎓✨
