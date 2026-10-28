import { z } from "zod";

// Categorías permitidas en el catálogo
const CATEGORIAS = ["guitarras", "bajos", "teclados", "baterias", "accesorios"] as const;

const nombre = z
  .string({ error: "El nombre es obligatorio" })
  .trim()
  .min(2, "El nombre debe tener al menos 2 caracteres");

const categoria = z.enum(CATEGORIAS, {
  error: `La categoría debe ser una de: ${CATEGORIAS.join(", ")}`,
});

const precio = z
  .number({ error: "El precio es obligatorio y debe ser un número" })
  .int("El precio debe ser un número entero")
  .positive("El precio debe ser mayor que 0");

const descripcion = z
  .string({ error: "La descripción es obligatoria" })
  .trim()
  .min(10, "La descripción debe tener al menos 10 caracteres");

const imagen = z
  .string({ error: "La imagen es obligatoria" })
  .trim()
  .min(1, "La imagen no puede estar vacía");

// Body para crear un producto
export const crearProductoSchema = z.object(
  { nombre, categoria, precio, descripcion, imagen },
  { error: "El cuerpo de la petición debe ser un objeto JSON" }
);

// Body para actualizar: mismos campos, opcionales, pero al menos uno
export const actualizarProductoSchema = crearProductoSchema
  .partial()
  .refine((datos) => Object.values(datos).some((valor) => valor !== undefined), {
    error: "Debes enviar al menos un campo para actualizar",
  });

// Params con el id del producto
export const idParamsSchema = z.object({
  id: z.coerce
    .number({ error: "El id debe ser un número" })
    .int("El id debe ser un número entero")
    .positive("El id debe ser mayor que 0"),
});

// Query del listado (los valores llegan como texto y se convierten a número)
export const listarProductosQuerySchema = z.object({
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
  categoria: categoria.optional(),
  q: z.string().trim().max(100, "La búsqueda no puede superar 100 caracteres").optional(),
  precioMin: z.coerce
    .number({ error: "precioMin debe ser un número" })
    .int("precioMin debe ser un número entero")
    .nonnegative("precioMin no puede ser negativo")
    .optional(),
  precioMax: z.coerce
    .number({ error: "precioMax debe ser un número" })
    .int("precioMax debe ser un número entero")
    .nonnegative("precioMax no puede ser negativo")
    .optional(),
});

// Tipos inferidos a partir de los esquemas
export type CrearProductoBody = z.infer<typeof crearProductoSchema>;
export type ActualizarProductoBody = z.infer<typeof actualizarProductoSchema>;
export type IdParams = z.infer<typeof idParamsSchema>;
export type ListarProductosQuery = z.infer<typeof listarProductosQuerySchema>;
