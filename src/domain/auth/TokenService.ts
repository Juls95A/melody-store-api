import { TokenPayload } from "./User";

// Servicio para generar tokens de sesión
export interface TokenService {
  generar(payload: TokenPayload): string;
}
