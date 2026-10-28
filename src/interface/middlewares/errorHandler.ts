import { NextFunction, Request, Response } from "express";
import { AppError, ValidationError } from "../../domain/errors/AppError";

// Respuestas para los códigos de error conocidos de Prisma.
// Se reconocen por su "code" para no importar Prisma fuera de infrastructure.
const ERRORES_PRISMA: Record<string, { status: number; message: string }> = {
  P2002: { status: 409, message: "Ya existe un registro con esos datos" },
  P2025: { status: 404, message: "Recurso no encontrado" },
  P2003: { status: 400, message: "La referencia a otro registro no es válida" },
};

// Devuelve el código de Prisma (P2002, P2025...) si el error lo tiene
function codigoPrisma(error: unknown): string | undefined {
  if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
    return error.code;
  }
  return undefined;
}

// JSON mal formado en el body (lo lanza express.json)
function esJsonInvalido(error: unknown): boolean {
  return error instanceof SyntaxError && "body" in error;
}

// Convierte cualquier error en una respuesta HTTP (nunca devuelve el stack)
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ValidationError) {
    res.status(error.statusCode).json({ message: error.message, errors: error.errors });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  const codigo = codigoPrisma(error);
  const errorPrisma = codigo ? ERRORES_PRISMA[codigo] : undefined;
  if (errorPrisma) {
    res.status(errorPrisma.status).json({ message: errorPrisma.message });
    return;
  }

  if (esJsonInvalido(error)) {
    res.status(400).json({ message: "El cuerpo de la petición no es un JSON válido" });
    return;
  }

  // Error inesperado: se registra en consola, pero al cliente solo va un mensaje genérico
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
