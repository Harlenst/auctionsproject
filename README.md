# Casa de Subastas HS

Plataforma web para la gestión de subastas en línea. Permite a los usuarios registrarse, iniciar sesión, publicar artículos, participar en subastas mediante ofertas y consultar los cambios en tiempo real.

## 1. Tecnologías utilizadas

### Backend
- Node.js
- Express
- TypeScript
- MongoDB con Mongoose
- JSON Web Tokens (JWT)
- Socket.IO
- Jest

### Frontend
- React 19
- TypeScript
- Vite
- React Router
- Axios
- Socket.IO Client
- Lucide React

## 2. Estructura del proyecto

```text
subastas-api/
├── subastas-frontend/
│   ├── public/
│   ├── src/
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
├── tests/
├── .env
├── .env.example
├── .gitignore
├── app.ts
├── jest.config.js
├── package.json
└── package-lock.json
```

## 3. Requisitos previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- npm
- Una instancia de MongoDB o una base de datos en MongoDB Atlas.
- Git (opcional, para clonar el repositorio).

## 4. Instalación

Clona el repositorio:

```bash
git clone https://github.com/Harlenst/auctionsproject.git
```

Entra a la carpeta del backend:

```bash
cd auctionsproject
```

Instala las dependencias:

```bash
npm install
```

Después, instala las dependencias del frontend:

```bash
cd subastas-frontend
npm install
```

## 5. Configuración de variables de entorno

### Backend

Crea un archivo `.env` en la raíz del backend:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=1h
CLIENT_URL=http://localhost:5173
MONGODB_URI=your_mongodb_connection_string
PAYMENT_WEBHOOK_SECRET=your_payment_webhook_secret
```

Descripción:

| Variable | Descripción |
|---|---|
| PORT | Puerto del servidor backend. |
| JWT_SECRET | Clave para firmar los tokens JWT. |
| JWT_EXPIRES_IN | Tiempo de expiración de los tokens. |
| CLIENT_URL | Dirección del frontend. |
| MONGODB_URI | Cadena de conexión a MongoDB. |
| PAYMENT_WEBHOOK_SECRET | Clave para verificar la autenticidad de las notificaciones del webhook de pagos. |

### Frontend

Crea un archivo `.env` dentro de `subastas-frontend`:

```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
```

Estas variables permiten configurar la comunicación con la API y el servidor Socket.IO.

**Importante:** No publiques archivos `.env` ni claves privadas en el repositorio. Utiliza `.env.example` con valores de ejemplo.

## 6. Ejecución del proyecto

### Iniciar el backend

Desde la carpeta raíz:

```bash
npm run dev
```

El servidor estará disponible en:

```text
http://localhost:5000
```

### Iniciar el frontend

Abre una segunda terminal:

```bash
cd subastas-frontend
npm run dev
```

El frontend estará disponible en:

```text
http://localhost:5173
```

## 7. Funcionalidades principales

### Gestión de usuarios
- Registro de usuarios.
- Inicio de sesión.
- Autenticación mediante JWT.
- Protección de rutas privadas.
- Persistencia de la sesión al recargar la página.
- Cierre de sesión.

### Gestión de subastas
- Consulta de subastas disponibles.
- Visualización del detalle de cada subasta.
- Creación de subastas.
- Cancelación y cierre de subastas.
- Consulta del estado y precio actual.

### Sistema de ofertas
- Registro de ofertas.
- Validación del monto mínimo permitido.
- Actualización del precio actual.
- Conteo de ofertas realizadas.
- Identificación del mejor postor.

### Comunicación en tiempo real
La aplicación utiliza Socket.IO para comunicar los cambios de las subastas sin necesidad de recargar la página.

Entre los eventos utilizados se encuentran:

| Evento | Descripción |
|---|---|
| `auction:join` | Permite unirse a una sala de subasta. |
| `auction:leave` | Permite salir de una sala de subasta. |
| `bid:created` | Notifica que se registró una nueva oferta. |
| `bid:outbid` | Notifica que otro usuario superó una oferta. |
| `auction:closed` | Notifica el cierre de una subasta. |

## 8. Reglas de negocio

El sistema contempla reglas para garantizar el funcionamiento correcto de las subastas:

- El precio base y el incremento mínimo deben ser mayores que cero.
- La fecha de cierre debe ser posterior a la fecha de creación.
- La duración de una subasta debe estar entre una hora y treinta días.
- Una subasta con ofertas registradas no puede cancelarse.
- Solo se pueden realizar ofertas en subastas abiertas.
- El vendedor no puede ofertar en su propia subasta.
- La primera oferta debe ser igual o superior al precio base.
- Las siguientes ofertas deben respetar el incremento mínimo.
- El mejor postor no puede superarse a sí mismo.
- Las ofertas rechazadas se registran.
- Al cerrar una subasta se determina si existe un ganador o si quedó desierta.
- Las órdenes de pago tienen un plazo de 48 horas.

## 9. Seguridad

El proyecto implementa mecanismos de seguridad como:

- Autenticación mediante JSON Web Tokens.
- Protección de rutas privadas.
- Verificación de autenticación para las conexiones Socket.IO.
- Validación de ofertas y reglas de negocio.
- Verificación de firmas HMAC-SHA256 para las notificaciones del webhook de pagos.

## 10. Pruebas y compilación

### Backend

Ejecutar las pruebas:

```bash
npm test
```

Compilar TypeScript:

```bash
npm run build
```

### Frontend

Compilar la aplicación:

```bash
npm run build
```

Ejecutar el análisis de código:

```bash
npm run lint
```

## 11. Documentación de la API

La documentación de los endpoints se encuentra en:

```text
docs/openapi.json
```

Este archivo contiene la especificación OpenAPI de la API.

## 12. Repositorio

GitHub:

https://github.com/Harlenst/auctionsproject

## 13. Estado del proyecto

El proyecto integra un backend y un frontend para gestionar subastas en línea, con autenticación de usuarios, protección de rutas, gestión de ofertas, comunicación en tiempo real y procesamiento de notificaciones de pagos.

**Proyecto académico – Electiva II: Desarrollo Backend.**