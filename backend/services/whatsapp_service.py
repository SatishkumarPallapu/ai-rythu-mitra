import httpx
from config.settings import settings
from typing import Dict

async def send_whatsapp_message(phone_number: str, message: str) -> Dict:
    """Send WhatsApp message using WhatsApp Business API"""
    
    # Mock implementation - replace with actual WhatsApp Business API
    if settings.WHATSAPP_API_KEY:
        try:
            # Example using WhatsApp Business API
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://graph.facebook.com/v18.0/YOUR_PHONE_NUMBER_ID/messages",
                    headers={
                        "Authorization": f"Bearer {settings.WHATSAPP_API_KEY}",
                        "Content-Type": "application/json"
                    },
                    json={
                        "messaging_product": "whatsapp",
                        "to": phone_number,
                        "type": "text",
                        "text": {
                            "body": message
                        }
                    }
                )
                
                return {
                    "status": "sent",
                    "message_id": response.json().get("messages", [{}])[0].get("id"),
                    "provider": "whatsapp_business"
                }
        except Exception as e:
            print(f"WhatsApp send error: {e}")
            return {
                "status": "error",
                "error": str(e)
            }
    else:
        # Mock response
        print(f"Mock WhatsApp: Sending to {phone_number}: {message}")
        return {
            "status": "mock_sent",
            "phone_number": phone_number,
            "message": message,
            "provider": "mock"
        }
