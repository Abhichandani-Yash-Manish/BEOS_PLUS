from app.core.database import get_supabase
from app.models import schemas
from typing import List, Optional
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class DonorService:
    @staticmethod
    async def get_donors(city: Optional[str] = None, blood_type: Optional[str] = None) -> List[schemas.Donor]:
        supabase = get_supabase()
        if not supabase:
            return []
        
        query = supabase.table("donors").select("*")
        if city:
            query = query.eq("city", city)
        if blood_type:
            query = query.eq("blood_type", blood_type)
        
        try:
            response = query.execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching donors: {str(e)}")
            raise HTTPException(status_code=500, detail="Database query failed")

    @staticmethod
    async def create_donor(donor_data: schemas.DonorBase, user_id: int) -> schemas.Donor:
        supabase = get_supabase()
        if not supabase:
            raise HTTPException(status_code=503, detail="Database unavailable")
            
        data = donor_data.model_dump()
        data["user_id"] = user_id
        
        try:
            response = supabase.table("donors").insert(data).execute()
            if not response.data:
                raise HTTPException(status_code=400, detail="Failed to create donor")
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating donor: {str(e)}")
            raise HTTPException(status_code=500, detail="Database insert failed")

    @staticmethod
    async def get_my_profile(user_id: int) -> Optional[schemas.Donor]:
        supabase = get_supabase()
        if not supabase:
            return None
            
        try:
            response = supabase.table("donors").select("*").eq("user_id", user_id).single().execute()
            return response.data
        except Exception as e:
             # Supabase single() raises error if no row found, catch it gracefully
            return None

    @staticmethod
    async def update_status(donor_id: int, available: bool, user_id: int) -> schemas.Donor:
        supabase = get_supabase()
        if not supabase:
             raise HTTPException(status_code=503, detail="Database unavailable")
            
        try:
            # Check ownership via user_id implicitly or RLS
            response = supabase.table("donors").update({"available": available}).eq("id", donor_id).eq("user_id", user_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Donor not found or unauthorized")
            return response.data[0]
        except Exception as e:
             logger.error(f"Error updating donor: {str(e)}")
             raise HTTPException(status_code=500, detail=str(e))
