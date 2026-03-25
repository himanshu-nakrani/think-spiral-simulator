from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.spiral import InsightsResponse
from app.models.spiral import Spiral, Insight
from app.database import get_db

router = APIRouter()


@router.get("/insights", response_model=InsightsResponse)
async def get_insights(
    db: Session = Depends(get_db),
):
    """
    Get aggregated insights and patterns from all spirals.
    """
    print("[Insights] Calculating aggregated insights")

    spirals = db.query(Spiral).all()

    # Extract common patterns from insights
    all_insights = []
    all_modes = []
    all_emotion_scores = []

    for spiral in spirals:
        all_modes.append(spiral.mode)
        all_emotion_scores.extend([t.emotion_score for t in spiral.thoughts])
        all_insights.extend([i.text for i in spiral.insights])

    # Calculate common patterns
    insight_counter = Counter(all_insights)
    common_patterns = [
        pattern for pattern, _ in insight_counter.most_common(5)
    ]

    # Calculate emotional trends
    if all_emotion_scores:
        avg_emotion = sum(all_emotion_scores) / len(all_emotion_scores)
        max_emotion = max(all_emotion_scores)
    else:
        avg_emotion = 0
        max_emotion = 0

    # Most common mode
    mode_counter = Counter(all_modes)
    dominant_mode = mode_counter.most_common(1)[0][0] if mode_counter else "anxious"

    # Generate recommendations based on patterns
    recommendations = [
        "Practice grounding techniques when spirals begin",
        "Challenge automatic negative thoughts with evidence",
        "Break problems into smaller, manageable steps",
        "Take action on what you can control",
        "Give yourself permission to not have all answers",
    ]

    print(
        f"[Insights] Calculated insights from {len(spirals)} spirals"
    )

    return InsightsResponse(
        commonPatterns=common_patterns or [
            "Spirals often involve catastrophic thinking",
            "Emotions intensify as thoughts escalate",
        ],
        emotionalTrends={
            "average": round(avg_emotion, 2),
            "peak": max_emotion,
            "mode": dominant_mode,
        },
        recommendations=recommendations,
    )
