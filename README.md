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

Cuando lleno el formulario de /login, el componente LoginForm valida que el correo y la contraseña estén bien escritos. Después el hook useAuth llama a authService.login, que usa la función request de http.ts para hacer un POST a /api/auth/login.

En el backend, primero el middleware validar revisa el body con zod. Luego el caso de uso login busca el usuario por email y compara la contraseña con bcrypt. Si coincide, se firma un JWT con JWT_SECRET que solo lleva el id y el role, y que vence en 1 día. La API responde el token y los datos del usuario, sin la contraseña.

El frontend guarda el token y el usuario en localStorage, y la barra de navegación cambia. Cuando entro a Mis solicitudes, http.ts agrega solo el header Authorization: Bearer <token>. En el backend, el middleware autenticar verifica el token, deja el usuario en req.user y el controlador devuelve solo las solicitudes de ese usuario.

### Dónde guardo el token y qué riesgo tiene

Lo guardo en localStorage con la clave melody_token. Lo elegí porque es sencillo y la sesión no se pierde al recargar la página. El riesgo es que si la página tuviera una falla de XSS, un script podría leer el token y usarlo. Una opción más segura sería guardarlo en una cookie httpOnly. Para reducir el problema, el token dura poco (1 día) y solo lleva el id y el role, nada de datos sensibles.

### Cuándo responde 401 y cuándo 403

La API responde 401 cuando no sabe quién eres: no mandas token, el token está mal o ya venció. Responde 403 cuando sí sabe quién eres pero no tienes permiso.

Un ejemplo real: un DELETE a /api/productos/1 sin token da 401. La misma petición con el token de user@melodystore.com da 403, porque borrar productos es solo para admin. Lo probé en la API desplegada en Render y dio esos códigos.

### Uso de IA

Usé Claude Code para ir generando el código por pasos: primero el backend y luego el frontend. Después de cada paso lo probaba y hacía commit. Cosas que tuve que corregir o decidir:

- El backend estaba en el puerto 3000 y chocaba con Next.js, así que lo pasé al 4000.
- La URL que me dio Neon traía -pooler y channel_binding, y tuve que quitarlos para que Prisma funcionara. Tampoco usé el prompt automático que da Neon, porque podía conectar la base sin Prisma.
- La paginación no se notaba porque tengo pocos productos por categoría, así que agregué el filtro de varias categorías en GET /api/productos.
- Cuando pedí la canasta, cambié las solicitudes para que funcionen como pedidos, con dirección de envío, ciudad y método de pago, sin guardar datos de tarjeta.
- En la auditoría salieron dos casos que daban error 500 en vez de 400 (ids muy grandes y algunos errores de Express), y se corrigieron.

## Captura de Network

![Captura de Network](c:\Users\admin\Pictures\melody-store-api\melody-store-api.png)
