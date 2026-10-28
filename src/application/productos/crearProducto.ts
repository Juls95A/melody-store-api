import { CrearProductoDTO, Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";

// Crea un nuevo producto en el catálogo
export async function crearProducto(repo: ProductoRepository, datos: CrearProductoDTO): Promise<Producto> {
  return repo.crear(datos);
}
