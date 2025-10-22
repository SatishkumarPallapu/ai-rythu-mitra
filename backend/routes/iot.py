from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List
import uuid
from backend.models.iot import IoTData, IoTDataInput, IoTDataResponse
from backend.routes.auth import get_current_user
from backend.config.database import get_db

router = APIRouter()

@router.post("/data", response_model=IoTDataResponse)
async def receive_iot_data(
    data: IoTDataInput,
    db: Session = Depends(get_db)
):
    """Receive data from ESP32 sensors"""
    try:
        iot_record = IoTData(
            id=str(uuid.uuid4()),
            field_id=data.field_id,
            device_id=data.device_id,
            moisture=data.moisture,
            temperature=data.temperature,
            humidity=data.humidity,
            timestamp=data.timestamp or datetime.utcnow()
        )

        db.add(iot_record)
        db.commit()
        db.refresh(iot_record)

        # Check thresholds and create alerts if needed
        alerts = []
        if data.moisture < 30:
            alerts.append("Low soil moisture - irrigation recommended")
        if data.temperature > 35:
            alerts.append("High temperature alert")
        if data.humidity < 40:
            alerts.append("Low humidity detected")

        return IoTDataResponse(
            record_id=iot_record.id,
            status="received",
            alerts=alerts,
            timestamp=iot_record.timestamp
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store IoT data: {str(e)}")

@router.get("/data/{field_id}", response_model=List[IoTDataResponse])
async def get_iot_data(
    field_id: str,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get IoT data for a specific field"""
    iot_data = db.query(IoTData).filter(IoTData.field_id == field_id).order_by(IoTData.timestamp.desc()).limit(limit).all()
    return [IoTDataResponse(
        record_id=item.id,
        status="success",
        alerts=[],
        timestamp=item.timestamp
    ) for item in iot_data]

@router.get("/latest/{field_id}", response_model=IoTDataResponse)
async def get_latest_reading(
    field_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get the latest sensor reading"""
    iot_data = db.query(IoTData).filter(IoTData.field_id == field_id).order_by(IoTData.timestamp.desc()).first()
    if iot_data is None:
        raise HTTPException(status_code=404, detail="No data found for this field")
    return IoTDataResponse(
        record_id=iot_data.id,
        status="success",
        alerts=[],
        timestamp=iot_data.timestamp
    )

@router.get("/stats/{field_id}")
async def get_field_stats(
    field_id: str,
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    """Get statistical summary of field data"""
    iot_data = db.query(IoTData).filter(IoTData.field_id == field_id).all()
    if not iot_data:
        return {"message": "No data available"}

    moistures = [item.moisture for item in iot_data]
    temps = [item.temperature for item in iot_data]
    humidities = [item.humidity for item in iot_data]

    stats = {
        "field_id": field_id,
        "data_points": len(iot_data),
        "moisture": {
            "avg": sum(moistures) / len(moistures) if moistures else 0,
            "min": min(moistures) if moistures else 0,
            "max": max(moistures) if moistures else 0
        },
        "temperature": {
            "avg": sum(temps) / len(temps) if temps else 0,
            "min": min(temps) if temps else 0,
            "max": max(temps) if temps else 0
        },
        "humidity": {
            "avg": sum(humidities) / len(humidities) if humidities else 0,
            "min": min(humidities) if humidities else 0,
            "max": max(humidities) if humidities else 0
        }
    }

    return stats
