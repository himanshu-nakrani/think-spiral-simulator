# ThinkSpiral Architecture Guide

This document explains the architecture, component structure, and data flow of ThinkSpiral.

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                             │
├─────────────────────────────────────────────────────────────────┤
│  Next.js Frontend Application (React 19 + TypeScript)            │
│  ├─ UI Components (ShadCN)                                      │
│  ├─ State Management (React Hooks)                              │
│  ├─ HTTP Client (Axios)                                         │
│  └─ Styling (Tailwind CSS)                                      │
└────────────────────┬────────────────────────────────────────────┘
                     │
        HTTP REST API │ (JSON over HTTP)
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FASTAPI BACKEND SERVER                        │
├─────────────────────────────────────────────────────────────────┤
│  FastAPI Application (Python)                                    │
│  ├─ API Routes                                                   │
│  │  ├─ /api/simulate (POST)                                     │
│  │  ├─ /api/reality-check (POST)                                │
│  │  ├─ /api/history (GET)                                       │
│  │  └─ /api/insights (GET)                                      │
│  │                                                               │
│  ├─ Services                                                     │
│  │  └─ AIService (Singleton)                                    │
│  │     ├─ generate_spiral()                                     │
│  │     ├─ generate_reality_check()                              │
│  │     └─ classify_emotion()                                    │
│  │                                                               │
│  ├─ Models (SQLAlchemy ORM)                                     │
│  │  ├─ Spiral                                                    │
│  │  ├─ Thought                                                   │
│  │  └─ Insight                                                   │
│  │                                                               │
│  └─ Data Validation (Pydantic Schemas)                          │
└────────────────────┬────────────────────────────────────────────┘
                     │
          SQL Queries │
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     SQLITE DATABASE                              │
├─────────────────────────────────────────────────────────────────┤
│  Tables:                                                         │
│  ├─ spirals (id, initial_thought, mode, reality_check, ...)   │
│  ├─ thoughts (id, spiral_id, text, emotion_score, level, ...) │
│  └─ insights (id, spiral_id, text, ...)                        │
└─────────────────────────────────────────────────────────────────┘
```

## Frontend Component Tree

```
app/page.tsx (Main Page - Client Component)
│
├─ Header Section
│  └─ Static title and description
│
└─ Grid Layout (3-column on desktop, 1-column on mobile)
   │
   ├─ LEFT COLUMN (Input Section)
   │  ├─ ModeSelector Component
   │  │  ├─ Three mode buttons
   │  │  └─ Mode descriptions
   │  │
   │  ├─ InputBox Component
   │  │  ├─ Textarea for thought input
   │  │  ├─ Character counter
   │  │  └─ Submit button
   │  │
   │  └─ Error Display (conditional)
   │
   └─ RIGHT COLUMN (Results Section)
      │
      ├─ SpiralTimeline Component (conditional)
      │  ├─ Vertical timeline
      │  ├─ Gradient connecting line
      │  ├─ Individual Thought Cards
      │  │  ├─ Thought text
      │  │  ├─ Emotion score badge
      │  │  └─ Vertical emotion bar
      │  └─ Level indicators
      │
      ├─ EmotionChart Component (conditional)
      │  ├─ Recharts LineChart
      │  ├─ Emotion data points
      │  ├─ Average/Peak stats
      │  └─ Custom tooltip
      │
      ├─ ShareCard Component (conditional)
      │  ├─ Reality Check section
      │  ├─ Insights list
      │  └─ Copy to clipboard button
      │
      └─ Empty State (conditional)
         └─ Welcome message for new users
```

## Component Specifications

### InputBox.tsx
**Purpose**: Accept user input and submit thoughts

**Props**:
- `onSubmit: (thought: string) => void` - Callback when user submits
- `isLoading: boolean` - Show loading state during API call

**State**:
- `thought: string` - Current textarea value

**Features**:
- Real-time character counter
- Enter+Ctrl keyboard shortcut support
- Disabled state during submission
- Character limit validation

### ModeSelector.tsx
**Purpose**: Allow user to choose spiral pattern

**Props**:
- `selectedMode: ThinkMode` - Current selected mode
- `onModeChange: (mode: ThinkMode) => void` - Callback on mode change

**Modes**:
- Anxious: Catastrophic thinking patterns
- Logical: Analytical overthinking
- Dramatic: Emotional escalation

**Features**:
- Three equal-width buttons
- Description text under each option
- Visual highlight of selected mode

### SpiralTimeline.tsx
**Purpose**: Visualize thought escalation as a timeline

**Props**:
- `thoughts: Thought[]` - Array of generated thoughts

**Features**:
- Vertical gradient line showing progression
- Circular dots at each thought level
- Cards with thought text
- Emotion score display
- Vertical emotion intensity bar

**Styling**:
- Dark theme with purple-to-red gradient
- Smooth transitions
- Responsive padding

### EmotionChart.tsx
**Purpose**: Display emotion trajectory as a line chart

**Props**:
- `emotionScores: number[]` - Array of emotion scores (0-100)

**Features**:
- Recharts LineChart component
- X-axis: Thought levels (L1, L2, etc.)
- Y-axis: Emotion intensity (0-100)
- Dynamic average and peak calculation
- Custom dark-themed tooltip

**Styling**:
- Purple line color
- Grid background
- Slate color scheme

### ShareCard.tsx
**Purpose**: Display and share results

**Props**:
- `realityCheck: string` - Grounded perspective text
- `insights: string[]` - Array of key insights

**Features**:
- Reality check section with special styling
- Bulleted insights list
- Copy to clipboard button with visual feedback
- Uses Lucide icons

**State**:
- `copied: boolean` - Track if text was copied

## Data Models

### Frontend Types (lib/types.ts)

```typescript
type ThinkMode = 'anxious' | 'logical' | 'dramatic'

interface Thought {
  id: string
  text: string
  emotionScore: number  // 0-100
  timestamp: Date
}

interface SpiralEntry {
  id: string
  initialThought: string
  mode: ThinkMode
  thoughts: Thought[]
  realityCheck: string
  insights: string[]
  createdAt: Date
  emotionScores: number[]
}
```

### Backend Models (SQLAlchemy)

```python
class Spiral(Base):
    __tablename__ = "spirals"
    id: String (PK)
    initial_thought: Text
    mode: String
    created_at: DateTime
    reality_check: Text (nullable)
    # Relationships
    thoughts: List[Thought]
    insights: List[Insight]

class Thought(Base):
    __tablename__ = "thoughts"
    id: String (PK)
    spiral_id: String (FK)
    text: Text
    emotion_score: Float
    level: Integer
    created_at: DateTime

class Insight(Base):
    __tablename__ = "insights"
    id: String (PK)
    spiral_id: String (FK)
    text: Text
    created_at: DateTime
```

## Data Flow: Submission to Display

```
1. USER INTERACTION
   User types thought → Selects mode → Clicks "Explore Spiral"
   │
   ▼
2. FRONTEND STATE UPDATE
   InputBox captures input
   ModeSelector provides mode
   onSubmit called from app/page.tsx
   │
   ▼
3. API REQUEST
   Axios POST to /api/simulate with {initial_thought, mode}
   │
   ▼
4. BACKEND PROCESSING
   POST /api/simulate receives request
   │
   ├─ Create Spiral record
   ├─ Call AIService.generate_spiral()
   │  ├─ Select pattern based on mode
   │  ├─ Generate 5 thought sequences
   │  ├─ Calculate emotion scores
   │  └─ Return (thoughts, emotionScores)
   ├─ Save Thought records to DB
   └─ Return SimulationResponse
   │
   ▼
5. FRONTEND RECEIVES RESPONSE
   Update state:
   - thoughts = response.thoughts
   - emotionScores = response.emotionScores
   - currentSpinalId = response.id
   │
   ▼
6. FETCH REALITY CHECK
   POST /api/reality-check with {spiral_id}
   │
   ▼
7. BACKEND GENERATES INSIGHTS
   POST /api/reality-check
   │
   ├─ Fetch Spiral by ID
   ├─ Call AIService.generate_reality_check()
   │  ├─ Select reality check based on mode
   │  └─ Return (realityCheck, insights)
   ├─ Save Insight records to DB
   └─ Return RealityCheckResponse
   │
   ▼
8. FRONTEND DISPLAYS RESULTS
   Update state:
   - realityCheck = response.realityCheck
   - insights = response.insights
   │
   ▼
9. COMPONENT RENDERING
   SpiralTimeline renders thoughts with emotion scale
   EmotionChart renders trajectory
   ShareCard renders reality check + insights
   │
   ▼
10. USER INTERACTION
    User can:
    - View timeline and chart
    - Copy insights
    - Submit new thought
    - View history
```

## API Request/Response Flow

### Simulation Request
```
POST /api/simulate
Content-Type: application/json

{
  "initial_thought": "I made a mistake at work",
  "mode": "anxious"
}

Response (200):
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "thoughts": [
    {
      "id": "...",
      "text": "What if they fire me?",
      "emotionScore": 55,
      "timestamp": "2024-03-25T..."
    },
    ...
  ],
  "emotionScores": [55, 70, 85, 95, 100]
}
```

### Reality Check Request
```
POST /api/reality-check
Content-Type: application/json

{
  "spiral_id": "550e8400-e29b-41d4-a716-446655440000"
}

Response (200):
{
  "realityCheck": "While anxiety feels real...",
  "insights": [
    "Most worries never happen",
    "You've overcome challenges before",
    ...
  ]
}
```

## State Management Strategy

### Frontend State (app/page.tsx)
- **React Hooks** for local component state
- **useState** for form inputs and results
- No external state library needed (simple data flow)
- State passed down as props to child components

### Backend State
- **SQLAlchemy ORM** manages database state
- **FastAPI Dependency Injection** for database session
- **AIService Singleton** maintains loaded ML models

## Styling Architecture

### Color System
```
Primary:        #a855f7 (purple-600)
Secondary:      #ef4444 (red-600)
Background:     #0f172a (slate-950)
Surface:        #1e293b (slate-900)
Text Primary:   #f1f5f9 (slate-100)
Text Secondary: #cbd5e1 (slate-300)
Border:         #475569 (slate-700)
```

### Key Classes
```
.bg-gradient-to-br     # Gradient background
.backdrop-blur         # Frosted glass effect
.text-balance         # Optimal line breaks
.leading-relaxed      # Comfortable line height
.space-y-*            # Vertical spacing
.gap-*                # Flexbox/grid gaps
```

## Database Schema Relationships

```
Spiral (1)
  ├─ has many ─→ Thought (N)
  │              └─ emotion_score: Float (0-100)
  │              └─ level: Integer (1-5)
  │
  └─ has many ─→ Insight (N)
                 └─ text: String
```

## Error Handling

### Frontend
- Try-catch in async functions
- User-friendly error messages in UI
- Error states prevent further submissions
- Logs to browser console for debugging

### Backend
- HTTP exceptions with status codes
- Pydantic validation errors
- Graceful degradation if AI models unavailable
- Logging at key steps

## Performance Considerations

### Frontend
- Components are lightweight
- No unnecessary re-renders (hooks)
- Images lazy-loaded by Next.js
- CSS-in-JS compiled to static CSS

### Backend
- SQLAlchemy connection pooling
- HuggingFace models cached after first load
- Async I/O with FastAPI
- JSON serialization efficient

### Database
- Indexes on foreign keys
- Query optimization
- SQLite -> PostgreSQL upgrade path

## Extension Points

### Adding Features
1. **New Spiral Mode**: Add in `AIService.generate_spiral()`
2. **New Endpoint**: Create in `app/routes/`, register in `main.py`
3. **New Component**: Create in `components/`, import in `page.tsx`
4. **New Database Table**: Create model in `app/models/`, schema in `app/schemas/`

### Integration Opportunities
- Sentiment analysis API
- User authentication system
- Export/visualization tools
- Email notifications
- Mobile app (React Native)

This architecture prioritizes simplicity, maintainability, and scalability.
