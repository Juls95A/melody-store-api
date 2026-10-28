import { Router } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { crearProductosController } from "./productos.controller";

// Rutas de /api/productos (POST, PUT y DELETE se protegen en el Paso 6)
export function crearProductosRouter(repo: ProductoRepository): Router {
  const router = Router();
  const controller = crearProductosController(repo);

  router.get("/", controller.listar);
  router.get("/:id", controller.obtener);
  router.post("/", controller.crear);
  router.put("/:id", controller.actualizar);
  router.delete("/:id", controller.eliminar);

  return router;
}
