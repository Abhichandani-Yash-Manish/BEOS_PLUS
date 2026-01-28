from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class HospitalBase(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emergency_contact: Optional[str] = None
    verified: bool = False

class HospitalCreate(HospitalBase):
    pass

class HospitalUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emergency_contact: Optional[str] = None

class HospitalResponse(HospitalBase):
    id: int
    user_id: Optional[UUID] = None

    class Config:
        from_attributes = True
