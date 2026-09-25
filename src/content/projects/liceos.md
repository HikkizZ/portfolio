---
title: "Gestión académica para liceos"
year: "2024"
kind: "Universidad"
role: "Full Stack"
summary: "Gestión académica completa: cursos, horarios, calificaciones, reservas de salas, foros y noticias, con 5 roles."
stack: ["JavaScript", "Node.js", "React", "PostgreSQL", "TypeORM"]
status: "En producción"
links:
  repo: "https://github.com/HikkizZ/Project-ISW-2024"
metrics:
  - value: "9"
    label: "módulos"
  - value: "5"
    label: "roles RBAC"
order: 3
draft: false
---

## Problema

El ramo de Ingeniería de Software (ISW 2024, agosto–diciembre) pedía un sistema de gestión académica para un liceo: cursos, asignaturas, horarios, calificaciones, reservas de salas, foros y noticias, todo en un solo lugar y con distintos niveles de acceso según si quien entra es administrativo, profesor o alumno. El punto crítico era el armado de horarios: asignar sala, curso, asignatura, profesor y bloque horario sin que dos clases quedaran chocadas en la misma sala y bloque.

## Contexto y restricciones

- Trabajo de equipo, con entrega y evaluación fijadas por el ramo (agosto–diciembre 2024).
- 5 roles de usuario: administrador, profesor, alumno, encargado y administrativo, cada uno con su propio alcance de acciones.
- Identificación de usuarios por RUT chileno, con formato validado en el backend (no solo en el frontend).
- Las reservas de salas necesitaban un flujo de estados (pendiente / aprobada / rechazada), no una simple creación directa.

## Decisiones técnicas

### Detección de conflictos al crear un horario

**Decisión:** antes de guardar un horario, el servicio consulta si ya existe uno para la misma sala, día y bloque, y si existe, rechaza la creación con un mensaje explicando el choque.

**Por qué:** sin esa validación en el backend, nada impedía crear dos clases en la misma sala al mismo tiempo.

**Alternativa descartada:** TODO — no verifiqué si se evaluó un algoritmo de asignación automática de horarios en vez de validar el conflicto en la creación manual. Preguntar a Felipe.

### Reservas de salas con flujo de aprobación por estados

**Decisión:** las reservas de sala se crean en estado `pendiente` y pasan a `aprobada` o `rechazada` por una acción explícita de quien tiene el rol para autorizarlas.

**Por qué:** una sala es un recurso compartido y limitado; el flujo de aprobación deja registro de quién pidió y quién autorizó, sin que cualquiera la bloquee.

**Alternativa descartada:** TODO — no verifiqué si se consideró aprobación automática ("primero en pedir, primero en obtener") para casos simples. Preguntar a Felipe.

### Validación de RUT chileno en el backend

**Decisión:** validar el formato del RUT con una expresión regular en el backend (Joi), no solo en el frontend, y usarlo como identificador en usuarios, horarios y asignaturas.

**Por qué:** el RUT es el identificador natural de personas en Chile; validarlo en el backend evita datos mal formados que lleguen por fuera del formulario web.

**Alternativa descartada:** TODO — no verifiqué si se evaluó validar también el dígito verificador del RUT y se dejó fuera por alcance del ramo. Preguntar a Felipe.

## Arquitectura

El backend expone rutas por módulo (cursos, asignaturas, horarios, calificaciones, reservas, salas, foros, noticias), cada una con su controlador, servicio y modelo TypeORM sobre PostgreSQL, y con las validaciones de entrada (Joi) antes de tocar la base de datos. El control de acceso por rol se aplica con middlewares de autenticación y autorización en las rutas. El frontend en React consume esa API por módulo; el flujo más particular es el de horarios, donde la creación pasa primero por la validación de conflicto de sala/día/bloque antes de guardar.

## Resultados

El sistema quedó desplegado en producción con los 9 módulos funcionando sobre los 5 roles definidos, incluida la validación de conflictos de horario y el flujo de aprobación de reservas de sala. Fue el primer proyecto donde tuve que resolver un problema de asignación con restricciones reales (sala/día/bloque) en vez de un CRUD simple.
