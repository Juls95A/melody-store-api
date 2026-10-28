import { NextFunction, Request, Response } from "express";
import { ActualizarProductoDTO, CrearProductoDTO } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { listarProductos } from "../../application/productos/listarProductos";
import { obtenerProducto } from "../../application/productos/obtenerProducto";
import { crearProducto } from "../../application/productos/crearProducto";
import { actualizarProducto } from "../../application/productos/actualizarProducto";
import { eliminarProducto } from "../../application/productos/eliminarProducto";

// Convierte un parámetro de la query a número (o undefined si no viene)
function aNumero(valor: unknown): number | undefined {
  if (typeof valor !== "string" || valor.trim() === "") return undefined;
  const numero = Number(valor);
  return Number.isNaN(numero) ? undefined : numero;
}

// Convierte un parámetro de la query a texto (o undefined si no viene)
function aTexto(valor: unknown): string | undefined {
  return typeof valor === "string" && valor.trim() !== "" ? valor.trim() : undefined;
}

// Controlador de productos: solo traduce HTTP y llama a los casos de uso
export function crearProductosController(repo: ProductoRepository) {
  return {
    async listar(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const filtros = {
          categoria: aTexto(req.query.categoria),
          busqueda: aTexto(req.query.q),
          precioMin: aNumero(req.query.precioMin),
          precioMax: aNumero(req.query.precioMax),
        };
        const resultado = await listarProductos(repo, filtros, aNumero(req.query.page), aNumero(req.query.limit));
        res.status(200).json(resultado);
      } catch (error) {
        next(error);
      }
    },

    async obtener(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await obtenerProducto(repo, Number(req.params.id));
        res.status(200).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async crear(req: Request, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await crearProducto(repo, req.body as CrearProductoDTO);
        res.status(201).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async actualizar(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
      try {
        const producto = await actualizarProducto(repo, Number(req.params.id), req.body as ActualizarProductoDTO);
        res.status(200).json(producto);
      } catch (error) {
        next(error);
      }
    },

    async eliminar(req: Request<{ id: string }>, res: Response, next: NextFunction): Promise<void> {
      try {
        await eliminarProducto(repo, Number(req.params.id));
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    },
  };
}
