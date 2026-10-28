import "dotenv/config";
import bcrypt from "bcrypt";
import { Role } from "@prisma/client";
import { prisma } from "../src/infrastructure/prisma/client";

// Catálogo inicial de la tienda
const productos = [
  {
    nombre: "Guitarra eléctrica",
    categoria: "guitarras",
    precio: 1299000,
    descripcion: "Guitarra eléctrica de seis cuerdas para practicar y tocar en vivo.",
    imagen: "/img/guitarra_electrica.png",
  },
  {
    nombre: "Guitarra acústica",
    categoria: "guitarras",
    precio: 749000,
    descripcion: "Guitarra acústica de madera con sonido cálido y equilibrado.",
    imagen: "/img/guitarra_acustica.png",
  },
  {
    nombre: "Bajo eléctrico",
    categoria: "bajos",
    precio: 1199000,
    descripcion: "Bajo eléctrico de cuatro cuerdas, ideal para ensayos y escenario.",
    imagen: "/img/bajo_electrico.png",
  },
  {
    nombre: "Teclado",
    categoria: "teclados",
    precio: 899000,
    descripcion: "Teclado digital de 61 teclas con sonidos y ritmos integrados.",
    imagen: "/img/teclado.png",
  },
  {
    nombre: "Batería acústica",
    categoria: "baterias",
    precio: 2499000,
    descripcion: "Batería acústica completa para comenzar a tocar con tu banda.",
    imagen: "/img/bateria_acustica.png",
  },
  {
    nombre: "Micrófono",
    categoria: "accesorios",
    precio: 329000,
    descripcion: "Micrófono dinámico para voces, ensayos y presentaciones.",
    imagen: "/img/microfono.png",
  },
  {
    nombre: "Afinador",
    categoria: "accesorios",
    precio: 59000,
    descripcion: "Afinador digital de pinza con pantalla fácil de leer.",
    imagen: "/img/afinador.png",
  },
  {
    nombre: "Pedal de efectos",
    categoria: "accesorios",
    precio: 249000,
    descripcion: "Pedal compacto para añadir efectos a tu guitarra eléctrica.",
    imagen: "/img/pedalmultiefectos.png",
  },
  {
    nombre: "Cuerdas",
    categoria: "accesorios",
    precio: 79000,
    descripcion: "Juego de cuerdas de repuesto para guitarra acústica o eléctrica.",
    imagen: "/img/cuerdas.png",
  },
  {
    nombre: "Baquetas",
    categoria: "accesorios",
    precio: 45000,
    descripcion: "Par de baquetas de madera para batería y percusión.",
    imagen: "/img/baquetas.png",
  },
];

// Usuarios de prueba
const usuarios = [
  { nombre: "Administrador", email: "admin@melodystore.com", password: "Admin123*", role: Role.admin },
  { nombre: "Usuario Prueba", email: "user@melodystore.com", password: "User123*", role: Role.user },
];

async function main(): Promise<void> {
  // Borra los productos (sus solicitudes se eliminan en cascada) y los vuelve a cargar
  await prisma.producto.deleteMany();
  await prisma.producto.createMany({ data: productos });
  console.log(`Productos cargados: ${productos.length}`);

  // Crea o actualiza los usuarios con la contraseña hasheada
  for (const usuario of usuarios) {
    const hash = await bcrypt.hash(usuario.password, 10);
    await prisma.user.upsert({
      where: { email: usuario.email },
      update: { nombre: usuario.nombre, password: hash, role: usuario.role },
      create: { nombre: usuario.nombre, email: usuario.email, password: hash, role: usuario.role },
    });
    console.log(`Usuario listo: ${usuario.email}`);
  }
}

main()
  .catch((error: unknown) => {
    console.error("Error en el seed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
