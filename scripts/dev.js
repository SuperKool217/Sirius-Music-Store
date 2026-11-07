import { spawn } from "node:child_process"
import process from "node:process"

const children = [
  spawn(process.execPath, ["--watch", "server/index.js"], { stdio: "inherit", env: process.env }),
  spawn(process.execPath, ["node_modules/vite/bin/vite.js", "--host", "0.0.0.0"], { stdio: "inherit", env: process.env }),
]

let shuttingDown = false
function shutdown(code = 0) {
  if (shuttingDown) return
  shuttingDown = true
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM")
  }
  process.exitCode = code
}

for (const child of children) {
  child.on("error", (error) => {
    console.error("No se pudo iniciar un proceso de desarrollo:", error.message)
    shutdown(1)
  })
  child.on("exit", (code) => {
    if (!shuttingDown && code !== 0) shutdown(code || 1)
  })
}

process.on("SIGINT", () => shutdown(0))
process.on("SIGTERM", () => shutdown(0))
