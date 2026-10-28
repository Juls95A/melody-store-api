import { prisma } from "../prisma/client";
import { User, UserConPassword } from "../../domain/auth/User";
import { NuevoUser, UserRepository } from "../../domain/auth/UserRepository";

// Campos públicos del usuario (nunca incluye password)
const camposPublicos = { id: true, nombre: true, email: true, role: true, createdAt: true } as const;

// Implementación del repositorio de usuarios usando Prisma
export class PrismaUserRepository implements UserRepository {
  async buscarPorEmail(email: string): Promise<UserConPassword | null> {
    return prisma.user.findUnique({ where: { email } });
  }

  async buscarPorId(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id }, select: camposPublicos });
  }

  async crear(datos: NuevoUser): Promise<User> {
    return prisma.user.create({ data: datos, select: camposPublicos });
  }
}
