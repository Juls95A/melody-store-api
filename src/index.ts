import "dotenv/config";
import express, { Request, Response } from "express";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// Permite recibir cuerpos JSON
app.use(express.json());

// Ruta para comprobar que el servidor está activo
app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ ok: true });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
