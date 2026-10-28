import { Router } from "express";
import { HashService } from "../../domain/auth/HashService";
import { TokenService } from "../../domain/auth/TokenService";
import { UserRepository } from "../../domain/auth/UserRepository";
import { validar } from "../middlewares/validar";
import { crearAuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schemas";

// Rutas de /api/auth
export function crearAuthRouter(repo: UserRepository, hashService: HashService, tokenService: TokenService): Router {
  const router = Router();
  const controller = crearAuthController(repo, hashService, tokenService);

  router.post("/register", validar({ body: registerSchema }), controller.register);
  router.post("/login", validar({ body: loginSchema }), controller.login);

  return router;
}
