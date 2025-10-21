from pydantic import BaseModel
from typing import Optional, List

class CropRecommendationRequest(BaseModel):
    soil_type: str
    season: str
    location: str
    soil_report_id: Optional[str] = None

class CropResponse(BaseModel):
    name: str
    suitability_score: float
    expected_yield: str
    growth_duration: str
    water_requirement: str
    care_tips: List[str]

class CropHealthRequest(BaseModel):
    image_url: str
    crop_type: Optional[str] = None
