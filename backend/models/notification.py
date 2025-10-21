from pydantic import BaseModel
from typing import Optional

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
