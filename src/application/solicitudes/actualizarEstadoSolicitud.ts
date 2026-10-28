import { NotFoundError } from "../../domain/errors/AppError";
import { EstadoSolicitud, SolicitudDetalle } from "../../domain/solicitudes/Solicitud";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";

// Cambia el estado de una solicitud existente (solo admin, se controla en el router)
export async function actualizarEstadoSolicitud(
  repo: SolicitudRepository,
  id: number,
  estado: EstadoSolicitud
): Promise<SolicitudDetalle> {
  const solicitud = await repo.buscarPorId(id);
  if (!solicitud) {
    throw new NotFoundError("Solicitud no encontrada");
  }
  return repo.actualizarEstado(id, estado);
}
