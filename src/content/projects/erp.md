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

**Decisión:** Organizar el backend en capas (rutas → middlewares → controladores → servicios → entidades TypeORM) sobre PostgreSQL.

**Por qué:** Separar HTTP, lógica de negocio y acceso a datos permite probar y cambiar cada capa por separado, sin lógica de negocio mezclada en los controladores.

**Alternativa descartada:** Otras formas de organizar el código se conversaron en el equipo, pero solo brevemente: no llegamos a evaluarlas en serio.

### RBAC de 11 roles con middleware encadenado

**Decisión:** Modelar 11 roles de negocio (Recursos Humanos, Gerencia, Ventas, Finanzas, Mecánico, entre otros) y controlarlos con un middleware de autenticación seguido de uno de autorización por rol.

**Por qué:** Repetir la validación en cada controlador habría sido inconsistente; centralizarla en middlewares la hace uniforme. Los roles ya cubrían lo que necesitaba cada perfil, así que no hizo falta un modelo de permisos individuales.

### Autenticación JWT sin estado

**Decisión:** Autenticar con JSON Web Tokens firmados por el backend, sin sesiones guardadas en el servidor.

**Por qué:** Un token sin estado no requiere almacenamiento de sesión y es el estándar para una API REST separada del frontend.

### Suite de tests de integración sobre la API real

**Decisión:** Cubrir autenticación, usuarios y módulos de negocio con 106 tests automatizados (Mocha, Chai, Supertest), en su mayoría de integración contra los endpoints reales.

**Por qué:** En un sistema con control de acceso por rol, un test de integración prueba a la vez ruta, middleware de autorización y respuesta real.

**Alternativa descartada:** Sumar tests unitarios de los servicios. Quedaron fuera por tiempo.

### Despliegue en producción con PM2

**Decisión:** Desplegar el backend gestionado por PM2, con variables de entorno separadas por ambiente y HTTPS.

**Por qué:** PM2 mantiene el proceso Node vivo, lo reinicia si falla, y permite ver logs sin infraestructura más compleja.

**Qué cambiaría hoy:** Usaría Docker desde el comienzo del proyecto.

## Arquitectura

El flujo de una request pasa por: ruta Express → middleware de autenticación (valida el JWT) → middleware de autorización (valida el rol contra los permitidos para esa ruta) → controlador → servicio con la lógica de negocio → entidad TypeORM → PostgreSQL. El frontend en React repite el mismo control de acceso a nivel de componente, ocultando o deshabilitando lo que el rol activo no puede usar, como refuerzo de UX (el control real vive en el backend).

## Resultados

El sistema quedó desplegado en producción con los 7 módulos (inventario, maquinaria, mantenimiento, recursos humanos y los que dependen de ellos) funcionando sobre los 11 roles definidos, con 106 tests automatizados cubriendo los flujos principales de autenticación y de negocio. Fue mi primer sistema con un modelo de permisos de ese tamaño llevado hasta el despliegue real, no solo hasta la demo del ramo.
