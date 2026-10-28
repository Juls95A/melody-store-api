import { Role, User, UserConPassword } from "./User";

// Datos para guardar un usuario (password ya hasheado)
export type NuevoUser = {
  nombre: string;
  email: string;
  password: string;
  role: Role;
};

// Contrato que debe cumplir cualquier almacenamiento de usuarios
export interface UserRepository {
  buscarPorEmail(email: string): Promise<UserConPassword | null>;
  buscarPorId(id: number): Promise<User | null>;
  crear(datos: NuevoUser): Promise<User>;
}
