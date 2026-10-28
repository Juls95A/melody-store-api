// Producto del catálogo de la tienda
export type Producto = {
  id: number;
  nombre: string;
  categoria: string;
  precio: number; // Pesos colombianos
  descripcion: string;
  imagen: string;
  createdAt: Date;
  updatedAt: Date;
};

// Datos necesarios para crear un producto
export type CrearProductoDTO = {
  nombre: string;
  categoria: string;
  precio: number;
  descripcion: string;
  imagen: string;
};

// Al actualizar, todos los campos son opcionales
export type ActualizarProductoDTO = Partial<CrearProductoDTO>;

// Filtros opcionales para listar productos
export type FiltrosProducto = {
  categorias?: string[]; // Una o varias categorías
  busqueda?: string;
  precioMin?: number;
  precioMax?: number;
};
