import { z } from "zod";

// Email sin espacios y en minúsculas
const email = z
  .string({ error: "El correo es obligatorio" })
  .trim()
  .toLowerCase()
  .pipe(z.email("El correo no es válido"));

// Body del registro (si mandan "role" se descarta)
export const registerSchema = z.object(
  {
    nombre: z
      .string({ error: "El nombre es obligatorio" })
      .trim()
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    email,
    password: z
      .string({ error: "La contraseña es obligatoria" })
      .min(6, "La contraseña debe tener al menos 6 caracteres"),
  },
  { error: "El cuerpo de la petición debe ser un objeto JSON" }
);

// Body del login
export const loginSchema = z.object(
  {
    email,
    password: z.string({ error: "La contraseña es obligatoria" }).min(1, "La contraseña es obligatoria"),
  },
  { error: "El cuerpo de la petición debe ser un objeto JSON" }
);

export type RegisterBody = z.infer<typeof registerSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
