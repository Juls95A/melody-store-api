import { Router } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { validar } from "../middlewares/validar";
import { Middleware } from "../middlewares/autenticar";
import { soloAdmin } from "../middlewares/soloAdmin";
import { crearProductosController } from "./productos.controller";
import {
  actualizarProductoSchema,
  crearProductoSchema,
  idParamsSchema,
  listarProductosQuerySchema,
} from "./productos.schemas";

// Rutas de /api/productos: lectura pública, escritura solo para admin
export function crearProductosRouter(repo: ProductoRepository, autenticar: Middleware): Router {
  const router = Router();
  const controller = crearProductosController(repo);

  router.get("/", validar({ query: listarProductosQuerySchema }), controller.listar);
  router.get("/:id", validar({ params: idParamsSchema }), controller.obtener);
  router.post("/", autenticar, soloAdmin, validar({ body: crearProductoSchema }), controller.crear);
  router.put(
    "/:id",
    autenticar,
    soloAdmin,
    validar({ params: idParamsSchema, body: actualizarProductoSchema }),
    controller.actualizar
  );
  router.delete("/:id", autenticar, soloAdmin, validar({ params: idParamsSchema }), controller.eliminar);

  return router;
}
