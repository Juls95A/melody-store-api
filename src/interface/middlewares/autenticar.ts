import { NextFunction, Request, Response } from "express";
import { UnauthorizedError } from "../../domain/errors/AppError";
import { TokenService } from "../../domain/auth/TokenService";
import { TokenPayload } from "../../domain/auth/User";

// Middleware genérico: se adapta a los tipos de params, body y query de cada ruta
// (así se puede combinar con validar() en cualquier orden)
export type Middleware = <P, B, Q>(req: Request<P, unknown, B, Q>, res: Response, next: NextFunction) => void;

// Crea el middleware que exige un token válido en "Authorization: Bearer <token>"
export function crearAutenticar(tokenService: TokenService): Middleware {
  return (req, _res, next) => {
    const header = req.headers.authorization;
    const [tipo, token] = header ? header.split(" ") : [];

    // Sin header o con un formato distinto a "Bearer <token>"
    if (tipo !== "Bearer" || !token) {
      next(new UnauthorizedError("Debes iniciar sesión"));
      return;
    }

    try {
      // Guarda { id, role } para los siguientes middlewares y controladores
      req.user = tokenService.verificar(token);
      next();
    } catch (error) {
      next(error);
    }
  };
}

// Devuelve el usuario que dejó autenticar en req.user (401 si no existe)
export function usuarioActual(req: { user?: TokenPayload }): TokenPayload {
  if (!req.user) {
    throw new UnauthorizedError("Debes iniciar sesión");
  }
  return req.user;
}
