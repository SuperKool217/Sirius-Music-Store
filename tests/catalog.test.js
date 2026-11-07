import test from "node:test"
import assert from "node:assert/strict"
import { calculateOrder } from "../server/catalog.js"

test("calcula subtotal, envío y total con precios del servidor", () => {
  const order = calculateOrder({ "10": 2 })
  assert.equal(order.subtotal, 58000)
  assert.equal(order.shipping, 15000)
  assert.equal(order.total, 73000)
  assert.equal(order.items[0].name, "Púas Tortex surtidas · x12")
})

test("aplica envío gratis desde COP 600.000", () => {
  const order = calculateOrder({ "8": 1, "10": 1 })
  assert.equal(order.subtotal, 608000)
  assert.equal(order.shipping, 0)
  assert.equal(order.total, 608000)
})

test("rechaza carrito vacío, producto desconocido y cantidades inválidas", () => {
  assert.throws(() => calculateOrder({}), /vacío/)
  assert.throws(() => calculateOrder({ "26": 1 }), /producto o cantidad/)
  assert.throws(() => calculateOrder({ "1": 0 }), /producto o cantidad/)
  assert.throws(() => calculateOrder({ "1": 100 }), /producto o cantidad/)
})

test("rechaza importes superiores al límite publicado de Factus Pay", () => {
  assert.throws(() => calculateOrder({ "23": 2 }), /12\.100\.000/)
})
