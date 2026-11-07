import { mkdir, readFile, rename, writeFile } from "node:fs/promises"
import path from "node:path"

const dataDirectory = process.env.SIRIUS_DATA_DIR || path.resolve("data")
const dataFile = path.join(dataDirectory, "orders.json")
const temporaryFile = `${dataFile}.tmp`

let orders = new Map()
let writeQueue = Promise.resolve()

export async function initializeOrderStore() {
  await mkdir(dataDirectory, { recursive: true })
  try {
    const contents = await readFile(dataFile, "utf8")
    const parsed = JSON.parse(contents)
    orders = new Map(Object.entries(parsed))
  } catch (error) {
    if (error.code !== "ENOENT") throw error
    orders = new Map()
    await persist()
  }
}

async function persist() {
  const snapshot = Object.fromEntries(orders)
  writeQueue = writeQueue.then(async () => {
    await writeFile(temporaryFile, JSON.stringify(snapshot, null, 2), { mode: 0o600 })
    await rename(temporaryFile, dataFile)
  })
  return writeQueue
}

export async function saveOrder(order) {
  orders.set(order.referenceCode, order)
  await persist()
  return order
}

export function getOrder(referenceCode) {
  return orders.get(referenceCode) || null
}

export function listOrders() {
  return [...orders.values()]
}

export async function updateOrder(referenceCode, updates) {
  const current = getOrder(referenceCode)
  if (!current) return null
  const updated = { ...current, ...updates, updatedAt: new Date().toISOString() }
  await saveOrder(updated)
  return updated
}
