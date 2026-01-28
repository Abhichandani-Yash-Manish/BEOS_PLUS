from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional
from app.services.hospital_service import HospitalService
from app.models.hospital_models import HospitalCreate, HospitalUpdate, HospitalResponse
from app.services.auth import get_current_user
from supabase import Client
from app.api.endpoints.auth import get_supabase_client

router = APIRouter()

def get_hospital_service(supabase: Client = Depends(get_supabase_client)) -> HospitalService:
    return HospitalService(supabase)

@router.get("/", response_model=List[HospitalResponse])
def read_hospitals(
    city: Optional[str] = None,
    verified: Optional[bool] = None,
    service: HospitalService = Depends(get_hospital_service)
):
    """
    Retrieve hospitals with optional filtering by city and verification status.
    """
    return service.get_hospitals(city=city, verified=verified)

@router.get("/me", response_model=HospitalResponse)
def read_hospital_me(
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service)
):
    """
    Get current logged-in hospital's profile.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
        
    hospital = service.get_hospital_by_user_id(user_id)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital profile not found")
    return hospital

@router.get("/{hospital_id}", response_model=HospitalResponse)
def read_hospital(
    hospital_id: int,
    service: HospitalService = Depends(get_hospital_service)
):
    """
    Get a specific hospital by ID.
    """
    hospital = service.get_hospital_by_id(hospital_id)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    return hospital

@router.post("/", response_model=HospitalResponse, status_code=status.HTTP_201_CREATED)
def create_hospital_profile(
    hospital: HospitalCreate,
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service)
):
    """
    Create a new hospital profile for the current user.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="Could not validate credentials")
    
    # Check if profile already exists
    existing = None
    try:
        existing = service.get_hospital_by_user_id(user_id)
    except Exception:
        pass
    
    if existing:
        raise HTTPException(status_code=400, detail="Hospital profile already exists for this user")

    return service.create_hospital(hospital, user_id)

@router.put("/{hospital_id}", response_model=HospitalResponse)
def update_hospital_profile(
    hospital_id: int,
    hospital_update: HospitalUpdate,
    current_user: dict = Depends(get_current_user),
    service: HospitalService = Depends(get_hospital_service)
):
    """
    Update a hospital profile. 
    NOTE: In production, verify that current_user.id owns this hospital_id or is admin.
    """
    user_id = current_user.get("sub") or current_user.get("id")
    
    # Basic authorization check
    hospital = service.get_hospital_by_id(hospital_id)
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
        
    # Strictly we should check if hospital['user_id'] == user_id
    # Assuming user_id is consistent string in both auth and db
    if str(hospital['user_id']) != str(user_id): 
         # Allow admin bypass in future, for now strict owner check
         raise HTTPException(status_code=403, detail="Not authorized to update this profile")

    return service.update_hospital(hospital_id, hospital_update)
