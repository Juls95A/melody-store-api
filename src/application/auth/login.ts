import { UnauthorizedError } from "../../domain/errors/AppError";
import { HashService } from "../../domain/auth/HashService";
import { TokenService } from "../../domain/auth/TokenService";
import { AuthResponse, aUserPublico, LoginDTO } from "../../domain/auth/User";
import { UserRepository } from "../../domain/auth/UserRepository";

// Inicia sesión y devuelve el token junto al usuario (sin password)
export async function login(
  repo: UserRepository,
  hashService: HashService,
  tokenService: TokenService,
  datos: LoginDTO
): Promise<AuthResponse> {
  const user = await repo.buscarPorEmail(datos.email);
  const passwordCorrecto = user ? await hashService.comparar(datos.password, user.password) : false;

  // Mismo mensaje si falla el email o la contraseña, para no revelar cuál fue
  if (!user || !passwordCorrecto) {
    throw new UnauthorizedError("Credenciales inválidas");
  }

  const token = tokenService.generar({ id: user.id, role: user.role });
  return { token, user: aUserPublico(user) };
}
