import "dotenv/config";
import express from "express";
import cors from "cors";
import { healthRouter } from "./interface/health/health.router";
import { crearProductosRouter } from "./interface/productos/productos.router";
import { notFound } from "./interface/middlewares/notFound";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { PrismaProductoRepository } from "./infrastructure/productos/PrismaProductoRepository";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// CORS solo para el frontend configurado (si falta FRONTEND_URL no se permite ningún origen)
app.use(cors({ origin: process.env.FRONTEND_URL ?? false, credentials: true }));

// Permite recibir cuerpos JSON
app.use(express.json());

// Repositorios concretos que se inyectan en las rutas
const productoRepository = new PrismaProductoRepository();

// Rutas
app.use("/api/health", healthRouter);
app.use("/api/productos", crearProductosRouter(productoRepository));

// Rutas inexistentes y manejo centralizado de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
