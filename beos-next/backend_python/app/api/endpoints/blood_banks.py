from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
from app.services.blood_bank_service import BloodBankService
from app.models.blood_bank_models import (
    BloodBankCreate, BloodBankUpdate, BloodBankResponse,
    BloodInventoryUpdate, BloodBatchCreate, BloodBatchResponse
)
from app.services.auth import get_current_user
from supabase import Client
from app.api.endpoints.auth import get_supabase_client

router = APIRouter()

def get_blood_bank_service(supabase: Client = Depends(get_supabase_client)) -> BloodBankService:
    return BloodBankService(supabase)

# --- Public Endpoints ---

@router.get("/", response_model=List[BloodBankResponse])
def read_blood_banks(
    city: Optional[str] = None,
    service: BloodBankService = Depends(get_blood_bank_service)
):
    return service.get_blood_banks(city=city)

@router.get("/search/{blood_type}", response_model=List[BloodBankResponse])
def search_blood_banks(
    blood_type: str,
    minUnits: int = Query(1, alias="minUnits"),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    return service.get_blood_banks(blood_type=blood_type, min_units=minUnits)

@router.get("/inventory/total")
def get_total_inventory(service: BloodBankService = Depends(get_blood_bank_service)):
    return service.get_total_inventory_stats()

@router.get("/{bank_id}", response_model=BloodBankResponse)
def read_blood_bank(
    bank_id: int,
    service: BloodBankService = Depends(get_blood_bank_service)
):
    bank = service.get_blood_bank_by_id(bank_id)
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank not found")
    return bank

@router.get("/{bank_id}/inventory")
def read_inventory(
    bank_id: int,
    service: BloodBankService = Depends(get_blood_bank_service)
):
    return service.get_inventory(bank_id)

# --- Protected Endpoints ---

@router.get("/me", response_model=BloodBankResponse)
def read_blood_bank_me(
    current_user: dict = Depends(get_current_user),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    user_id = current_user.get("sub") or current_user.get("id")
    bank = service.get_blood_bank_by_user_id(user_id)
    if not bank:
        raise HTTPException(status_code=404, detail="Profile not found")
    return bank

@router.post("/", response_model=BloodBankResponse, status_code=status.HTTP_201_CREATED)
def create_blood_bank_profile(
    bank: BloodBankCreate,
    current_user: dict = Depends(get_current_user),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    user_id = current_user.get("sub") or current_user.get("id")
    # check existing
    try:
        if service.get_blood_bank_by_user_id(user_id):
             raise HTTPException(status_code=400, detail="Profile already exists")
    except:
        pass
    return service.create_blood_bank(bank, user_id)

@router.put("/{bank_id}/inventory")
def update_inventory_manual(
    bank_id: int,
    inventory: BloodInventoryUpdate,
    current_user: dict = Depends(get_current_user),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    # Auth check: only owner
    user_id = current_user.get("sub") or current_user.get("id")
    bank = service.get_blood_bank_by_id(bank_id)
    if not bank or str(bank['user_id']) != str(user_id):
        raise HTTPException(status_code=403, detail="Not authorized")
        
    return service.update_inventory(bank_id, inventory)

@router.post("/inventory/batches", response_model=BloodBatchResponse)
def add_inventory_batch(
    batch: BloodBatchCreate,
    current_user: dict = Depends(get_current_user),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    user_id = current_user.get("sub") or current_user.get("id")
    bank = service.get_blood_bank_by_user_id(user_id)
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank profile required")
        
    return service.add_batch(bank['id'], batch)

@router.get("/inventory/batches")
def get_my_batches(
    current_user: dict = Depends(get_current_user),
    service: BloodBankService = Depends(get_blood_bank_service)
):
    user_id = current_user.get("sub") or current_user.get("id")
    bank = service.get_blood_bank_by_user_id(user_id)
    if not bank:
        raise HTTPException(status_code=404, detail="Blood bank profile required")
    
    return service.get_batches(bank['id'])
