import uuid
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.spiral import RealityCheckRequest, RealityCheckResponse
from app.models.spiral import Spiral, Insight
from app.services.ai_service import AIService
from app.database import get_db

router = APIRouter()
ai_service = AIService()


@router.post("/reality-check", response_model=RealityCheckResponse)
async def get_reality_check(
    request: RealityCheckRequest,
    db: Session = Depends(get_db),
):
    """
    Generate a reality check and insights for a specific spiral.
    """
    print(f"[Reality Check] Processing spiral: {request.spiral_id}")

    # Fetch spiral from database
    spiral = db.query(Spiral).filter(Spiral.id == request.spiral_id).first()
    if not spiral:
        print(f"[Reality Check] Spiral not found: {request.spiral_id}")
        raise HTTPException(status_code=404, detail="Spiral not found")

    # Get thoughts for this spiral
    thoughts = db.query(Spiral).filter(Spiral.id == request.spiral_id).first().thoughts

    # Generate reality check and insights
    reality_check, insights = ai_service.generate_reality_check(
        spiral.initial_thought,
        [{"id": t.id, "text": t.text, "emotionScore": t.emotion_score} for t in thoughts],
        spiral.mode,
    )

    print(
        f"[Reality Check] Generated reality check with {len(insights)} insights"
    )

    # Save insights to database
    spiral.reality_check = reality_check
    for insight_text in insights:
        insight = Insight(
            id=str(uuid.uuid4()),
            spiral_id=request.spiral_id,
            text=insight_text,
            created_at=datetime.utcnow(),
        )
        db.add(insight)

    db.commit()

    return RealityCheckResponse(
        realityCheck=reality_check,
        insights=insights,
    )
