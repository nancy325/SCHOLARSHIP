/**
 * `npm run dev` now shows the NEW ScholarHub website (Laravel, in ../backend) on port 8080.
 *
 * - Starts `php artisan serve` on 127.0.0.1:8000 automatically (unless it is already running)
 * - Forwards every request from http://localhost:8080 to it
 *
 * The old React version is still available with:  npm run dev:old
 * MySQL must be running (WAMP icon green).
 */
import { defineConfig, type Plugin } from "vite";
import { spawn, spawnSync, type ChildProcess } from "child_process";
import fs from "fs";
import net from "net";
import path from "path";

const LARAVEL_HOST = "127.0.0.1";
const LARAVEL_PORT = 8000;
const BACKEND_DIR = path.resolve(__dirname, "../backend");

/** php from PATH, otherwise the newest PHP 8.2–8.4 bundled with WAMP */
function findPhp(): string {
  if (process.env.PHP_BINARY) return process.env.PHP_BINARY;
  if (spawnSync("php", ["-v"], { stdio: "ignore", shell: true }).status === 0) return "php";
  const wampPhp = "D:/wamp64/bin/php";
  try {
    const versions = fs.readdirSync(wampPhp).filter((d) => /^php8\.[2-4]\./.test(d)).sort().reverse();
    for (const v of versions) {
      const exe = path.join(wampPhp, v, "php.exe");
      if (fs.existsSync(exe)) return exe;
    }
  } catch {
    /* WAMP not in the default location */
  }
  return "php";
}

function portInUse(port: number, host: string): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.connect({ port, host });
    socket.once("connect", () => { socket.destroy(); resolve(true); });
    socket.once("error", () => resolve(false));
  });
}

function laravelServer(): Plugin {
  let child: ChildProcess | null = null;
  return {
    name: "scholarhub-laravel",
    async configureServer() {
      if (await portInUse(LARAVEL_PORT, LARAVEL_HOST)) {
        console.log(`\n  ScholarHub: using the Laravel server already running on ${LARAVEL_HOST}:${LARAVEL_PORT}\n`);
        return;
      }
      const php = findPhp();
      console.log(`\n  ScholarHub: starting Laravel (${php} artisan serve) in ${BACKEND_DIR}\n`);
      child = spawn(php, ["artisan", "serve", `--host=${LARAVEL_HOST}`, `--port=${LARAVEL_PORT}`], {
        cwd: BACKEND_DIR,
        stdio: "inherit",
        shell: process.platform === "win32",
      });
      child.on("error", (e) => console.error("  Could not start PHP. Install PHP or set PHP_BINARY.", e.message));
      const stop = () => { if (child && !child.killed) child.kill(); };
      process.on("exit", stop);
      process.on("SIGINT", () => { stop(); process.exit(0); });
      process.on("SIGTERM", () => { stop(); process.exit(0); });
    },
  };
}

export default defineConfig({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // everything goes to Laravel; keep the browser's Host (localhost:8080) so links stay on 8080
      "/": {
        target: `http://${LARAVEL_HOST}:${LARAVEL_PORT}`,
        changeOrigin: false,
        ws: false,
      },
    },
  },
  plugins: [laravelServer()],
});
