from fastapi import APIRouter, HTTPException, Depends, Response
from sqlalchemy.orm import Session
from datetime import datetime
from backend.services.pdf_service import generate_farm_report
from backend.routes.auth import get_current_user
from backend.config.database import get_db
from backend.models.user import User
from backend.models.reports import GeneratedReport
from typing import List
import uuid

router = APIRouter()

@router.post("/generate")
async def generate_report(
    report_type: str = "farm_summary",
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate PDF report"""

    try:
        # Fetch user data
        user_data = {
            "name": current_user.name,
            "farm_location": current_user.farm_location,
            "farm_size": current_user.farm_size,
            "phone": current_user.phone
        }

        # Fetch relevant data based on report type
        if report_type == "farm_summary":
            # Get soil reports
            soil_reports = current_user.soil_reports

            # Get IoT data
            iot_data = db.query(IoTData).filter(IoTData.field_id == "field1").limit(10).all() # Replace with actual field_id

            # Get crop recommendations
            crop_recommendations = []  # Replace with actual crop recommendations retrieval

            data = {
                "user": user_data,
                "soil_reports": soil_reports,
                "iot_data": iot_data,
                "crop_recommendations": crop_recommendations
            }
        else:
            data = {"user": user_data}

        # Generate PDF
        pdf_content = await generate_farm_report(data, report_type)

        # Store report metadata
        report_id = str(uuid.uuid4())
        report_meta = GeneratedReport(
            id=report_id,
            user_id=current_user.id,
            report_type=report_type,
            created_at=datetime.utcnow(),
            file_url="/reports/download/" + report_id # Placeholder URL
        )
        db.add(report_meta)
        db.commit()
        db.refresh(report_meta)

        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=farm_report_{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@router.get("/history", response_model=List[dict])
async def get_report_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get generated report history"""
    reports = db.query(GeneratedReport).filter(GeneratedReport.user_id == current_user.id).all()

    # Convert SQLAlchemy objects to dictionaries
    report_list = []
    for report in reports:
        report_data = {
            "id": report.id,
            "user_id": report.user_id,
            "report_type": report.report_type,
            "created_at": report.created_at,
            "file_url": report.file_url
        }
        report_list.append(report_data)

    return report_list