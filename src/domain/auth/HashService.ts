// Servicio para hashear y comparar contraseñas
export interface HashService {
  hash(texto: string): Promise<string>;
  comparar(texto: string, hash: string): Promise<boolean>;
}
