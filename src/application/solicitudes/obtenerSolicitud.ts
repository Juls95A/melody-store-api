import { ForbiddenError, NotFoundError } from "../../domain/errors/AppError";
import { TokenPayload } from "../../domain/auth/User";
import { SolicitudDetalle } from "../../domain/solicitudes/Solicitud";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";

// Devuelve una solicitud si quien la pide es el dueño o un admin
export async function obtenerSolicitud(
  repo: SolicitudRepository,
  solicitante: TokenPayload,
  id: number
): Promise<SolicitudDetalle> {
  const solicitud = await repo.buscarPorId(id);
  if (!solicitud) {
    throw new NotFoundError("Solicitud no encontrada");
  }

  const esDueno = solicitud.userId === solicitante.id;
  if (!esDueno && solicitante.role !== "admin") {
    throw new ForbiddenError("No tienes permisos para esta acción");
  }
  return solicitud;
}
