from pydantic import BaseModel
from typing import Optional, List

class MarketplaceListing(BaseModel):
    crop_name: str
    quantity: float
    unit: str  # kg, quintal, ton
    price_per_unit: float
    location: str
    description: Optional[str] = None
    contact: str
    images: Optional[List[str]] = []

class MarketplaceResponse(BaseModel):
    listing_id: str
    status: str
    created_at: str
