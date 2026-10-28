// Estados posibles de una solicitud
export const ESTADOS_SOLICITUD = ["pendiente", "atendida", "cancelada"] as const;
export type EstadoSolicitud = (typeof ESTADOS_SOLICITUD)[number];

// Indica si un texto es un estado válido
export function esEstadoSolicitud(valor: string): valor is EstadoSolicitud {
  return (ESTADOS_SOLICITUD as readonly string[]).includes(valor);
}

// Métodos de pago permitidos (solo la opción elegida, nunca datos de tarjeta)
export const METODOS_PAGO = ["contra_entrega", "transferencia", "tarjeta_al_recibir"] as const;
export type MetodoPago = (typeof METODOS_PAGO)[number];

// Indica si un texto es un método de pago válido
export function esMetodoPago(valor: string): valor is MetodoPago {
  return (METODOS_PAGO as readonly string[]).includes(valor);
}

// Solicitud (pedido) de un usuario sobre un producto
export type Solicitud = {
  id: number;
  userId: number;
  productoId: number;
  telefono: string;
  asunto: string;
  mensaje: string | null;
  cantidad: number;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: MetodoPago;
  estado: EstadoSolicitud;
  createdAt: Date;
};

// Solicitud con los datos básicos del usuario y del producto
export type SolicitudDetalle = Solicitud & {
  user: { nombre: string; email: string };
  producto: { nombre: string; imagen: string; precio: number };
};

// Datos que envía el usuario para crear una solicitud
export type CrearSolicitudDTO = {
  productoId: number;
  telefono: string;
  asunto: string;
  mensaje?: string;
  cantidad: number;
  direccionEnvio: string;
  ciudad: string;
  metodoPago: MetodoPago;
};

// Datos para guardar una solicitud (el userId sale del token)
export type NuevaSolicitud = CrearSolicitudDTO & {
  userId: number;
};
