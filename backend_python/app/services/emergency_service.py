from app.core.database import get_supabase
from app.models import schemas
from typing import List, Optional
from datetime import datetime
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

class EmergencyService:
    @staticmethod
    async def create_request(request_data: schemas.BloodRequestBase, user_id: int) -> schemas.BloodRequest:
        supabase = get_supabase()
        if not supabase:
             raise HTTPException(status_code=503, detail="Database unavailable")

        # In a real system, we'd lookup the hospital_id associated with this user_id
        # For MVP, we assume the user IS the hospital rep or has a linked hospital_id
        # We'll use a mock hospital ID or trust the input if we were admins
        
        # Override simple logic:
        data = request_data.model_dump()
        data["created_at"] = datetime.utcnow().isoformat()
        
        try:
            response = supabase.table("blood_requests").insert(data).execute()
            if not response.data:
                raise HTTPException(status_code=400, detail="Failed to create request")
            return response.data[0]
        except Exception as e:
            logger.error(f"Error creating request: {str(e)}")
            raise HTTPException(status_code=500, detail="Database insert failed")

    @staticmethod
    async def get_requests(hospital_id: Optional[int] = None, status: Optional[str] = None) -> List[schemas.BloodRequest]:
        supabase = get_supabase()
        if not supabase:
            return []
            
        query = supabase.table("blood_requests").select("*")
        if hospital_id:
            query = query.eq("hospital_id", hospital_id)
        if status:
            query = query.eq("status", status)
            
        try:
            response = query.order("created_at", desc=True).execute()
            return response.data
        except Exception as e:
            logger.error(f"Error fetching requests: {str(e)}")
            raise HTTPException(status_code=500, detail="Database query failed")

    @staticmethod
    async def get_request_by_id(request_id: int) -> Optional[schemas.BloodRequest]:
        supabase = get_supabase()
        if not supabase:
            return None
            
        try:
            response = supabase.table("blood_requests").select("*").eq("id", request_id).single().execute()
            return response.data
        except Exception as e:
            return None

    @staticmethod
    async def update_status(request_id: int, status: str) -> schemas.BloodRequest:
        supabase = get_supabase()
        if not supabase:
             raise HTTPException(status_code=503, detail="Database unavailable")
            
        update_data = {"status": status}
        if status == "fulfilled":
            update_data["fulfilled_at"] = datetime.utcnow().isoformat()

        try:
            response = supabase.table("blood_requests").update(update_data).eq("id", request_id).execute()
            if not response.data:
                raise HTTPException(status_code=404, detail="Request not found")
            return response.data[0]
        except Exception as e:
            logger.error(f"Error updating request: {str(e)}")
            raise HTTPException(status_code=500, detail="Database update failed")
