import type { FormEvent } from "react"
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react"
import {
  createBrowserRouter,
  RouterProvider,
  Link,
  Outlet,
  useNavigate,
  useSearchParams,
  useParams,
  useLocation,
} from "react-router"
import {
  Search,
  Heart,
  ShoppingBag,
  UserRound,
  ArrowRight,
  ArrowUpRight,
  Menu,
  X,
  Star,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Plus,
  Minus,
  Check,
  Instagram,
  Music2,
  SlidersHorizontal,
  Mail,
} from "lucide-react"
import logo from "../imports/Sirius_Music_Store_logo_star.png"

const photo = (id: string, width = 1000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=85`
const images = {
  hero: photo("photo-1770720221744-f9a0aadf3a4f", 1600),
  guitar: photo("photo-1550291652-6ea9114a47b1"),
  bass: photo("photo-1760413209574-918337123e01"),
  drums: photo("photo-1519892300165-cb5542fb47c7"),
  keys: photo("photo-1520523839897-bd0b52f945a0"),
  wind: photo("photo-1573871669414-010dbf73ca84"),
  audio: photo("photo-1598488035139-bdbb2231ce04"),
  accessories: photo("photo-1511379938547-c1f69419868d"),
  community: photo("photo-1593697725250-6a184f4e9ed0"),
}
const categories = [
  "Guitarras",
  "Bajos",
  "Baterías",
  "Teclados",
  "Instrumentos de viento",
  "Audio y grabación",
  "Accesorios",
]
const categoryImages = [
  images.guitar,
  images.bass,
  images.drums,
  images.keys,
  images.wind,
  images.audio,
  images.accessories,
]
type Product = {
  id: number
  name: string
  brand: string
  price: number
  old?: number
  category: string
  image: string
  badge?: string
}
const products: Product[] = [
  {
    id: 1,
    name: "Player II Stratocaster",
    brand: "Fender",
    price: 4299000,
    old: 4899000,
    category: "Guitarras",
    image: images.guitar,
    badge: "FAVORITO DE LA COMUNIDAD",
  },
  {
    id: 2,
    name: "FG800 · Natural",
    brand: "Yamaha",
    price: 1299000,
    category: "Guitarras",
    image: photo("photo-1571992164651-76489ce4ae35"),
    badge: "IDEAL PARA COMENZAR",
  },
  {
    id: 3,
    name: "GSR200 · Black",
    brand: "Ibanez",
    price: 1499000,
    category: "Bajos",
    image: images.bass,
  },
  {
    id: 4,
    name: "FP-10 · Piano digital",
    brand: "Roland",
    price: 2999000,
    old: 3449000,
    category: "Teclados",
    image: images.keys,
    badge: "−13%",
  },
  {
    id: 5,
    name: "Roadshow · Kit de batería",
    brand: "Pearl",
    price: 3999000,
    category: "Baterías",
    image: images.drums,
  },
  {
    id: 6,
    name: "Scarlett Solo · 4th Gen",
    brand: "Focusrite",
    price: 769000,
    category: "Audio y grabación",
    image: images.audio,
  },
  {
    id: 7,
    name: "YAS-280 · Saxofón alto",
    brand: "Yamaha",
    price: 6799000,
    category: "Instrumentos de viento",
    image: images.wind,
  },
  {
    id: 8,
    name: "Monitor · Audífonos de estudio",
    brand: "Marshall",
    price: 579000,
    old: 699000,
    category: "Accesorios",
    image: images.accessories,
  },
  {
    id: 9,
    name: "Cuerdas eléctrica Regular Slinky 10-46",
    brand: "Ernie Ball",
    price: 39000,
    category: "Accesorios",
    image: photo("photo-1522008224169-e5992bed5fae"),
    badge: "MÁS VENDIDO",
  },
  {
    id: 10,
    name: "Púas Tortex surtidas · x12",
    brand: "Dunlop",
    price: 29000,
    category: "Accesorios",
    image: photo("photo-1613837354006-1000dc22444c"),
  },
  {
    id: 11,
    name: "Correa de cuero para guitarra",
    brand: "Levy's",
    price: 189000,
    category: "Accesorios",
    image: photo("photo-1599302863710-43bcfd2d65df"),
  },
  {
    id: 12,
    name: "Capotraste Trigger · Negro",
    brand: "Kyser",
    price: 99000,
    old: 129000,
    category: "Accesorios",
    image: photo("photo-1647035295080-eb87f1b73e3a"),
    badge: "−23%",
  },
  {
    id: 13,
    name: "Baquetas 5A · Hickory",
    brand: "Vic Firth",
    price: 69000,
    category: "Accesorios",
    image: photo("photo-1571327073757-71d13c24de30"),
  },
  {
    id: 14,
    name: "Funda acolchada para guitarra acústica",
    brand: "Gator",
    price: 249000,
    category: "Accesorios",
    image: photo("photo-1552028650-1056e04d2e6d"),
  },
  {
    id: 15,
    name: "DS-1 · Pedal de distorsión",
    brand: "Boss",
    price: 329000,
    category: "Accesorios",
    image: photo("photo-1625801823295-311aa32e4d0d"),
  },
  {
    id: 16,
    name: "Afinador cromático de clip",
    brand: "Snark",
    price: 79000,
    category: "Accesorios",
    image: photo("photo-1599302978786-453ce05f525a"),
    badge: "IDEAL PARA COMENZAR",
  },
  {
    id: 17,
    name: "Cable de instrumento · 6 m",
    brand: "Fender",
    price: 89000,
    category: "Accesorios",
    image: photo("photo-1600152015632-77c2aa5565d5"),
  },
  {
    id: 18,
    name: "Atril plegable para partituras",
    brand: "K&M",
    price: 119000,
    category: "Accesorios",
    image: photo("photo-1527606432722-8b1422ce77a1"),
  },
  {
    id: 19,
    name: "Soporte de micrófono tipo boom",
    brand: "K&M",
    price: 159000,
    category: "Accesorios",
    image: photo("photo-1641903806973-17eaf2d2634f"),
  },
  {
    id: 20,
    name: "ATH-M50x · Audífonos de estudio",
    brand: "Audio-Technica",
    price: 749000,
    old: 849000,
    category: "Accesorios",
    image: photo("photo-1585298723682-7115561c51b7"),
  },
  {
    id: 21,
    name: "Cuerdas para bajo 45-105",
    brand: "D'Addario",
    price: 129000,
    category: "Accesorios",
    image: photo("photo-1543060749-aa3f115aad09"),
  },
  {
    id: 22,
    name: "Kit de limpieza para guitarra",
    brand: "Dunlop",
    price: 69000,
    category: "Accesorios",
    image: photo("photo-1643386156149-c99c3f03cf7b"),
  },
  {
    id: 23,
    name: "Les Paul Standard '60s",
    brand: "Gibson",
    price: 11999000,
    category: "Guitarras",
    image: photo("photo-1516924962500-2b4b3b99ea02"),
    badge: "EDICIÓN PREMIUM",
  },
  {
    id: 24,
    name: "KA-C · Ukelele concierto",
    brand: "Kala",
    price: 349000,
    category: "Guitarras",
    image: photo("photo-1707699164633-0e584b2da329"),
  },
  {
    id: 25,
    name: "Player Precision Bass",
    brand: "Fender",
    price: 3899000,
    category: "Bajos",
    image: photo("photo-1485278537138-4e8911a13c02"),
  },
  {
    id: 26,
    name: "Sensitone · Redoblante 14\"",
    brand: "Ludwig",
    price: 1299000,
    category: "Baterías",
    image: photo("photo-1629055929130-ebbe08f76cdf"),
  },
  {
    id: 27,
    name: "CT-S1 · Teclado portátil",
    brand: "Casio",
    price: 1099000,
    old: 1249000,
    category: "Teclados",
    image: images.keys,
  },
  {
    id: 28,
    name: "MPK Mini MK3 · Controlador MIDI",
    brand: "Akai",
    price: 549000,
    old: 629000,
    category: "Teclados",
    image: photo("photo-1522870389523-7e83c0065eaf"),
  },
  {
    id: 29,
    name: "YTR-2330 · Trompeta",
    brand: "Yamaha",
    price: 3299000,
    category: "Instrumentos de viento",
    image: photo("photo-1573871666457-7c7329118cf9"),
  },
  {
    id: 30,
    name: "AT2020 · Micrófono condensador",
    brand: "Audio-Technica",
    price: 489000,
    category: "Audio y grabación",
    image: photo("photo-1531651008558-ed1740375b39"),
  },
  {
    id: 31,
    name: "Eris 3.5 · Monitores de estudio (par)",
    brand: "PreSonus",
    price: 599000,
    category: "Audio y grabación",
    image: photo("photo-1545454675-3531b543be5d"),
  },
  {
    id: 32,
    name: "Katana-50 MkII · Amplificador",
    brand: "Boss",
    price: 1499000,
    category: "Audio y grabación",
    image: photo("photo-1616533719060-a7fc492e9299"),
  },
  {
    id: 33,
    name: "MG10XU · Mezcladora de 10 canales",
    brand: "Yamaha",
    price: 899000,
    category: "Audio y grabación",
    image: photo("photo-1600148272607-7bbf03a40d3b"),
  },
]
const brands = [...new Set(products.map((product) => product.brand))].sort()
const maxPrice =
  Math.ceil(Math.max(...products.map((product) => product.price)) / 50000) * 50000
const money = (price: number) =>
  new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(price)
const button =
  "inline-flex items-center justify-center gap-3 rounded-lg bg-primary px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#6e2846] active:scale-[.98]"
const outline =
  "inline-flex items-center justify-center gap-3 rounded-lg border border-[#dcaec2] px-6 py-3.5 text-sm font-semibold text-primary transition hover:bg-secondary"
type Store = {
  cart: Record<number, number>
  favorites: number[]
  add: (id: number) => void
  quantity: (id: number, delta: number) => void
  favorite: (id: number) => void
  notify: (text: string) => void
  clear: () => void
}
const Context = createContext<Store>(null!)
const useStore = () => useContext(Context)
function Logo({ footer = false }: { footer?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <img
        src={logo}
        alt=""
        className={`${footer ? "h-16 w-16" : "h-12 w-12 sm:h-14 sm:w-14"} shrink-0 object-contain`}
      />
      <span className="flex flex-col items-center leading-none" style={{ fontFamily: "'Exo 2', sans-serif" }}>
        <span
          className={`${footer ? "text-[34px]" : "text-[26px] sm:text-[30px]"} font-black italic uppercase tracking-[.02em]`}
          style={{
            color: "#d593b0",
            WebkitTextStroke: "3px #5e1f3a",
            paintOrder: "stroke fill",
            textShadow: "0 2px 0 #5e1f3a",
          }}
        >
          Sirius
        </span>
        <span
          className={`${footer ? "text-[10px]" : "text-[8px] sm:text-[9px]"} mt-1 flex items-center gap-1.5 font-bold uppercase tracking-[.22em] text-[#5e1f3a]`}
        >
          <span aria-hidden className="h-px w-3 bg-[#5e1f3a]" />
          Music Store
          <span aria-hidden className="h-px w-3 bg-[#5e1f3a]" />
        </span>
      </span>
      <span className="sr-only">Sirius Music Store</span>
    </span>
  )
}
const navItems = [
  { label: "Inicio", to: "/" },
  { label: "Instrumentos", to: "/catalogo" },
  { label: "Accesorios", to: "/catalogo?categoria=Accesorios" },
  { label: "Ofertas", to: "/catalogo?ofertas=1" },
  { label: "Marcas", to: "/#marcas" },
  { label: "Nosotros", to: "/#comunidad" },
]
function SectionTitle({
  eyebrow,
  title,
  link,
  to = "/catalogo",
}: {
  eyebrow?: string
  title: string
  link?: string
  to?: string
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-5">
      <div>
        {eyebrow && (
          <p className="mb-3 text-[10px] font-bold tracking-[.2em] text-primary">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-[27px] font-semibold leading-[1.35] md:text-[32px]">
          {title}
        </h2>
      </div>
      {link && (
        <Link
          className="hidden shrink-0 items-center gap-2 border-b border-primary/30 pb-1 text-xs font-semibold text-primary sm:flex"
          to={to}
        >
          {link}
          <ArrowUpRight size={15} />
        </Link>
      )}
    </div>
  )
}
function Layout() {
  const [cart, setCart] = useState<Record<number, number>>(() => {
    try {
      return JSON.parse(localStorage.getItem("sirius-cart") || "{}")
    } catch {
      return {}
    }
  })
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem("sirius-favorites") || "[]")
    } catch {
      return []
    }
  })
  const [toast, setToast] = useState("")
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    localStorage.setItem("sirius-cart", JSON.stringify(cart))
  }, [cart])
  useEffect(() => {
    localStorage.setItem("sirius-favorites", JSON.stringify(favorites))
  }, [favorites])
  useEffect(() => {
    setMenu(false)
    if (location.hash) {
      // Wait for the target page to render before scrolling to the section.
      const timer = setTimeout(() => {
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 50)
      return () => clearTimeout(timer)
    }
    window.scrollTo(0, 0)
  }, [location.key])
  useEffect(() => {
    if (!menu) return
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenu(false)
    }
    window.addEventListener("keydown", close)
    return () => window.removeEventListener("keydown", close)
  }, [menu])
  const current = location.pathname + location.search + location.hash
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(""), 3500)
      return () => clearTimeout(timer)
    }
  }, [toast])
  const store: Store = {
    cart,
    favorites,
    add: (id) => {
      setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
      setToast("Tu instrumento se agregó al carrito")
    },
    quantity: (id, delta) =>
      setCart((prev) => {
        const next = { ...prev }
        next[id] = Math.max(0, (next[id] || 0) + delta)
        if (!next[id]) delete next[id]
        return next
      }),
    favorite: (id) =>
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
      ),
    notify: setToast,
    clear: () => setCart({}),
  }
  return (
    <Context.Provider value={store}>
      <div className="bg-[#5e1f3a] px-4 py-2 text-center text-[10px] tracking-[.06em] text-white sm:text-[11px]">
        Tu primer escenario empieza aquí.{" "}
        <span className="mx-2 opacity-50">★</span> Envío gratis en compras desde
        $600.000 COP
      </div>
      <header className="relative z-30 border-b border-border bg-background">
        <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-5 px-5 py-3 md:px-10">
          <Link to="/" aria-label="Sirius Music Store, inicio">
            <Logo />
          </Link>
          <nav className="hidden items-center gap-6 text-[12px] font-medium lg:flex">
            {navItems.map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                aria-current={current === to ? "page" : undefined}
                className={`py-2 transition hover:text-primary ${
                  current === to
                    ? "border-b border-primary text-primary"
                    : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <form
              onSubmit={(event) => {
                event.preventDefault()
                navigate(`/buscar?q=${encodeURIComponent(search)}`)
              }}
              className="hidden items-center gap-2 rounded-lg bg-[#f5ebef] px-3 py-2.5 xl:flex"
            >
              <Search size={15} className="text-muted-foreground" />
              <input
                aria-label="Buscar instrumentos"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Encuentra tu sonido..."
                className="w-36 bg-transparent text-[11px] outline-none"
              />
            </form>
            <Link
              to="/catalogo?favoritos=1"
              aria-label="Favoritos"
              className="relative hover:text-primary"
            >
              <Heart size={19} />
              {favorites.length > 0 && (
                <span className="absolute -right-2 -top-2 text-[9px] text-primary">
                  {favorites.length}
                </span>
              )}
            </Link>
            <Link
              to="/carrito"
              className="relative hover:text-primary"
              aria-label="Carrito"
            >
              <ShoppingBag size={19} />
              <span className="absolute -right-2 -top-2 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-white">
                {Object.values(cart).reduce((total, count) => total + count, 0)}
              </span>
            </Link>
            <Link
              to="/cuenta"
              aria-label="Iniciar sesión"
              className="hidden hover:text-primary sm:block"
            >
              <UserRound size={19} />
            </Link>
            <button
              type="button"
              onClick={() => setMenu(!menu)}
              aria-label={menu ? "Cerrar navegación" : "Abrir navegación"}
              aria-expanded={menu}
              aria-controls="menu-movil"
              className="lg:hidden"
            >
              {menu ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>
        </div>
        {menu && (
          <nav
            id="menu-movil"
            aria-label="Navegación principal"
            className="absolute inset-x-0 top-full grid max-h-[calc(100vh-140px)] gap-1 overflow-y-auto border-b border-border bg-background p-4 shadow-lg lg:hidden"
          >
            {[
              ...navItems,
              { label: "Buscar", to: "/buscar" },
              { label: "Favoritos", to: "/catalogo?favoritos=1" },
              { label: "Encuentra tu instrumento", to: "/encuentra-tu-instrumento" },
              { label: "Iniciar sesión", to: "/cuenta" },
            ].map(({ label, to }) => (
              <Link
                key={label}
                to={to}
                onClick={() => setMenu(false)}
                aria-current={current === to ? "page" : undefined}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition hover:bg-secondary hover:text-primary ${
                  current === to ? "bg-secondary text-primary" : ""
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
      </header>
      <main>
        <Outlet />
      </main>
      <Footer />
      {toast && (
        <div
          role="status"
          className="fixed bottom-6 left-1/2 z-50 flex w-max max-w-[90vw] -translate-x-1/2 items-center gap-3 rounded-xl bg-[#4a1a2f] px-6 py-4 text-sm text-white shadow-xl"
        >
          <Check size={18} />
          {toast}
        </div>
      )}
    </Context.Provider>
  )
}
function Home() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  return (
    <>
      <section className="relative overflow-hidden bg-[#f9ecf1]">
        <div className="relative mx-auto grid max-w-[1440px] lg:grid-cols-[.96fr_1fr]">
          <div className="relative z-10 px-6 py-14 sm:px-12 md:py-20 lg:pl-[max(60px,calc((100vw-1240px)/2))] lg:pr-8">
            <div className="mb-7 flex items-center gap-2 text-[10px] font-semibold tracking-[.18em] text-primary">
              <Star size={14} /> UN UNIVERSO DE POSIBILIDADES
            </div>
            <h1 className="max-w-[590px] font-display text-[46px] font-semibold leading-[1.14] tracking-[-.025em] text-[#3a1d2a] sm:text-[62px] xl:text-[70px]">
              Tú también
              <br />
              puedes ser
              <br />
              <span className="text-[#a24d70]">
                una estrella
                <span className="ml-2 inline-block align-top text-[37px] text-[#c4a0b1]">
                  ★
                </span>
              </span>
            </h1>
            <p className="mt-6 max-w-[390px] text-[14px] leading-[1.85] text-[#7a6870]">
              Encuentra el instrumento que te acompañará a convertir tu pasión
              por la música en algo extraordinario.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/catalogo" className={button}>
                Explorar instrumentos <ArrowRight size={16} />
              </Link>
              <Link to="/catalogo?ofertas=1" className={outline}>
                Ver ofertas <ArrowUpRight size={16} />
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[
                  "photo-1619361369057-a86afad4be8a",
                  "photo-1593697725250-6a184f4e9ed0",
                  "photo-1511379938547-c1f69419868d",
                ].map((id) => (
                  <img
                    key={id}
                    src={photo(id, 100)}
                    className="h-8 w-8 rounded-full border-2 border-[#f9ecf1] object-cover"
                    alt="Nuestra comunidad"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-[#7a2f4d]">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <Star key={number} size={10} fill="currentColor" />
                  ))}
                  <span className="ml-1 text-[10px] font-semibold text-foreground">
                    4.9 / 5
                  </span>
                </div>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Más de 1,000 músicos ya brillan con nosotros
                </p>
              </div>
            </div>
          </div>
          <div className="relative min-h-[360px] lg:min-h-[620px]">
            <img
              src={images.hero}
              alt="Colección de guitarras eléctricas en una tienda de instrumentos"
              className="absolute inset-0 h-full w-full object-cover object-[55%_center]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#f9ecf1] via-transparent to-black/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            <span className="absolute right-[15%] top-[15%] text-5xl text-[#f8e6ee]/70">
              ☆
            </span>
            <span className="absolute right-[28%] top-[28%] text-xl text-white/70">
              ★
            </span>
            <div className="absolute bottom-10 right-8 flex items-center gap-4 rounded-xl border border-white/25 bg-white/15 p-4 text-white backdrop-blur-md">
              <span className="text-3xl">★</span>
              <div>
                <p className="text-xs font-medium">
                  Grandes sueños. Grandes instrumentos.
                </p>
                <p className="mt-1 text-[10px] text-white/70">
                  Tu próxima historia empieza con una nota.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Benefits compact />
      <section className="mx-auto max-w-[1320px] px-6 py-16 md:px-10">
        <SectionTitle
          eyebrow="CADA MÚSICO TIENE SU UNIVERSO"
          title="Encuentra tu sonido"
          link="Explorar todas las categorías"
        />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {categories.map((name, index) => (
            <Link
              to={`/catalogo?categoria=${encodeURIComponent(name)}`}
              key={name}
              className="group"
            >
              <div className="relative aspect-[.95] overflow-hidden rounded-xl bg-muted">
                <img
                  loading="lazy"
                  src={categoryImages[index]}
                  alt={name}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />
                <span className="absolute bottom-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-foreground transition group-hover:bg-secondary">
                  <ArrowUpRight size={13} />
                </span>
              </div>
              <h3 className="mt-3 text-center text-[12px] font-semibold">
                {name}
              </h3>
              <p className="mt-1 text-center text-[10px] text-muted-foreground">
                Descubre tu universo
              </p>
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto max-w-[1320px] px-6 pb-16 md:px-10">
        <SectionTitle
          eyebrow="SELECCIONADOS PARA INSPIRARTE"
          title="Tu próximo gran comienzo"
          link="Ver todos los instrumentos"
        />
        <p className="-mt-5 mb-7 text-sm text-muted-foreground">
          Instrumentos que pueden convertirse en tu próximo comienzo.
        </p>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      <section className="mx-auto mb-16 max-w-[1240px] overflow-hidden rounded-2xl bg-[#f5e8ed] max-md:mx-6">
        <div className="grid items-center gap-6 px-7 py-9 md:grid-cols-[100px_1fr_auto] md:px-10">
          <div className="hidden h-20 w-20 items-center justify-center rounded-full border border-[#c48aa3]/40 text-[#5e1f3a] md:flex">
            <Music2 size={34} />
            <Star size={17} />
          </div>
          <div>
            <p className="mb-2 text-[10px] font-bold tracking-[.17em] text-[#5e1f3a]">
              TU PRIMER PASO HACIA EL ESCENARIO
            </p>
            <h2 className="font-display text-2xl font-semibold">
              ¿No sabes qué instrumento elegir?
            </h2>
            <p className="mt-2 text-[13px] text-[#7d5f6c]">
              Cada estrella tiene su propio sonido. Descubramos el tuyo.
            </p>
          </div>
          <Link
            to="/encuentra-tu-instrumento"
            className={`${button} bg-[#5e1f3a] hover:bg-[#4a1a2f]`}
          >
            Descubre tu instrumento <ArrowUpRight size={16} />
          </Link>
        </div>
      </section>
      <section
        id="marcas"
        className="mx-auto max-w-[1240px] scroll-mt-5 px-6 pb-16"
      >
        <p className="mb-8 text-center text-[10px] font-semibold tracking-[.18em] text-muted-foreground">
          LAS MARCAS QUE HACEN HISTORIA. EN TUS MANOS.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-8 text-[#73606a]">
          {[
            "Fender",
            "Gibson",
            "YAMAHA",
            "Ibanez",
            "Roland",
            "Marshall",
            "CASIO",
            "Pearl",
          ].map((brand, index) => (
            <Link
              to={`/catalogo?marca=${brand}`}
              key={brand}
              className={`text-xl font-bold transition hover:text-primary ${
                [0, 1, 3, 5, 7].includes(index)
                  ? "font-serif italic"
                  : "font-display tracking-[-.04em]"
              }`}
            >
              {brand}
            </Link>
          ))}
        </div>
      </section>
      <section className="mx-auto mb-16 grid max-w-[1240px] overflow-hidden rounded-2xl bg-[#3a1f2b] text-white max-md:mx-6 md:grid-cols-2">
        <div className="px-8 py-12 md:px-12">
          <p className="text-[10px] tracking-[.18em] text-[#ebc9d6]">
            MÁS MÚSICA. MÁS POSIBILIDADES.
          </p>
          <h2 className="mt-5 max-w-[400px] font-display text-3xl font-medium leading-snug md:text-4xl">
            Tu próxima gran historia comienza aquí
          </h2>
          <p className="mb-6 mt-4 text-sm leading-6 text-white/60">
            Hasta 20% de descuento en instrumentos seleccionados. Dale play a
            eso que siempre has soñado.
          </p>
          <Link
            to="/catalogo?ofertas=1"
            className={`${button} bg-[#e6bfd0] text-[#3d1a2a] hover:bg-[#eed2de]`}
          >
            Ver ofertas <ArrowRight size={16} />
          </Link>
        </div>
        <div className="relative min-h-64">
          <img
            src={images.guitar}
            alt="Guitarra eléctrica en promoción"
            loading="lazy"
            className="absolute h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#3a1f2b] to-transparent" />
          <div className="absolute right-10 top-10 flex h-24 w-24 rotate-12 flex-col items-center justify-center rounded-full bg-[#e6bfd0] text-[#3d1a2a]">
            <span className="text-[10px]">HASTA</span>
            <strong className="text-3xl">−20%</strong>
          </div>
        </div>
      </section>
      <Benefits />
      <section
        id="comunidad"
        className="mx-auto grid max-w-[1320px] scroll-mt-5 items-center gap-12 px-6 py-16 md:grid-cols-2 md:px-10"
      >
        <div className="relative">
          <img
            src={images.community}
            alt="Músico practicando guitarra en su estudio"
            loading="lazy"
            className="h-[380px] w-full rounded-2xl object-cover object-[center_40%]"
          />
          <span className="absolute -right-4 -top-5 text-6xl text-[#c98aa6]">
            ★
          </span>
          <div className="absolute bottom-5 left-5 rounded-lg bg-background/95 px-4 py-3 text-[11px] text-primary">
            Una pasión que nos conecta. ♡
          </div>
        </div>
        <div>
          <p className="mb-4 text-[10px] font-bold tracking-[.2em] text-primary">
            NO SOLO VENDEMOS INSTRUMENTOS
          </p>
          <h2 className="font-display text-4xl font-semibold leading-[1.3]">
            Las estrellas también
            <br />
            comienzan desde cero
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">
            Ya seas principiante o músico experimentado, en Sirius Music Store
            encontrarás herramientas para seguir haciendo crecer tu talento.
          </p>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            Creemos en el poder de una primera nota. Y en todo lo que viene
            después.
          </p>
          <Link
            to="/encuentra-tu-instrumento"
            className="mt-6 inline-flex items-center gap-3 text-sm font-semibold text-primary"
          >
            Encuentra tu próximo comienzo <ArrowUpRight size={17} />
          </Link>
        </div>
      </section>
      <section className="bg-[#f9ecf1] px-6 py-12">
        <div className="mx-auto grid max-w-[1240px] items-center gap-8 md:grid-cols-2">
          <div>
            <div className="mb-3 flex items-center gap-2 text-primary">
              <Star size={19} />
              <span className="text-[10px] tracking-[.17em]">
                SIGAMOS EN SINTONÍA
              </span>
            </div>
            <h2 className="font-display text-[28px] font-semibold">
              Haz que tu música llegue más lejos
            </h2>
            <p className="mt-2 text-xs text-muted-foreground">
              Novedades, lanzamientos y ofertas especiales. Nada de ruido.
            </p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSubscribed(true)
            }}
          >
            <div className="flex gap-2">
              <input
                required
                type="email"
                aria-label="Correo para novedades"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Tu correo electrónico"
                className="min-w-0 flex-1 rounded-lg border border-white bg-white px-4 py-3 text-sm focus:border-primary focus:outline-none"
              />
              <button className={button}>
                {subscribed ? "¡Suscrito!" : "Suscribirme"}
                <ArrowRight size={15} />
              </button>
            </div>
            <p role="status" className="mt-3 text-[10px] text-muted-foreground">
              {subscribed
                ? "¡Bienvenido al universo Sirius! Suscripción registrada en esta demostración."
                : "Al suscribirte, aceptas nuestra política de privacidad. Puedes salir cuando quieras."}
            </p>
          </form>
        </div>
      </section>
    </>
  )
}
function Benefits({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={`${compact ? "border-b border-border" : "bg-[#f6eef1]"}`}
    >
      <div className="mx-auto grid max-w-[1240px] grid-cols-2 gap-5 px-6 py-6 md:grid-cols-4">
        {[
          [Truck, "Envíos rápidos", "Tu música no puede esperar"],
          [ShieldCheck, "Compra segura", "Pagos protegidos, siempre"],
          [BadgeCheck, "Garantía de calidad", "Instrumentos 100% originales"],
          [Headphones, "Asesoría especializada", "Músicos que te entienden"],
        ].map(([Icon, title, subtitle]) => {
          const BenefitIcon = Icon as typeof Truck
          return (
            <div
              key={String(title)}
              className="flex items-center justify-center gap-3"
            >
              <BenefitIcon
                size={24}
                strokeWidth={1.3}
                className="shrink-0 text-[#92647a]"
              />
              <div>
                <p className="text-[11px] font-semibold">{String(title)}</p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  {String(subtitle)}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
function ProductCard({ product }: { product: Product }) {
  const store = useStore()
  return (
    <article className="group overflow-hidden rounded-xl border border-border bg-white">
      <div className="relative bg-[#f8f0f3]">
        <Link to={`/producto/${product.id}`} className="block">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null
              event.currentTarget.src =
                categoryImages[categories.indexOf(product.category)]
            }}
            className={`h-[230px] w-full p-5 transition duration-500 group-hover:scale-105 sm:h-[280px] ${
              product.id < 4
                ? "object-contain mix-blend-multiply"
                : "object-cover"
            }`}
          />
        </Link>
        {product.badge && (
          <span className="absolute left-3 top-3 max-w-[70%] rounded bg-[#f7e3eb] px-2 py-1.5 text-[7px] font-bold tracking-[.04em] text-primary">
            {product.badge}
          </span>
        )}
        <button
          aria-label={`Guardar ${product.name}`}
          aria-pressed={store.favorites.includes(product.id)}
          onClick={() => store.favorite(product.id)}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 text-primary hover:bg-secondary"
        >
          <Heart
            size={15}
            fill={
              store.favorites.includes(product.id) ? "currentColor" : "none"
            }
          />
        </button>
      </div>
      <div className="p-4">
        <p className="text-[9px] font-semibold uppercase tracking-[.13em] text-muted-foreground">
          {product.brand}
        </p>
        <Link to={`/producto/${product.id}`}>
          <h3 className="mt-2 text-[13px] font-semibold sm:text-sm">
            {product.name}
          </h3>
        </Link>
        <p className="mt-2 flex items-center gap-1 text-[#a05a76]">
          {[1, 2, 3, 4, 5].map((number) => (
            <Star key={number} size={10} fill="currentColor" />
          ))}
          <span className="ml-1 text-[9px] text-muted-foreground">(24)</span>
        </p>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <strong className="text-base">{money(product.price)}</strong>
          {product.old && (
            <span className="text-[10px] text-muted-foreground line-through">
              {money(product.old)}
            </span>
          )}
          <span className="text-[9px] text-muted-foreground">COP</span>
        </div>
        <button
          onClick={() => store.add(product.id)}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-md border border-border py-2.5 text-[11px] font-medium text-primary transition hover:border-primary hover:bg-secondary"
        >
          <Plus size={14} /> Agregar al carrito
        </button>
      </div>
    </article>
  )
}
function Catalog() {
  const [params, setParams] = useSearchParams()
  const store = useStore()
  const [query, setQuery] = useState(params.get("q") || "")
  const [sort, setSort] = useState("popular")
  const [max, setMax] = useState(maxPrice)
  const selected = params.get("categoria") || ""
  const brand = params.get("marca") || ""
  let filtered = products.filter(
    (product) =>
      (!selected || selected === product.category) &&
      (!brand || product.brand.toLowerCase() === brand.toLowerCase()) &&
      (!params.get("ofertas") || product.old) &&
      (!params.get("favoritos") || store.favorites.includes(product.id)) &&
      (!params.get("q") ||
        `${product.name} ${product.brand} ${product.category}`
          .toLowerCase()
          .includes(params.get("q")!.toLowerCase())) &&
      product.price <= max,
  )
  if (sort !== "popular")
    filtered = [...filtered].sort((first, second) =>
      sort === "low" ? first.price - second.price : second.price - first.price,
    )
  return (
    <div className="mx-auto max-w-[1320px] px-6 py-12 md:px-10">
      <p className="mb-5 text-xs text-muted-foreground">
        <Link to="/">Inicio</Link> /{" "}
        {params.get("q") ? "Resultados de búsqueda" : "Instrumentos"}
      </p>
      <SectionTitle
        eyebrow="TU UNIVERSO MUSICAL"
        title={
          params.get("favoritos")
            ? "Tus favoritos"
            : params.get("ofertas")
              ? "Ofertas para tu próximo comienzo"
              : params.get("q")
                ? `Resultados para “${params.get("q")}”`
                : selected || "Encuentra tu próximo instrumento"
        }
      />
      <form
        className="mb-8 flex gap-3"
        onSubmit={(event) => {
          event.preventDefault()
          setParams({ q: query })
        }}
      >
        <input
          className="w-full rounded-lg border border-border bg-white px-4 text-sm"
          aria-label="Buscar"
          placeholder="Buscar instrumento, marca..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className={button}>
          <Search size={17} />
          Buscar
        </button>
      </form>
      <div className="grid gap-8 md:grid-cols-[220px_1fr]">
        <aside className="h-fit rounded-xl border border-border bg-white p-5">
          <h3 className="mb-5 flex gap-2 text-sm font-semibold">
            <SlidersHorizontal size={17} />
            Filtros
          </h3>
          <label className="text-xs font-semibold">
            Categoría
            <select
              value={selected}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                event.target.value
                  ? next.set("categoria", event.target.value)
                  : next.delete("categoria")
                setParams(next)
              }}
              className="mb-5 mt-2 w-full rounded-lg border border-border p-2 text-xs"
            >
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Marca
            <select
              value={brand}
              onChange={(event) => {
                const next = new URLSearchParams(params)
                event.target.value
                  ? next.set("marca", event.target.value)
                  : next.delete("marca")
                setParams(next)
              }}
              className="mb-5 mt-2 w-full rounded-lg border border-border p-2 text-xs"
            >
              <option value="">Todas</option>
              {brands.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="text-xs font-semibold">
            Hasta {money(max)}
            <input
              aria-label="Precio máximo"
              type="range"
              min="0"
              max={maxPrice}
              step="50000"
              value={max}
              onChange={(event) => setMax(Number(event.target.value))}
              className="mt-4 w-full accent-primary"
            />
          </label>
          <button
            onClick={() => {
              setParams({})
              setMax(maxPrice)
              setQuery("")
            }}
            className="mt-5 text-xs text-primary underline"
          >
            Limpiar filtros
          </button>
        </aside>
        <div>
          <div className="mb-5 flex items-center justify-between text-xs text-muted-foreground">
            <p>{filtered.length} instrumentos encontrados</p>
            <select
              aria-label="Ordenar productos"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
              className="rounded-lg border border-border bg-white p-2"
            >
              <option value="popular">Recomendados</option>
              <option value="low">Precio: menor a mayor</option>
              <option value="high">Precio: mayor a menor</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {!filtered.length && (
            <div className="rounded-xl bg-secondary p-12 text-center">
              <Search className="mx-auto mb-4" />
              <h3 className="text-lg">
                No encontramos instrumentos con estos filtros.
              </h3>
              <p className="mt-3 text-sm">
                Prueba otra categoría, marca o rango de precios.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
function ProductDetail() {
  const { id } = useParams()
  const product = products.find((item) => item.id === Number(id))
  const store = useStore()
  if (!product) return <NotFound />
  return (
    <div className="mx-auto max-w-[1240px] px-6 py-12">
      <p className="mb-8 text-xs text-muted-foreground">
        <Link to="/catalogo">Instrumentos</Link> / {product.category} /{" "}
        {product.name}
      </p>
      <div className="grid gap-12 md:grid-cols-2">
        <div className="rounded-2xl bg-muted p-8">
          <img
            src={product.image}
            alt={product.name}
            className="h-[440px] w-full object-contain"
          />
        </div>
        <div className="py-6">
          <p className="text-xs uppercase tracking-[.18em] text-primary">
            {product.brand}
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold">
            {product.name}
          </h1>
          <p className="mt-4 text-sm text-accent">
            ★★★★★{" "}
            <span className="text-muted-foreground">4.9 · 24 reseñas</span>
          </p>
          <div className="mt-7 text-3xl font-semibold">
            {money(product.price)}{" "}
            <span className="text-xs font-normal">COP</span>
          </div>
          {product.old && (
            <p className="mt-2 text-muted-foreground line-through">
              {money(product.old)}
            </p>
          )}
          <p className="mt-7 text-sm leading-7 text-muted-foreground">
            Un sonido que inspira desde la primera nota. {product.brand} combina
            calidad, comodidad y versatilidad para acompañarte en cada ensayo y
            en cada escenario.
          </p>
          <p className="mt-6 flex items-center gap-2 text-xs text-accent">
            <Check size={15} />
            Disponible · Envío gratis
          </p>
          <button
            onClick={() => store.add(product.id)}
            className={`${button} mt-6 w-full`}
          >
            <ShoppingBag size={17} />
            Agregar al carrito
          </button>
          <button
            onClick={() => store.favorite(product.id)}
            className={`${outline} mt-3 w-full`}
          >
            <Heart size={16} />
            {store.favorites.includes(product.id)
              ? "Guardado en favoritos"
              : "Guardar en favoritos"}
          </button>
          <div className="mt-8 space-y-3 text-xs text-muted-foreground">
            <p>★ Producto original con garantía de 12 meses</p>
            <p>★ Asesoría personalizada antes y después de tu compra</p>
            <p>★ Devoluciones durante los primeros 30 días</p>
          </div>
        </div>
      </div>
      <div className="mt-14">
        <SectionTitle title="También pueden inspirarte" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {products
            .filter((item) => item.id !== product.id)
            .slice(0, 4)
            .map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
        </div>
      </div>
    </div>
  )
}
type FactusPaymentInfo = {
  referenceCode: string
  amount: number
  status: string
  qr: string
  qrExpiresAt: string | null
  brebKey: string | null
}

function FactusPayment({
  payment,
  onPaid,
  onRetry,
}: {
  payment: FactusPaymentInfo
  onPaid: () => void
  onRetry: () => void
}) {
  const [status, setStatus] = useState(payment.status)
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState("")
  const [manualCheck, setManualCheck] = useState(0)

  useEffect(() => {
    let active = true
    let timer: number | undefined

    const verify = async () => {
      if (!active) return
      setChecking(true)
      try {
        const response = await fetch(
          `/api/payments/factus/${encodeURIComponent(payment.referenceCode)}/status`,
        )
        const result = await response.json()
        if (!response.ok) throw new Error(result.message || "No se pudo consultar el pago.")
        if (!active) return
        setStatus(String(result.status || "unknown").toLowerCase())
        setError("")
        if (String(result.status).toLowerCase() === "paid") {
          active = false
          if (timer) window.clearInterval(timer)
          onPaid()
        }
      } catch (checkError) {
        if (active) {
          setError(
            checkError instanceof Error
              ? checkError.message
              : "No se pudo consultar el estado del pago.",
          )
        }
      } finally {
        if (active) setChecking(false)
      }
    }

    void verify()
    timer = window.setInterval(() => void verify(), 10000)
    return () => {
      active = false
      if (timer) window.clearInterval(timer)
    }
  }, [payment.referenceCode, manualCheck])

  const statusLabel: Record<string, string> = {
    ready: "Esperando el pago",
    started: "Pago iniciado",
    paid: "Pago confirmado",
    failed: "El pago no pudo completarse",
    rejected: "El pago fue rechazado",
    unknown: "Estado pendiente de consulta",
  }

  return (
    <section className="col-span-2 rounded-xl border border-border bg-white p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[.18em] text-primary">
            Factus Pay · Sandbox
          </p>
          <h2 className="mt-2 text-xl font-semibold">Escanea para pagar</h2>
        </div>
        <span className="rounded-full bg-secondary px-3 py-2 text-xs font-semibold text-primary">
          {statusLabel[status] || statusLabel.unknown}
        </span>
      </div>
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Abre la aplicación bancaria o billetera compatible con Bre-B y escanea este código QR.
        No compartas el código con personas distintas a quien realizará el pago.
      </p>
      <div className="mt-6 grid gap-6 md:grid-cols-[220px_1fr] md:items-center">
        <div className="mx-auto w-full max-w-[220px] rounded-xl border border-border bg-white p-3">
          <img src={payment.qr} alt="Código QR de pago Factus Pay Sandbox" className="aspect-square w-full object-contain" />
        </div>
        <div className="space-y-4 text-sm">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <span className="text-muted-foreground">Total solicitado</span>
            <strong className="text-lg">{money(payment.amount)}</strong>
          </div>
          <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
            <span className="text-muted-foreground">Referencia</span>
            <strong className="break-all text-right text-xs">{payment.referenceCode}</strong>
          </div>
          {payment.brebKey && (
            <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
              <span className="text-muted-foreground">Llave Bre-B</span>
              <strong className="break-all text-right text-xs">{payment.brebKey}</strong>
            </div>
          )}
          {payment.qrExpiresAt && (
            <p className="text-xs text-muted-foreground">Vencimiento informado por Factus: {payment.qrExpiresAt}</p>
          )}
          <p className="rounded-lg bg-secondary p-4 text-xs leading-5 text-primary">
            Esta es una transacción de prueba. Usa el simulador oficial de Factus Pay Sandbox para representar un pago exitoso o fallido.
            <a href="https://pay-developers.factus.com.co/sandbox/simulator/" target="_blank" rel="noreferrer" className="mt-2 block font-semibold underline">Abrir simulador de Factus Pay</a>
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setManualCheck((value) => value + 1)}
              disabled={checking}
              className={button}
            >
              {checking ? "Consultando..." : "Ya pagué · Verificar"}
            </button>
            {(["failed", "rejected"].includes(status)) && (
              <button type="button" onClick={onRetry} className={outline}>
                Crear otro cobro
              </button>
            )}
          </div>
          {error && <p role="alert" className="text-xs text-red-700">{error}</p>}
          <p className="text-[11px] text-muted-foreground">
            Consultamos el estado automáticamente cada 10 segundos. El pedido solo se confirma cuando Factus Pay devuelve el estado “paid”.
          </p>
        </div>
      </div>
    </section>
  )
}

function Cart({ checkout = false }: { checkout?: boolean }) {
  const store = useStore()
  const [done, setDone] = useState(false)
  const [completedReference, setCompletedReference] = useState("")
  const [payment, setPayment] = useState<FactusPaymentInfo | null>(() => {
    try {
      const stored = localStorage.getItem("sirius-factus-pending-payment")
      if (!stored) return null
      const parsed = JSON.parse(stored) as FactusPaymentInfo
      return parsed.referenceCode && parsed.qr ? parsed : null
    } catch {
      return null
    }
  })
  const [creatingPayment, setCreatingPayment] = useState(false)
  const [checkoutError, setCheckoutError] = useState("")
  const items = products.filter((product) => store.cart[product.id])
  const subtotal = items.reduce(
    (sum, product) => sum + product.price * store.cart[product.id],
    0,
  )
  const shipping = subtotal >= 600000 ? 0 : 15000
  const total = subtotal + shipping

  useEffect(() => {
    if (payment) {
      localStorage.setItem("sirius-factus-pending-payment", JSON.stringify(payment))
    } else {
      localStorage.removeItem("sirius-factus-pending-payment")
    }
  }, [payment])

  const handlePaid = () => {
    setCompletedReference(payment?.referenceCode || "")
    setDone(true)
    setPayment(null)
    store.clear()
  }

  const handleCheckout = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setCheckoutError("")
    setCreatingPayment(true)
    try {
      const formData = new FormData(event.currentTarget)
      const customer = Object.fromEntries(
        ["name", "email", "phone", "address", "city", "postalCode"].map((field) => [
          field,
          String(formData.get(field) || "").trim(),
        ]),
      )
      const response = await fetch("/api/payments/factus/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ customer, items: store.cart }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || "No se pudo crear el cobro.")
      setPayment(result as FactusPaymentInfo)
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Ocurrió un error al iniciar el pago.",
      )
    } finally {
      setCreatingPayment(false)
    }
  }

  if (done)
    return (
      <div className="mx-auto max-w-xl px-6 py-24 text-center">
        <BadgeCheck size={60} className="mx-auto text-accent" />
        <h1 className="mt-6 font-display text-3xl">¡Tu próximo comienzo está en camino!</h1>
        <p className="my-4 text-muted-foreground">
          Factus Pay confirmó el pago de tu pedido en el entorno Sandbox.
        </p>
        {completedReference && (
          <p className="mb-6 text-xs text-muted-foreground">Referencia: {completedReference}</p>
        )}
        <Link to="/" className={button}>Volver a Sirius</Link>
      </div>
    )

  return (
    <div className="mx-auto min-h-[550px] max-w-[1240px] px-6 py-12">
      <SectionTitle
        eyebrow="UN PASO MÁS CERCA DE TU SONIDO"
        title={checkout ? "Finaliza tu compra" : "Tu carrito"}
      />
      {!items.length ? (
        <div className="py-12 text-center">
          <ShoppingBag size={45} className="mx-auto text-primary" />
          <h2 className="my-6 text-xl">Tu próxima estrella aún no está aquí.</h2>
          <Link to="/catalogo" className={button}>
            Explorar instrumentos <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-10 md:grid-cols-[1fr_350px]">
          <div>
            {checkout ? (
              payment ? (
                <FactusPayment
                  payment={payment}
                  onPaid={handlePaid}
                  onRetry={() => {
                    setPayment(null)
                    setCheckoutError("")
                  }}
                />
              ) : (
                <form id="checkout" onSubmit={handleCheckout} className="grid grid-cols-2 gap-5">
                  <h2 className="col-span-2 text-lg font-semibold">Contacto y envío</h2>
                  {[
                    ["name", "Nombre completo", "text"],
                    ["email", "Correo electrónico", "email"],
                    ["phone", "Teléfono", "tel"],
                    ["address", "Dirección", "text"],
                    ["city", "Ciudad", "text"],
                    ["postalCode", "Código postal", "text"],
                  ].map(([name, label, type]) => (
                    <label key={name} className="text-xs text-muted-foreground">
                      {label}
                      <input
                        required
                        name={name}
                        type={type}
                        autoComplete={
                          name === "name" ? "name" :
                          name === "email" ? "email" :
                          name === "phone" ? "tel" :
                          name === "address" ? "street-address" :
                          name === "city" ? "address-level2" : "postal-code"
                        }
                        className="mt-2 w-full rounded-lg border border-border bg-white p-3 text-foreground"
                      />
                    </label>
                  ))}
                  <h2 className="col-span-2 mt-3 text-lg font-semibold">Método de pago</h2>
                  <div className="col-span-2 rounded-lg bg-secondary p-5 text-sm text-primary">
                    <p className="font-semibold">Factus Pay · Pago con código QR</p>
                    <p className="mt-2 leading-6">
                      Al continuar generaremos un cobro de prueba en Factus Pay Sandbox. Podrás escanear el QR y simular el resultado del pago.
                    </p>
                  </div>
                  <label className="col-span-2 flex items-center gap-3 text-xs">
                    <input type="checkbox" required className="accent-primary" />
                    Acepto los términos y la política de privacidad.
                  </label>
                  {checkoutError && (
                    <p role="alert" className="col-span-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                      {checkoutError}
                    </p>
                  )}
                </form>
              )
            ) : (
              items.map((product) => (
                <div key={product.id} className="mb-4 flex items-center gap-5 rounded-xl border border-border bg-white p-5">
                  <img src={product.image} alt={product.name} className="h-24 w-20 object-contain" />
                  <div className="flex-1">
                    <Link to={`/producto/${product.id}`} className="text-sm font-semibold">{product.name}</Link>
                    <p className="mt-1 text-xs text-muted-foreground">{product.brand}</p>
                    <p className="mt-3 text-sm font-semibold">{money(product.price)}</p>
                    <div className="mt-3 flex items-center gap-4">
                      <button aria-label="Reducir cantidad" onClick={() => store.quantity(product.id, -1)} className="rounded border border-border p-1"><Minus size={14} /></button>
                      <span className="text-sm">{store.cart[product.id]}</span>
                      <button aria-label="Aumentar cantidad" onClick={() => store.quantity(product.id, 1)} className="rounded border border-border p-1"><Plus size={14} /></button>
                      <button onClick={() => store.quantity(product.id, -store.cart[product.id])} className="ml-auto text-xs text-muted-foreground underline">Eliminar</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="h-fit rounded-xl border border-border bg-white p-7">
            <h2 className="mb-6 font-display text-xl font-semibold">Resumen de tu compra</h2>
            <div className="flex justify-between text-sm"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <div className="my-4 flex justify-between text-sm">
              <span>Envío</span>
              <span className="text-accent">{shipping === 0 ? "Gratis" : money(shipping)}</span>
            </div>
            <div className="mt-6 flex justify-between border-t border-border pt-6 font-semibold">
              <span>Total</span><span>{money(total)}</span>
            </div>
            <p className="mt-2 text-[10px] text-muted-foreground">Precios en COP · IVA incluido</p>
            {checkout ? (
              payment ? (
                <p className="mt-6 rounded-lg bg-secondary p-4 text-center text-xs text-primary">Esperando confirmación de Factus Pay. No cierres esta ventana hasta verificar el resultado.</p>
              ) : (
                <button form="checkout" disabled={creatingPayment} className={`${button} mt-6 w-full disabled:cursor-wait disabled:opacity-60`}>
                  {creatingPayment ? "Generando cobro..." : "Generar QR de pago"} <ArrowRight size={16} />
                </button>
              )
            ) : (
              <Link to="/checkout" className={`${button} mt-6 w-full`}>Continuar con mi compra <ArrowRight size={16} /></Link>
            )}
            <p className="mt-4 text-center text-[10px] text-muted-foreground">Compra segura · Tu pasión está en buenas manos</p>
          </div>
        </div>
      )}
    </div>
  )
}
function Quiz() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const questions = [
    {
      title: "¿Qué te mueve cuando escuchas música?",
      options: [
        "Las melodías y los acordes",
        "El ritmo que no puedo dejar de seguir",
        "Los sonidos y las atmósferas",
        "Las líneas graves que conectan todo",
      ],
    },
    {
      title: "¿Cuál es tu experiencia musical?",
      options: [
        "Estoy dando mis primeros pasos",
        "Ya toco un poco",
        "Quiero descubrir algo nuevo",
      ],
    },
    {
      title: "¿Dónde te imaginas tocando?",
      options: [
        "En casa, a mi propio ritmo",
        "En una banda con amigos",
        "En un escenario",
      ],
    },
  ]
  const recommended = answers[0]?.includes("ritmo")
    ? products[4]
    : answers[0]?.includes("atmósferas")
      ? products[3]
      : answers[0]?.includes("graves")
        ? products[2]
        : products[1]
  return (
    <section className="min-h-[650px] bg-secondary px-6 py-16">
      <div className="mx-auto max-w-2xl text-center">
        <Star className="mx-auto mb-5 text-primary" size={35} />
        <p className="mb-4 text-[10px] tracking-[.2em] text-primary">
          CADA ESTRELLA TIENE SU SONIDO
        </p>
        <h1 className="font-display text-3xl font-semibold md:text-4xl">
          {step === 3
            ? "Encontramos tu próximo comienzo"
            : "Descubre tu instrumento"}
        </h1>
        {step < 3 ? (
          <>
            <p className="mt-4 text-sm text-muted-foreground">
              Tres preguntas. Un universo de posibilidades.
            </p>
            <div className="my-8 flex justify-center gap-2">
              {questions.map((_, index) => (
                <span
                  key={index}
                  className={`h-1.5 w-14 rounded-full ${
                    index <= step ? "bg-primary" : "bg-primary/20"
                  }`}
                />
              ))}
            </div>
            <h2 className="mb-6 text-xl">{questions[step].title}</h2>
            <div className="grid gap-3">
              {questions[step].options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    setAnswers((prev) => [...prev.slice(0, step), option])
                    setStep(step + 1)
                  }}
                  className="flex items-center justify-between rounded-xl border border-primary/15 bg-background px-6 py-5 text-left text-sm transition hover:border-primary hover:bg-white"
                >
                  {option}
                  <ArrowRight size={16} className="text-primary" />
                </button>
              ))}
            </div>
            {step > 0 && (
              <button
                onClick={() => setStep(step - 1)}
                className="mt-6 text-xs text-primary underline"
              >
                Volver a la pregunta anterior
              </button>
            )}
          </>
        ) : (
          <>
            <p className="my-5 text-sm text-muted-foreground">
              Por tus gustos, este instrumento puede ser un gran compañero.
              Nuestro equipo puede ayudarte a elegirlo con confianza.
            </p>
            <div className="mx-auto max-w-xs text-left">
              <ProductCard product={recommended} />
            </div>
            <button
              onClick={() => {
                setStep(0)
                setAnswers([])
              }}
              className="mt-6 text-xs text-primary underline"
            >
              Volver a descubrir mi sonido
            </button>
          </>
        )}
      </div>
    </section>
  )
}
function Account() {
  const [sent, setSent] = useState(false)
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <h1 className="mb-3 font-display text-3xl font-semibold">
        Bienvenido a tu universo
      </h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Inicia sesión en Sirius Music Store.
      </p>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setSent(true)
        }}
        className="space-y-5"
      >
        <label className="block text-sm">
          Correo electrónico
          <input
            required
            type="email"
            className="mt-2 w-full rounded-lg border border-border p-3"
          />
        </label>
        <label className="block text-sm">
          Contraseña
          <input
            required
            minLength={6}
            type="password"
            className="mt-2 w-full rounded-lg border border-border p-3"
          />
        </label>
        <button className={`${button} w-full`}>Iniciar sesión</button>
        {sent && (
          <p
            role="status"
            className="rounded-lg bg-secondary p-4 text-sm text-primary"
          >
            Esta es una tienda de demostración. La autenticación estará
            disponible cuando se conecte el servicio de cuentas.
          </p>
        )}
      </form>
    </div>
  )
}
function Footer() {
  return (
    <footer className="bg-[#f8eef2] px-6 pb-6 pt-12">
      <div className="mx-auto grid max-w-[1240px] gap-9 border-b border-border pb-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Link to="/">
            <Logo footer />
          </Link>
          <p className="mt-4 max-w-[220px] text-xs leading-6 text-muted-foreground">
            Tu pasión. Tu sonido. Tu universo.
            <br />
            Tú también puedes ser una estrella.
          </p>
          <div className="mt-4 flex gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
            >
              <Music2 size={18} />
            </a>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-semibold">Explora Sirius</h3>
          <div className="grid gap-3 text-xs text-muted-foreground">
            <Link to="/catalogo">Instrumentos</Link>
            <Link to="/catalogo?categoria=Accesorios">Accesorios</Link>
            <Link to="/catalogo?ofertas=1">Ofertas</Link>
            <Link to="/encuentra-tu-instrumento">Encuentra tu instrumento</Link>
            <Link to="/#comunidad">Nuestra historia</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-semibold">Estamos para ayudarte</h3>
          <div className="grid gap-3 text-xs text-muted-foreground">
            <Link to="/informacion/envios">Envíos y devoluciones</Link>
            <Link to="/informacion/garantia">Garantía y soporte</Link>
            <Link to="/informacion/privacidad">Política de privacidad</Link>
            <Link to="/informacion/terminos">Términos y condiciones</Link>
            <Link to="/informacion/contacto">Contáctanos</Link>
          </div>
        </div>
        <div>
          <h3 className="mb-5 text-sm font-semibold">Hablemos de música</h3>
          <p className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mail size={14} /> hola@siriusmusicstore.com
          </p>
          <p className="mt-4 text-xs leading-6 text-muted-foreground">
            Lunes a viernes · 10:00 a 19:00
            <br />
            Sábado · 10:00 a 15:00
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded border border-border px-2 py-1">Factus Pay</span>
            <span className="rounded border border-border px-2 py-1">QR</span>
            <span className="rounded border border-border px-2 py-1">Sandbox</span>
          </div>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1240px] flex-wrap justify-between gap-3 pt-6 text-[10px] text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Sirius Music Store. Todos los derechos
          reservados.
        </p>
        <p>Hecho para quienes nunca dejan de soñar. ★</p>
      </div>
    </footer>
  )
}
function Information() {
  const { topic } = useParams()
  const info: Record<string, [string, string]> = {
    envios: [
      "Envíos y devoluciones",
      "Envío gratuito en pedidos desde $600.000 COP. Devoluciones durante 30 días. Las condiciones y plazos definitivos se confirmarán antes del lanzamiento de la tienda.",
    ],
    garantia: [
      "Garantía y soporte",
      "Nuestros instrumentos cuentan con garantía por defectos de fabricación. Contacta al equipo para consultar cobertura y recibir asesoría.",
    ],
    privacidad: [
      "Política de privacidad",
      "Durante esta fase de pruebas, al generar un cobro se envían al servidor los datos de contacto y envío, junto con los productos del pedido, para crear y verificar la transacción de Factus Pay. Los pedidos se conservan en el almacenamiento configurado para esta aplicación. No uses datos personales reales en Sandbox. Antes de habilitar ventas reales se publicará la política definitiva de tratamiento, conservación y atención de datos personales.",
    ],
    terminos: [
      "Términos y condiciones",
      "Sirius Music Store se encuentra en fase de prototipo y utiliza Factus Pay Sandbox. Los cobros son pruebas y no representan una compra real; no se deben realizar entregas ni compromisos comerciales con base en estas transacciones. Precios, inventario e imágenes son ilustrativos y podrán cambiar antes del lanzamiento comercial.",
    ],
    contacto: [
      "Hablemos de música",
      "Puedes escribir a hola@siriusmusicstore.com. Horario propuesto: lunes a viernes de 10:00 a 19:00 y sábados de 10:00 a 15:00. Datos de contacto por confirmar para el lanzamiento.",
    ],
  }
  const selected = info[topic || ""] || info.contacto
  return (
    <div className="mx-auto min-h-[400px] max-w-3xl px-6 py-16">
      <h1 className="font-display text-3xl font-semibold">{selected[0]}</h1>
      <p className="mt-6 leading-8 text-muted-foreground">{selected[1]}</p>
      <Link to="/" className={`${outline} mt-8`}>
        Volver al inicio
      </Link>
    </div>
  )
}
function NotFound() {
  return (
    <div className="px-6 py-24 text-center">
      <h1 className="font-display text-3xl">
        Esta estrella aún no está en nuestro universo
      </h1>
      <Link className={`${button} mt-8`} to="/">
        Volver al inicio
      </Link>
    </div>
  )
}
const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "catalogo", Component: Catalog },
      { path: "buscar", Component: Catalog },
      { path: "producto/:id", Component: ProductDetail },
      { path: "carrito", Component: Cart },
      { path: "checkout", element: <Cart checkout /> },
      { path: "encuentra-tu-instrumento", Component: Quiz },
      { path: "cuenta", Component: Account },
      { path: "informacion/:topic", Component: Information },
      { path: "*", Component: NotFound },
    ],
  },
])
export default function App() {
  return <RouterProvider router={router} />
}
