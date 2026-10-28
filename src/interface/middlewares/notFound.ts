import { Request, Response } from "express";

// Responde 404 cuando ninguna ruta coincide
export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Ruta no encontrada" });
}
