// Precios autoritativos del servidor. No se confía en precios enviados por el navegador.
export const catalog = Object.freeze({
  1: { name: "Player II Stratocaster", price: 4299000 },
  2: { name: "FG800 · Natural", price: 1299000 },
  3: { name: "GSR200 · Black", price: 1499000 },
  4: { name: "FP-10 · Piano digital", price: 2999000 },
  5: { name: "Roadshow · Kit de batería", price: 3999000 },
  6: { name: "Scarlett Solo · 4th Gen", price: 769000 },
  7: { name: "YAS-280 · Saxofón alto", price: 6799000 },
  8: { name: "Monitor · Audífonos de estudio", price: 579000 },
  9: { name: "Cuerdas eléctrica Regular Slinky 10-46", price: 39000 },
  10: { name: "Púas Tortex surtidas · x12", price: 29000 },
  11: { name: "Correa de cuero para guitarra", price: 189000 },
  12: { name: "Capotraste Trigger · Negro", price: 99000 },
  13: { name: "Baquetas 5A · Hickory", price: 69000 },
  14: { name: "Funda acolchada para guitarra acústica", price: 249000 },
  15: { name: "DS-1 · Pedal de distorsión", price: 329000 },
  16: { name: "Afinador cromático de clip", price: 79000 },
  17: { name: "Cable de instrumento · 6 m", price: 89000 },
  18: { name: "Atril plegable para partituras", price: 119000 },
  19: { name: "Soporte de micrófono tipo boom", price: 159000 },
  20: { name: "ATH-M50x · Audífonos de estudio", price: 749000 },
  21: { name: "Cuerdas para bajo 45-105", price: 129000 },
  22: { name: "Kit de limpieza para guitarra", price: 69000 },
  23: { name: "Les Paul Standard '60s", price: 11999000 },
  24: { name: "KA-C · Ukelele concierto", price: 349000 },
  25: { name: "Player Precision Bass", price: 3899000 },
  27: { name: "CT-S1 · Teclado portátil", price: 1099000 },
  28: { name: "MPK Mini MK3 · Controlador MIDI", price: 549000 },
  29: { name: "YTR-2330 · Trompeta", price: 3299000 },
  30: { name: "AT2020 · Micrófono condensador", price: 489000 },
  31: { name: "Eris 3.5 · Monitores de estudio (par)", price: 599000 },
  32: { name: "Katana-50 MkII · Amplificador", price: 1499000 },
  33: { name: "MG10XU · Mezcladora de 10 canales", price: 899000 },
})

export const SHIPPING_FREE_FROM = 600000
export const SHIPPING_PRICE = 15000
export const FACTUS_MIN_AMOUNT = 1000
export const FACTUS_MAX_AMOUNT = 12100000

export function calculateOrder(items) {
  if (!items || typeof items !== "object" || Array.isArray(items)) {
    throw new Error("El carrito no es válido.")
  }

  const entries = Object.entries(items)
  if (!entries.length || entries.length > Object.keys(catalog).length) {
    throw new Error("El carrito está vacío o contiene demasiados productos.")
  }

  const normalizedItems = []
  let subtotal = 0

  for (const [rawId, rawQuantity] of entries) {
    const id = Number(rawId)
    const product = catalog[id]
    const quantity = Number(rawQuantity)

    if (!product || !Number.isSafeInteger(quantity) || quantity < 1 || quantity > 99) {
      throw new Error("El carrito contiene un producto o cantidad no válida.")
    }

    const lineTotal = product.price * quantity
    subtotal += lineTotal
    normalizedItems.push({ id, name: product.name, unitPrice: product.price, quantity, lineTotal })
  }

  const shipping = subtotal >= SHIPPING_FREE_FROM ? 0 : SHIPPING_PRICE
  const total = subtotal + shipping

  if (total < FACTUS_MIN_AMOUNT || total > FACTUS_MAX_AMOUNT) {
    throw new Error(
      `Factus Pay Sandbox admite cobros entre ${FACTUS_MIN_AMOUNT.toLocaleString("es-CO")} y ${FACTUS_MAX_AMOUNT.toLocaleString("es-CO")} COP. Ajusta el carrito para continuar.`,
    )
  }

  return { items: normalizedItems, subtotal, shipping, total }
}
