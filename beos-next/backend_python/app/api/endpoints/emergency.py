from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.models import schemas
from app.services.emergency_service import EmergencyService
from app.core.security import get_current_user

router = APIRouter()

@router.post("/", response_model=schemas.BloodRequest, status_code=status.HTTP_201_CREATED)
async def create_blood_request(
    request: schemas.BloodRequestBase,
    current_user = Depends(get_current_user)
):
    """
    Create a new emergency blood request.
    Restricted to Hospital/Admin roles (checked via RLS or policy in real deployment).
    """
    user_id = current_user.id
    return await EmergencyService.create_request(request, user_id)

@router.get("/", response_model=List[schemas.BloodRequest])
async def list_requests(
    hospital_id: Optional[int] = None,
    status: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    List blood requests. 
    Hospitals see their own, Donors see all active ones (filtered by policy).
    """
    return await EmergencyService.get_requests(hospital_id, status)

@router.get("/{request_id}", response_model=schemas.BloodRequest)
async def get_request_details(
    request_id: int,
    current_user = Depends(get_current_user)
):
    """
    Get details of a specific request.
    """
    req = await EmergencyService.get_request_by_id(request_id)
    if not req:
        raise HTTPException(status_code=404, detail="Request not found")
    return req

@router.patch("/{request_id}/status", response_model=schemas.BloodRequest)
async def update_request_status(
    request_id: int,
    status_update: schemas.RequestStatus,
    current_user = Depends(get_current_user)
):
    """
    Update request status (e.g., fulfill or cancel).
    """
    return await EmergencyService.update_status(request_id, status_update.value)
