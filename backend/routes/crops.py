from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from models.crop import CropRecommendationRequest, CropResponse
from services.ai_service import get_crop_recommendation
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/recommend")
async def recommend_crops(
    request: CropRecommendationRequest,
    user_id: str = Depends(get_current_user)
):
    try:
        # Get AI recommendation
        recommendation = await get_crop_recommendation(
            soil_type=request.soil_type,
            season=request.season,
            location=request.location,
            soil_report_id=request.soil_report_id
        )
        
        db = get_firestore_db()
        
        # Store recommendation
        crop_data = {
            "user_id": user_id,
            "recommendations": recommendation,
            "soil_type": request.soil_type,
            "season": request.season,
            "location": request.location,
            "created_at": datetime.utcnow().isoformat()
        }
        
        doc_ref = db.collection('crop_recommendations').add(crop_data)
        
        return {
            "recommendation_id": doc_ref[1].id,
            "recommendations": recommendation,
            "created_at": crop_data["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {str(e)}")

@router.get("/history")
async def get_crop_history(user_id: str = Depends(get_current_user)):
    db = get_firestore_db()
    
    try:
        crops_ref = db.collection('crop_recommendations').where('user_id', '==', user_id).order_by('created_at', direction='DESCENDING').limit(10)
        crops = crops_ref.get()
        
        result = []
        for crop in crops:
            crop_data = crop.to_dict()
            crop_data['id'] = crop.id
            result.append(crop_data)
        
        return {"history": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health-check")
async def crop_health_check(
    image_url: str,
    user_id: str = Depends(get_current_user)
):
    try:
        from services.ai_service import analyze_crop_health
        
        analysis = await analyze_crop_health(image_url)
        
        db = get_firestore_db()
        
        health_record = {
            "user_id": user_id,
            "image_url": image_url,
            "analysis": analysis,
            "created_at": datetime.utcnow().isoformat()
        }
        
        doc_ref = db.collection('crop_health_records').add(health_record)
        
        return {
            "record_id": doc_ref[1].id,
            "analysis": analysis,
            "created_at": health_record["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")
