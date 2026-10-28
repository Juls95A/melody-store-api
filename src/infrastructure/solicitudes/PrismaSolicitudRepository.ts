import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { EstadoSolicitud, esEstadoSolicitud, esMetodoPago, NuevaSolicitud, SolicitudDetalle } from "../../domain/solicitudes/Solicitud";
import { SolicitudRepository } from "../../domain/solicitudes/SolicitudRepository";

// Datos relacionados que se incluyen en cada solicitud
const incluir = {
  user: { select: { nombre: true, email: true } },
  producto: { select: { nombre: true, imagen: true, precio: true } },
} as const;

type FilaSolicitud = Prisma.SolicitudGetPayload<{ include: typeof incluir }>;

// Convierte la fila de Prisma al tipo del dominio (estado y metodoPago son texto en la BD)
function aDominio(fila: FilaSolicitud): SolicitudDetalle {
  if (!esEstadoSolicitud(fila.estado)) {
    throw new Error(`Estado desconocido en la solicitud ${fila.id}: ${fila.estado}`);
  }
  if (!esMetodoPago(fila.metodoPago)) {
    throw new Error(`Método de pago desconocido en la solicitud ${fila.id}: ${fila.metodoPago}`);
  }
  return { ...fila, estado: fila.estado, metodoPago: fila.metodoPago };
}

// Implementación del repositorio de solicitudes usando Prisma
export class PrismaSolicitudRepository implements SolicitudRepository {
  async crear(datos: NuevaSolicitud): Promise<SolicitudDetalle> {
    const fila = await prisma.solicitud.create({ data: datos, include: incluir });
    return aDominio(fila);
  }

  async listar(userId: number | undefined, skip: number, take: number): Promise<{ data: SolicitudDetalle[]; total: number }> {
    const where: Prisma.SolicitudWhereInput = { userId };
    const [filas, total] = await Promise.all([
      prisma.solicitud.findMany({ where, skip, take, include: incluir, orderBy: { createdAt: "desc" } }),
      prisma.solicitud.count({ where }),
    ]);
    return { data: filas.map(aDominio), total };
  }

  async buscarPorId(id: number): Promise<SolicitudDetalle | null> {
    const fila = await prisma.solicitud.findUnique({ where: { id }, include: incluir });
    return fila ? aDominio(fila) : null;
  }

  async actualizarEstado(id: number, estado: EstadoSolicitud): Promise<SolicitudDetalle> {
    const fila = await prisma.solicitud.update({ where: { id }, data: { estado }, include: incluir });
    return aDominio(fila);
  }

  async eliminar(id: number): Promise<void> {
    await prisma.solicitud.delete({ where: { id } });
  }
}
