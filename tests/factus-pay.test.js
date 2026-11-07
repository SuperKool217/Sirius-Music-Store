import test from "node:test"
import assert from "node:assert/strict"
import { createFactusCollection, getFactusCollection } from "../server/factus-pay.js"

test("autentica en Sandbox, crea un recaudo y reutiliza el token", async (t) => {
  const previousEmail = process.env.FACTUS_PAY_EMAIL
  const previousPassword = process.env.FACTUS_PAY_PASSWORD
  process.env.FACTUS_PAY_EMAIL = "john@example.test"
  process.env.FACTUS_PAY_PASSWORD = "sandbox-password"

  const calls = []
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push({ url: String(url), options })
    if (String(url).endsWith("/auth")) {
      return new Response(JSON.stringify({ token: "sandbox-token-123" }), { status: 200 })
    }
    if (String(url).endsWith("/v1/collections")) {
      return new Response(JSON.stringify({
        data: {
          reference_code: "SIR-TEST-001",
          amount: 73000,
          status: "ready",
          qr: "data:image/png;base64,ZmFrZS1xcg==",
        },
        status: "success",
      }), { status: 201 })
    }
    return new Response(JSON.stringify({
      data: { reference_code: "SIR-TEST-001", amount: 73000, status: "ready" },
      status: "success",
    }), { status: 200 })
  })

  try {
    const created = await createFactusCollection({
      referenceCode: "SIR-TEST-001",
      amount: 73000,
      expiration: 1200,
    })
    const current = await getFactusCollection("SIR-TEST-001")

    assert.equal(created.data.status, "ready")
    assert.equal(current.data.amount, 73000)
    assert.equal(calls.length, 3)
    assert.equal(calls[0].url, "https://pay-api-sandbox.factus.com.co/auth")
    assert.equal(calls[1].url, "https://pay-api-sandbox.factus.com.co/v1/collections")
    assert.equal(calls[1].options.headers.Authorization, "Bearer sandbox-token-123")
    assert.deepEqual(JSON.parse(calls[1].options.body), {
      reference_code: "SIR-TEST-001",
      amount: "73000",
      expiration: 1200,
    })
    assert.equal(calls[2].url, "https://pay-api-sandbox.factus.com.co/v1/collections/SIR-TEST-001")
  } finally {
    if (previousEmail === undefined) delete process.env.FACTUS_PAY_EMAIL
    else process.env.FACTUS_PAY_EMAIL = previousEmail
    if (previousPassword === undefined) delete process.env.FACTUS_PAY_PASSWORD
    else process.env.FACTUS_PAY_PASSWORD = previousPassword
  }
})
