from typing import List
from pydantic import BaseModel
from datetime import datetime


class ThoughtSchema(BaseModel):
    id: str
    text: str
    emotionScore: float
    timestamp: datetime

    class Config:
        from_attributes = True


class SimulationRequest(BaseModel):
    initial_thought: str
    mode: str  # anxious, logical, dramatic


class SimulationResponse(BaseModel):
    id: str
    thoughts: List[ThoughtSchema]
    emotionScores: List[float]

    class Config:
        from_attributes = True


class RealityCheckRequest(BaseModel):
    spiral_id: str


class RealityCheckResponse(BaseModel):
    realityCheck: str
    insights: List[str]


class InsightSchema(BaseModel):
    id: str
    text: str

    class Config:
        from_attributes = True


class SpiralEntrySchema(BaseModel):
    id: str
    initialThought: str
    mode: str
    thoughts: List[ThoughtSchema]
    realityCheck: str
    insights: List[str]
    createdAt: datetime
    emotionScores: List[float]

    class Config:
        from_attributes = True


class HistoryResponse(BaseModel):
    entries: List[SpiralEntrySchema]


class InsightsResponse(BaseModel):
    commonPatterns: List[str]
    emotionalTrends: dict
    patternDetection: dict
    recommendations: List[str]


class BreakSpiralRequest(BaseModel):
    spiral_id: str


class BreakSpiralItem(BaseModel):
    thought: str
    rationalCounter: str


class BreakSpiralResponse(BaseModel):
    reframes: List[BreakSpiralItem]


class CompareModesRequest(BaseModel):
    initial_thought: str
    primary_mode: str
    compare_mode: str


class CompareModesResponse(BaseModel):
    primaryMode: str
    compareMode: str
    primaryThoughts: List[ThoughtSchema]
    primaryEmotionScores: List[float]
    compareThoughts: List[ThoughtSchema]
    compareEmotionScores: List[float]
