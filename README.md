# ThinkSpiral

A full-stack web application that helps you understand and analyze your overthinking patterns using AI-powered visualization and insights.

## Overview

ThinkSpiral lets you explore how your thoughts spiral and escalate emotionally. By selecting a thinking pattern (Anxious, Logical, or Dramatic), the app generates a realistic progression of thoughts and provides grounded reality checks with actionable insights.

### Key Features

- **Three Spiral Patterns**: Anxious (catastrophic), Logical (analytical), Dramatic (emotional escalation)
- **Real-time Visualization**: Watch thoughts escalate with emotion intensity scores (0-100)
- **Emotion Trajectory Chart**: Line graph showing emotional progression
- **Reality Checks**: AI-generated grounded perspectives specific to your thinking pattern
- **Actionable Insights**: Key takeaways and recommendations
- **History & Analytics**: View past spirals and get aggregated insights
- **Share Results**: Copy insights to clipboard for reflection or sharing

## Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Python 3.11+ with uv

### Installation & Running

**Easiest Option - Run Both Servers Together:**
```bash
pnpm install
pnpm dev:full
```

This will:
1. Install all dependencies
2. Set up the backend
3. Start both frontend (port 3000) and backend (port 8000)

**Or Start Separately:**

Terminal 1 - Frontend:
```bash
pnpm install
pnpm dev
```

Terminal 2 - Backend:
```bash
pnpm backend:setup
pnpm backend:dev
```

Then open [http://localhost:3000](http://localhost:3000)

## How It Works

1. **Enter Your Thought**: Type something that's been troubling you
2. **Choose a Pattern**: Select how your mind typically spirals (anxious, logical, or dramatic)
3. **Explore the Spiral**: Watch as ThinkSpiral generates 5 escalating thoughts, each with an emotion score
4. **View Insights**: Get a reality-based perspective and key insights about your thinking pattern
5. **Learn Over Time**: Your spirals are saved, and the app learns patterns from your history

## Technology Stack

### Frontend
- **Next.js 16** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **ShadCN UI** - Beautiful component library
- **Recharts** - Data visualization
- **Axios** - HTTP client

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - ORM for database operations
- **SQLite** - Local database (easily swappable)
- **Pydantic** - Data validation
- **HuggingFace Transformers** - AI/ML capabilities

## Project Structure

```
thinkspiral/
├── app/                          # Next.js application
│   ├── page.tsx                  # Main interface
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # Reusable React components
│   ├── InputBox.tsx             # Thought input
│   ├── ModeSelector.tsx         # Pattern selection
│   ├── SpiralTimeline.tsx       # Thought visualization
│   ├── EmotionChart.tsx         # Emotion trajectory
│   └── ShareCard.tsx            # Results sharing
├── lib/
│   ├── api.ts                   # API client
│   ├── types.ts                 # TypeScript definitions
│   └── utils.ts                 # Helper functions
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI app
│   │   ├── database.py         # DB configuration
│   │   ├── models/             # SQLAlchemy models
│   │   ├── routes/             # API endpoints
│   │   ├── schemas/            # Pydantic schemas
│   │   └── services/           # Business logic
│   └── pyproject.toml
├── scripts/                      # Utility scripts
├── SETUP.md                      # Detailed setup guide
└── README.md                     # This file
```

## API Endpoints

All requests go to `http://localhost:8000/api`

- **POST `/simulate`** - Generate a thought spiral
  - Request: `{ initial_thought: string, mode: "anxious" | "logical" | "dramatic" }`
  - Returns: `{ id, thoughts, emotionScores }`

- **POST `/reality-check`** - Get grounded perspective
  - Request: `{ spiral_id: string }`
  - Returns: `{ realityCheck: string, insights: string[] }`

- **GET `/history`** - Get all past spirals
  - Returns: `{ entries: SpiralEntry[] }`

- **GET `/insights`** - Get aggregated insights
  - Returns: `{ commonPatterns, emotionalTrends, recommendations }`

**Interactive API docs**: [http://localhost:8000/docs](http://localhost:8000/docs)

## Available NPM Scripts

```bash
pnpm dev              # Start frontend only
pnpm dev:full        # Start both frontend and backend
pnpm backend:setup   # Initialize backend
pnpm backend:dev     # Start backend only
pnpm build           # Build for production
pnpm start           # Run production build
pnpm lint            # Run ESLint
```

## Configuration

### Frontend
- Default API URL: `http://localhost:8000`
- Override with `NEXT_PUBLIC_API_URL` environment variable

### Backend
- Database: SQLite (file-based, no config needed)
- Port: 8000 (configurable in start command)
- See `.env.example` for environment variables

## Thinking Patterns Explained

### Anxious
Characterized by catastrophic thinking and worst-case scenarios. Emotions escalate as potential negative outcomes multiply.

### Logical
Analytical overthinking where problems are deconstructed logically, but each analysis leads to more dire conclusions.

### Dramatic
Emotional escalation where feelings intensify dramatically with exaggerated thoughts and maximum emotion scores.

## Development

### Adding New Thought Patterns
1. Edit `AIService.generate_spiral()` in `backend/app/services/ai_service.py`
2. Add new pattern with thought sequences and emotion curves
3. Add corresponding reality check logic

### Customizing UI
- Colors: Edit design tokens in `app/globals.css` and `tailwind.config.ts`
- Components: Modify files in `components/` directory
- Styling: Use Tailwind CSS utility classes

### Database Changes
- Models: Edit `backend/app/models/spiral.py`
- Schema: Update in `backend/app/schemas/spiral.py`
- Migrations: Create new migration files as needed

## Performance Notes

- **AI Models**: First run downloads ~2-3GB of HuggingFace models. Subsequent runs use cache.
- **Database**: SQLite is great for development. Use PostgreSQL for production.
- **Frontend**: Optimized with Next.js Image component and lazy loading.

## Troubleshooting

### Backend won't start
```bash
cd backend
uv sync  # Reinstall dependencies
```

### CORS errors
- Ensure backend is running on port 8000
- Check `app/main.py` CORS middleware settings

### AI models not loading
- Models load on first use (may take 30-60 seconds)
- Check internet connection for HuggingFace model downloads
- Models gracefully degrade if unavailable

### Port conflicts
- Frontend: Change in `pnpm dev` command
- Backend: Change port in `backend:dev` script

## Deployment

### Frontend (Vercel)
```bash
pnpm build
# Push to GitHub and connect to Vercel
# Set NEXT_PUBLIC_API_URL in environment variables
```

### Backend (Railway/Render/Others)
```bash
# Set DATABASE_URL environment variable
# Deploy with uvicorn
```

## Contributing

Feel free to:
- Add new thinking patterns
- Improve reality checks
- Enhance visualizations
- Add more analytics features

## License

MIT

## Support

For detailed setup instructions, see [SETUP.md](SETUP.md)

For API documentation, run the app and visit [http://localhost:8000/docs](http://localhost:8000/docs)

---

Built with ❤️ to help you understand your mind better.
