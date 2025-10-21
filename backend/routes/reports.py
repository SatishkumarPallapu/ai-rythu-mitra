from fastapi import APIRouter, HTTPException, Depends, Response
from datetime import datetime
from services.pdf_service import generate_farm_report
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/generate")
async def generate_report(
    report_type: str = "farm_summary",
    user_id: str = Depends(get_current_user)
):
    """Generate PDF report"""
    db = get_firestore_db()
    
    try:
        # Fetch user data
        user_doc = db.collection('users').document(user_id).get()
        user_data = user_doc.to_dict() if user_doc.exists else {}
        
        # Fetch relevant data based on report type
        if report_type == "farm_summary":
            # Get soil reports
            soil_reports = list(db.collection('soil_reports').where('user_id', '==', user_id).limit(5).get())
            
            # Get IoT data
            iot_data = list(db.collection('iot_data').limit(10).get())
            
            # Get crop recommendations
            crop_recs = list(db.collection('crop_recommendations').where('user_id', '==', user_id).limit(5).get())
            
            data = {
                "user": user_data,
                "soil_reports": [r.to_dict() for r in soil_reports],
                "iot_data": [d.to_dict() for d in iot_data],
                "crop_recommendations": [c.to_dict() for c in crop_recs]
            }
        else:
            data = {"user": user_data}
        
        # Generate PDF
        pdf_content = await generate_farm_report(data, report_type)
        
        # Store report metadata
        report_meta = {
            "user_id": user_id,
            "report_type": report_type,
            "created_at": datetime.utcnow().isoformat(),
            "status": "generated"
        }
        
        doc_ref = db.collection('generated_reports').add(report_meta)
        
        return Response(
            content=pdf_content,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f"attachment; filename=farm_report_{datetime.now().strftime('%Y%m%d')}.pdf"
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate report: {str(e)}")

@router.get("/history")
async def get_report_history(user_id: str = Depends(get_current_user)):
    """Get generated report history"""
    db = get_firestore_db()
    
    try:
        reports_ref = db.collection('generated_reports').where('user_id', '==', user_id).order_by('created_at', direction='DESCENDING').limit(20)
        reports = reports_ref.get()
        
        result = []
        for report in reports:
            report_data = report.to_dict()
            report_data['id'] = report.id
            result.append(report_data)
        
        return {"reports": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
