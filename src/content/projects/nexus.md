---
title: "Nexus: servidor propio"
year: "2026 — actualidad"
kind: "Personal"
role: "Infraestructura"
summary: "VPS propio donde corre este portafolio: sin puertos web abiertos y con toda la infraestructura versionada en git."
stack: ["Ubuntu", "Docker", "nginx", "Cloudflare", "Git", "ufw", "fail2ban"]
status: "Activo"
links: {}
metrics:
  - value: "0"
    label: "puertos web expuestos (solo SSH)"
  - value: "0"
    label: "llaves con permiso de escritura guardadas en el servidor"
order: 4
draft: false
---

## Problema

Quería un servidor propio donde alojar mis proyectos personales (empezando por este portafolio), en vez de depender de plataformas gestionadas, y usarlo para practicar de verdad la parte de infraestructura que no se aprende solo leyendo: firewall, contenedores, DNS, certificados y despliegue. La condición que me puse fue que la superficie de ataque quedara mínima desde el día uno, y que la configuración del servidor viviera en un repositorio, no solo en mi memoria de lo que fui tecleando por SSH.

## Contexto y restricciones

- Proyecto personal, sin plazo fijo, mantenido y ampliado por mí solo.
- Objetivo explícito: ningún puerto web expuesto directamente a internet, solo acceso SSH para administración.
- Todo cambio de infraestructura (proxy, contenedores) tenía que quedar en un repositorio versionado, no aplicado a mano y sin registro.

## Decisiones técnicas

### Cloudflare Tunnel en vez de exponer puertos

**Decisión:** Publicar los sitios con un túnel saliente de Cloudflare en vez de abrir los puertos 80/443, con Docker configurado para no publicar puertos que salten el firewall.

**Por qué:** Con Cloudflare solo como proxy DNS, el servidor respondía por la IP directa, y Docker puede abrir puertos sin que ufw se entere. El túnel saliente elimina el puerto web.

**Alternativa descartada:** Allowlist de IPs de Cloudflare o Authenticated Origin Pulls — ambas dependen de un puerto abierto y de mantener listas al día.

### nginx en Docker como reverse proxy único

**Decisión:** Un contenedor de nginx hace de reverse proxy hacia el resto de servicios, resolviendo los contenedores destino en tiempo de ejecución.

**Por qué:** Así un servicio caído no tumba a los demás, y agregar un sitio nuevo es agregar configuración, no reconfigurar red.

**Alternativa descartada:** nginx instalado directamente en el sistema, que fue como partí. Lo migré a un contenedor cuando había un solo sitio, porque mover varios servicios después habría sido más caro.

### Infraestructura como código con push solo desde el PC

**Decisión:** La configuración vive en git; el servidor solo hace `pull` (llave de despliegue de solo lectura) y el `push` solo es posible por SSH desde mi PC con reenvío de agente.

**Por qué:** Así ninguna llave capaz de escribir en el repositorio vive en el servidor; si se compromete, no puede alterar la infraestructura versionada.

**Alternativa descartada:** Guardar una llave de escritura o un token en el servidor para hacer `push` desde ahí — más cómodo, pero es un punto único de fuga.

### Seguridad en capas incremental

**Decisión:** Combinar medidas independientes: ufw en el único puerto abierto (SSH), fail2ban con bloqueos crecientes, parches automáticos, y SPF/DKIM/DMARC estrictos en un dominio que no envía correo.

**Por qué:** Ninguna medida sola cubre todo; ufw no detiene fuerza bruta por SSH, fail2ban no reemplaza los parches, y sin SPF/DMARC estricto el dominio es un vector de suplantación.

## Arquitectura

El tráfico entra por Cloudflare, sale del centro de datos de Cloudflare hacia el servidor únicamente a través del túnel saliente (sin puerto de entrada), llega a `nginx` corriendo en Docker, y `nginx` lo enruta al contenedor del servicio correspondiente según el dominio (por ejemplo, este portafolio). Todos los servicios corren en contenedores separados, con el código de cada uno en su propio directorio versionado y los datos (cuando existen) fuera de ese código.

## Resultados

El servidor quedó operando con cero puertos web expuestos directamente y con toda la configuración del proxy y de los servicios versionada en git. Este portafolio es el primer sitio que corre sobre esa infraestructura. El aprendizaje más concreto fue entender por qué "Cloudflare como proxy" no basta por sí solo si Docker o el firewall dejan una puerta abierta por otro lado.
