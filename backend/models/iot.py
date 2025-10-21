from pydantic import BaseModel
from typing import Optional

class IoTDataInput(BaseModel):
    field_id: str
    device_id: str
    moisture: float
    temperature: float
    humidity: float
    timestamp: Optional[str] = None

class IoTDataResponse(BaseModel):
    record_id: str
    status: str
    alerts: list
    timestamp: str
