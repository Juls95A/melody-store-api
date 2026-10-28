import { NextFunction, Request, Response } from "express";
import { AppError } from "../../domain/errors/AppError";

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

// Código 4xx que traen algunos errores de Express y body-parser
// (URL mal codificada, body demasiado grande, charset no soportado...)
function statusCliente(error: unknown): number | undefined {
  if (typeof error === "object" && error !== null && "status" in error && typeof error.status === "number") {
    return error.status >= 400 && error.status < 500 ? error.status : undefined;
  }
  return undefined;
}

// Convierte cualquier error en una respuesta HTTP (nunca devuelve el stack)
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  // Errores propios: su código HTTP y, si existen, los errores por campo
  if (error instanceof AppError) {
    res.status(error.statusCode).json(error.errors ? { message: error.message, errors: error.errors } : { message: error.message });
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

  const status = statusCliente(error);
  if (status) {
    const message = status === 413 ? "El cuerpo de la petición es demasiado grande" : "Petición inválida";
    res.status(status).json({ message });
    return;
  }

  // Error inesperado: se registra en consola, pero al cliente solo va un mensaje genérico
  console.error(error);
  res.status(500).json({ message: "Error interno del servidor" });
}
