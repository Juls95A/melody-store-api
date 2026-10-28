import jwt, { SignOptions } from "jsonwebtoken";
import { UnauthorizedError } from "../../domain/errors/AppError";
import { TokenPayload } from "../../domain/auth/User";
import { TokenService } from "../../domain/auth/TokenService";

// Generación y verificación de tokens JWT
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

  verificar(token: string): TokenPayload {
    let decodificado: string | jwt.JwtPayload;
    try {
      // Revisa firma y expiración
      decodificado = jwt.verify(token, this.secreto, { algorithms: ["HS256"] });
    } catch {
      throw new UnauthorizedError("Token inválido o expirado");
    }

    // Comprueba que el contenido tenga la forma esperada
    if (
      typeof decodificado === "string" ||
      typeof decodificado.id !== "number" ||
      (decodificado.role !== "admin" && decodificado.role !== "user")
    ) {
      throw new UnauthorizedError("Token inválido o expirado");
    }

    return { id: decodificado.id, role: decodificado.role };
  }
}
