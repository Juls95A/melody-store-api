import { NextFunction, Request, RequestHandler, Response } from "express";
import { z } from "zod";

// Esquemas opcionales para cada parte de la petición
type Esquemas<P, B, Q> = {
  params?: z.ZodType<P>;
  body?: z.ZodType<B>;
  query?: z.ZodType<Q>;
};

// Agrega los errores de zod al objeto { campo: mensaje }
function agregarErrores(errores: Record<string, string>, error: z.ZodError, origen: string): void {
  for (const issue of error.issues) {
    const campo = issue.path.length > 0 ? issue.path.join(".") : origen;
    // Solo se guarda el primer mensaje de cada campo
    if (!errores[campo]) {
      errores[campo] = issue.message;
    }
  }
}

// Middleware genérico: valida params, body y query con zod
// y reemplaza los datos de la petición por los ya validados
export function validar<P = Request["params"], B = unknown, Q = Request["query"]>(
  esquemas: Esquemas<P, B, Q>
): RequestHandler<P, unknown, B, Q> {
  return (req: Request<P, unknown, B, Q>, res: Response, next: NextFunction): void => {
    const errores: Record<string, string> = {};

    if (esquemas.params) {
      const resultado = esquemas.params.safeParse(req.params);
      if (resultado.success) req.params = resultado.data;
      else agregarErrores(errores, resultado.error, "params");
    }

    if (esquemas.body) {
      const resultado = esquemas.body.safeParse(req.body);
      if (resultado.success) req.body = resultado.data;
      else agregarErrores(errores, resultado.error, "body");
    }

    if (esquemas.query) {
      const resultado = esquemas.query.safeParse(req.query);
      if (resultado.success) req.query = resultado.data;
      else agregarErrores(errores, resultado.error, "query");
    }

    if (Object.keys(errores).length > 0) {
      res.status(400).json({ message: "Datos inválidos", errors: errores });
      return;
    }
    next();
  };
}
