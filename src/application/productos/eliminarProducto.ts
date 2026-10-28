import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { obtenerProducto } from "./obtenerProducto";

// Elimina un producto existente o lanza NotFoundError
export async function eliminarProducto(repo: ProductoRepository, id: number): Promise<void> {
  await obtenerProducto(repo, id);
  await repo.eliminar(id);
}
