import { NextFunction, Request, Response } from "express";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { listarProductos } from "../../application/productos/listarProductos";
import { obtenerProducto } from "../../application/productos/obtenerProducto";
import { crearProducto } from "../../application/productos/crearProducto";
import { actualizarProducto } from "../../application/productos/actualizarProducto";
import { eliminarProducto } from "../../application/productos/eliminarProducto";
import { ActualizarProductoBody, CrearProductoBody, IdParams, ListarProductosQuery } from "./productos.schemas";

// Controlador de productos: recibe datos ya validados y llama a los casos de uso
export function crearProductosController(repo: ProductoRepository) {
  return {
    async listar(
      req: Request<Request["params"], unknown, unknown, ListarProductosQuery>,
      res: Response,
      next: NextFunction
    ): Promise<void> {
      try {
        const { page, limit, categoria, q, precioMin, precioMax } = req.query;
        const resultado = await listarProductos(repo, { categoria, busqueda: q, precioMin, precioMax }, page, limit);
        res.status(200).json(resultado);
      } catch (error) {
        next(error);
      }
    },

    async obtener(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await obtenerProducto(repo, req.params.id);
        res.status(200).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async crear(req: Request<Request["params"], unknown, CrearProductoBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await crearProducto(repo, req.body);
        res.status(201).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async actualizar(req: Request<IdParams, unknown, ActualizarProductoBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await actualizarProducto(repo, req.params.id, req.body);
        res.status(200).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async eliminar(req: Request<IdParams>, res: Response, next: NextFunction): Promise<void> {
      try {
        await eliminarProducto(repo, req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
