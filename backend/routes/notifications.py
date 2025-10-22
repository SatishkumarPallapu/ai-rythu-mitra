from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from datetime import datetime
import uuid
from typing import List
from backend.models.notification import CalendarEvent, WhatsAppMessage, CalendarEventModel, WhatsAppMessageModel
from backend.services.whatsapp_service import send_whatsapp_message
from backend.utils.calendar_helper import create_calendar_event
from backend.routes.auth import get_current_user
from backend.config.database import get_db
from backend.models.user import User


router = APIRouter()

@router.post("/calendar")
async def create_event(
    event: CalendarEvent,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a Google Calendar event"""
    try:
        event_result = await create_calendar_event(
            title=event.title,
            description=event.description,
            start_time=event.start_time,
            end_time=event.end_time,
            location=event.location
        )

        db_event = CalendarEventModel(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            title=event.title,
            description=event.description,
            start_time=datetime.fromisoformat(event.start_time),
            end_time=datetime.fromisoformat(event.end_time),
            location=event.location
        )
        db.add(db_event)
        db.commit()
        db.refresh(db_event)

        return {
            "status": "created",
            "event": {"id": db_event.id, "title": db_event.title},
            "message": "Calendar event created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create calendar event: {str(e)}")

@router.post("/whatsapp")
async def send_whatsapp(
    message: WhatsAppMessage,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Send WhatsApp notification"""
    try:
        result = await send_whatsapp_message(
            phone_number=message.phone_number,
            message=message.message
        )

        db_message = WhatsAppMessageModel(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            phone_number=message.phone_number,
            message=message.message,
            status="sent" if result.get("status") == "sent" else "pending"
        )
        db.add(db_message)
        db.commit()
        db.refresh(db_message)

        return {
            "status": "sent",
            "result": result,
            "message": "WhatsApp message sent successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send WhatsApp message: {str(e)}")

@router.get("/history")
async def get_notification_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get notification history for the user"""
    try:
        calendar_events = db.query(CalendarEventModel).filter(CalendarEventModel.user_id == current_user.id).all()
        whatsapp_messages = db.query(WhatsAppMessageModel).filter(WhatsAppMessageModel.user_id == current_user.id).all()

        history = []
        for event in calendar_events:
            history.append({"type": "calendar", "data": event})
        for message in whatsapp_messages:
            history.append({"type": "whatsapp", "data": message})

        return {"notifications": history, "count": len(history)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-daily-report")
async def schedule_daily_report(
    phone_number: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Schedule daily WhatsApp reports"""
    # TODO: Implement scheduling logic (e.g., using Celery)
    return {"message": "Scheduling not yet implemented"}
