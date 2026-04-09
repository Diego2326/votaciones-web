# Votaciones Web

Frontend web para administrar y ejecutar torneos de votacion con tres perfiles principales:

- `Votante`: entra solo con codigo PIN o QR, crea sesion y vota en matches.
- `Organizador`: crea torneos, configura acceso, carga participantes, arma rondas y ejecuta el torneo.
- `Admin`: ademas de lo anterior, administra usuarios y consulta auditoria global.

La aplicacion consume una API REST, usa WebSocket STOMP/SockJS para eventos en vivo y esta construida con `React 19`, `TypeScript`, `Vite`, `React Query`, `Zustand`, `React Hook Form` y `Zod`.

## Estado actual de la web

La web ya cubre el flujo principal del sistema:

- autenticacion de usuarios con login, registro, refresh y carga de perfil actual
- dashboard de organizacion
- CRUD operativo de torneos
- workspace por torneo con navegacion contextual
- configuracion de acceso del torneo
- generacion de PIN y QR de ingreso
- carga y edicion de participantes
- subida de foto de participante a Imgur
- creacion y control de rondas
- creacion manual y generacion automatica de matches
- asignacion manual de ganador
- flujo de votacion para participantes con sesion por torneo
- resultados por match, ronda y torneo
- actualizacion en vivo por WebSocket
- modo presentacion para proyectar el torneo
- administracion de usuarios
- auditoria

## Flujos por perfil

### Publico / votante

El votante no navega un catalogo publico de torneos. La entrada es solo por:

- `PIN` en `/vote/join?pin=XXXXXX`
- `QR` en `/join/:qrToken`
- codigo ingresado desde la landing `/`

Funciones disponibles:

- ingresar al torneo con `PIN` o `QR`
- crear sesion segun el modo de acceso del torneo:
  - `ANONYMOUS`
  - `DISPLAY_NAME`
  - `EMAIL_PASSWORD`
- continuar una sesion existente
- entrar al detalle del torneo una vez validado el acceso
- ver rondas disponibles
- ver matches de una ronda
- votar en un match usando `X-Tournament-Session`
- consultar si ya votaste
- ver resultados del match

### Organizador

Funciones principales:

- ver dashboard con resumen de torneos
- crear torneos
- editar torneos
- publicar, activar, pausar y cerrar torneos
- configurar el modo de acceso del torneo
- regenerar el `PIN`
- generar y mostrar `QR` de acceso basado en la URL actual del frontend
- administrar participantes:
  - crear
  - editar
  - eliminar
  - activar/inactivar
  - subir foto
- administrar rondas:
  - crear
  - abrir
  - cerrar
  - procesar
  - publicar resultados
- administrar matches:
  - crear manualmente
  - generar automaticamente
  - asignar ganador manualmente
- ver resultados del torneo y eventos en vivo
- abrir la pantalla de presentacion del torneo

### Admin

Ademas del flujo de organizador, el admin puede:

- listar usuarios
- consultar detalle de usuarios
- cambiar estado de usuarios
- actualizar roles
- consultar auditoria global

## Pantallas principales

### Organizacion

- `/dashboard`: panel principal del organizador/admin
- `/tournaments`: listado de torneos
- `/tournaments/new`: creacion de torneo
- `/tournaments/:id`: centro operativo del torneo
- `/tournaments/:id/edit`: configuracion del torneo
- `/tournaments/:id/participants`: roster del torneo
- `/tournaments/:id/rounds`: estructura de rondas
- `/rounds/:id`: control de una ronda
- `/rounds/:id/matches`: gestion de matches
- `/tournaments/:id/presentation`: modo presentacion

### Votacion

- `/`: landing publica para entrar con codigo
- `/vote`: lobby del votante
- `/vote/join`: entrada por PIN
- `/join/:qrToken`: entrada por QR
- `/vote/tournaments/:id`: detalle del torneo ya validado
- `/vote/rounds/:id`: listado de duelos de una ronda
- `/vote/matches/:id`: pantalla de voto

Nota:

- `/vote/tournaments` ya no se usa como listado publico; ahora redirige al inicio del votante.

## Presentacion del torneo

La vista de presentacion esta pensada para pantalla grande o streaming interno.

Soporta:

- `ELIMINATION` y `BRACKET`: vista por rondas con matches y barras de resultado
- `POLL` y `ROUND_BASED`: leaderboard acumulado y desglose por ronda
- actualizacion en vivo por eventos del torneo

## Subida de imagenes

Las fotos de participantes se suben de forma anonima a Imgur desde el frontend.

Se requiere:

```bash
VITE_IMGUR_CLIENT_ID=tu_client_id_publico
```

Si esa variable no existe, el formulario de participantes mostrara error al intentar guardar una foto.

## Desarrollo local

Para evitar errores de CORS en desarrollo, el frontend usa rutas relativas por defecto:

- API REST: `/api`
- WebSocket/SockJS: `/ws`

Vite reenvia esas rutas a `http://localhost:8080`.

### Variables de entorno

Archivo sugerido:

```bash
VITE_API_URL=/api
VITE_WS_URL=/ws
VITE_IMGUR_CLIENT_ID=
```

Si necesitas apuntar a otro backend:

```bash
VITE_API_URL=http://tu-backend:8080
VITE_WS_URL=http://tu-backend:8080/ws
VITE_IMGUR_CLIENT_ID=tu_client_id_publico
```

Importante:

- en desarrollo, evita apuntar `VITE_API_URL` directo al backend si no tienes CORS configurado
- si usas URL absoluta, el navegador llamara al backend sin pasar por el proxy de Vite

## Scripts

```bash
npm install
npm run dev
npm run lint
npm run build
npm run preview
```

## Integraciones

- API REST propia para auth, torneos, join, participantes, rondas, matches, votos, usuarios y auditoria
- WebSocket STOMP/SockJS para eventos en vivo del torneo
- Imgur para subida temporal de imagenes de participantes
- API de QR pública para generar codigos QR del join

## Estructura resumida

```text
src/
  app/                  providers, router y stores globales
  components/           layout, feedback y UI base
  core/                 cliente API, config, constantes, tipos y utils
  features/
    auth/               login, registro y perfil
    join/               ingreso por PIN o QR
    tournaments/        CRUD, workspace y presentacion
    participants/       roster y fotos
    rounds/             control de rondas
    matches/            creacion y resolucion de matches
    votes/              flujo del votante y resultados
    users/              administracion de usuarios
    audit/              auditoria
    websocket/          suscripciones STOMP
```

## Calidad

Actualmente el proyecto valida con:

- `npm run lint`
- `npm run build`

Nota:

- el build puede mostrar la advertencia de Vite por chunk mayor a `500 kB`

## Licencia

Este proyecto se distribuye bajo licencia `MIT`. El texto completo esta en [LICENSE](/home/diego/WebstormProjects/votaciones-web/LICENSE).
