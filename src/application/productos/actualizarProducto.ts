import { ActualizarProductoDTO, Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { obtenerProducto } from "./obtenerProducto";

// Actualiza un producto existente o lanza NotFoundError
export async function actualizarProducto(
  repo: ProductoRepository,
  id: number,
  datos: ActualizarProductoDTO
): Promise<Producto> {
  await obtenerProducto(repo, id);
  return repo.actualizar(id, datos);
}
