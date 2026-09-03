Plataforma de Subastas en Línea

API desarrollada con Node.js, Express y TypeScript para gestionar usuarios, artículos, categorías, subastas, pujas y órdenes de pago.

Tecnologías

Node.js

Express

TypeScript

Jest

ts-jest

Arquitectura

El proyecto utiliza una separación por capas:

domain/
application/
infrastructure/
controllers/
routes/

Domain

Contiene las entidades y reglas principales del negocio.

domain/
├── entities/
└── value-objects/

Entidades principales:

User

Article

Category

Auction

Bid

RejectedBidAttempt

PaymentOrder

PaymentEvent

Notification

Objetos de valor:

Money

Email

AuctionStatus

Application

Contiene los casos de uso y los puertos de persistencia.

application/
├── ports/
└── use-cases/

Casos de uso principales:

CreateAuction

GetAuctions

GetAuction

PlaceBid

CancelAuction

CloseAuction

CreateUser

LoginUser

ConfirmPayment

ExpirePaymentOrder

Infrastructure

Contiene las implementaciones de los repositorios.

infrastructure/
└── repositories/

Actualmente se utiliza persistencia en memoria.

Controllers

Reciben las solicitudes HTTP y ejecutan los casos de uso correspondientes.

controllers/
├── auctions.ts
└── users.ts

Routes

Define las rutas disponibles de la API.

routes/
├── auctions.ts
└── users.ts

Instalación

Clonar el repositorio:

git clone https://github.com/Harlenst/auctionsproject.git

Ingresar al proyecto:

cd auctionsproject

Instalar las dependencias:

npm install

Ejecución

Compilar el proyecto:

npm run build

Ejecutar la aplicación:

npm run app

Servidor:

http://localhost:5000

Para ejecutar en modo desarrollo:

npm run dev

Pruebas

Las pruebas se realizan utilizando Jest.

npm test

Las pruebas principales verifican las reglas de negocio de las subastas:

Puja válida.

Puja menor al precio base.

Puja menor al incremento mínimo.

Puja realizada por el vendedor.

Puja del mejor postor.

Cancelación de una subasta.

Cancelación de una subasta con pujas.

Cierre de una subasta con pujas.

Cierre de una subasta sin pujas.

Segundo intento de cierre.

API

La API utiliza el prefijo:

/api/v1

Usuarios

Registrar usuario:

POST /api/v1/users

Iniciar sesión:

POST /api/v1/auth/login

Subastas

Obtener todas las subastas:

GET /api/v1/auctions

Obtener una subasta:

GET /api/v1/auctions/:id

Crear una subasta:

POST /api/v1/auctions

Cancelar una subasta:

PATCH /api/v1/auctions/:id/cancel

Cerrar una subasta:

PATCH /api/v1/auctions/:id/close

Pujas

Registrar una puja:

POST /api/v1/auctions/:id/bids

Reglas principales

El sistema implementa las principales reglas de negocio relacionadas con las subastas:

El precio base debe ser mayor que cero.

El incremento mínimo debe ser mayor que cero.

La fecha de cierre debe ser posterior a la publicación.

La duración de la subasta debe estar entre una hora y treinta días.

Una subasta con pujas no puede ser cancelada.

Solo una subasta abierta puede recibir pujas.

El vendedor no puede pujar en su propia subasta.

La primera puja debe ser igual o superior al precio base.

Las siguientes pujas deben superar la puja actual por el incremento mínimo.

El mejor postor no puede superar su propia puja.

Las pujas rechazadas se almacenan con su motivo.

Una subasta con pujas tiene un ganador al momento del cierre.

Una subasta sin pujas queda como desierta.

Una subasta no puede cerrarse nuevamente después de haber sido cerrada.

Persistencia

La primera versión utiliza repositorios en memoria.

Los puertos se encuentran en:

application/ports/

Las implementaciones se encuentran en:

infrastructure/repositories/

Esto permite cambiar posteriormente la implementación de persistencia sin modificar las reglas principales del dominio.

Documentación de la API

La documentación de la API se encuentra en:

docs/openapi.json

Seguridad

Las contraseñas de los usuarios son almacenadas utilizando un proceso de hash y no se devuelven en las respuestas de la API.

Git

El proyecto utiliza ramas para separar el desarrollo de las funcionalidades:

main
auctions
users
entities

Los commits utilizan mensajes descriptivos para identificar los cambios realizados.

Estado del proyecto

Esta versión contiene:

Modelo de dominio.

Entidades principales.

Objetos de valor.

Reglas de negocio.

Casos de uso.

Controladores.

Rutas.

Repositorios en memoria.

Pruebas automatizadas.

Documentación OpenAPI.

Las funcionalidades de persistencia con base de datos y comunicación en tiempo real mediante WebSockets corresponden a etapas posteriores del proyecto.