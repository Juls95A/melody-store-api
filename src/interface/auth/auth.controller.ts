import { NextFunction, Request, Response } from "express";
import { HashService } from "../../domain/auth/HashService";
import { TokenService } from "../../domain/auth/TokenService";
import { UserRepository } from "../../domain/auth/UserRepository";
import { registrar } from "../../application/auth/registrar";
import { login } from "../../application/auth/login";
import { LoginBody, RegisterBody } from "./auth.schemas";

// Controlador de autenticación: recibe datos validados y llama a los casos de uso
export function crearAuthController(repo: UserRepository, hashService: HashService, tokenService: TokenService) {
  return {
    async register(req: Request<Request["params"], unknown, RegisterBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        const user = await registrar(repo, hashService, req.body);
        res.status(201).json({ user });
      } catch (error) {
        next(error);
      }
    },

    async login(req: Request<Request["params"], unknown, LoginBody>, res: Response, next: NextFunction): Promise<void> {
      try {
        const resultado = await login(repo, hashService, tokenService, req.body);
        res.status(200).json(resultado);
      } catch (error) {
        next(error);
      }
    },
  };
}
