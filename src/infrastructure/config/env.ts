// Lee y valida las variables de entorno necesarias para arrancar
export function leerConfiguracion() {
  const jwtSecret = process.env.JWT_SECRET;

  // Sin secreto no se pueden firmar tokens: el servidor no debe arrancar
  if (!jwtSecret) {
    console.error("ERROR: falta la variable de entorno JWT_SECRET. Agrégala al archivo .env (ver .env.example).");
    process.exit(1);
  }

  return {
    port: Number(process.env.PORT) || 3000,
    jwtSecret,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "1d",
    frontendUrl: process.env.FRONTEND_URL,
  };
}
