from pydantic import BaseModel, EmailStr, Field
from typing import Optional, Literal, Union
from datetime import date, datetime
from enum import Enum

# Enums matching TypeScript types
class UserRole(str, Enum):
    USER = 'user'
    ADMIN = 'admin'
    HOSPITAL = 'hospital'
    BLOOD_BANK = 'blood_bank'
    DONOR = 'donor'

class BloodType(str, Enum):
    A_POS = 'A+'
    A_NEG = 'A-'
    B_POS = 'B+'
    B_NEG = 'B-'
    AB_POS = 'AB+'
    AB_NEG = 'AB-'
    O_POS = 'O+'
    O_NEG = 'O-'

class UrgencyLevel(str, Enum):
    NORMAL = 'normal'
    URGENT = 'urgent'
    CRITICAL = 'critical'

class RequestStatus(str, Enum):
    PENDING = 'pending'
    FULFILLED = 'fulfilled'
    CANCELLED = 'cancelled'

# --- Base Schemas ---

class UserBase(BaseModel):
    email: EmailStr
    role: UserRole


class User(UserBase):
    id: int
    user_id: Optional[Union[str, int]] = None  # Supabase Auth ID (UUID)
    created_at: Optional[datetime] = None


class DonorBase(BaseModel):
    name: str
    blood_type: BloodType
    phone: str
    email: Optional[EmailStr] = None
    city: str
    address: Optional[str] = None
    available: bool = True
    latitude: Optional[float] = None
    longitude: Optional[float] = None

class Donor(DonorBase):
    id: int
    user_id: Optional[Union[str, int]] = None
    last_donation: Optional[date] = None
    created_at: Optional[datetime] = None

class HospitalBase(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    email: Optional[EmailStr] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    emergency_contact: Optional[str] = None
    verified: bool = False

class Hospital(HospitalBase):
    id: int
    user_id: Optional[Union[str, int]] = None
    created_at: Optional[datetime] = None

class BloodBankBase(BaseModel):
    name: str
    address: str
    city: str
    phone: str
    email: Optional[EmailStr] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    operating_hours: Optional[str] = None
    verified: bool = False

class BloodBank(BloodBankBase):
    id: int
    user_id: Optional[Union[str, int]] = None
    created_at: Optional[datetime] = None

class BloodRequestBase(BaseModel):
    hospital_id: Optional[int] = None
    patient_name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    blood_type: BloodType
    units: int
    component_type: Optional[str] = 'Whole Blood'
    urgency: UrgencyLevel
    is_critical: bool = False
    diagnosis: Optional[str] = None
    allergies: Optional[str] = None
    doctor_name: Optional[str] = None
    status: RequestStatus = RequestStatus.PENDING
    contact_phone: Optional[str] = None
    notes: Optional[str] = None

class BloodRequest(BloodRequestBase):
    id: int
    hospital_name: Optional[str] = None
    donor_id: Optional[int] = None
    created_at: Optional[datetime] = None
    fulfilled_at: Optional[datetime] = None

class BloodBatchBase(BaseModel):
    blood_bank_id: int
    blood_type: BloodType
    units: int
    expiry_date: date

class BloodBatch(BloodBatchBase):
    id: int
    created_at: Optional[datetime] = None

# Auth Schemas
class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    name: str # Copied to public.profiles
    role: UserRole = UserRole.USER
    phone: Optional[str] = None
    city: Optional[str] = None
    blood_type: Optional[BloodType] = None

# API Response Schemas
class AuthResponse(BaseModel):
    success: bool
    token: str
    user: User

