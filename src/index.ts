import "dotenv/config";
import express from "express";
import cors from "cors";
import { leerConfiguracion } from "./infrastructure/config/env";
import { healthRouter } from "./interface/health/health.router";
import { crearProductosRouter } from "./interface/productos/productos.router";
import { crearAuthRouter } from "./interface/auth/auth.router";
import { crearSolicitudesRouter } from "./interface/solicitudes/solicitudes.router";
import { notFound } from "./interface/middlewares/notFound";
import { crearAutenticar } from "./interface/middlewares/autenticar";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { PrismaProductoRepository } from "./infrastructure/productos/PrismaProductoRepository";
import { PrismaUserRepository } from "./infrastructure/auth/PrismaUserRepository";
import { PrismaSolicitudRepository } from "./infrastructure/solicitudes/PrismaSolicitudRepository";
import { BcryptHashService } from "./infrastructure/auth/BcryptHashService";
import { JwtTokenService } from "./infrastructure/auth/JwtTokenService";

// Si falta JWT_SECRET el proceso termina aquí con un mensaje claro
const config = leerConfiguracion();

const app = express();

// CORS solo para el frontend configurado (si falta FRONTEND_URL no se permite ningún origen)
app.use(cors({ origin: config.frontendUrl ?? false, credentials: true }));

// Permite recibir cuerpos JSON
app.use(express.json());

// Implementaciones concretas que se inyectan en las rutas
const productoRepository = new PrismaProductoRepository();
const userRepository = new PrismaUserRepository();
const solicitudRepository = new PrismaSolicitudRepository();
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService(config.jwtSecret, config.jwtExpiresIn);

// Middleware de autenticación compartido por los routers
const autenticar = crearAutenticar(tokenService);

// Rutas
app.use("/api/health", healthRouter);
app.use("/api/auth", crearAuthRouter(userRepository, hashService, tokenService, autenticar));
app.use("/api/productos", crearProductosRouter(productoRepository, autenticar));
app.use("/api/solicitudes", crearSolicitudesRouter(solicitudRepository, productoRepository, autenticar));

// Rutas inexistentes y manejo centralizado de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
