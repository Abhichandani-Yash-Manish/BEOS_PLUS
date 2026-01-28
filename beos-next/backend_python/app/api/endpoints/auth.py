from fastapi import APIRouter, Depends
from app.models import schemas
from app.services.auth_service import AuthService
from app.core.security import get_current_user

router = APIRouter()

@router.post("/login", response_model=schemas.AuthResponse)
async def login(credentials: schemas.UserLogin):
    return await AuthService.login(credentials)

@router.post("/register", response_model=schemas.AuthResponse)
async def register(data: schemas.UserRegister):
    return await AuthService.register(data)

@router.get("/me")
async def get_current_user_profile(current_user = Depends(get_current_user)):
    # current_user is the Supabase User object
    return {"success": True, "user": {"id": 1, "user_id": current_user.id, "email": current_user.email}}
