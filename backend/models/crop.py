from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class CropRecommendationRequest(BaseModel):
    soil_type: str
    season: str
    location: str
    soil_report_id: Optional[str] = None
    daily_market: bool = False
    multi_cropping: bool = False

class CropResponse(BaseModel):
    name: str
    suitability_score: float
    expected_yield: str
    growth_duration: str
    water_requirement: str
    care_tips: List[str]
    daily_market_crop: bool = False
    multi_cropping_strategy: Optional[str] = None
    compatible_crops: Optional[List[str]] = None
    profit_index: Optional[str] = None

class CropHealthRequest(BaseModel):
    image_url: str
    crop_type: Optional[str] = None
