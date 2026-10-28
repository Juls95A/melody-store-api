import { Prisma } from "@prisma/client";
import { prisma } from "../prisma/client";
import { ActualizarProductoDTO, CrearProductoDTO, FiltrosProducto, Producto } from "../../domain/productos/Producto";
import { ProductoRepository } from "../../domain/productos/ProductoRepository";

// Implementación del repositorio de productos usando Prisma
export class PrismaProductoRepository implements ProductoRepository {
  async listar(filtros: FiltrosProducto, skip: number, take: number): Promise<{ data: Producto[]; total: number }> {
    // Construye el filtro de Prisma solo con los valores recibidos
    const where: Prisma.ProductoWhereInput = {
      categoria: filtros.categorias ? { in: filtros.categorias } : undefined,
      nombre: filtros.busqueda ? { contains: filtros.busqueda, mode: "insensitive" } : undefined,
      precio: { gte: filtros.precioMin, lte: filtros.precioMax },
    };

    const [data, total] = await Promise.all([
      prisma.producto.findMany({ where, skip, take, orderBy: { id: "asc" } }),
      prisma.producto.count({ where }),
    ]);
    return { data, total };
  }

  async buscarPorId(id: number): Promise<Producto | null> {
    return prisma.producto.findUnique({ where: { id } });
  }

  async crear(datos: CrearProductoDTO): Promise<Producto> {
    return prisma.producto.create({ data: datos });
  }

  async actualizar(id: number, datos: ActualizarProductoDTO): Promise<Producto> {
    return prisma.producto.update({ where: { id }, data: datos });
  }

  async eliminar(id: number): Promise<void> {
    await prisma.producto.delete({ where: { id } });
  }
}
