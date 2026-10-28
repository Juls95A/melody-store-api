import { UnauthorizedError } from "../../domain/errors/AppError";
import { User } from "../../domain/auth/User";
import { UserRepository } from "../../domain/auth/UserRepository";

// Devuelve el usuario de la sesión actual (sin password)
export async function obtenerUsuarioActual(repo: UserRepository, id: number): Promise<User> {
  const user = await repo.buscarPorId(id);
  // Si el usuario ya no existe, la sesión deja de ser válida
  if (!user) {
    throw new UnauthorizedError("Debes iniciar sesión");
  }
  return user;
}
