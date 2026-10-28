// Respuesta paginada genérica
export type Paginado<T> = {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  data: T[];
};
