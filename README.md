# Melody Store API

Este es el backend de mi tienda de instrumentos Melody Store. Lo hice para la Entrega 3 de Desarrollo Web y continúa el sitio que hice en la Entrega 1. La API maneja el registro y login de usuarios, el catálogo de productos y las solicitudes de compra.

API: https://melody-store-api.onrender.com

Sitio: https://melody-store-v2.vercel.app

Frontend: https://github.com/Juls95A/melody-store-v2

## Qué usé

Node.js, Express, TypeScript, Prisma, PostgreSQL en Neon, bcrypt, JWT y zod.

## Cómo está organizado

Separé el código en 4 capas dentro de `src`. En `domain` están las entidades, los errores y las interfaces de los repositorios y servicios, sin depender de ninguna librería. En `application` están los casos de uso, como registrar, hacer login o crear una solicitud. En `infrastructure` está lo que habla con el exterior: Prisma, bcrypt, JWT y la lectura de variables de entorno. Prisma solo se usa en esta capa. En `interface` están las rutas de Express, los controladores, los esquemas de zod y los middlewares.

## Base de datos

Tengo tres tablas: `users`, `productos` y `solicitudes`. Cada usuario tiene un rol (`admin` o `user`) y la contraseña se guarda como hash de bcrypt. Una solicitud es un pedido que hace un usuario sobre un producto, con cantidad, teléfono, dirección de envío, ciudad, método de pago y estado. Por eso `solicitudes` tiene una relación con `users` y otra con `productos`, y un usuario o un producto pueden tener muchas solicitudes. Si se borra un producto, se borran también sus solicitudes.

## Endpoints

| Método | Ruta | Quién puede usarlo |
| --- | --- | --- |
| GET | /api/health | Cualquiera |
| POST | /api/auth/register | Cualquiera |
| POST | /api/auth/login | Cualquiera |
| GET | /api/auth/me | Usuario con sesión |
| GET | /api/productos | Cualquiera |
| GET | /api/productos/:id | Cualquiera |
| POST | /api/productos | Admin |
| PUT | /api/productos/:id | Admin |
| DELETE | /api/productos/:id | Admin |
| POST | /api/solicitudes | Usuario con sesión |
| GET | /api/solicitudes/mias | Usuario con sesión (solo las suyas) |
| GET | /api/solicitudes | Admin |
| GET | /api/solicitudes/:id | El dueño de la solicitud o admin |
| PUT | /api/solicitudes/:id | Admin (cambia el estado) |
| DELETE | /api/solicitudes/:id | El dueño de la solicitud o admin |

## Correrlo en local

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run seed
npm run dev
```

Antes de migrar hay que poner en `.env` la URL de una base PostgreSQL. El servidor queda corriendo en el puerto 4000.

## Variables de entorno

`DATABASE_URL`: la cadena de conexión a PostgreSQL.

`JWT_SECRET`: el secreto con el que se firman los tokens. Si falta, el servidor no arranca.

`JWT_EXPIRES_IN`: cuánto dura el token, por ejemplo `1d`.

`PORT`: el puerto del servidor.

`FRONTEND_URL`: la URL del frontend que tiene permiso por CORS.

## Usuarios de prueba

El seed crea dos usuarios: `admin@melodystore.com` / `Admin123*` con rol admin y `user@melodystore.com` / `User123*` con rol user. Los dejé solo para la entrega, para que se pueda probar.

## Despliegue

La API está en Render con auto-deploy desde la rama `main`, y la base de datos está en Neon. CORS solo deja pasar peticiones desde la URL del sitio en Vercel.

## Decisiones técnicas

### Flujo de un login

### Dónde guardo el token y qué riesgo tiene

### Cuándo responde 401 y cuándo 403

### Uso de IA

## Captura de Network

![Captura de Network](c:\Users\admin\Pictures\melody-store-api\melody-store-api.png)
