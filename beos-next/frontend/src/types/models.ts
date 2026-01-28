export type BloodType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type UrgencyLevel = 'normal' | 'urgent' | 'critical';
export type RequestStatus = 'pending' | 'fulfilled' | 'cancelled';
export type UserRole = 'user' | 'admin' | 'hospital' | 'blood_bank' | 'donor';

export interface User {
    id: number;
    email: string;
    role: UserRole;
    created_at?: string;
}

export interface Donor {
    id: number;
    user_id?: number | null;
    name: string;
    blood_type: BloodType;
    phone: string;
    email?: string;
    city: string;
    address?: string;
    available: boolean; // mapped from INTEGER 0/1
    latitude?: number;
    longitude?: number;
    last_donation?: string;
    created_at?: string;
}

export interface Hospital {
    id: number;
    user_id?: number | null;
    name: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    emergency_contact?: string;
    verified: boolean;
    created_at?: string;
}

export interface BloodBank {
    id: number;
    user_id?: number | null;
    name: string;
    address: string;
    city: string;
    phone: string;
    email?: string;
    latitude?: number;
    longitude?: number;
    operating_hours?: string;
    verified: boolean;
    created_at?: string;
}

export interface BloodRequest {
    id: number;
    hospital_id?: number;
    hospital_name?: string; // Often joined in API responses
    donor_id?: number | null;
    patient_name?: string;
    age?: number;
    gender?: string;
    blood_type: BloodType;
    units: number;
    component_type?: string;
    urgency: UrgencyLevel;
    is_critical?: boolean; // mapped from INTEGER
    diagnosis?: string;
    allergies?: string;
    doctor_name?: string;
    status: RequestStatus;
    contact_phone?: string;
    notes?: string;
    created_at?: string;
    fulfilled_at?: string;
}

export interface BloodInventory {
    id: number;
    blood_bank_id: number;
    blood_type: BloodType;
    units: number;
    updated_at?: string;
}

export interface BloodBatch {
    id: number;
    blood_bank_id: number;
    blood_type: BloodType;
    units: number;
    expiry_date: string;
    created_at: string;
}

export interface AuthResponse {
    success: boolean;
    token: string;
    user: {
        id: number;
        email: string;
        role: UserRole;
        profileId?: number;
    };
}
