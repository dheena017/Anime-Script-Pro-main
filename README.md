<div align="center">
  <img alt="Anime Script Pro - God Mode" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" width="100%" />
  <h1>🌌 Anime Script Pro: God Mode Engine</h1>
  <p><i>The Final Frontier of Autonomous Anime Production</i></p>
</div>

---

## 🎭 The Studio Core
Welcome to the most advanced AI-driven anime production suite. **Anime Script Pro** orchestrates a full-stack creative pipeline—from the initial spark of world lore to high-fidelity screening metadata—using a "God Mode" one-prompt construction loop.

### 3. Full-Stack Studio Deploy (Docker)
Launch the entire studio environment (Orchestrator, AI Backend, and Mathesar Admin) in seconds:
```bash
docker compose up -d
```
- **Studio Interface**: [http://localhost:3000](http://localhost:3000)
- **AI Intelligence Layer**: [http://localhost:8001/docs](http://localhost:8001/docs)
- **Mathesar Database Admin**: [http://localhost:8080](http://localhost:8080)

---

## 🛠️ Integrated Tech Stack
- **Frontend**: React + Vite + Tailwind (Noir Design System)
- **Orchestrator**: Node.js + Express (AI Proxy & Lifecycle Management)
- **Intelligence**: FastAPI + Python (SQLModel & Logic persistence)
- **Models**: Multi-Model Swarm (Gemini 2.0 Flash, GPT-4o, Claude 3.5 Sonnet)
- **Persistence**: PostgreSQL + Mathesar Visual Admin
- **Verification**: Playwright E2E "Atomic" Audit Suite

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
uvicorn backend.fastapi_app:app --reload --port 8001
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
We maintain a strict **Atomic Integrity** standard. Every module is protected by our automated audit suite.

### Run Full Studio Audit
```bash
npm run test
```

### Diagnostic Reports
View high-fidelity videos and traces of every production module:
```bash
npx playwright show-report
```

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
