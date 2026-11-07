# Sirius Music Store

Tienda web de instrumentos musicales y accesorios, construida con React, TypeScript y Vite. Incluye un backend Node.js para crear y consultar recaudos mediante **Factus Pay en entorno Sandbox**.

> **Estado del proyecto:** integración de pagos en pruebas. No proceses ventas reales ni publiques credenciales Sandbox. Antes de pasar a producción se deben realizar pruebas completas con Factus y revisar almacenamiento, seguridad y operación.

## Funcionalidades

- Catálogo de instrumentos y accesorios.
- Carrito de compras y formulario de envío.
- Creación de recaudos en Factus Pay Sandbox.
- Visualización del código QR devuelto por Factus Pay.
- Consulta del estado del recaudo desde el backend.
- Webhook de Factus Pay con llave compartida y verificación posterior del recaudo contra la API.
- Cálculo de precios y envío en el backend; no se confía en importes enviados por el navegador.
- Persistencia básica de pedidos en un archivo JSON.

Factus Pay se utiliza aquí mediante **recaudos con QR**. Esta implementación no es un checkout de tarjeta bancaria.

## Tecnologías

- React 19, TypeScript y Vite 8.
- Tailwind CSS 4.
- Node.js 22.12 o superior.
- API nativa de Node.js (sin Express).
- Factus Pay Sandbox.
- Render para despliegue.
- pnpm 10.34.3 para instalar dependencias usando el lockfile incluido.

## Requisitos

- Node.js 22.12 o superior.
- Corepack y pnpm 10.34.3.
- Credenciales activas de Factus Pay Sandbox (correo y contraseña).

## Instalación local

1. Clona el repositorio:

   ```bash
   git clone URL_DE_TU_REPOSITORIO
   cd sirius-music-store
   ```

2. Activa pnpm mediante Corepack e instala las dependencias:

   ```bash
   corepack enable
   corepack prepare pnpm@10.34.3 --activate
   pnpm install --frozen-lockfile
   ```

3. Crea tu archivo local de variables de entorno a partir del ejemplo:

   **Windows PowerShell:**

   ```powershell
   Copy-Item .env.example .env
   ```

   **macOS / Linux:**

   ```bash
   cp .env.example .env
   ```

4. Edita `.env` y coloca tus credenciales Sandbox. No compartas ni subas ese archivo.

5. Inicia el frontend y el backend de desarrollo:

   ```bash
   pnpm dev
   ```

6. Abre la aplicación en [http://localhost:8443](http://localhost:8443). El backend escucha en el puerto `3001` y Vite reenvía las solicitudes `/api` al backend.

Comprueba la disponibilidad del backend en [http://localhost:3001/api/health](http://localhost:3001/api/health). La respuesta informa si las credenciales están configuradas, pero nunca devuelve sus valores.

## Variables de entorno

| Variable | Obligatoria | Descripción |
|---|---:|---|
| `FACTUS_PAY_EMAIL` | Sí | Correo de acceso a Factus Pay Sandbox. |
| `FACTUS_PAY_PASSWORD` | Sí | Contraseña de Factus Pay Sandbox. |
| `FACTUS_WEBHOOK_KEY` | Para webhook | Secreto propio, aleatorio y largo; debe coincidir con la llave configurada en la URL del webhook de Factus. |
| `FACTUS_QR_EXPIRATION_SECONDS` | No | Duración del QR en segundos. Valor predeterminado: `1200`; la aplicación admite de `60` a `86400`. |
| `SIRIUS_DATA_DIR` | Recomendada | Carpeta donde se guarda `orders.json`. En Render se configura como `/var/data`. |
| `PORT` | No | Puerto que Render asigna automáticamente al servicio. |

Para generar una llave para el webhook puedes usar:

```bash
openssl rand -hex 32
```

No uses valores de ejemplo como secretos reales. Mantén las variables privadas en el archivo `.env` local o en el panel Environment de Render. Nunca las pongas en variables `VITE_*`, componentes React ni archivos versionados.

## Pruebas y compilación

Ejecuta las pruebas automatizadas:

```bash
pnpm test
```

Genera el sitio listo para producción:

```bash
pnpm build
```

Inicia el servidor en modo producción después de compilar:

```bash
pnpm start
```

El servidor Node sirve tanto los archivos compilados de `dist/` como los endpoints `/api`.

## Endpoints del backend

| Método | Ruta | Uso |
|---|---|---|
| `GET` | `/api/health` | Estado del servidor y configuración (sin revelar secretos). |
| `POST` | `/api/payments/factus/create` | Crea un pedido y solicita el recaudo QR a Factus Pay. |
| `GET` | `/api/payments/factus/:referenceCode/status` | Consulta el estado del recaudo y actualiza el pedido. |
| `POST` | `/api/webhooks/factus-pay?key=...` | Recibe una notificación y verifica el recaudo consultando Factus Pay. |

## Despliegue en Render

El archivo `render.yaml` contiene un Blueprint para crear el servicio web. Está configurado con un plan compatible con disco persistente y un disco de `1 GB` montado en `/var/data`.

1. Sube el contenido de este proyecto a un repositorio de GitHub.
2. En Render, crea un **Blueprint** y conecta ese repositorio. Render leerá `render.yaml`.
3. Cuando Render solicite las variables secretas, introduce:
   - `FACTUS_PAY_EMAIL`
   - `FACTUS_PAY_PASSWORD`
   - `FACTUS_WEBHOOK_KEY`
4. Espera a que termine el despliegue y abre:

   ```text
   https://TU-SERVICIO.onrender.com/api/health
   ```

   Debe responder con `status: "ok"`, `environment: "sandbox"` y `credentialsConfigured: true` cuando las credenciales estén configuradas.

5. Configura en el panel de Factus Pay el webhook con esta URL, sustituyendo el dominio y la llave:

   ```text
   https://TU-SERVICIO.onrender.com/api/webhooks/factus-pay?key=TU_FACTUS_WEBHOOK_KEY
   ```

   La llave de la URL debe coincidir exactamente con `FACTUS_WEBHOOK_KEY`. Esa URL contiene un secreto: no la publiques ni la compartas.

**Costos de Render:** el servicio usa el plan `starter` porque los discos persistentes no están disponibles en los servicios Free. Revisa los precios vigentes de Render antes de crear el servicio.

## Probar un pago Sandbox

1. Despliega la aplicación o ejecútala localmente con las variables Sandbox.
2. Agrega un producto al carrito y completa los datos solicitados en el checkout.
3. Sirius solicita el recaudo y muestra el QR que devuelve Factus Pay.
4. Usa el simulador oficial de Factus Pay Sandbox para probar los escenarios disponibles.
5. La interfaz consulta el estado del recaudo. El pedido solo se marca como pagado cuando la API de Factus confirma `paid` y el importe coincide con el pedido.

Simulador: <https://pay-developers.factus.com.co/sandbox/simulator/>

## Reglas de importes incluidas

- El backend mantiene un catálogo de precios propio y vuelve a calcular el total recibido del carrito.
- El envío cuesta COP $15.000.
- El envío es gratis desde COP $600.000 de subtotal.
- La aplicación rechaza importes fuera del rango configurado en el código para Factus Pay Sandbox: COP $1.000 a COP $12.100.000.

Si cambias productos o precios en la interfaz, actualiza también `server/catalog.js`. El backend es la fuente autoritativa del importe.

## Persistencia y limitaciones actuales

Los pedidos se guardan en `orders.json` dentro de `SIRIUS_DATA_DIR`. Para este MVP se espera una sola instancia de servidor y un disco persistente. Este almacenamiento en archivo no está diseñado para múltiples instancias ni para altos volúmenes de concurrencia.

Antes de operar en producción o escalar el sitio, migra los pedidos a una base de datos transaccional (por ejemplo PostgreSQL), añade controles operativos y realiza pruebas de seguridad y conciliación. La disponibilidad de Factus Pay y las credenciales de Sandbox también deben validarse directamente con el proveedor.

## Documentación de Factus Pay

- Autenticación: <https://pay-developers.factus.com.co/autenticacion/>
- Crear un recaudo: <https://pay-developers.factus.com.co/recaudos/crear/>
- Consultar un recaudo: <https://pay-developers.factus.com.co/recaudos/ver/>
- Webhooks: <https://pay-developers.factus.com.co/webhooks/>
- Simulador Sandbox: <https://pay-developers.factus.com.co/sandbox/simulator/>

---

**Sirius Music Store** · Proyecto de tienda de instrumentos musicales.
