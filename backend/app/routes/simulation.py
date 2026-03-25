import uuid
from datetime import datetime
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.spiral import SimulationRequest, SimulationResponse, ThoughtSchema
from app.models.spiral import Spiral, Thought
from app.services.ai_service import AIService
from app.database import get_db

router = APIRouter()
ai_service = AIService()


@router.post("/simulate", response_model=SimulationResponse)
async def simulate_spiral(
    request: SimulationRequest,
    db: Session = Depends(get_db),
):
    """
    Simulate an overthinking spiral based on initial thought and mode.
    """
    print(
        f"[Simulate] Processing: '{request.initial_thought}' with mode: {request.mode}"
    )

    # Create spiral entry
    spiral_id = str(uuid.uuid4())
    spiral = Spiral(
        id=spiral_id,
        initial_thought=request.initial_thought,
        mode=request.mode,
        created_at=datetime.utcnow(),
    )

    # Generate spiral using AI service
    generated_thoughts, emotion_scores = ai_service.generate_spiral(
        request.initial_thought, request.mode
    )

    print(
        f"[Simulate] Generated {len(generated_thoughts)} thoughts with scores: {emotion_scores}"
    )

    # Save spiral and thoughts to database
    db.add(spiral)
    db.flush()

    thought_objects = []
    for thought_data in generated_thoughts:
        thought = Thought(
            id=thought_data["id"],
            spiral_id=spiral_id,
            text=thought_data["text"],
            emotion_score=thought_data["emotionScore"],
            level=thought_data["level"],
            created_at=datetime.utcnow(),
        )
        db.add(thought)
        thought_objects.append(thought)

    db.commit()
    db.refresh(spiral)

    # Format response
    thoughts_response = [
        ThoughtSchema(
            id=t.id,
            text=t.text,
            emotionScore=t.emotion_score,
            timestamp=t.created_at,
        )
        for t in thought_objects
    ]

    return SimulationResponse(
        id=spiral_id,
        thoughts=thoughts_response,
        emotionScores=emotion_scores,
    )
