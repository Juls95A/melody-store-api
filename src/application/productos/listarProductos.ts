import { Paginado } from "../../domain/productos/Paginado";
import { FiltrosProducto, Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";

const LIMITE_POR_DEFECTO = 6;
const LIMITE_MAXIMO = 50;

// Lista productos paginados aplicando los filtros recibidos
export async function listarProductos(
  repo: ProductoRepository,
  filtros: FiltrosProducto,
  page?: number,
  limit?: number
): Promise<Paginado<Producto>> {
  // Normaliza página y límite a valores válidos
  const pagina = page && page > 0 ? Math.floor(page) : 1;
  const limite = limit && limit > 0 ? Math.min(Math.floor(limit), LIMITE_MAXIMO) : LIMITE_POR_DEFECTO;

  const { data, total } = await repo.listar(filtros, (pagina - 1) * limite, limite);

  return {
    pagination: {
      page: pagina,
      limit: limite,
      total,
      totalPages: Math.ceil(total / limite),
    },
    data,
  };
}
