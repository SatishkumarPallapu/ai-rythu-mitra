import firebase_admin
from firebase_admin import credentials, firestore, auth
import os
from dotenv import load_dotenv

load_dotenv()

def initialize_firebase():
    """
    Initializes the Firebase Admin SDK.
    """
    # Get the base64 encoded service account from the environment variables
    firebase_service_account_b64 = os.getenv("FIREBASE_SERVICE_ACCOUNT_B64")

    if not firebase_service_account_b64:
        raise ValueError("FIREBASE_SERVICE_ACCOUNT_B64 environment variable not set.")

    import base64
    import json

    # Decode the base64 string to a JSON string
    firebase_service_account_json = base64.b64decode(firebase_service_account_b64).decode('utf-8')
    
    # Load the JSON string into a dictionary
    service_account_info = json.loads(firebase_service_account_json)
    
    # Initialize the app with a service account, granting admin privileges
    cred = credentials.Certificate(service_account_info)

    try:
        firebase_admin.get_app()
    except ValueError:
        firebase_admin.initialize_app(cred)

    print("Firebase initialized successfully.")
    
def get_db():
    """
    Returns the Firestore database client.
    """
    return firestore.client()

def get_auth():
    """
    Returns the Firebase Authentication client.
    """
    return auth

# Example usage:
if __name__ == "__main__":
    initialize_firebase()
    db = get_db()
    # Now you can use the db object to interact with Firestore
    print(db)
