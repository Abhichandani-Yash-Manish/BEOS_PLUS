from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.models import schemas
from app.services.donor_service import DonorService
from app.core.security import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Donor])
async def search_donors(
    city: Optional[str] = None, 
    blood_type: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Search for donors by city or blood type.
    Authentication required.
    """
    return await DonorService.get_donors(city, blood_type)

@router.post("/", response_model=schemas.Donor, status_code=status.HTTP_201_CREATED)
async def register_as_donor(
    donor: schemas.DonorBase, 
    current_user = Depends(get_current_user)
):
    """
    Register the current user as a donor.
    """
    # Extract user ID from Supabase Auth (UUID)
    user_id = current_user.id
    
    return await DonorService.create_donor(donor, user_id=user_id)

@router.get("/me", response_model=Optional[schemas.Donor])
async def get_my_donor_profile(
    current_user = Depends(get_current_user)
):
    """
    Get the donor profile for the logged-in user.
    """
    user_id = current_user.id
    profile = await DonorService.get_my_profile(user_id)
    # If no profile exists, return None (200 OK with null body) or 404
    if not profile:
        raise HTTPException(status_code=404, detail="Donor profile not found")
    return profile

@router.patch("/{donor_id}/status", response_model=schemas.Donor)
async def update_availability(
    donor_id: int,
    available: bool,
    current_user = Depends(get_current_user)
):
    """
    Toggle availability status.
    """
    user_id = current_user.id
    return await DonorService.update_status(donor_id, available, user_id)
