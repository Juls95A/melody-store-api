import { ForbiddenError, UnauthorizedError } from "../../domain/errors/AppError";
import { Middleware } from "./autenticar";

// Permite continuar solo a usuarios con role "admin" (usar después de autenticar)
export const soloAdmin: Middleware = (req, _res, next) => {
  if (!req.user) {
    next(new UnauthorizedError("Debes iniciar sesión"));
    return;
  }
  if (req.user.role !== "admin") {
    next(new ForbiddenError("No tienes permisos para esta acción"));
    return;
  }
  next();
};
