import { NextFunction, Request, Response } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";
import { crearSolicitud } from "../../application/solicitudes/crearSolicitud";
import { listarMisSolicitudes, listarSolicitudes } from "../../application/solicitudes/listarSolicitudes";
import { obtenerSolicitud } from "../../application/solicitudes/obtenerSolicitud";
import { actualizarEstadoSolicitud } from "../../application/solicitudes/actualizarEstadoSolicitud";
import { eliminarSolicitud } from "../../application/solicitudes/eliminarSolicitud";
import { usuarioActual } from "../middlewares/autenticar";
import { IdParams } from "../productos/productos.schemas";
import { ActualizarEstadoBody, CrearSolicitudBody, PaginacionQuery } from "./solicitudes.schemas";

// Controlador de solicitudes: recibe datos ya validados y llama a los casos de uso
export function crearSolicitudesController(repo: SolicitudRepository, productoRepo: ProductoRepository) {
  return {
    async crear(req: Request<Request["params"], unknown, CrearSolicitudBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        // El userId sale siempre del token
        const solicitud = await crearSolicitud(repo, productoRepo, usuarioActual(req).id, req.body);
        res.status(201).json(solicitud);
      } catch (error) {
        next(error);
      }
    },

    async listarMias(
      req: Request<Request["params"], unknown, unknown, PaginacionQuery>,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const resultado = await listarMisSolicitudes(repo, usuarioActual(req).id, req.query.page, req.query.limit);
        res.status(200).json(resultado);
      } catch (error) {
        next(error);
      }
    },

    async listarTodas(
      req: Request<Request["params"], unknown, unknown, PaginacionQuery>,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const resultado = await listarSolicitudes(repo, req.query.page, req.query.limit);
        res.status(200).json(resultado);
      } catch (error) {
        next(error);
      }
    },

    async obtener(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
      try {
        const solicitud = await obtenerSolicitud(repo, usuarioActual(req), req.params.id);
        res.status(200).json(solicitud);
      } catch (error) {
        next(error);
      }
    },

    async actualizarEstado(req: Request<IdParams, unknown, ActualizarEstadoBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        const solicitud = await actualizarEstadoSolicitud(repo, req.params.id, req.body.estado);
        res.status(200).json(solicitud);
      } catch (error) {
        next(error);
      }
    },

    async eliminar(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
      try {
        await eliminarSolicitud(repo, usuarioActual(req), req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
