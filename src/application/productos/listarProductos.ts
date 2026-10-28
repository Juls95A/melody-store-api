import { Paginado } from "../../domain/productos/Paginado";
import { FiltrosProducto, Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { paginar } from "../shared/paginar";

// Lista productos paginados aplicando los filtros recibidos
export async function listarProductos(
  repo: ProductoRepository,
  filtros: FiltrosProducto,
  page?: number,
  limit?: number
): Promise<Paginado<Producto>> {
  const paginacion = paginar(page, limit);
  const { data, total } = await repo.listar(filtros, paginacion.skip, paginacion.limit);

  return {
    pagination: {
      page: paginacion.page,
      limit: paginacion.limit,
      total,
      totalPages: Math.ceil(total / paginacion.limit),
    },
    data,
  };
}
