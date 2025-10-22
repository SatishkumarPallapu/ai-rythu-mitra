
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import os
import uuid
from typing import List
from backend.services.ai_service import analyze_soil_with_ai
from backend.models.soil import SoilReport, SoilAnalysisResponse
from backend.models.user import User
from backend.routes.auth import get_current_user
from backend.config.database import get_db

router = APIRouter()

@router.post("/analyze", response_model=SoilAnalysisResponse)
async def analyze_soil(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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

        # Create SoilReport instance
        report_id = str(uuid.uuid4())
        soil_report = SoilReport(
            id=report_id,
            user_id=current_user.id,
            file_url=file_path,
            analysis=analysis_result,
            created_at=datetime.utcnow()
        )
        db.add(soil_report)
        db.commit()
        db.refresh(soil_report)

        return SoilAnalysisResponse(
            report_id=report_id,
            user_id=current_user.id,
            analysis=analysis_result,
            file_url=file_path,
            created_at=soil_report.created_at
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

@router.get("/reports", response_model=List[SoilAnalysisResponse])
async def get_soil_reports(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    reports = db.query(SoilReport).filter(SoilReport.user_id == current_user.id).all()
    return [SoilAnalysisResponse(
            report_id=report.id,
            user_id=report.user_id,
            analysis=report.analysis,
            file_url=report.file_url,
            created_at=report.created_at
        ) for report in reports]

@router.get("/reports/{report_id}", response_model=SoilAnalysisResponse)
async def get_soil_report(
    report_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    report = db.query(SoilReport).filter(SoilReport.id == report_id, SoilReport.user_id == current_user.id).first()
    if report is None:
        raise HTTPException(status_code=404, detail="Report not found")
    return SoilAnalysisResponse(
            report_id=report.id,
            user_id=report.user_id,
            analysis=report.analysis,
            file_url=report.file_url,
            created_at=report.created_at
        )
