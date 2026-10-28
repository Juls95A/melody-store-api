import "dotenv/config";
import express from "express";
import { healthRouter } from "./interface/health/health.router";
import { crearProductosRouter } from "./interface/productos/productos.router";
import { errorHandler } from "./interface/middlewares/errorHandler";
import { PrismaProductoRepository } from "./infrastructure/productos/PrismaProductoRepository";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Permite recibir cuerpos JSON
app.use(express.json());

// Repositorios concretos que se inyectan en las rutas
const productoRepository = new PrismaProductoRepository();

// Rutas
app.use("/api/health", healthRouter);
app.use("/api/productos", crearProductosRouter(productoRepository));

// Manejo centralizado de errores (siempre al final)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
