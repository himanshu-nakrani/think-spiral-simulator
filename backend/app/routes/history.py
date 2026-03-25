from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.spiral import HistoryResponse, SpiralEntrySchema, ThoughtSchema
from app.models.spiral import Spiral
from app.database import get_db

router = APIRouter()


@router.get("/history", response_model=HistoryResponse)
async def get_history(
    db: Session = Depends(get_db),
):
    """
    Get all spiral entries from history.
    """
    print("[History] Fetching all spirals")

    spirals = (
        db.query(Spiral)
        .order_by(Spiral.created_at.desc())
        .all()
    )

    entries = []
    for spiral in spirals:
        # Get thoughts for this spiral
        thoughts = [
            ThoughtSchema(
                id=t.id,
                text=t.text,
                emotionScore=t.emotion_score,
                timestamp=t.created_at,
            )
            for t in spiral.thoughts
        ]

        # Get insights for this spiral
        insights = [insight.text for insight in spiral.insights]

        # Get emotion scores
        emotion_scores = [t.emotion_score for t in spiral.thoughts]

        entry = SpiralEntrySchema(
            id=spiral.id,
            initialThought=spiral.initial_thought,
            mode=spiral.mode,
            thoughts=thoughts,
            realityCheck=spiral.reality_check or "",
            insights=insights,
            createdAt=spiral.created_at,
            emotionScores=emotion_scores,
        )
        entries.append(entry)

    print(f"[History] Found {len(entries)} spiral entries")

    return HistoryResponse(entries=entries)
