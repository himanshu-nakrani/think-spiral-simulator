# ThinkSpiral - Quick Start Guide

**Get ThinkSpiral running in 2 minutes:**

## Prerequisites
- Node.js 18+ with pnpm
- Python 3.11+ with uv
- Git (optional)

## Installation & Run

### Option 1: Everything at Once (Recommended)
```bash
pnpm install
pnpm dev:full
```
Done! Frontend and backend start automatically.

### Option 2: Start Services Separately

**Terminal 1 - Frontend:**
```bash
pnpm install
pnpm dev
```

**Terminal 2 - Backend:**
```bash
pnpm backend:setup    # (First time only)
pnpm backend:dev
```

## Access the App

- **Frontend**: http://localhost:3000
- **API Docs**: http://localhost:8000/docs
- **Health Check**: http://localhost:8000/health

## Test It Works

1. Go to http://localhost:3000
2. Type: "I forgot my keys"
3. Select: "Anxious" mode
4. Click: "Explore the Spiral"
5. Wait: 10-15 seconds for first run (loads AI models)
6. See: Timeline with thoughts and emotion chart
7. View: Reality check and insights

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Port 3000 in use | Kill other process: `lsof -ti:3000 \| xargs kill` |
| Port 8000 in use | Change in `pnpm backend:dev` script |
| ModuleNotFoundError | Run: `cd backend && uv sync` |
| Can't connect to API | Check backend is running on 8000 |
| AI models slow | Normal first run (~1 min), cached after |

## Key Commands

```bash
# Development
pnpm dev              # Frontend only (port 3000)
pnpm dev:full        # Both servers
pnpm backend:dev     # Backend only (port 8000)

# Setup
pnpm install         # Install dependencies
pnpm backend:setup   # Initialize backend

# Production
pnpm build           # Build frontend
pnpm start           # Run production build
```

## File Structure

```
.
├── app/              # Next.js frontend
│   ├── page.tsx      # Main app
│   └── layout.tsx    # Root layout
├── components/       # React components
├── lib/
│   ├── api.ts        # API client
│   └── types.ts      # TypeScript types
├── backend/          # FastAPI server
│   └── app/
│       ├── main.py   # API app
│       ├── models/   # Database models
│       ├── routes/   # API endpoints
│       └── services/ # Business logic
├── scripts/          # Helper scripts
└── README.md         # Full documentation
```

## How The App Works

```
User Input
    ↓
Select Mode (Anxious/Logical/Dramatic)
    ↓
Frontend sends to Backend
    ↓
Backend generates 5 thoughts with emotion scores
    ↓
Database saves results
    ↓
Frontend displays Timeline + Chart + Insights
    ↓
User can share results or explore more
```

## What Each Mode Does

**Anxious**: Catastrophic thinking pattern
- Worst-case scenarios multiply
- Emotions escalate from 40→95

**Logical**: Analytical overthinking
- Problems analyzed systematically
- Each analysis leads to more dire conclusions
- Emotions escalate from 35→90

**Dramatic**: Emotional escalation
- Feelings intensify dramatically
- Exaggerated thoughts and reactions
- Emotions escalate from 50→100

## API Quick Reference

All endpoints at `http://localhost:8000/api`:

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/simulate` | Generate spiral |
| POST | `/reality-check` | Get insights |
| GET | `/history` | View past spirals |
| GET | `/insights` | View analytics |

Example:
```bash
curl -X POST http://localhost:8000/api/simulate \
  -H "Content-Type: application/json" \
  -d '{"initial_thought": "I messed up", "mode": "anxious"}'
```

## Customize

### Add New Mode (5 min)
Edit `backend/app/services/ai_service.py`:
```python
elif mode == "your_mode":
    patterns = ["thought 1", "thought 2", ...]
    base_emotions = [40, 60, 80, ...]
```

### Change Colors (2 min)
Edit `app/globals.css`:
```css
:root {
  --primary: #your-color;
}
```

### Modify Insights (5 min)
Edit `backend/app/services/ai_service.py` `generate_reality_check()` method

## Next Steps

- Explore the [README.md](README.md) for features
- See [SETUP.md](SETUP.md) for detailed setup
- Check [DEPLOYMENT.md](DEPLOYMENT.md) for going live
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand code

## Performance Notes

- **First Run**: AI models download (~2-3GB), takes 1-2 min
- **Subsequent Runs**: Uses cached models, loads instantly
- **Database**: SQLite works great for development

## Deploy to Production

1. **Frontend**: Push to GitHub → Connect to Vercel
2. **Backend**: Deploy to Railway/Heroku (free tier available)
3. **Set env vars**: `NEXT_PUBLIC_API_URL` on Vercel

See [DEPLOYMENT.md](DEPLOYMENT.md) for step-by-step instructions.

## Getting Help

- Check [SETUP.md](SETUP.md) for detailed setup help
- Review [ARCHITECTURE.md](ARCHITECTURE.md) to understand code
- API docs at http://localhost:8000/docs (interactive)
- Inline code comments explain complex logic

---

**That's it!** You're ready to explore ThinkSpiral. 🚀

Start with: `pnpm dev:full`
