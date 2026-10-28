import { ActualizarProductoDTO, CrearProductoDTO, FiltrosProducto, Producto } from "./Producto";

// Contrato que debe cumplir cualquier almacenamiento de productos
export interface ProductoRepository {
  listar(filtros: FiltrosProducto, skip: number, take: number): Promise<{ data: Producto[]; total: number }>;
  buscarPorId(id: number): Promise<Producto | null>;
  crear(datos: CrearProductoDTO): Promise<Producto>;
  actualizar(id: number, datos: ActualizarProductoDTO): Promise<Producto>;
  eliminar(id: number): Promise<void>;
}
