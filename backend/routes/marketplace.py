from fastapi import APIRouter, HTTPException, Depends
from datetime import datetime
from typing import Optional
from models.marketplace import MarketplaceListing, MarketplaceResponse
from config.firebase_config import get_firestore_db
from routes.auth import get_current_user

router = APIRouter()

@router.post("/listings")
async def create_listing(
    listing: MarketplaceListing,
    user_id: str = Depends(get_current_user)
):
    """Create a new marketplace listing"""
    db = get_firestore_db()
    
    try:
        listing_data = {
            "user_id": user_id,
            "crop_name": listing.crop_name,
            "quantity": listing.quantity,
            "unit": listing.unit,
            "price_per_unit": listing.price_per_unit,
            "location": listing.location,
            "description": listing.description,
            "contact": listing.contact,
            "images": listing.images or [],
            "status": "active",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        doc_ref = db.collection('marketplace').add(listing_data)
        
        return {
            "listing_id": doc_ref[1].id,
            "status": "created",
            "created_at": listing_data["created_at"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create listing: {str(e)}")

@router.get("/listings")
async def get_listings(
    crop_name: Optional[str] = None,
    location: Optional[str] = None,
    limit: int = 50
):
    """Get all marketplace listings with optional filters"""
    db = get_firestore_db()
    
    try:
        query = db.collection('marketplace').where('status', '==', 'active')
        
        if crop_name:
            query = query.where('crop_name', '==', crop_name)
        if location:
            query = query.where('location', '==', location)
        
        query = query.order_by('created_at', direction='DESCENDING').limit(limit)
        listings = query.get()
        
        result = []
        for listing in listings:
            listing_data = listing.to_dict()
            listing_data['id'] = listing.id
            result.append(listing_data)
        
        return {"listings": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/listings/{listing_id}")
async def get_listing(listing_id: str):
    """Get a specific listing"""
    db = get_firestore_db()
    
    try:
        listing_doc = db.collection('marketplace').document(listing_id).get()
        
        if not listing_doc.exists:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        listing_data = listing_doc.to_dict()
        listing_data['id'] = listing_id
        
        return listing_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/listings/{listing_id}")
async def update_listing(
    listing_id: str,
    listing: MarketplaceListing,
    user_id: str = Depends(get_current_user)
):
    """Update a marketplace listing"""
    db = get_firestore_db()
    
    try:
        listing_ref = db.collection('marketplace').document(listing_id)
        listing_doc = listing_ref.get()
        
        if not listing_doc.exists:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        existing_data = listing_doc.to_dict()
        if existing_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        update_data = listing.dict(exclude_unset=True)
        update_data['updated_at'] = datetime.utcnow().isoformat()
        
        listing_ref.update(update_data)
        
        return {"status": "updated", "listing_id": listing_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/listings/{listing_id}")
async def delete_listing(
    listing_id: str,
    user_id: str = Depends(get_current_user)
):
    """Delete/deactivate a marketplace listing"""
    db = get_firestore_db()
    
    try:
        listing_ref = db.collection('marketplace').document(listing_id)
        listing_doc = listing_ref.get()
        
        if not listing_doc.exists:
            raise HTTPException(status_code=404, detail="Listing not found")
        
        existing_data = listing_doc.to_dict()
        if existing_data['user_id'] != user_id:
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        listing_ref.update({
            "status": "deleted",
            "updated_at": datetime.utcnow().isoformat()
        })
        
        return {"status": "deleted", "listing_id": listing_id}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/my-listings")
async def get_my_listings(user_id: str = Depends(get_current_user)):
    """Get listings created by the current user"""
    db = get_firestore_db()
    
    try:
        listings_ref = db.collection('marketplace').where('user_id', '==', user_id).order_by('created_at', direction='DESCENDING')
        listings = listings_ref.get()
        
        result = []
        for listing in listings:
            listing_data = listing.to_dict()
            listing_data['id'] = listing.id
            result.append(listing_data)
        
        return {"listings": result, "count": len(result)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
