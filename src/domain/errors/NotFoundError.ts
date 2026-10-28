// Error que indica que un recurso no existe
export class NotFoundError extends Error {
  constructor(mensaje: string) {
    super(mensaje);
    this.name = "NotFoundError";
  }
}
