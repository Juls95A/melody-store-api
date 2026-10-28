import { Router } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";
import { validar } from "../middlewares/validar";
import { Middleware } from "../middlewares/autenticar";
import { soloAdmin } from "../middlewares/soloAdmin";
import { idParamsSchema } from "../productos/productos.schemas";
import { crearSolicitudesController } from "./solicitudes.controller";
import { actualizarEstadoSchema, crearSolicitudSchema, paginacionQuerySchema } from "./solicitudes.schemas";

// Rutas de /api/solicitudes (todas requieren sesión)
export function crearSolicitudesRouter(
  repo: SolicitudRepository,
  productoRepo: ProductoRepository,
  autenticar: Middleware
): Router {
  const router = Router();
  const controller = crearSolicitudesController(repo, productoRepo);

  router.post("/", autenticar, validar({ body: crearSolicitudSchema }), controller.crear);
  // /mias va antes de /:id para que no se confunda con un id
  router.get("/mias", autenticar, validar({ query: paginacionQuerySchema }), controller.listarMias);
  router.get("/", autenticar, soloAdmin, validar({ query: paginacionQuerySchema }), controller.listarTodas);
  router.get("/:id", autenticar, validar({ params: idParamsSchema }), controller.obtener);
  router.put(
    "/:id",
    autenticar,
    soloAdmin,
    validar({ params: idParamsSchema, body: actualizarEstadoSchema }),
    controller.actualizarEstado
  );
  router.delete("/:id", autenticar, validar({ params: idParamsSchema }), controller.eliminar);

  return router;
}
