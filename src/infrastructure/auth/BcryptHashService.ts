import bcrypt from "bcrypt";
import { HashService } from "../../domain/auth/HashService";

const RONDAS = 10;

// Hash de contraseñas con bcrypt
export class BcryptHashService implements HashService {
  async hash(texto: string): Promise<string> {
    return bcrypt.hash(texto, RONDAS);
  }

  async comparar(texto: string, hash: string): Promise<boolean> {
    return bcrypt.compare(texto, hash);
  }
}
