from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from typing import List, Optional
import uuid
from backend.models.marketplace import MarketplaceListing, MarketplaceListingCreate, MarketplaceListingUpdate, MarketplaceListingResponse
from backend.routes.auth import get_current_user
from backend.config.database import get_db
from backend.models.user import User

router = APIRouter()

@router.post("/listings", response_model=MarketplaceListingResponse)
async def create_listing(
    listing: MarketplaceListingCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new marketplace listing"""
    try:
        db_listing = MarketplaceListing(
            id=str(uuid.uuid4()),
            user_id=current_user.id,
            crop_name=listing.crop_name,
            quantity=listing.quantity,
            unit=listing.unit,
            price_per_unit=listing.price_per_unit,
            location=listing.location,
            description=listing.description,
            contact=listing.contact,
            images=",".join(listing.images) if listing.images else None,
        )
        db.add(db_listing)
        db.commit()
        db.refresh(db_listing)
        return MarketplaceListingResponse(
            id=db_listing.id,
            crop_name=db_listing.crop_name,
            quantity=db_listing.quantity,
            unit=db_listing.unit,
            price_per_unit=db_listing.price_per_unit,
            location=db_listing.location,
            description=db_listing.description,
            contact=db_listing.contact,
            images=listing.images or [],
            created_at=db_listing.created_at,
            user_id=db_listing.user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create listing: {str(e)}")

@router.get("/listings", response_model=List[MarketplaceListingResponse])
async def get_listings(
    crop_name: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get all marketplace listings with optional filters"""
    try:
        query = db.query(MarketplaceListing)
        if crop_name:
            query = query.filter(MarketplaceListing.crop_name == crop_name)
        if location:
            query = query.filter(MarketplaceListing.location == location)
        listings = query.limit(limit).all()
        return [MarketplaceListingResponse(
            id=listing.id,
            crop_name=listing.crop_name,
            quantity=listing.quantity,
            unit=listing.unit,
            price_per_unit=listing.price_per_unit,
            location=listing.location,
            description=listing.description,
            contact=listing.contact,
            images=listing.images.split(",") if listing.images else [],
            created_at=listing.created_at,
            user_id=listing.user_id
        ) for listing in listings]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get listings: {str(e)}")

@router.get("/listings/{listing_id}", response_model=MarketplaceListingResponse)
async def get_listing(
    listing_id: str,
    db: Session = Depends(get_db)
):
    """Get a specific listing"""
    try:
        listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        return MarketplaceListingResponse(
            id=listing.id,
            crop_name=listing.crop_name,
            quantity=listing.quantity,
            unit=listing.unit,
            price_per_unit=listing.price_per_unit,
            location=listing.location,
            description=listing.description,
            contact=listing.contact,
            images=listing.images.split(",") if listing.images else [],
            created_at=listing.created_at,
            user_id=listing.user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get listing: {str(e)}")

@router.put("/listings/{listing_id}", response_model=MarketplaceListingResponse)
async def update_listing(
    listing_id: str,
    listing_update: MarketplaceListingUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a marketplace listing"""
    try:
        listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id, MarketplaceListing.user_id == current_user.id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")

        for var, value in vars(listing_update).items():
            if value is not None:
                setattr(listing, var, value)

        db.commit()
        db.refresh(listing)
        return MarketplaceListingResponse(
            id=listing.id,
            crop_name=listing.crop_name,
            quantity=listing.quantity,
            unit=listing.unit,
            price_per_unit=listing.price_per_unit,
            location=listing.location,
            description=listing.description,
            contact=listing.contact,
            images=listing.images.split(",") if listing.images else [],
            created_at=listing.created_at,
            user_id=listing.user_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update listing: {str(e)}")

@router.delete("/listings/{listing_id}")
async def delete_listing(
    listing_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a marketplace listing"""
    try:
        listing = db.query(MarketplaceListing).filter(MarketplaceListing.id == listing_id, MarketplaceListing.user_id == current_user.id).first()
        if not listing:
            raise HTTPException(status_code=404, detail="Listing not found")
        db.delete(listing)
        db.commit()
        return {"message": "Listing deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete listing: {str(e)}")
