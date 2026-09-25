---
title: "Plataforma de algoritmos de bioinformática"
year: "2025"
kind: "Práctica"
role: "Backend"
summary: "Ejecutar e inspeccionar algoritmos de bioinformática desde la web, con visualización paso a paso, en equipo de 4."
stack: ["Python", "NumPy", "SciPy", "NetworkX", "Node.js", "React", "PostgreSQL", "Joi"]
status: "Finalizado"
links:
  repo: "https://github.com/HallamSaaveda/NovaUBB-2025"
metrics:
  - value: "4/6"
    label: "algoritmos implementados por mí"
  - value: "2"
    label: "capas de la arquitectura (Node.js → Python)"
order: 2
draft: false
---

## Problema

La práctica profesional pedía una plataforma web donde se pudiera ejecutar e inspeccionar, paso a paso, un conjunto de algoritmos clásicos de bioinformática (alineamiento de secuencias, árboles, permutaciones, cobertura de vértices, predicción de estructura), pensada para apoyar docencia. Los algoritmos ya existían como scripts de Python sueltos, de un prototipo de escritorio anterior; el trabajo era exponerlos en una API web común y construir una interfaz donde alguien sin conocer el código pudiera correr cada uno y ver su ejecución.

## Contexto y restricciones

- Equipo de 4 personas; yo implementé 4 de los 6 algoritmos, su capa de API en Node.js y el frontend del hub donde se integran los 6.
- Los algoritmos venían de un prototipo de escritorio en Python hecho por mí antes (`Bioinformatics-Algorithms`), así que el cómputo ya existía.
- Restricción técnica: el cómputo científico tenía que seguir en Python (NumPy, SciPy, NetworkX) aunque la API del proyecto fuera Node.js.
- Cada algoritmo necesitaba, además del resultado final, los pasos intermedios para la visualización paso a paso.

## Decisiones técnicas

### Separar HTTP y validación del cómputo

**Decisión:** Node.js con Joi recibe la petición HTTP, valida la entrada (incluida ADN/ARN) y responde; el cómputo corre en un proceso Python aparte, invocado con `child_process`, con JSON como contrato.

**Por qué:** así el cómputo científico se queda en el lenguaje que ya lo tenía implementado y probado, sin forzar una reescritura de los algoritmos.

**Alternativa descartada:** exponer los scripts de Python como su propio servicio HTTP (Flask/FastAPI) — evitaba el costo de un proceso por ejecución, pero sumaba otro servidor para un equipo pequeño.

### Reutilizar el prototipo de escritorio como origen de los algoritmos

**Decisión:** partir de los algoritmos ya escritos en un prototipo de escritorio en Python (proyecto personal previo) en vez de programarlos de nuevo para la web.

**Por qué:** los algoritmos más complejos (alineamiento con traceback, predicción de estructura con Montecarlo) ya estaban implementados y probados ahí.

**Alternativa descartada:** TODO — no verifiqué si se consideró usar una librería de bioinformática existente (ej. Biopython) en vez de la implementación propia. Preguntar a Felipe.

## Arquitectura

El navegador llama a la API en Node.js (Express), que valida la petición con Joi y decide qué algoritmo ejecutar. Para los algoritmos que a mí me tocaron, Node.js invoca el script Python correspondiente con `child_process`, pasando la entrada como JSON; el script en Python hace el cómputo con NumPy/SciPy/NetworkX y devuelve el resultado y los pasos intermedios, también en JSON. El frontend en React (hub de algoritmos, tarjetas, espacio de trabajo con panel lateral) consume esa respuesta y arma la visualización paso a paso.

## Resultados

Quedaron los 6 algoritmos integrados en un solo hub web, de los cuales implementé 4 (alineamiento de secuencias con traceback, permutaciones, búsqueda con permutaciones y predicción de estructura con Montecarlo), además de su capa de API en Node.js y el frontend completo del hub (página de inicio, tarjetas, espacio de trabajo y las 6 páginas de algoritmo). También escribí el manual de uso de la plataforma. Los otros dos algoritmos (árboles, cobertura de vértices) son de otra integrante del equipo; yo los integré al mismo hub y contrato de API.
