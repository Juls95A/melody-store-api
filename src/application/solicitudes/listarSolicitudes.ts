import { Paginado } from "../../domain/productos/Paginado";
import { SolicitudDetalle } from "../../domain/solicitudes/Solicitud";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";
import { paginar } from "../shared/paginar";

// Lista solicitudes paginadas; si se indica userId, solo las de ese usuario
async function listar(
  repo: SolicitudRepository,
  userId: number | undefined,
  page?: number,
  limit?: number
): Promise<Paginado<SolicitudDetalle>> {
  const paginacion = paginar(page, limit);
  const { data, total } = await repo.listar(userId, paginacion.skip, paginacion.limit);

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

// Todas las solicitudes (para el admin)
export function listarSolicitudes(repo: SolicitudRepository, page?: number, limit?: number): Promise<Paginado<SolicitudDetalle>> {
  return listar(repo, undefined, page, limit);
}

// Solo las solicitudes del usuario indicado
export function listarMisSolicitudes(
  repo: SolicitudRepository,
  userId: number,
  page?: number,
  limit?: number
): Promise<Paginado<SolicitudDetalle>> {
  return listar(repo, userId, page, limit);
}
