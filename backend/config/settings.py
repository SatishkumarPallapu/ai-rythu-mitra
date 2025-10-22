
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # Firebase
    FIREBASE_PROJECT_ID: Optional[str] = None
    FIREBASE_PRIVATE_KEY: Optional[str] = None
    FIREBASE_CLIENT_EMAIL: Optional[str] = None
    
    # Database
    DATABASE_URL: str = "sqlite:///./test.db"
    
    # AI APIs
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    PERPLEXITY_API_KEY: Optional[str] = None
    
    # External Services
    WHATSAPP_API_KEY: Optional[str] = None
    GOOGLE_CALENDAR_CREDENTIALS: Optional[str] = None
    
    # JWT
    SECRET_KEY: str = "6d25d91306d5a59996cde64df9d8f34e939f89e003ec843c8b572acd7544d232"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Server
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
