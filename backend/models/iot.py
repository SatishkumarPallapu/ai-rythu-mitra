from sqlalchemy import Column, String, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from backend.config.database import Base

class IoTData(Base):
    __tablename__ = "iot_data"

    id = Column(String, primary_key=True, index=True)
    field_id = Column(String)
    device_id = Column(String)
    moisture = Column(Float)
    temperature = Column(Float)
    humidity = Column(Float)
    timestamp = Column(DateTime, default=datetime.utcnow)

class IoTDataInput(BaseModel):
    field_id: str
    device_id: str
    moisture: float
    temperature: float
    humidity: float
    timestamp: Optional[datetime] = None

class IoTDataResponse(BaseModel):
    record_id: str
    status: str
    alerts: list
    timestamp: datetime
