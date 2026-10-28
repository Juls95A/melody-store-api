import { z } from "zod";
import { ESTADOS_SOLICITUD, METODOS_PAGO } from "../../domain/solicitudes/Solicitud";
import { ENTERO_MAX } from "../productos/productos.schemas";

// Body para crear una solicitud (si mandan "userId" se descarta)
export const crearSolicitudSchema = z.object(
  {
    productoId: z
      .number({ error: "El productoId es obligatorio y debe ser un número" })
      .int("El productoId debe ser un número entero")
      .positive("El productoId debe ser mayor que 0")
      .max(ENTERO_MAX, "El productoId es demasiado grande"),
    telefono: z
      .string({ error: "El teléfono es obligatorio" })
      .trim()
      .regex(/^[+\d][\d\s()-]{6,}$/, "El teléfono no es válido"),
    asunto: z
      .string({ error: "El asunto es obligatorio" })
      .trim()
      .min(1, "El asunto es obligatorio"),
    // Opcional, pero si viene debe tener al menos 10 caracteres
    mensaje: z
      .string({ error: "El mensaje debe ser un texto" })
      .trim()
      .min(10, "El mensaje debe tener al menos 10 caracteres")
      .optional(),
    cantidad: z
      .number({ error: "La cantidad es obligatoria y debe ser un número" })
      .int("La cantidad debe ser un número entero")
      .min(1, "La cantidad debe ser al menos 1")
      .max(10, "La cantidad no puede ser mayor que 10")
      .default(1),
    direccionEnvio: z
      .string({ error: "La dirección de envío es obligatoria" })
      .trim()
      .min(5, "La dirección de envío debe tener al menos 5 caracteres"),
    ciudad: z
      .string({ error: "La ciudad es obligatoria" })
      .trim()
      .min(3, "La ciudad debe tener al menos 3 caracteres"),
    // Solo la opción elegida; no se reciben ni guardan datos de tarjeta
    metodoPago: z.enum(METODOS_PAGO, {
      error: `El método de pago debe ser uno de: ${METODOS_PAGO.join(", ")}`,
    }),
  },
  { error: "El cuerpo de la petición debe ser un objeto JSON" }
);

// Body para cambiar el estado
export const actualizarEstadoSchema = z.object(
  {
    estado: z.enum(ESTADOS_SOLICITUD, {
      error: `El estado debe ser uno de: ${ESTADOS_SOLICITUD.join(", ")}`,
    }),
  },
  { error: "El cuerpo de la petición debe ser un objeto JSON" }
);

// Query de paginación
export const paginacionQuerySchema = z.object({
  page: z.coerce
    .number({ error: "page debe ser un número" })
    .int("page debe ser un número entero")
    .positive("page debe ser mayor que 0")
    .optional(),
  limit: z.coerce
    .number({ error: "limit debe ser un número" })
    .int("limit debe ser un número entero")
    .positive("limit debe ser mayor que 0")
    .max(50, "limit no puede ser mayor que 50")
    .optional(),
});

export type CrearSolicitudBody = z.infer<typeof crearSolicitudSchema>;
export type ActualizarEstadoBody = z.infer<typeof actualizarEstadoSchema>;
export type PaginacionQuery = z.infer<typeof paginacionQuerySchema>;
