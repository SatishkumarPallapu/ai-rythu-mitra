
from sqlalchemy import Column, String, Float
from sqlalchemy.orm import relationship
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from backend.config.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    phone = Column(String)
    farm_location = Column(String, nullable=True)
    farm_size = Column(Float, nullable=True)

    soil_reports = relationship("SoilReport", back_populates="owner")

class UserRegister(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    farm_location: Optional[str] = None
    farm_size: Optional[float] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    phone: str
    access_token: str
    token_type: str = "bearer"
