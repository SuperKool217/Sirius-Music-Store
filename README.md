# Sirius Music Store

Tienda web de instrumentos musicales y accesorios, construida con React, TypeScript y Vite. Incluye un backend Node.js que integra **Factus Pay en entorno Sandbox** para crear y consultar recaudos mediante código QR.

> **Proyecto académico y demostrativo.** La integración de pagos está en pruebas y utiliza el entorno Sandbox. No procesa ventas reales. No introduzcas datos personales de clientes reales ni publiques credenciales, tokens, llaves de webhook o códigos QR de recaudos.

## Vista general

- Catálogo de instrumentos y accesorios.
- Navegación, búsqueda, carrito y formulario de checkout.
- Backend Node.js para crear recaudos en Factus Pay Sandbox.
- Visualización del código QR devuelto por Factus Pay.
- Consulta del estado del recaudo desde el backend.
- Webhook protegido por una llave compartida y verificación posterior del recaudo contra la API de Factus.
- Cálculo de precios y envío en el servidor; no se confía en los importes enviados por el navegador.
- Persistencia demostrativa de pedidos en un archivo JSON.

Factus Pay se utiliza mediante **recaudos QR**. Esta implementación no es un checkout de tarjeta bancaria.

## Tecnologías

- React 19 y TypeScript.
- Vite 8.
- Tailwind CSS 4.
- Node.js 22.12 o superior (ES modules y API nativa de Node.js).
- pnpm 10.34.3.
- Factus Pay Sandbox.
- Render Web Service.

## Requisitos

- Node.js 22.12 o superior.
- Corepack y pnpm 10.34.3.
- Credenciales habilitadas para Factus Pay Sandbox (correo y contraseña).

## Instalación local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/SuperKool217/Sirius-Music-Store.git
   cd Sirius-Music-Store
   ```

2. Activa pnpm e instala las dependencias usando el lockfile:

   ```bash
   corepack enable
   corepack prepare pnpm@10.34.3 --activate
   pnpm install --frozen-lockfile
   ```

3. Crea tu archivo local de variables de entorno:

   **Windows PowerShell:**
   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux:**
   ```bash
   cp .env.example .env
   ```

4. Edita `.env` y reemplaza los valores de ejemplo por tus credenciales Sandbox. Genera una llave de webhook propia. **Nunca subas `.env` a GitHub.**

5. Inicia el frontend y el backend de desarrollo:

   ```bash
   pnpm dev
   ```

6. Abre <http://localhost:8443>. Vite reenvía las solicitudes `/api` al backend, que escucha en el puerto `3001`.

La disponibilidad del backend se puede comprobar en <http://localhost:3001/api/health>.

### Configuración de Figma

El archivo `.figma/make/site.json` forma parte de la configuración utilizada por `vite.config.ts`. Debe permanecer versionado en el repositorio. No elimines la carpeta `.figma` ni cambies su nombre.

## Variables de entorno

El archivo `.env.example` contiene únicamente marcadores ficticios. Cópialo a `.env` para desarrollo local y reemplaza sus valores.

| Variable | Uso |
|---|---|
| `FACTUS_PAY_EMAIL` | Correo habilitado para Factus Pay Sandbox. |
| `FACTUS_PAY_PASSWORD` | Contraseña de Factus Pay Sandbox. |
| `FACTUS_WEBHOOK_KEY` | Secreto aleatorio propio que debe coincidir con la llave configurada en el webhook de Factus. |
| `FACTUS_QR_EXPIRATION_SECONDS` | Duración del QR en segundos. Valor predeterminado: `1200`; rango aceptado: `60` a `86400`. |
| `SIRIUS_DATA_DIR` | Directorio donde se guarda `orders.json`. Localmente usa `./data`; en Render Free se configura como `/tmp/sirius-data`. |
| `PORT` | Puerto HTTP asignado por Render o definido para desarrollo. |

Las credenciales y los secretos deben permanecer en variables privadas del servidor (archivo `.env` local o panel **Environment** de Render). Nunca deben incluirse en el frontend, en variables `VITE_*`, en capturas de pantalla ni en archivos versionados.

Para generar una llave aleatoria localmente con OpenSSL:

```bash
openssl rand -hex 32
```

No reutilices una llave publicada ni compartas la URL completa del webhook, porque contiene el secreto como parámetro de consulta.

## Pruebas y compilación

Ejecuta las pruebas automatizadas:

```bash
pnpm test
```

Compila el frontend:

```bash
pnpm build
```

Inicia el servidor en modo producción después de compilar:

```bash
pnpm start
```

## Endpoints del backend

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor y configuración (sin revelar valores secretos). |
| `POST` | `/api/payments/factus/create` | Crea un pedido y solicita un recaudo QR a Factus Pay. |
| `GET` | `/api/payments/factus/:referenceCode/status` | Consulta el estado del recaudo y actualiza el pedido. |
| `POST` | `/api/webhooks/factus-pay?key=...` | Recibe una notificación y verifica el recaudo consultando la API de Factus. |

La llave de la URL del webhook es un secreto. Configúrala en Factus y Render sin publicarla en documentación, capturas ni registros.

## Despliegue en Render (plan Free)

El archivo `render.yaml` configura un **Web Service Node.js en el plan Free**:

- Instalación y compilación: `pnpm install --frozen-lockfile && pnpm run build`.
- Inicio: `pnpm start`.
- Health check: `/api/health`.
- Directorio de pedidos: `/tmp/sirius-data`.
- Variables privadas solicitadas por Render: `FACTUS_PAY_EMAIL`, `FACTUS_PAY_PASSWORD` y `FACTUS_WEBHOOK_KEY`.

Pasos:

1. En Render, crea o sincroniza un Blueprint conectado a este repositorio.
2. Cuando Render solicite las variables secretas, introdúcelas directamente en el panel. No las escribas en `render.yaml`.
3. Espera a que finalice el despliegue.
4. Comprueba `https://TU-SERVICIO.onrender.com/api/health`.
5. Configura el webhook de Factus con la ruta `/api/webhooks/factus-pay` y la misma llave privada definida como `FACTUS_WEBHOOK_KEY`.

### Limitaciones del plan Free y del almacenamiento

Render Free suspende los Web Services después de 15 minutos sin tráfico entrante; al recibir una nueva solicitud, el servicio puede tardar alrededor de un minuto en volver a estar disponible. El sistema de archivos del servicio es efímero: los cambios locales se pierden al reiniciar, redeplegar o suspender el servicio.

Por eso, en esta versión los pedidos guardados en `/tmp/sirius-data/orders.json` son **temporales**. Esta configuración es adecuada para demostraciones y pruebas Sandbox, no para operar una tienda con pedidos reales. Consulta las [limitaciones oficiales de Render Free](https://render.com/docs/free).

## Probar Factus Pay Sandbox

1. Inicia la aplicación localmente o abre el despliegue de Render.
2. Agrega un producto al carrito y completa el checkout usando datos ficticios.
3. Sirius solicita el recaudo y muestra el QR devuelto por Factus Pay.
4. Usa el [simulador oficial de Factus Pay Sandbox](https://pay-developers.factus.com.co/sandbox/simulator/) para representar un pago exitoso o fallido.
5. La aplicación consulta el estado del recaudo. El pedido solo se marca como pagado cuando el backend confirma el estado `paid` y comprueba que el importe coincide con el pedido.

No compartas el QR o la referencia de una operación fuera de la prueba correspondiente.

## Reglas de importes

- El backend mantiene su propio catálogo y vuelve a calcular el total del carrito.
- El envío cuesta COP $15.000.
- El envío es gratis desde COP $600.000 de subtotal.
- La aplicación valida los importes frente al rango configurado para Factus Pay Sandbox: COP $1.000 a COP $12.100.000.

Si cambias productos o precios en la interfaz, actualiza también `server/catalog.js`. El backend es la fuente autoritativa del importe.

## Seguridad, privacidad y trabajo futuro

- No guardes credenciales, tokens, claves ni archivos `.env` en Git.
- No subas `orders.json`, archivos temporales ni datos personales de compradores.
- El almacenamiento JSON actual guarda datos de contacto y envío; utiliza únicamente datos ficticios mientras esta versión sea una demostración.
- Antes de producción se debe migrar el almacenamiento a una base de datos persistente (por ejemplo, PostgreSQL), definir controles de acceso y retención de datos, revisar los webhooks y realizar pruebas de seguridad y conciliación.
- La integración actual utiliza exclusivamente Factus Pay Sandbox. No introduzcas credenciales de producción en este proyecto de demostración.

## Documentación

- [Factus Pay: autenticación](https://pay-developers.factus.com.co/autenticacion/)
- [Factus Pay: crear un recaudo](https://pay-developers.factus.com.co/recaudos/crear/)
- [Factus Pay: consultar un recaudo](https://pay-developers.factus.com.co/recaudos/ver/)
- [Factus Pay: webhooks](https://pay-developers.factus.com.co/webhooks/)
- [Factus Pay: simulador Sandbox](https://pay-developers.factus.com.co/sandbox/simulator/)
- [Render: servicios gratuitos](https://render.com/docs/free)

---

**Sirius Music Store** · Proyecto académico de tienda digital de instrumentos musicales y accesorios.
