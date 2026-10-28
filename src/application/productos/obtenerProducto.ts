import { NotFoundError } from "../../domain/errors/NotFoundError";
import { Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";

// Devuelve un producto por id o lanza NotFoundError
export async function obtenerProducto(repo: ProductoRepository, id: number): Promise<Producto> {
  // Un id inválido nunca puede existir
  if (!Number.isInteger(id) || id <= 0) {
    throw new NotFoundError("Producto no encontrado");
  }

  const producto = await repo.buscarPorId(id);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }
  return producto;
}
