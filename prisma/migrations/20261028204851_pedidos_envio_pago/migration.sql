-- Las solicitudes pasan a funcionar como pedidos (envío y método de pago)
-- Las columnas nuevas se agregan con un valor por defecto para no fallar si ya hay filas,
-- y luego se quita ese default para que coincida con el schema de Prisma.
-- metodoPago solo guarda la opción elegida, nunca datos de tarjeta.

-- AlterTable
ALTER TABLE "solicitudes" ADD COLUMN     "cantidad" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "ciudad" TEXT NOT NULL DEFAULT 'sin ciudad',
ADD COLUMN     "direccionEnvio" TEXT NOT NULL DEFAULT 'sin dirección',
ADD COLUMN     "metodoPago" TEXT NOT NULL DEFAULT 'contra_entrega',
ALTER COLUMN "mensaje" DROP NOT NULL;

-- Quita los defaults temporales
ALTER TABLE "solicitudes" ALTER COLUMN "ciudad" DROP DEFAULT,
ALTER COLUMN "direccionEnvio" DROP DEFAULT,
ALTER COLUMN "metodoPago" DROP DEFAULT;
