const FACTUS_BASE_URL = "https://pay-api-sandbox.factus.com.co"

let cachedToken = null
let authenticationPromise = null

function requiredCredentials() {
  const email = process.env.FACTUS_PAY_EMAIL
  const password = process.env.FACTUS_PAY_PASSWORD
  if (!email || !password) {
    const error = new Error("Faltan FACTUS_PAY_EMAIL y/o FACTUS_PAY_PASSWORD en las variables de entorno del servidor.")
    error.statusCode = 503
    throw error
  }
  return { email, password }
}

async function readJson(response) {
  const raw = await response.text()
  try {
    return raw ? JSON.parse(raw) : {}
  } catch {
    return { message: "Factus Pay respondió con un formato inesperado." }
  }
}

async function authenticate(force = false) {
  if (!force && cachedToken) return cachedToken
  if (authenticationPromise) return authenticationPromise

  authenticationPromise = (async () => {
    const credentials = requiredCredentials()
    const response = await fetch(`${FACTUS_BASE_URL}/auth`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(credentials),
      signal: AbortSignal.timeout(15000),
    })
    const payload = await readJson(response)
    if (!response.ok || !payload.token) {
      const error = new Error(payload.message || "No fue posible autenticar con Factus Pay Sandbox.")
      error.statusCode = response.status || 502
      throw error
    }
    cachedToken = payload.token
    return cachedToken
  })()

  try {
    return await authenticationPromise
  } finally {
    authenticationPromise = null
  }
}

async function requestWithToken(path, options = {}, retry = true) {
  const token = await authenticate()
  const response = await fetch(`${FACTUS_BASE_URL}${path}`, {
    ...options,
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
    signal: options.signal || AbortSignal.timeout(20000),
  })
  const payload = await readJson(response)

  if (response.status === 401 && retry) {
    cachedToken = null
    await authenticate(true)
    return requestWithToken(path, options, false)
  }

  if (!response.ok) {
    const error = new Error(payload.message || `Factus Pay respondió con HTTP ${response.status}.`)
    error.statusCode = response.status >= 500 ? 502 : response.status
    error.providerStatus = response.status
    throw error
  }

  return payload
}

export async function createFactusCollection({ referenceCode, amount, expiration }) {
  return requestWithToken("/v1/collections", {
    method: "POST",
    body: JSON.stringify({
      reference_code: referenceCode,
      amount: String(amount),
      expiration,
    }),
  })
}

export async function getFactusCollection(referenceCode) {
  return requestWithToken(`/v1/collections/${encodeURIComponent(referenceCode)}`, {
    method: "GET",
  })
}

export function isFactusPayConfigured() {
  return Boolean(process.env.FACTUS_PAY_EMAIL && process.env.FACTUS_PAY_PASSWORD)
}
