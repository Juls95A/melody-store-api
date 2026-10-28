// Estados posibles de una solicitud
export const ESTADOS_SOLICITUD = ["pendiente", "atendida", "cancelada"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

// Indica si un texto es un estado válido
export function esEstadoSolicitud(valor: string): valor is EstadoSolicitud {
  return (ESTADOS_SOLICITUD as readonly string[]).includes(valor);
}

// Solicitud de un usuario sobre un producto
export type Solicitud = {
  id: number;
  userId: number;
  productoId: number;
  telefono: string;
  asunto: string;
  mensaje: string;
  estado: EstadoSolicitud;
  createdAt: Date;
};

// Solicitud con los datos básicos del usuario y del producto
export type SolicitudDetalle = Solicitud & {
  user: { nombre: string; email: string };
  producto: { nombre: string; imagen: string };
};

// Datos que envía el usuario para crear una solicitud
export type CrearSolicitudDTO = {
  productoId: number;
  telefono: string;
  asunto: string;
  mensaje: string;
};

// Datos para guardar una solicitud (el userId sale del token)
export type NuevaSolicitud = CrearSolicitudDTO & {
  userId: number;
};
