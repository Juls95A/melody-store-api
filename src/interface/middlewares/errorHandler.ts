import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../domain/errors/NotFoundError";

// Convierte los errores de la aplicación en respuestas HTTP
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof NotFoundError) {
    res.status(404).json({ message: error.message });
    return;
  }

  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
