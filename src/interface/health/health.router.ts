import { Request, Response, Router } from "express";

// Ruta para comprobar que el servidor está activo
export const healthRouter = Router();

healthRouter.get("/", (_req: Request, res: Response) => {
  res.json({ ok: true });
});
