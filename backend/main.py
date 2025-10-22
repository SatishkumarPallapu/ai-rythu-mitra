
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

from routes import auth, soil, crops, iot, marketplace, notifications, reports
from config.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Rythu Mitra API",
    description="Backend API for AI-powered farmer assistance",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create uploads directory if it doesn't exist
os.makedirs("uploads", exist_ok=True)

# Mount static files for uploads
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Include routers
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(soil.router, prefix="/soil", tags=["Soil Analysis"])
app.include_router(crops.router, prefix="/crops", tags=["Crops"])
app.include_router(iot.router, prefix="/iot", tags=["IoT Data"])
app.include_router(marketplace.router, prefix="/marketplace", tags=["Marketplace"])
app.include_router(notifications.router, prefix="/notifications", tags=["Notifications"])
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

@app.get("/")
async def root():
    return {
        "message": "AI Rythu Mitra API",
        "version": "1.0.0",
        "status": "active"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
