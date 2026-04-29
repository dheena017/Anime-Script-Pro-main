
import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import os from "os";
import fs from "fs";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

// ANSI Styling Utilities
const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;
const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
const gray = (text: string) => `\x1b[90m${text}\x1b[0m`;



export async function createServer() {
  const app = express();

  // --- Traffic Inspector Component ---
  const trafficLog: any[] = [];
  const logTraffic = (req: Request, status: number, duration: number) => {
    trafficLog.unshift({
      time: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      status,
      duration: `${duration}ms`
    });
    if (trafficLog.length > 20) trafficLog.pop();
  };

  // OpenAI Client
  const openai = process.env.OPENAI_API_KEY
    ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    : null;

  // Anthropic Client
  const anthropic = process.env.ANTHROPIC_API_KEY
    ? new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
    : null;

  // Groq Client
  const groq = process.env.GROQ_API_KEY
    ? new Groq({ apiKey: process.env.GROQ_API_KEY })
    : null;

  // AI Generation is now handled by the Python FastAPI backend for superior stability and fallback logic.
  // The Node.js handler has been retired.
  
  // --- Premium Request Logger Middleware ---
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      const status = res.statusCode >= 400 ? red(res.statusCode.toString()) : green(res.statusCode.toString());
      console.log(`${gray(`[${new Date().toLocaleTimeString()}]`)} ${bold(req.method)} ${req.originalUrl} | ${status} | ${duration}ms`);
      logTraffic(req, res.statusCode, duration);
    });
    next();
  });

  // Python Backend Proxy (Phase 2 & 3 Migration)
  // Mounted at /api to handle all /api routes including /api/generate and auth routes.

  app.use('/api', createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://localhost:8001",
    changeOrigin: true,
    proxyTimeout: 90000,
    timeout: 90000,
    pathRewrite: (path) => {
      const rewritten = path.startsWith('/api') ? path : `/api${path}`;
      console.log('[PROXY DEBUG] rewrite:', path, '=>', rewritten);
      return rewritten;
    },
    on: {
      proxyReq: (proxyReq: any, req: any, _res: any) => {
        // Detailed Proxy Logging
        if (process.env.DEBUG_PROXY === 'true') {
          console.log(`${cyan('[PROXY]')} >> ${bold(req.method)} ${req.originalUrl} -> ${proxyReq.path}`);
        }
      },
      proxyRes: (proxyRes: any, req: any, _res: any) => {
        if (process.env.DEBUG_PROXY === 'true') {
          console.log(`${cyan('[PROXY]')} << ${proxyRes.statusCode} from ${req.originalUrl}`);
        }
      },
      error: (err: any, req: any, res: any) => {
        console.error(`${red('[PROXY CRITICAL]')} Connection refused for ${req.originalUrl}: ${err.message}`);
        if (res && !res.headersSent) {
          res.status(502).json({ error: "Intelligence Layer Unreachable", details: err.message });
        }
      }
    }
  }));



  // --- MIGRATED ENDPOINTS ---
  // The following endpoints have been migrated to the FastAPI backend:
  // - /api/projects
  // - /api/world-lore
  // - /api/characters
  // - /api/sessions
  // - /api/episodes
  // - /api/scenes
  // - /api/categories
  // - /api/templates
  // - /api/stats/progress
  // - /api/prompt-library
  // They are now handled by the proxy defined above.
  // Note: Redundant handlers for projects, world-lore, characters, sessions, episodes, and scenes 
  // have been removed. They are now handled by the FastAPI proxy.
  // Vite middleware for development

  // --- Orchestrator Health Dashboard ---
  app.get('/_orchestrator/health', async (_req, res) => {
    const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001";
    let backendOnline = false;
    try {
      const response = await fetch(`${BACKEND_URL}/health`);
      backendOnline = response.ok;
    } catch { backendOnline = false; }

    res.json({
      status: "online",
      timestamp: new Date().toISOString(),
      orchestrator: {
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        platform: process.platform,
        arch: process.arch
      },
      backend: {
        url: BACKEND_URL,
        status: backendOnline ? "ONLINE" : "OFFLINE"
      }
    });
  });

  app.get('/_orchestrator/traffic', (_req, res) => {
    res.json(trafficLog);
  });

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Global error handler
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[UNCAUGHT ERROR]', err);
    res.status(500).json({
      error: 'Internal Server Error',
      details: process.env.NODE_ENV === 'development' ? (err?.message || err) : undefined
    });
  });

  return { app, openai, anthropic, groq };
}

async function startServer() {
  const { app, openai, anthropic, groq } = await createServer();
  const PORT = 3000;
  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8001";

  app.listen(PORT, "0.0.0.0", async () => {
    const cyan = (text: string) => `\x1b[36m${text}\x1b[0m`;
    const green = (text: string) => `\x1b[32m${text}\x1b[0m`;
    const yellow = (text: string) => `\x1b[33m${text}\x1b[0m`;
    const red = (text: string) => `\x1b[31m${text}\x1b[0m`;
    const bold = (text: string) => `\x1b[1m${text}\x1b[0m`;
    const gray = (text: string) => `\x1b[90m${text}\x1b[0m`;

    let pkg = { name: "Anime Script Pro", version: "1.0.0" };
    try {
      pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
    } catch {}

    console.log("\n" + bold(cyan("================================================================")));
    console.log(bold(cyan(`   🌌 ${pkg.name.toUpperCase()} - v${pkg.version}`)));
    console.log(bold(cyan("================================================================")));
    
    console.log(`${bold("[STATUS]")} Orchestrator:  ${green(`Running on http://localhost:${PORT}`)}`);
    console.log(`${bold("[ENV]")}    Environment:   ${yellow(process.env.NODE_ENV || "development")}`);
    console.log(`${bold("[PORT]")}   Service Port:  ${PORT}`);

    // System Metrics Component
    const freeMem = (os.freemem() / (1024 * 1024 * 1024)).toFixed(2);
    const totalMem = (os.totalmem() / (1024 * 1024 * 1024)).toFixed(2);
    const cpuLoad = os.loadavg()[0].toFixed(2);
    console.log(`${bold("[SYS]")}    Resources:     ${cyan(`${freeMem}GB/${totalMem}GB Free | CPU Load: ${cpuLoad}`)}`);

    let fastApiStatus = "UNKNOWN";

    try {
      const response = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (response && response.ok) {
        fastApiStatus = "ONLINE";
      } else {
        fastApiStatus = "OFFLINE";
      }
    } catch (error: any) {
      fastApiStatus = "OFFLINE";
    }

    // Core Services Check
    console.log("\n" + bold("--- SYSTEM INTEGRITY CHECK ---"));
    
    const check = (name: string, status: string, isOk: boolean) => {
      const statusText = isOk ? green(status) : red(status);
      const symbol = isOk ? "✅" : "❌";
      console.log(`${symbol} ${name.padEnd(15)} : ${statusText}`);
    };

    check("OpenAI", openai ? "CONNECTED" : "OFFLINE", !!openai);
    check("Anthropic", anthropic ? "CONNECTED" : "OFFLINE", !!anthropic);
    check("Groq", groq ? "CONNECTED" : "OFFLINE", !!groq);
    check("FastAPI", fastApiStatus, fastApiStatus === "ONLINE");
    check("Supabase", process.env.VITE_SUPABASE_URL ? "READY" : "MISSING", !!process.env.VITE_SUPABASE_URL);

    if (fastApiStatus === "ONLINE") {
      console.log(`\n${bold(green("[SUCCESS]"))} Intelligence Layer verified at ${BACKEND_URL}`);
    } else {
      console.log(`\n${bold(red("[CRITICAL]"))} Intelligence Layer (FastAPI) is ${bold("OFFLINE")}`);
      console.log(yellow(`           Run: npm run backend`));
    }

    console.log(bold(cyan("================================================================")));
    console.log(`🚀 ${bold("PRODUCTION READY")} | Listening for incoming creative signals...`);
    console.log(`${gray("   Health: ")} http://localhost:${PORT}/_orchestrator/health`);
    console.log(`${gray("   Traffic: ")} http://localhost:${PORT}/_orchestrator/traffic`);
    console.log(bold(cyan("================================================================")) + "\n");
  });

  // --- Graceful Shutdown ---
  const shutdown = () => {
    console.log(`\n${yellow('[SHUTDOWN]')} Closing Orchestration Layer...`);
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

startServer();
