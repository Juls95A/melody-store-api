import { TokenPayload } from "./User";

// Servicio para generar y verificar tokens de sesión
export interface TokenService {
  generar(payload: TokenPayload): string;
  // Lanza UnauthorizedError si el token es inválido o expiró
  verificar(token: string): TokenPayload;
}
