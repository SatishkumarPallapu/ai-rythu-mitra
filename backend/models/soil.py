from pydantic import BaseModel
from typing import Optional, Dict, Any

class SoilAnalysisRequest(BaseModel):
    file_path: str
    user_id: str

class SoilAnalysisResponse(BaseModel):
    report_id: str
    analysis: Dict[str, Any]
    file_url: str
    created_at: str
    recommendations: Optional[list] = []
