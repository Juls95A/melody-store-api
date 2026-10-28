import "dotenv/config";
import express from "express";
import cors from "cors";
import { leerConfiguracion } from "./infrastructure/config/env";
import { healthRouter } from "./interface/health/health.router";
import { crearProductosRouter } from "./interface/productos/productos.router";
import { crearAuthRouter } from "./interface/auth/auth.router";
import { notFound } from "./interface/middlewares/notFound";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { PrismaProductoRepository } from "./infrastructure/productos/PrismaProductoRepository";
import { PrismaUserRepository } from "./infrastructure/auth/PrismaUserRepository";
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
const hashService = new BcryptHashService();
const tokenService = new JwtTokenService(config.jwtSecret, config.jwtExpiresIn);

// Rutas
app.use("/api/health", healthRouter);
app.use("/api/auth", crearAuthRouter(userRepository, hashService, tokenService));
app.use("/api/productos", crearProductosRouter(productoRepository));

// Rutas inexistentes y manejo centralizado de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Servidor escuchando en el puerto ${config.port}`);
});
