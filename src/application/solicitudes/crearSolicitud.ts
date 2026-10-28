import { NotFoundError } from "../../domain/errors/AppError";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";
import { CrearSolicitudDTO, SolicitudDetalle } from "../../domain/solicitudes/Solicitud";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";

// Crea una solicitud a nombre del usuario autenticado
export async function crearSolicitud(
  repo: SolicitudRepository,
  productoRepo: ProductoRepository,
  userId: number,
  datos: CrearSolicitudDTO
): Promise<SolicitudDetalle> {
  // El producto debe existir
  const producto = await productoRepo.buscarPorId(datos.productoId);
  if (!producto) {
    throw new NotFoundError("Producto no encontrado");
  }

  return repo.crear({ ...datos, userId });
}
