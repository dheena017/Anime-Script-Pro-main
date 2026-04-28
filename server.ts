
import express from "express";
import type { Request, Response, NextFunction } from "express";
import path from "path";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import Groq from "groq-sdk";
import dotenv from "dotenv";
import { createProxyMiddleware } from 'http-proxy-middleware';
import { GoogleGenAI } from "@google/genai";

dotenv.config();

dotenv.config();



// Async error wrapper for route handlers
type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<any>;
const asyncHandler = (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


export async function createServer() {
  const app = express();
  app.use(express.json());

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
  
  // Python Backend Proxy (Phase 2 & 3 Migration)
  // Mounted at root to handle all /api routes including /api/generate
  app.use(createProxyMiddleware({
    target: process.env.BACKEND_URL || "http://localhost:8001",
    changeOrigin: true,
    pathFilter: '/api',
    proxyTimeout: 90000,
    timeout: 90000,
    on: {
      error: (err: any, _req: any, res: any) => {
        console.error('[PROXY ERROR] Backend unreachable:', err.message);
        if (res && res.status && !res.headersSent) {
          res.status(502).json({ error: "Backend service unreachable", details: err.message });
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
    console.log("====================================================");
    console.log(" 🌌 ANIME SCRIPT PRO - GOD MODE ORCHESTRATOR");
    console.log("====================================================");
    console.log(`[STATUS] Studio Server: Running on http://localhost:${PORT}`);
    console.log(`[ENV]    Environment:   ${process.env.NODE_ENV || "development"}`);
    console.log(`[PORT]   Server Port:   ${PORT}`);
    console.log(`[To stop the server, press CTRL+C in this terminal.`);
    console.log(`[INFO]   To stop the backend, press CTRL+C in the backend terminal.`);


    // Core Services Check
    const services = [
      { name: "OpenAI", status: openai ? "ACTIVE" : "OFFLINE" },
      { name: "Claude", status: anthropic ? "ACTIVE" : "OFFLINE" },
      { name: "Groq", status: groq ? "ACTIVE" : "OFFLINE" },
      { name: "FastAPI Proxy", status: BACKEND_URL },
      { name: "Supabase Host", status: process.env.VITE_SUPABASE_URL ? new URL(process.env.VITE_SUPABASE_URL).hostname : "MISSING" },
      { name: "Mathesar UI", status: "http://localhost:8080" }
    ];

    console.table(services);

    // Backend Connectivity Verification
    console.log(`[BACKEND] Validating: ${BACKEND_URL}...`);
    try {
      // Use dynamic import for fetch to avoid ESM issues if needed, or just use axios/node-fetch
      const response = await fetch(`${BACKEND_URL}/health`).catch(() => null);
      if (response && response.ok) {
        console.log(`[SUCCESS] FastAPI Intelligence Layer: ONLINE`);
      } else {
        console.warn(`[WARNING] FastAPI Backend: REJECTING OR NOT FOUND (Status: ${response?.status || 'No Response'})`);
        console.warn(`          Ensure backend is running: "uvicorn backend.fastapi_app:app --port 8001"`);
        console.warn(`(Or run: .\backend\venv\Scripts\activate)`);
      }
    } catch (e) {
      console.warn(`[ERROR] Backend Connectivity Failed. Proxy will return 502 for migrated routes.`);
    }

    console.log("====================================================");
    console.log(" 🚀 READY FOR PRODUCTION TRAFFIC");
    console.log("====================================================");
    console.log(`[INFO] To stop the server, press CTRL+C in this terminal.`);
  });
}

startServer();
