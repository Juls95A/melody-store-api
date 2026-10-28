import jwt, { SignOptions } from "jsonwebtoken";
import { TokenPayload } from "../../domain/auth/User";
import { TokenService } from "../../domain/auth/TokenService";

// Generación de tokens JWT
export class JwtTokenService implements TokenService {
  constructor(
    private readonly secreto: string,
    private readonly expiraEn: string
  ) {}

  generar(payload: TokenPayload): string {
    // El token solo lleva id y role (jwt agrega iat y exp)
    const datos: TokenPayload = { id: payload.id, role: payload.role };
    // expiresIn acepta textos como "1d" o "2h"; se toma de la variable de entorno
    return jwt.sign(datos, this.secreto, { expiresIn: this.expiraEn as SignOptions["expiresIn"] });
  }
}
