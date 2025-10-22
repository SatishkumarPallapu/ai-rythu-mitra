from sqlalchemy import Column, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from backend.config.database import Base

class CalendarEventModel(Base):
    __tablename__ = "calendar_events"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    title = Column(String)
    description = Column(String, nullable=True)
    start_time = Column(DateTime)
    end_time = Column(DateTime)
    location = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class WhatsAppMessageModel(Base):
    __tablename__ = "whatsapp_messages"

    id = Column(String, primary_key=True, index=True)
    user_id = Column(String)
    phone_number = Column(String)
    message = Column(String)
    status = Column(String, default="pending")
    created_at = Column(DateTime, default=datetime.utcnow)

class CalendarEvent(BaseModel):
    title: str
    description: Optional[str] = None
    start_time: str  # ISO format
    end_time: str    # ISO format
    location: Optional[str] = None

class WhatsAppMessage(BaseModel):
    phone_number: str
    message: str
    template_name: Optional[str] = None
