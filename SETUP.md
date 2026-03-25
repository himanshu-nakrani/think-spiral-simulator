# ThinkSpiral - Setup Guide

ThinkSpiral is a full-stack application that visualizes and analyzes overthinking patterns using AI. It consists of a Next.js frontend and a FastAPI backend.

## Project Structure

```
.
├── app/                          # Next.js frontend application
│   ├── page.tsx                  # Main application page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── InputBox.tsx             # Thought input component
│   ├── ModeSelector.tsx         # Spiral mode selector
│   ├── SpiralTimeline.tsx       # Visual timeline of thoughts
│   ├── EmotionChart.tsx         # Emotion trajectory chart
│   └── ShareCard.tsx            # Results sharing card
├── lib/
│   ├── api.ts                   # Axios API client
│   ├── types.ts                 # TypeScript type definitions
│   └── utils.ts                 # Utility functions
├── backend/                      # FastAPI backend
│   ├── app/
│   │   ├── main.py             # FastAPI application
│   │   ├── database.py         # Database configuration
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── routes/             # API endpoints
│   │   └── services/           # Business logic services
│   └── pyproject.toml          # Python dependencies
├── scripts/
│   └── setup-backend.sh        # Backend initialization script
└── SETUP.md                     # This file
```

## Prerequisites

- Node.js 18+ and pnpm
- Python 3.11+
- uv (for Python package management)

## Installation

### 1. Frontend Setup (Next.js)

The frontend is already initialized. Just install dependencies:

```bash
pnpm install
```

### 2. Backend Setup (FastAPI)

Initialize the backend project structure:

```bash
# From project root
bash scripts/setup-backend.sh
```

This will:
- Create a `backend/` directory
- Initialize a Python project with uv
- Install required dependencies (FastAPI, SQLAlchemy, transformers, etc.)
- Create the necessary directory structure

## Running the Application

### Development Mode

**Terminal 1 - Frontend (Next.js on port 3000):**

```bash
pnpm dev
```

**Terminal 2 - Backend (FastAPI on port 8000):**

```bash
cd backend
uv run uvicorn app.main:app --reload --port 8000
```

The application will be available at `http://localhost:3000`

The API documentation will be at `http://localhost:8000/docs`

## API Endpoints

All endpoints are prefixed with `/api`:

- `POST /simulate` - Generate a thought spiral
- `POST /reality-check` - Get reality check and insights for a spiral
- `GET /history` - Get all saved spirals
- `GET /insights` - Get aggregated insights from all spirals
- `GET /health` - Health check endpoint

## How It Works

1. **User Input**: User enters a thought and selects a spiral pattern (Anxious, Logical, or Dramatic)

2. **Spiral Generation**: The backend uses predefined patterns augmented with HuggingFace transformers to:
   - Generate 5-7 escalating thoughts
   - Assign emotion scores (0-100) to each
   - Store the spiral in SQLite database

3. **Reality Check**: After spiral generation, the app fetches a grounded reality check and insights specific to the spiral pattern

4. **Visualization**: The frontend displays:
   - Timeline of thoughts with emotion escalation
   - Line chart showing emotional trajectory
   - Reality check with key insights
   - Option to copy and share results

5. **History & Analytics**: Users can view past spirals and get aggregated insights across all entries

## Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **UI Library**: ShadCN UI with Tailwind CSS
- **State Management**: React hooks + SWR patterns
- **Charts**: Recharts for data visualization
- **HTTP Client**: Axios

### Backend
- **Framework**: FastAPI
- **Database**: SQLite with SQLAlchemy ORM
- **AI**: HuggingFace transformers (BART, GPT-2)
- **Validation**: Pydantic
- **Server**: Uvicorn with auto-reload

## Database Schema

### Spirals Table
- `id` (String, Primary Key)
- `initial_thought` (Text)
- `mode` (String: anxious, logical, dramatic)
- `reality_check` (Text, nullable)
- `created_at` (DateTime)

### Thoughts Table
- `id` (String, Primary Key)
- `spiral_id` (String, Foreign Key)
- `text` (Text)
- `emotion_score` (Float)
- `level` (Integer)
- `created_at` (DateTime)

### Insights Table
- `id` (String, Primary Key)
- `spiral_id` (String, Foreign Key)
- `text` (Text)
- `created_at` (DateTime)

## Environment Variables

Currently, no environment variables are required for local development. The backend uses SQLite by default.

For production deployment, consider:
- `NEXT_PUBLIC_API_URL` - Frontend API endpoint (default: http://localhost:8000)
- `DATABASE_URL` - Backend database connection string (default: SQLite)

## Troubleshooting

### Backend won't start
- Ensure Python 3.11+ is installed
- Try: `cd backend && uv sync` to ensure dependencies are properly installed
- Check that port 8000 is not in use

### Frontend can't connect to backend
- Verify backend is running on `http://localhost:8000`
- Check browser console for CORS errors
- Ensure `NEXT_PUBLIC_API_URL` is not set (uses default localhost)

### AI models taking too long to load
- First run downloads HuggingFace models (~2-3GB)
- Subsequent runs use cached models
- For faster development, models gracefully degrade if unavailable

## Development Notes

- The AI Service uses HuggingFace's BART model for zero-shot classification and GPT-2 for generation
- Spirals are stored in SQLite and persist between sessions
- All API responses follow consistent schemas defined in `app/schemas/`
- Frontend uses dark theme with purple/slate color scheme
- Components are modular and reusable

## Production Deployment

For production:
1. Build frontend: `pnpm build && pnpm start`
2. Build backend: Set up proper database (PostgreSQL recommended)
3. Use environment variables for API URLs
4. Deploy frontend to Vercel
5. Deploy backend to your preferred platform (Railway, Heroku, AWS, etc.)
6. Update CORS origins in `backend/app/main.py`

## Support

For issues or questions about the application, refer to the inline code comments and type definitions for detailed documentation.
