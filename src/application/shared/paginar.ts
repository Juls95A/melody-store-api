const LIMITE_POR_DEFECTO = 6;
const LIMITE_MAXIMO = 50;

// Normaliza página y límite y calcula cuántos registros saltar
export function paginar(page?: number, limit?: number): { page: number; limit: number; skip: number } {
  const pagina = page && page > 0 ? Math.floor(page) : 1;
  const limite = limit && limit > 0 ? Math.min(Math.floor(limit), LIMITE_MAXIMO) : LIMITE_POR_DEFECTO;
  return { page: pagina, limit: limite, skip: (pagina - 1) * limite };
}
