import { Router } from "express";
import { HashService } from "../../domain/auth/HashService";
import { TokenService } from "../../domain/auth/TokenService";
import { UserRepository } from "../../domain/auth/UserRepository";
import { validar } from "../middlewares/validar";
import { Middleware } from "../middlewares/autenticar";
import { crearAuthController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.schemas";

// Rutas de /api/auth
export function crearAuthRouter(
  repo: UserRepository,
  hashService: HashService,
  tokenService: TokenService,
  autenticar: Middleware
): Router {
  const router = Router();
  const controller = crearAuthController(repo, hashService, tokenService);

  router.post("/register", validar({ body: registerSchema }), controller.register);
  router.post("/login", validar({ body: loginSchema }), controller.login);
  router.get("/me", autenticar, controller.me);

  return router;
}
