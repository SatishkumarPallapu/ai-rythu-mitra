
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any, List
from datetime import datetime
from backend.config.database import Base

class SoilReport(Base):
    __tablename__ = "soil_reports"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String, ForeignKey("users.id"))
    file_url = Column(String)
    analysis = Column(JSON)
    recommendations = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="soil_reports")

class SoilAnalysisRequest(BaseModel):
    user_id: str

class SoilAnalysisResponse(BaseModel):
    report_id: str
    user_id: str
    analysis: Dict[str, Any]
    file_url: str
    created_at: datetime
    recommendations: Optional[List[str]] = None
