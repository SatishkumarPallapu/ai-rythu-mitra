from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from models.user import UserRegister, UserLogin, UserResponse
from config.firebase_config import get_firestore_db
from config.settings import settings

router = APIRouter()
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication credentials")

@router.post("/register", response_model=UserResponse)
async def register(user: UserRegister):
    db = get_firestore_db()
    
    try:
        # Check if user exists
        users_ref = db.collection('users')
        existing_user = users_ref.where('email', '==', user.email).limit(1).get()
        
        if len(list(existing_user)) > 0:
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Hash password
        hashed_password = get_password_hash(user.password)
        
        # Create user document
        user_data = {
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "password": hashed_password,
            "created_at": datetime.utcnow().isoformat(),
            "farm_location": user.farm_location,
            "farm_size": user.farm_size
        }
        
        doc_ref = users_ref.add(user_data)
        user_id = doc_ref[1].id
        
        # Generate token
        access_token = create_access_token(data={"sub": user_id})
        
        return {
            "id": user_id,
            "name": user.name,
            "email": user.email,
            "phone": user.phone,
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Registration failed: {str(e)}")

@router.post("/login", response_model=UserResponse)
async def login(user: UserLogin):
    db = get_firestore_db()
    
    try:
        users_ref = db.collection('users')
        user_docs = users_ref.where('email', '==', user.email).limit(1).get()
        user_list = list(user_docs)
        
        if len(user_list) == 0:
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        user_doc = user_list[0]
        user_data = user_doc.to_dict()
        
        if not verify_password(user.password, user_data['password']):
            raise HTTPException(status_code=401, detail="Invalid email or password")
        
        access_token = create_access_token(data={"sub": user_doc.id})
        
        return {
            "id": user_doc.id,
            "name": user_data['name'],
            "email": user_data['email'],
            "phone": user_data.get('phone', ''),
            "access_token": access_token,
            "token_type": "bearer"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Login failed: {str(e)}")

@router.get("/me")
async def get_me(user_id: str = Depends(get_current_user)):
    db = get_firestore_db()
    
    try:
        user_doc = db.collection('users').document(user_id).get()
        
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_data = user_doc.to_dict()
        user_data.pop('password', None)
        
        return {"id": user_id, **user_data}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
