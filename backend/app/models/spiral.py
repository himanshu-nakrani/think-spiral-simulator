from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, Text, Float
from sqlalchemy.orm import relationship
from app.models.base import Base


class Spiral(Base):
    __tablename__ = "spirals"

    id = Column(String, primary_key=True, index=True)
    initial_thought = Column(Text)
    mode = Column(String)  # anxious, logical, dramatic
    created_at = Column(DateTime, default=datetime.utcnow)
    reality_check = Column(Text, nullable=True)

    thoughts = relationship("Thought", back_populates="spiral")
    insights = relationship("Insight", back_populates="spiral")


class Thought(Base):
    __tablename__ = "thoughts"

    id = Column(String, primary_key=True, index=True)
    spiral_id = Column(String, index=True)
    text = Column(Text)
    emotion_score = Column(Float)
    level = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

    spiral = relationship("Spiral", back_populates="thoughts")


class Insight(Base):
    __tablename__ = "insights"

    id = Column(String, primary_key=True, index=True)
    spiral_id = Column(String, index=True)
    text = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)

    spiral = relationship("Spiral", back_populates="insights")
