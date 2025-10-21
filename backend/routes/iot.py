from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from models.iot import IoTDataInput, IoTDataResponse
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/data")
async def receive_iot_data(data: IoTDataInput):
    """Receive data from ESP32 sensors"""
    db = get_firestore_db()
    
    try:
        iot_record = {
            "field_id": data.field_id,
            "device_id": data.device_id,
            "moisture": data.moisture,
            "temperature": data.temperature,
            "humidity": data.humidity,
            "timestamp": data.timestamp or datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat()
        }
        
        doc_ref = db.collection('iot_data').add(iot_record)
        
        # Check thresholds and create alerts if needed
        alerts = []
        if data.moisture < 30:
            alerts.append("Low soil moisture - irrigation recommended")
        if data.temperature > 35:
            alerts.append("High temperature alert")
        if data.humidity < 40:
            alerts.append("Low humidity detected")
        
        return {
            "record_id": doc_ref[1].id,
            "status": "received",
            "alerts": alerts,
            "timestamp": iot_record["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to store IoT data: {str(e)}")

@router.get("/data/{field_id}")
async def get_iot_data(
    field_id: str,
    limit: int = 100,
    user_id: str = Depends(get_current_user)
):
    """Get IoT data for a specific field"""
    db = get_firestore_db()
    
    try:
        data_ref = db.collection('iot_data').where('field_id', '==', field_id).order_by('timestamp', direction='DESCENDING').limit(limit)
        data_docs = data_ref.get()
        
        result = []
        for doc in data_docs:
            data_item = doc.to_dict()
            data_item['id'] = doc.id
            result.append(data_item)
        
        return {"data": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/latest/{field_id}")
async def get_latest_reading(
    field_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get the latest sensor reading"""
    db = get_firestore_db()
    
    try:
        data_ref = db.collection('iot_data').where('field_id', '==', field_id).order_by('timestamp', direction='DESCENDING').limit(1)
        data_docs = data_ref.get()
        data_list = list(data_docs)
        
        if len(data_list) == 0:
            raise HTTPException(status_code=404, detail="No data found for this field")
        
        latest = data_list[0].to_dict()
        latest['id'] = data_list[0].id
        
        return latest
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/stats/{field_id}")
async def get_field_stats(
    field_id: str,
    user_id: str = Depends(get_current_user)
):
    """Get statistical summary of field data"""
    db = get_firestore_db()
    
    try:
        data_ref = db.collection('iot_data').where('field_id', '==', field_id).order_by('timestamp', direction='DESCENDING').limit(100)
        data_docs = data_ref.get()
        
        data_list = [doc.to_dict() for doc in data_docs]
        
        if not data_list:
            return {"message": "No data available"}
        
        # Calculate stats
        moistures = [d['moisture'] for d in data_list if 'moisture' in d]
        temps = [d['temperature'] for d in data_list if 'temperature' in d]
        humidities = [d['humidity'] for d in data_list if 'humidity' in d]
        
        stats = {
            "field_id": field_id,
            "data_points": len(data_list),
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
