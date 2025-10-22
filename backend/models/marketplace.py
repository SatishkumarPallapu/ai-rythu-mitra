from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from backend.config.database import Base

class MarketplaceListing(Base):
    __tablename__ = "marketplace"

    id = Column(String, primary_key=True, index=True)
    crop_name = Column(String)
    quantity = Column(Float)
    unit = Column(String)
    price_per_unit = Column(Float)
    location = Column(String)
    description = Column(Text, nullable=True)
    contact = Column(String)
    images = Column(String, nullable=True) # Storing image URLs as a comma-separated string
    created_at = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String)

class MarketplaceListingCreate(BaseModel):
    crop_name: str
    quantity: float
    unit: str
    price_per_unit: float
    location: str
    description: Optional[str] = None
    contact: str
    images: Optional[List[str]] = []

class MarketplaceListingUpdate(BaseModel):
    crop_name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    price_per_unit: Optional[float] = None
    location: Optional[str] = None
    description: Optional[str] = None
    contact: Optional[str] = None
    images: Optional[List[str]] = []

class MarketplaceListingResponse(BaseModel):
    id: str
    crop_name: str
    quantity: float
    unit: str
    price_per_unit: float
    location: str
    description: Optional[str] = None
    contact: str
    images: Optional[List[str]] = []
    created_at: datetime
    user_id: str