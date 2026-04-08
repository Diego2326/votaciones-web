# Votaciones Web

## Desarrollo local

Para evitar errores de CORS en desarrollo, el frontend usa rutas relativas por defecto:

- API REST: `/api`
- WebSocket/SockJS: `/ws`

El servidor de Vite reenvia esas rutas a `http://localhost:8080`.

Importante:

- En desarrollo, no apuntes `VITE_API_URL` a `http://localhost:8080` salvo que Spring Boot ya tenga CORS configurado.
- Si usas URL absoluta, el navegador hace la llamada directa al backend y Vite ya no puede actuar como proxy.

## Variables opcionales

Si necesitas apuntar a otro backend, define estas variables:

```bash
VITE_API_URL=http://tu-backend:8080
VITE_WS_URL=http://tu-backend:8080/ws
```

Eso es correcto para ambientes donde el backend ya responde con los headers CORS adecuados.
