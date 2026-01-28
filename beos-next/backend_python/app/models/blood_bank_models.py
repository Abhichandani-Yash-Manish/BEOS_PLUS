from pydantic import BaseModel, root_validator
from typing import Optional, List
from datetime import date
from uuid import UUID

# Blood Bank Models
class BloodBankBase(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    operating_hours: Optional[str] = None
    verified: bool = False

class BloodBankCreate(BloodBankBase):
    pass

class BloodBankUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    operating_hours: Optional[str] = None

class BloodBankResponse(BloodBankBase):
    id: int
    user_id: Optional[UUID] = None

    class Config:
        from_attributes = True

# Inventory Models
class BloodInventoryUpdate(BaseModel):
    blood_type: str
    units: int

class BloodInventoryResponse(BaseModel):
    id: int
    blood_bank_id: int
    blood_type: str
    units: int
    updated_at: str

    class Config:
        from_attributes = True

# Batch Models
class BloodBatchCreate(BaseModel):
    blood_type: str
    units: int
    expiry_date: date

class BloodBatchResponse(BaseModel):
    id: int
    blood_bank_id: int
    blood_type: str
    units: int
    expiry_date: date
    created_at: str

    class Config:
        from_attributes = True
