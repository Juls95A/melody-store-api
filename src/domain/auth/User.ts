export type Role = "admin" | "user";

// Usuario tal como se devuelve en las respuestas (sin password)
export type User = {
  id: number;
  nombre: string;
  email: string;
  role: Role;
  createdAt: Date;
};

// Usuario completo, solo para uso interno (incluye el hash)
export type UserConPassword = User & {
  password: string;
};

// Datos para registrarse
export type RegisterDTO = {
  nombre: string;
  email: string;
  password: string;
};

// Datos para iniciar sesión
export type LoginDTO = {
  email: string;
  password: string;
};

// Datos que guarda el token
export type TokenPayload = {
  id: number;
  role: Role;
};

// Respuesta del login
export type AuthResponse = {
  token: string;
  user: User;
};

// Quita el password copiando solo los campos públicos
export function aUserPublico(user: UserConPassword): User {
  return {
    id: user.id,
    nombre: user.nombre,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}
