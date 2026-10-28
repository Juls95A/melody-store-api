import { TokenPayload } from "../../domain/auth/User";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";
import { obtenerSolicitud } from "./obtenerSolicitud";

// Elimina una solicitud si quien la pide es el dueño o un admin
export async function eliminarSolicitud(repo: SolicitudRepository, solicitante: TokenPayload, id: number): Promise<void> {
  // Lanza 404 o 403 si corresponde
  await obtenerSolicitud(repo, solicitante, id);
  await repo.eliminar(id);
}
