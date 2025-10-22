from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import List
from backend.models.crop import CropRecommendationRequest, CropResponse
from backend.services.ai_service import get_crop_recommendation
from backend.models.user import User
from backend.routes.auth import get_current_user
from backend.config.database import get_db
from sqlalchemy.orm import Session
from backend.models.crop import CropRecommendationRequest, CropResponse

router = APIRouter()

@router.post("/recommend", response_model=List[CropResponse])
async def recommend_crops(
    request: CropRecommendationRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    try:
        # Get AI recommendation
        recommendation = await get_crop_recommendation(
            soil_type=request.soil_type,
            season=request.season,
            location=request.location,
            soil_report_id=request.soil_report_id,
            daily_market=request.daily_market,
            multi_cropping=request.multi_cropping
        )

        # Return recommendation
        return recommendation
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {str(e)}")

@router.get("/history")
async def get_crop_history(current_user: User = Depends(get_current_user)):
    # TODO: Implement this function to fetch crop history from the database
    # Replace this with actual data retrieval from the database
    return [{"message": "Crop history not implemented yet"}]

@router.get("/health-check")
async def crop_health_check(
    image_url: str,
    current_user: User = Depends(get_current_user)
):
    try:
        from backend.services.ai_service import analyze_crop_health

        analysis = await analyze_crop_health(image_url)

        # TODO: Implement this function to store health check data into the database

        return {
            "analysis": analysis
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
