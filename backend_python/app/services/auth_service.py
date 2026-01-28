from app.core.database import get_supabase
from app.models import schemas
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class AuthService:
    @staticmethod
    async def login(credentials: schemas.UserLogin) -> schemas.AuthResponse:
        supabase = get_supabase()
        if not supabase:
             raise HTTPException(status_code=503, detail="Auth service unavailable")

        try:
            # Supabase Auth Login
            response = supabase.auth.sign_in_with_password({
                "email": credentials.email,
                "password": credentials.password
            })
            
            if not response.user or not response.session:
                 raise HTTPException(status_code=401, detail="Invalid credentials")

            # Get user details from public.users (or sync if needed)
            # For MVP, we'll construct the User object from auth metadata + public query
            user_auth_id = response.user.id
            
            # TODO: Sync user to public.users if not exists (should be trigger)
            
            # Mock return for now since we haven't set up the trigger
            user = schemas.User(
                id=1, # This should be the BIGINT from public.users
                user_id=user_auth_id,
                email=credentials.email,
                role=response.user.user_metadata.get('role', 'user')
            )
            
            return schemas.AuthResponse(
                success=True,
                token=response.session.access_token,
                user=user
            )
            
        except Exception as e:
            logger.error(f"Login error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def register(data: schemas.UserRegister) -> schemas.AuthResponse:
        supabase = get_supabase()
        if not supabase:
             raise HTTPException(status_code=503, detail="Auth service unavailable")

        try:
            # Supabase Auth Register
            response = supabase.auth.sign_up({
                "email": data.email,
                "password": data.password,
                "options": {
                    "data": {
                        "name": data.name,
                        "role": data.role,
                        "phone": data.phone,
                        "city": data.city,
                        "blood_type": data.blood_type
                    }
                }
            })
            
            if not response.user:
                 raise HTTPException(status_code=400, detail="Registration failed")
                 
            # Note: triggers should handle insertion into public tables (donors, users etc)
            
            user = schemas.User(
                id=1, # Placeholder
                user_id=response.user.id,
                email=data.email,
                role=data.role
            )
            
            # If email confirmation is enabled, session might be None
            token = response.session.access_token if response.session else "pending_confirmation"

            return schemas.AuthResponse(
                success=True,
                token=token,
                user=user
            )

        except Exception as e:
            logger.error(f"Registration error: {str(e)}")
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def get_me(user_id: str) -> schemas.User:
        supabase = get_supabase()
        # In real app, query public.users using user_id (UUID)
        return schemas.User(
             id=1, 
             user_id=user_id,
             email="current@user.com", # Should fetch from DB
             role="user"
        )
