// Error base de la aplicación: cada error propio indica su código HTTP
export class AppError extends Error {
  constructor(mensaje: string, public readonly statusCode: number) {
    super(mensaje);
    this.name = new.target.name;
  }
}

// 400: los datos recibidos no son válidos
export class ValidationError extends AppError {
  constructor(mensaje = "Datos inválidos", public readonly errors: Record<string, string> = {}) {
    super(mensaje, 400);
  }
}

// 401: falta autenticación o es inválida
export class UnauthorizedError extends AppError {
  constructor(mensaje = "No autenticado") {
    super(mensaje, 401);
  }
}

// 403: el usuario no tiene permisos
export class ForbiddenError extends AppError {
  constructor(mensaje = "No tienes permisos para esta acción") {
    super(mensaje, 403);
  }
}

// 404: el recurso no existe
export class NotFoundError extends AppError {
  constructor(mensaje = "Recurso no encontrado") {
    super(mensaje, 404);
  }
}

// 409: conflicto con un dato existente (por ejemplo, email repetido)
export class ConflictError extends AppError {
  constructor(mensaje = "El recurso ya existe") {
    super(mensaje, 409);
  }
}
