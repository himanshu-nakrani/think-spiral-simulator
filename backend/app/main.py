from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base
from app.routes import simulation, reality_check, history, insights
from app.services.ai_service import AIService

# Initialize database
DATABASE_URL = "sqlite:///./thinkspiral.db"
engine = create_engine(
    DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

# Initialize AI service (singleton)
ai_service = AIService()

# Create FastAPI app
app = FastAPI(
    title="ThinkSpiral API",
    description="API for analyzing and understanding overthinking patterns",
    version="1.0.0",
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(
    simulation.router,
    prefix="/api",
    tags=["simulation"],
)
app.include_router(
    reality_check.router,
    prefix="/api",
    tags=["reality_check"],
)
app.include_router(
    history.router,
    prefix="/api",
    tags=["history"],
)
app.include_router(
    insights.router,
    prefix="/api",
    tags=["insights"],
)


@app.get("/")
async def root():
    return {
        "message": "ThinkSpiral API",
        "version": "1.0.0",
        "endpoints": {
            "simulate": "/api/simulate",
            "reality_check": "/api/reality-check",
            "history": "/api/history",
            "insights": "/api/insights",
        },
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
