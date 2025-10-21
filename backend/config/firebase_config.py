import firebase_admin
from firebase_admin import credentials, firestore
from config.settings import settings
import json

db = None

def initialize_firebase():
    global db
    
    if not settings.FIREBASE_PROJECT_ID:
        print("Firebase not configured. Using mock database.")
        return None
    
    try:
        # Initialize Firebase Admin SDK
        cred_dict = {
            "type": "service_account",
            "project_id": settings.FIREBASE_PROJECT_ID,
            "private_key": settings.FIREBASE_PRIVATE_KEY.replace('\\n', '\n') if settings.FIREBASE_PRIVATE_KEY else None,
            "client_email": settings.FIREBASE_CLIENT_EMAIL,
        }
        
        cred = credentials.Certificate(cred_dict)
        firebase_admin.initialize_app(cred)
        
        db = firestore.client()
        print("Firebase initialized successfully")
        return db
    except Exception as e:
        print(f"Error initializing Firebase: {e}")
        return None

def get_firestore_db():
    global db
    if db is None:
        db = initialize_firebase()
    return db
