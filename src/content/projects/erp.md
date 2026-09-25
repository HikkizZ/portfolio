---
title: "ERP de gestión empresarial"
year: "2025"
kind: "Universidad"
role: "Full Stack"
summary: "ERP modular con inventario, maquinaria, mantenimiento y RR.HH., arquitectura en capas y control de acceso por 11 roles."
stack: ["TypeScript", "Node.js", "Express", "React", "PostgreSQL", "TypeORM"]
status: "En producción"
links:
  repo: "https://github.com/HikkizZ/Project-GPS-2025"
metrics:
  - value: "7"
    label: "módulos"
  - value: "11"
    label: "roles RBAC"
  - value: "106"
    label: "tests automatizados"
order: 1
draft: false
---

## Problema

El ramo de Gestión de Proyectos de Software (GPS 2025, marzo–agosto) pedía construir en equipo un ERP funcional para una empresa ficticia que necesitaba centralizar inventario, maquinaria, mantenciones y recursos humanos en un solo sistema, con distintos niveles de acceso según el cargo de cada usuario. No bastaba con que el sistema funcionara para la entrega: tenía que sostener una arquitectura ordenada, control de acceso real por rol, y terminar desplegado en producción en vez de quedar como una demo.

## Contexto y restricciones

- Trabajo de equipo, con entrega y evaluación fijadas por el ramo (marzo–agosto 2025).
- La empresa cliente que aparece en el enunciado y en el repositorio es ficticia (caso del curso); no se presenta como cliente real.
- Requisito no negociable: control de acceso por rol tanto en cada endpoint del backend como en cada componente visible del frontend, no solo en la navegación.
- Stack fijado desde el inicio: TypeScript en todo el proyecto, PostgreSQL como base de datos, TypeORM como ORM.

## Decisiones técnicas

### Arquitectura en capas con TypeORM como base central

**Decisión:** organizar el backend en capas (rutas → middlewares → controladores → servicios → entidades TypeORM) sobre PostgreSQL.

**Por qué:** separar HTTP, lógica de negocio y acceso a datos permite probar y cambiar cada capa por separado, sin lógica de negocio mezclada en los controladores.

**Alternativa descartada:** TODO — no encontré en el repo una alternativa de arquitectura evaluada y descartada explícitamente. Preguntar a Felipe si se discutió alguna en el equipo.

### RBAC de 11 roles con middleware encadenado

**Decisión:** modelar 11 roles de negocio (`SuperAdministrador`, `Administrador`, `RecursosHumanos`, `Gerencia`, `Ventas`, `Arriendo`, `Finanzas`, `Conductor`, `Mecánico`, entre otros) y controlarlos con un middleware de autenticación seguido de uno de autorización por rol.

**Por qué:** con 11 roles reales, repetir la validación en cada controlador habría sido inconsistente; centralizarla en middlewares la hace uniforme.

**Alternativa descartada:** TODO — no verifiqué si se evaluó un modelo de permisos granulares en vez de rol fijo. Preguntar a Felipe.

### Autenticación JWT sin estado

**Decisión:** autenticar con JSON Web Tokens firmados por el backend, sin sesiones guardadas en el servidor.

**Por qué:** un token sin estado no requiere almacenamiento de sesión y es el estándar para una API REST separada del frontend.

**Alternativa descartada:** TODO — no confirmé si se consideró sesión con cookies antes de optar por JWT. Preguntar a Felipe.

### Suite de tests de integración sobre la API real

**Decisión:** cubrir autenticación, usuarios y módulos de negocio con 106 tests automatizados (Mocha, Chai, Supertest): la mayoría de integración, que levantan la API y golpean los endpoints reales, más tests unitarios de utilidades como la validación de RUT.

**Por qué:** en un sistema con control de acceso por rol, un test de integración prueba a la vez ruta, middleware de autorización y respuesta real.

**Alternativa descartada:** TODO — no verifiqué si se planteó sumar tests unitarios de servicios y se dejó fuera por tiempo. Preguntar a Felipe.

### Despliegue en producción con PM2

**Decisión:** desplegar el backend gestionado por PM2, con variables de entorno separadas por ambiente y HTTPS.

**Por qué:** PM2 mantiene el proceso Node vivo, lo reinicia si falla, y permite ver logs sin infraestructura más compleja.

**Alternativa descartada:** TODO — no verifiqué si se evaluó Docker para este despliegue y se descartó por el plazo del ramo. Preguntar a Felipe.

## Arquitectura

El flujo de una request pasa por: ruta Express → middleware de autenticación (valida el JWT) → middleware de autorización (valida el rol contra los permitidos para esa ruta) → controlador → servicio con la lógica de negocio → entidad TypeORM → PostgreSQL. El frontend en React repite el mismo control de acceso a nivel de componente, ocultando o deshabilitando lo que el rol activo no puede usar, como refuerzo de UX (el control real vive en el backend).

## Resultados

El sistema quedó desplegado en producción con los 7 módulos (inventario, maquinaria, mantenimiento, recursos humanos y los que dependen de ellos) funcionando sobre los 11 roles definidos, con 106 tests automatizados cubriendo los flujos principales de autenticación y de negocio. Fue mi primer sistema con un modelo de permisos de ese tamaño llevado hasta el despliegue real, no solo hasta la demo del ramo.
