import { ConflictError } from "../../domain/errors/AppError";
import { HashService } from "../../domain/auth/HashService";
import { RegisterDTO, User } from "../../domain/auth/User";
import { UserRepository } from "../../domain/auth/UserRepository";

// Registra un usuario nuevo, siempre con role "user"
export async function registrar(repo: UserRepository, hashService: HashService, datos: RegisterDTO): Promise<User> {
  const existente = await repo.buscarPorEmail(datos.email);
  if (existente) {
    throw new ConflictError("El correo ya está registrado", { email: "Este correo ya está registrado" });
  }

  const password = await hashService.hash(datos.password);
  return repo.crear({ nombre: datos.nombre, email: datos.email, password, role: "user" });
}
