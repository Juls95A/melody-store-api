import { TokenPayload } from "../../domain/auth/User";

// Agrega req.user a Express (lo llena el middleware autenticar)
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export {};
