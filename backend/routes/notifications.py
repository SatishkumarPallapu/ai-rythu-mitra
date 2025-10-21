from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from models.notification import CalendarEvent, WhatsAppMessage
from services.whatsapp_service import send_whatsapp_message
from utils.calendar_helper import create_calendar_event
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/calendar")
async def create_event(
    event: CalendarEvent,
    user_id: str = Depends(get_current_user)
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
        
        db = get_firestore_db()
        
        # Store notification record
        notification_data = {
            "user_id": user_id,
            "type": "calendar",
            "event_id": event_result.get("id", ""),
            "title": event.title,
            "created_at": datetime.utcnow().isoformat()
        }
        
        db.collection('notifications').add(notification_data)
        
        return {
            "status": "created",
            "event": event_result,
            "message": "Calendar event created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create calendar event: {str(e)}")

@router.post("/whatsapp")
async def send_whatsapp(
    message: WhatsAppMessage,
    user_id: str = Depends(get_current_user)
):
    """Send WhatsApp notification"""
    try:
        result = await send_whatsapp_message(
            phone_number=message.phone_number,
            message=message.message
        )
        
        db = get_firestore_db()
        
        # Store notification record
        notification_data = {
            "user_id": user_id,
            "type": "whatsapp",
            "phone_number": message.phone_number,
            "message": message.message,
            "status": result.get("status", "sent"),
            "created_at": datetime.utcnow().isoformat()
        }
        
        db.collection('notifications').add(notification_data)
        
        return {
            "status": "sent",
            "result": result,
            "message": "WhatsApp message sent successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send WhatsApp message: {str(e)}")

@router.get("/history")
async def get_notification_history(user_id: str = Depends(get_current_user)):
    """Get notification history for the user"""
    db = get_firestore_db()
    
    try:
        notifications_ref = db.collection('notifications').where('user_id', '==', user_id).order_by('created_at', direction='DESCENDING').limit(50)
        notifications = notifications_ref.get()
        
        result = []
        for notif in notifications:
            notif_data = notif.to_dict()
            notif_data['id'] = notif.id
            result.append(notif_data)
        
        return {"notifications": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/schedule-daily-report")
async def schedule_daily_report(
    phone_number: str,
    user_id: str = Depends(get_current_user)
):
    """Schedule daily WhatsApp reports"""
    db = get_firestore_db()
    
    try:
        schedule_data = {
            "user_id": user_id,
            "phone_number": phone_number,
            "type": "daily_report",
            "enabled": True,
            "created_at": datetime.utcnow().isoformat()
        }
        
        doc_ref = db.collection('scheduled_notifications').add(schedule_data)
        
        return {
            "status": "scheduled",
            "schedule_id": doc_ref[1].id,
            "message": "Daily reports scheduled successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
