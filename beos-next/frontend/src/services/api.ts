import { 
    Donor, Hospital, BloodBank, BloodRequest, AuthResponse, User 
} from '../types/models';
import { API_URL } from '../config';

async function fetchAPI<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers as any,
    };

    const config: RequestInit = {
        ...options,
        headers,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || 'API request failed');
    }

    return data as T;
}

// Interface for API responses that wrap data
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    user?: User; // specific for some endpoints
}

// Dashboard
export const getDashboard = () => fetchAPI<any>('/dashboard'); // Likely needs implementation on backend or mapped to stats

// Donors
export const getDonors = (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI<Donor[]>(`/donors${queryString ? `?${queryString}` : ''}`);
};

export const getMyDonorProfile = () => fetchAPI<Donor>('/donors/me');

export const getDonorStats = () => fetchAPI<any>('/donors/stats');

export const getDonorById = (id: string | number) => fetchAPI<Donor>(`/donors/${id}`);

export const getDonorsByBloodType = (bloodType: string) => fetchAPI<Donor[]>(`/donors/blood-type/${bloodType}`);

export const createDonor = (donor: Partial<Donor>) => fetchAPI<Donor>('/donors', {
    method: 'POST',
    body: JSON.stringify(donor),
});

export const updateDonor = (id: string | number, donor: Partial<Donor>) => fetchAPI<Donor>(`/donors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(donor),
});

export const deleteDonor = (id: string | number) => fetchAPI<{ success: boolean }>(`/donors/${id}`, {
    method: 'DELETE',
});

// Hospitals
export const getHospitals = (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI<Hospital[]>(`/hospitals${queryString ? `?${queryString}` : ''}`);
};

export const getMyHospitalProfile = () => fetchAPI<Hospital>('/hospitals/me');

export const getHospitalById = (id: string | number) => fetchAPI<Hospital>(`/hospitals/${id}`);

export const createHospital = (hospital: Partial<Hospital>) => fetchAPI<Hospital>('/hospitals', {
    method: 'POST',
    body: JSON.stringify(hospital),
});

// Blood Banks
export const getBloodBanks = (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI<BloodBank[]>(`/blood-banks${queryString ? `?${queryString}` : ''}`);
};

export const getBloodBankById = (id: string | number) => fetchAPI<BloodBank>(`/blood-banks/${id}`);

export const getTotalInventory = () => fetchAPI<any>('/blood-banks/inventory/total');

export const findBloodBanksByType = (bloodType: string, minUnits = 1) =>
    fetchAPI<BloodBank[]>(`/blood-banks/search/${bloodType}?minUnits=${minUnits}`);

export const updateBloodBankInventory = (id: string | number, bloodType: string, units: number) =>
    fetchAPI<any>(`/blood-banks/${id}/inventory`, {
        method: 'PUT',
        body: JSON.stringify({ blood_type: bloodType, units }),
    });

// Blood Requests (Emergency)
// Backend router is at /emergency
export const getRequests = (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return fetchAPI<BloodRequest[]>(`/emergency${queryString ? `?${queryString}` : ''}`);
};

// These specific endpoints don't exist in emergency.py yet, mapping to generic list with filters for now
export const getMyDonationHistory = () => fetchAPI<any>('/emergency?my_history=true');

export const getRequestStats = () => fetchAPI<any>('/emergency/stats'); // Needs backend impl

export const getPendingRequests = () => fetchAPI<BloodRequest[]>('/emergency?status=pending');

export const getCriticalRequests = () => fetchAPI<BloodRequest[]>('/emergency?urgency=critical');

export const getRequestById = (id: string | number) => fetchAPI<BloodRequest>(`/emergency/${id}`);

export const createRequest = (request: Partial<BloodRequest>) => fetchAPI<BloodRequest>('/emergency', {
    method: 'POST',
    body: JSON.stringify(request),
});

export const updateRequest = (id: string | number, request: Partial<BloodRequest>) => fetchAPI<BloodRequest>(`/emergency/${id}`, {
    method: 'PUT',
    body: JSON.stringify(request),
});

export const fulfillRequest = (id: string | number) => fetchAPI<BloodRequest>(`/emergency/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'fulfilled' }),
});

export const cancelRequest = (id: string | number) => fetchAPI<BloodRequest>(`/emergency/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'cancelled' }),
});

// Auth
export const login = (credentials: any) => fetchAPI<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
});

export const register = (userData: any) => fetchAPI<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
});

export const getMe = () => fetchAPI<{ success: boolean; user: User }>('/auth/me');

// Blood Banks specific
export const getFloodBanks = getBloodBanks; // Alias kept for compatibility
export const getMyBloodBankProfile = () => fetchAPI<BloodBank>('/blood-banks/me');

export const getBatches = () => fetchAPI<any>('/blood-banks/inventory/batches');

export const addBatch = (data: any) => fetchAPI<any>('/blood-banks/inventory/batches', {
    method: 'POST',
    body: JSON.stringify(data)
});

export const updateBatch = (id: string | number, data: any) => fetchAPI<any>(`/blood-banks/inventory/batches/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
});

export const deleteBatch = (id: string | number) => fetchAPI<any>(`/blood-banks/inventory/batches/${id}`, {
    method: 'DELETE'
});

// Admin Services
export const getAdminStats = () => fetchAPI<any>('/admin/stats');
export const getAllUsers = () => fetchAPI<User[]>('/admin/users');
export const deleteUser = (id: string | number) => fetchAPI<any>(`/admin/users/${id}`, { method: 'DELETE' });

export default {
    login,
    register,
    getMe,
    getMyDonorProfile,
    getDashboard,
    getDonors,
    getDonorStats,
    getDonorById,
    getDonorsByBloodType,
    createDonor,
    updateDonor,
    deleteDonor,
    getHospitals,
    getHospitalById,
    getMyHospitalProfile,
    createHospital,
    getBloodBanks,
    getBloodBankById,
    getTotalInventory,
    findBloodBanksByType,
    updateBloodBankInventory,
    getRequests,
    getMyDonationHistory,
    getRequestStats,
    getPendingRequests,
    getCriticalRequests,
    getRequestById,
    createRequest,
    updateRequest,
    fulfillRequest,
    cancelRequest,
    getMyBloodBankProfile,
    getBatches,
    addBatch,
    updateBatch,
    deleteBatch,
    getAdminStats,
    getAllUsers,
    deleteUser
};
