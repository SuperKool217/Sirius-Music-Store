import { createServer } from "node:http"
import { createReadStream } from "node:fs"
import { existsSync } from "node:fs"
import { mkdir, readFile, stat } from "node:fs/promises"
import { randomBytes, timingSafeEqual } from "node:crypto"
import path from "node:path"
import { fileURLToPath } from "node:url"
import {
  calculateOrder,
  FACTUS_MAX_AMOUNT,
  FACTUS_MIN_AMOUNT,
} from "./catalog.js"
import { createFactusCollection, getFactusCollection, isFactusPayConfigured } from "./factus-pay.js"
import { getOrder, initializeOrderStore, listOrders, saveOrder, updateOrder } from "./order-store.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const projectRoot = path.resolve(__dirname, "..")
const distDirectory = path.join(projectRoot, "dist")
const port = Number(process.env.PORT || 3001)
const expirationSeconds = Number(process.env.FACTUS_QR_EXPIRATION_SECONDS || 1200)
const MAX_BODY_BYTES = 100 * 1024

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".map": "application/json; charset=utf-8",
}

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  })
  response.end(JSON.stringify(payload))
}

async function readJsonBody(request) {
  const chunks = []
  let bytes = 0
  for await (const chunk of request) {
    bytes += chunk.length
    if (bytes > MAX_BODY_BYTES) {
      const error = new Error("La solicitud supera el tamaño permitido.")
      error.statusCode = 413
      throw error
    }
    chunks.push(chunk)
  }
  if (!bytes) return {}
  try {
    return JSON.parse(Buffer.concat(chunks).toString("utf8"))
  } catch {
    const error = new Error("El cuerpo de la solicitud no contiene JSON válido.")
    error.statusCode = 400
    throw error
  }
}

function publicError(error) {
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 502
  return { statusCode, message: error.message || "No fue posible procesar la solicitud." }
}

function validCustomer(customer) {
  if (!customer || typeof customer !== "object") return null
  const fields = ["name", "email", "phone", "address", "city", "postalCode"]
  const normalized = {}
  for (const field of fields) {
    if (typeof customer[field] !== "string") return null
    normalized[field] = customer[field].trim()
    if (!normalized[field] || normalized[field].length > 180) return null
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized.email)) return null
  return normalized
}

function generateReferenceCode() {
  return `SIR-${Date.now().toString(36).toUpperCase()}-${randomBytes(5).toString("hex").toUpperCase()}`
}

function sameAmount(first, second) {
  const a = Number(first)
  const b = Number(second)
  return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) < 0.01
}

function validWebhookKey(received) {
  const expected = process.env.FACTUS_WEBHOOK_KEY
  if (!expected || typeof received !== "string") return false
  const receivedBuffer = Buffer.from(received)
  const expectedBuffer = Buffer.from(expected)
  return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer)
}

async function handleCreatePayment(request, response) {
  try {
    if (!isFactusPayConfigured()) {
      return sendJson(response, 503, { message: "Factus Pay Sandbox aún no está configurado en el servidor." })
    }

    if (!Number.isInteger(expirationSeconds) || expirationSeconds < 60 || expirationSeconds > 86400) {
      return sendJson(response, 500, { message: "FACTUS_QR_EXPIRATION_SECONDS debe estar entre 60 y 86400 segundos." })
    }

    const body = await readJsonBody(request)
    const customer = validCustomer(body?.customer)
    if (!customer) {
      return sendJson(response, 400, { message: "Revisa los datos de contacto y envío. Todos los campos son obligatorios y el correo debe ser válido." })
    }

    let totals
    try {
      totals = calculateOrder(body?.items)
    } catch (error) {
      return sendJson(response, 400, { message: error.message })
    }

    if (totals.total < FACTUS_MIN_AMOUNT || totals.total > FACTUS_MAX_AMOUNT) {
      return sendJson(response, 400, { message: "El total está fuera de los límites aceptados por Factus Pay Sandbox." })
    }

    const referenceCode = generateReferenceCode()
    const order = {
      referenceCode,
      customer,
      ...totals,
      status: "creating",
      createdAt: new Date().toISOString(),
      provider: "factus-pay-sandbox",
    }

    // Guardamos primero la referencia y el importe para poder conciliar el cobro.
    await saveOrder(order)

    let providerPayload
    try {
      providerPayload = await createFactusCollection({
        referenceCode,
        amount: totals.total,
        expiration: expirationSeconds,
      })
    } catch (error) {
      await updateOrder(referenceCode, { status: "creation_failed", providerMessage: error.message })
      throw error
    }

    const collection = providerPayload?.data
    if (!collection?.qr || !String(collection.qr).startsWith("data:image/")) {
      await updateOrder(referenceCode, { status: "creation_failed", providerMessage: "Factus Pay no devolvió un QR válido." })
      return sendJson(response, 502, { message: "Factus Pay no devolvió un código QR válido. Revisa el panel Sandbox o intenta nuevamente." })
    }

    if (!sameAmount(collection.amount, totals.total)) {
      await updateOrder(referenceCode, { status: "amount_mismatch" })
      return sendJson(response, 502, { message: "El importe devuelto por Factus Pay no coincide con el total de la orden. El pedido quedó en revisión." })
    }

    const status = String(collection.status || "ready").toLowerCase()
    await updateOrder(referenceCode, {
      status,
      providerCreatedAt: collection.created_at || null,
      qrExpiresAt: collection.qr_expires_at || null,
      brebKey: collection.breb_key || null,
    })

    return sendJson(response, 201, {
      referenceCode,
      amount: totals.total,
      subtotal: totals.subtotal,
      shipping: totals.shipping,
      status,
      qr: collection.qr,
      qrExpiresAt: collection.qr_expires_at || null,
      brebKey: collection.breb_key || null,
    })
  } catch (error) {
    const result = publicError(error)
    console.error("Factus Pay create collection error:", error.message)
    return sendJson(response, result.statusCode, { message: result.message })
  }
}

async function handlePaymentStatus(referenceCode, response) {
  const order = getOrder(referenceCode)
  if (!order) return sendJson(response, 404, { message: "No encontramos la orden asociada a esta referencia." })
  if (!isFactusPayConfigured()) return sendJson(response, 503, { message: "Factus Pay Sandbox no está configurado en el servidor." })

  try {
    const payload = await getFactusCollection(referenceCode)
    const collection = payload?.data
    if (!collection) return sendJson(response, 502, { message: "Factus Pay no devolvió información del recaudo." })

    if (!sameAmount(collection.amount, order.total)) {
      await updateOrder(referenceCode, { status: "amount_mismatch" })
      return sendJson(response, 409, { message: "El importe del recaudo no coincide con el pedido. Contacta a soporte." })
    }

    const status = String(collection.status || "unknown").toLowerCase()
    await updateOrder(referenceCode, {
      status,
      paidAt: status === "paid" ? collection.collected_at || new Date().toISOString() : order.paidAt || null,
    })

    return sendJson(response, 200, { referenceCode, amount: Number(collection.amount), status, qrExpiresAt: collection.qr_expires_at || null })
  } catch (error) {
    const result = publicError(error)
    console.error("Factus Pay status lookup error:", error.message)
    return sendJson(response, result.statusCode, { message: result.message })
  }
}

async function handleWebhook(request, response, url) {
  if (!validWebhookKey(url.searchParams.get("key"))) {
    return sendJson(response, 401, { message: "Webhook no autorizado." })
  }

  let body
  try {
    body = await readJsonBody(request)
  } catch (error) {
    const result = publicError(error)
    return sendJson(response, result.statusCode, { message: result.message })
  }

  const incoming = body?.data
  const referenceCode = incoming?.reference_code
  if (typeof referenceCode !== "string" || !referenceCode) {
    return sendJson(response, 400, { message: "Notificación sin reference_code." })
  }

  const order = getOrder(referenceCode)
  if (!order) return sendJson(response, 404, { message: "No existe una orden para esta referencia." })
  if (!sameAmount(incoming.amount, order.total)) {
    await updateOrder(referenceCode, { status: "amount_mismatch" })
    return sendJson(response, 200, { received: true, processed: false, reason: "amount_mismatch" })
  }
  if (order.status === "paid") {
    return sendJson(response, 200, { received: true, processed: true, duplicate: true })
  }
  if (String(incoming.status || "").toLowerCase() !== "paid") {
    return sendJson(response, 200, { received: true, processed: false, reason: "not_paid" })
  }

  // Guardamos la notificación y contestamos de inmediato. Factus reintenta si no recibe 2xx
  // en 10 segundos; la verificación contra su API se realiza en segundo plano.
  if (order.status !== "webhook_received") {
    await updateOrder(referenceCode, {
      status: "webhook_received",
      webhookReceivedAt: new Date().toISOString(),
    })
  }
  void verifyPendingWebhookOrders()
  return sendJson(response, 200, { received: true, processed: false, verification: "queued" })
}

async function serveFrontend(request, response, url) {
  if (!existsSync(distDirectory)) return sendJson(response, 404, { message: "La aplicación aún no está compilada. Ejecuta npm run build." })
  if (request.method !== "GET" && request.method !== "HEAD") {
    return sendJson(response, 405, { message: "Método no permitido." })
  }

  let requestedPath
  try {
    requestedPath = decodeURIComponent(url.pathname)
  } catch {
    return sendJson(response, 400, { message: "Ruta inválida." })
  }

  const resolvedPath = path.resolve(distDirectory, `.${requestedPath}`)
  const relativePath = path.relative(distDirectory, resolvedPath)
  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return sendJson(response, 400, { message: "Ruta inválida." })
  }

  let filePath = resolvedPath
  try {
    if (!(await stat(filePath)).isFile()) filePath = path.join(distDirectory, "index.html")
  } catch {
    filePath = path.join(distDirectory, "index.html")
  }

  try {
    const fileStat = await stat(filePath)
    const extension = path.extname(filePath).toLowerCase()
    response.writeHead(200, {
      "Content-Type": contentTypes[extension] || "application/octet-stream",
      "Content-Length": fileStat.size,
      "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
    })
    if (request.method === "HEAD") return response.end()
    createReadStream(filePath).pipe(response)
  } catch {
    sendJson(response, 404, { message: "Archivo no encontrado." })
  }
}


let verifyingWebhookOrders = false
async function verifyPendingWebhookOrders() {
  if (verifyingWebhookOrders || !isFactusPayConfigured()) return
  verifyingWebhookOrders = true
  try {
    const pendingOrders = listOrders().filter((order) => order.status === "webhook_received")
    for (const order of pendingOrders) {
      try {
        const payload = await getFactusCollection(order.referenceCode)
        const collection = payload?.data
        if (!collection || !sameAmount(collection.amount, order.total)) {
          await updateOrder(order.referenceCode, { status: "amount_mismatch" })
          continue
        }
        if (String(collection.status || "").toLowerCase() === "paid") {
          await updateOrder(order.referenceCode, {
            status: "paid",
            paidAt: collection.collected_at || new Date().toISOString(),
          })
        }
      } catch (error) {
        // Se conserva en webhook_received para reintentar en el siguiente ciclo.
        console.error(`Factus Pay background verification failed (${order.referenceCode}):`, error.message)
      }
    }
  } finally {
    verifyingWebhookOrders = false
  }
}

const server = createServer(async (request, response) => {
  let url
  try {
    url = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`)
  } catch {
    return sendJson(response, 400, { message: "Solicitud inválida." })
  }

  try {
    if (request.method === "GET" && url.pathname === "/api/health") {
      return sendJson(response, 200, {
        status: "ok",
        paymentProvider: "Factus Pay",
        environment: "sandbox",
        credentialsConfigured: isFactusPayConfigured(),
        webhookConfigured: Boolean(process.env.FACTUS_WEBHOOK_KEY),
      })
    }

    if (request.method === "POST" && url.pathname === "/api/payments/factus/create") {
      return await handleCreatePayment(request, response)
    }

    const statusMatch = url.pathname.match(/^\/api\/payments\/factus\/([^/]+)\/status$/)
    if (request.method === "GET" && statusMatch) {
      return await handlePaymentStatus(decodeURIComponent(statusMatch[1]), response)
    }

    if (request.method === "POST" && url.pathname === "/api/webhooks/factus-pay") {
      return await handleWebhook(request, response, url)
    }

    if (url.pathname.startsWith("/api/")) {
      return sendJson(response, 404, { message: "Ruta API no encontrada." })
    }

    return await serveFrontend(request, response, url)
  } catch (error) {
    console.error("Server request error:", error.message)
    if (!response.headersSent) return sendJson(response, 500, { message: "Error interno del servidor." })
    response.destroy(error)
  }
})

await mkdir(process.env.SIRIUS_DATA_DIR || path.resolve("data"), { recursive: true })
await initializeOrderStore()
server.listen(port, "0.0.0.0", () => {
  console.log(`Sirius Music Store listening on port ${port} (Factus Pay Sandbox)`)
  const webhookVerifier = setInterval(() => void verifyPendingWebhookOrders(), 15000)
  webhookVerifier.unref()
  void verifyPendingWebhookOrders()
})
