🌌 Anime Script Pro: God Mode Engine
</h1>
  <p><i>The Final Frontier of Autonomous Multimodal Production</i></p>
</div>

---

## 🎭 The Studio Core
Welcome to the most advanced AI-driven anime production suite. **Anime Script Pro** orchestrates a full-stack creative pipeline—from the initial spark of world lore to high-fidelity screening metadata—using a "God Mode" one-prompt construction loop.

### 🏛️ Engineering Manifest
For deep-dive technical documentation on our multimodal synthesis engine and cinematic design system, refer to the [Studio Architect Guide](./STUDIO_ARCHITECT_GUIDE.md) and our [API Documentation](./API_DOCUMENTATION.md).

---

## 🚀 Multimodal Synthesis Engine
The studio has been modernized to handle a complex **Image-to-Video** pipeline:
- **Neural DNA Synthesis**: Generates persistent visual storyboard frames.
- **Motion Engine Ignition**: Transforms static frames into cinematic 5s production clips.
- **Async Backend Protocols**: High-concurrency production handled via FastAPI + AsyncSession.

---

## 🛠️ Integrated Tech Stack
- **Frontend**: React + Vite + Cinematic Noir Design (Glassmorphism & Neural Pulse)
- **Intelligence Layer**: FastAPI + Python (100% Async / SQLModel)
- **Neural Models**: Multi-Model Swarm (Gemini 2.5 Pro / Flash, Imagen-3, Veo-2.0)
- **Verification**: Playwright E2E + Backend Unit/Integration Suite
- **Feature Docs**: See [FEATURES.md](./FEATURES.md) for a detailed feature catalog.

---

## ⚙️ Direct Deployment

### 1. Unified Studio Start (Local Hybrid Mode)
Start the frontend and AI proxy in one single command:
```bash
npm run dev
```

### 2. Python AI Backend (Manual Start)
```bash
.\backend\venv\Scripts\activate
uvicorn backend.fastapi_app:app --reload --port 8002
```

### 3. Environment Configuration (`.env`)
Ensure your environment is primed for autonomous generation:
```env
# AI Models
GEMINI_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here
ANTHROPIC_API_KEY=your_key_here

# Database
DATABASE_URL=postgresql://user:pass@host:5432/db_name
MATHESAR_SECRET_KEY=long_random_string
```

---

## 🛡️ Sovereign Audit & Quality Assurance
Our validation suite is now organized into specialized technical sectors:

### Run Full Studio Audit
```bash
npm run test
```

### 🛡️ Test Manifest
| Sector | Purpose | Location |
| :--- | :--- | :--- |
| **Unit** | AI Connectivity & REST Protocols | `backend/tests/unit/` |
| **Integration** | Production Workflow Logic | `backend/tests/integration/` |
| **E2E** | User Production Flows (Playwright) | `tests/e2e/` |
| **Service** | Multi-Agent Orchestration | `tests/backend_services/` |

---

## 💻 Full Studio Command Reference

### Development & Live-Ops
| Command | Result |
| :--- | :--- |
| `npm run dev` | Start the Express server + Vite Frontend in hybrid mode. |
| `npm run build` | Generate the optimized production-grade bundle. |
| `npm run start` | Launch the production server bundle. |
| `docker compose up -d` | Launch the entire 3-tier studio architecture. |

### 🛡️ Sovereign Audit (Testing)
| Command | Result |
| :--- | :--- |
| `npm run test` | Execute the full 49-test autonomous audit suite. |
| `npm run test:ui` | Open the Interactive Test Runner (Visual Debugging). |
| `npx playwright test tests/studio_phases` | Audit only the Phase 1–4 roadmap modules. |
| `npx playwright test tests/backend_services` | Verify API and AI Model integrity specifically. |
| `npx playwright show-report` | Launch the diagnostic portal with videos and traces. |

### 🐳 Infrastructure (Docker & Database)
| Command | Result |
| :--- | :--- |
| `docker compose up -d` | Launch Orchestrator, FastAPI, and Mathesar. |
| `docker compose ps` | Check the health of all studio containers. |
| `docker compose logs -f` | Stream real-time events from all services. |

---

## 🎨 Design Language: NOIR
The studio utilizes a high-contrast **Noir System** designed for focus and creative depth.
- **Glassmorphism**: Subtle backdrops for neural stream interactions.
- **Micro-Animations**: Real-time feedback on AI generation events.
- **Atomic Selectors**: Precision targeting for all studio interaction pins.

---

<div align="center">
  <sub>Built for the next generation of digital architects.</sub>
</div>
