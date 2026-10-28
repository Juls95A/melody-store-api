import { Router } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { validar } from "../middlewares/validar";
import { crearProductosController } from "./productos.controller";
import {
  actualizarProductoSchema,
  crearProductoSchema,
  idParamsSchema,
  listarProductosQuerySchema,
} from "./productos.schemas";

// Rutas de /api/productos (POST, PUT y DELETE se protegen en el Paso 6)
export function crearProductosRouter(repo: ProductoRepository): Router {
  const router = Router();
  const controller = crearProductosController(repo);

  router.get("/", validar({ query: listarProductosQuerySchema }), controller.listar);
  router.get("/:id", validar({ params: idParamsSchema }), controller.obtener);
  router.post("/", validar({ body: crearProductoSchema }), controller.crear);
  router.put("/:id", validar({ params: idParamsSchema, body: actualizarProductoSchema }), controller.actualizar);
  router.delete("/:id", validar({ params: idParamsSchema }), controller.eliminar);

  return router;
}
