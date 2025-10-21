from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from datetime import datetime
import os
import uuid
from services.ai_service import analyze_soil_with_ai
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/analyze")
async def analyze_soil(
    file: UploadFile = File(...),
    user_id: str = Depends(get_current_user)
):
    db = get_firestore_db()
    
    try:
        # Save uploaded file
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        file_path = f"uploads/soil_reports/{unique_filename}"
        
        os.makedirs("uploads/soil_reports", exist_ok=True)
        
        with open(file_path, "wb") as f:
            content = await file.read()
            f.write(content)
        
        # Analyze with AI
        analysis_result = await analyze_soil_with_ai(file_path)
        
        # Store in Firestore
        soil_report = {
            "user_id": user_id,
            "file_url": file_path,
            "analysis": analysis_result,
            "created_at": datetime.utcnow().isoformat(),
            "status": "completed"
        }
        
        doc_ref = db.collection('soil_reports').add(soil_report)
        report_id = doc_ref[1].id
        
        return {
            "report_id": report_id,
            "analysis": analysis_result,
            "file_url": file_path,
            "created_at": soil_report["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

@router.get("/reports")
async def get_soil_reports(user_id: str = Depends(get_current_user)):
    db = get_firestore_db()
    
    try:
        reports_ref = db.collection('soil_reports').where('user_id', '==', user_id).order_by('created_at', direction='DESCENDING').limit(10)
        reports = reports_ref.get()
        
        result = []
        for report in reports:
            report_data = report.to_dict()
            report_data['id'] = report.id
            result.append(report_data)
        
        return {"reports": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/reports/{report_id}")
async def get_soil_report(report_id: str, user_id: str = Depends(get_current_user)):
    db = get_firestore_db()
    
    try:
        report_doc = db.collection('soil_reports').document(report_id).get()
        
        if not report_doc.exists:
            raise HTTPException(status_code=404, detail="Report not found")
        
        report_data = report_doc.to_dict()
        
        if report_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized access")
        
        report_data['id'] = report_id
        return report_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
