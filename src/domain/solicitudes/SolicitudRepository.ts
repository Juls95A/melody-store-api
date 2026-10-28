import { EstadoSolicitud, NuevaSolicitud, SolicitudDetalle } from "./Solicitud";

// Contrato que debe cumplir cualquier almacenamiento de solicitudes
export interface SolicitudRepository {
  crear(datos: NuevaSolicitud): Promise<SolicitudDetalle>;
  // Si se indica userId, solo devuelve las solicitudes de ese usuario
  listar(userId: number | undefined, skip: number, take: number): Promise<{ data: SolicitudDetalle[]; total: number }>;
  buscarPorId(id: number): Promise<SolicitudDetalle | null>;
  actualizarEstado(id: number, estado: EstadoSolicitud): Promise<SolicitudDetalle>;
  eliminar(id: number): Promise<void>;
}
