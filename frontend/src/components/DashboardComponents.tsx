import React, { useState } from 'react';
import { Donor, BloodRequest } from '../types/models';

interface AvailabilityToggleProps {
    available: boolean;
    onToggle: (checked: boolean) => void;
    loading?: boolean;
}

export const AvailabilityToggle: React.FC<AvailabilityToggleProps> = ({ available, onToggle, loading }) => {
    return (
        <div className="availability-toggle glass-card">
            <div>
                <p className="toggle-label">Available to Donate</p>
                <p className="text-sm text-gray-400">
                    {available
                        ? "You are visible to hospitals and blood banks."
                        : "You are currently hidden from search results."}
                </p>
            </div>
            <label className="switch">
                <input
                    type="checkbox"
                    checked={available}
                    onChange={(e) => onToggle(e.target.checked)}
                    disabled={loading}
                />
                <span className="slider round"></span>
            </label>
        </div>
    );
};

interface ProfileEditorProps {
    profile: Donor | null;
    onSave: (data: Partial<Donor>) => void;
    loading?: boolean;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onSave, loading }) => {
    // Safe default: return null if profile is missing
    if (!profile) {
        return null;
    }

    const [formData, setFormData] = useState({
        name: profile.name || '',
        phone: profile.phone || '',
        city: profile.city || '',
        address: profile.address || '',
        blood_type: profile.blood_type || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="profile-form">
            <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                        type="text"
                        name="name"
                        className="form-input"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">Blood Type</label>
                    <select
                        name="blood_type"
                        className="form-select"
                        value={formData.blood_type}
                        onChange={handleChange}
                        disabled // Usually changing blood type requires verification
                    >
                        <option value={formData.blood_type}>{formData.blood_type}</option>
                    </select>
                </div>
                <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                        type="tel"
                        name="phone"
                        className="form-input"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label className="form-label">City</label>
                    <input
                        type="text"
                        name="city"
                        className="form-input"
                        value={formData.city}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label">Address (Optional)</label>
                    <textarea
                        name="address"
                        className="form-textarea"
                        value={formData.address}
                        onChange={handleChange}
                        rows={2}
                    />
                </div>
            </div>
            <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-400">Blood type cannot be changed. Contact support for assistance.</p>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </form>
    );
};

interface RequestCardProps {
    request: BloodRequest | null;
    onFulfill: (id: number) => void;
}

export const RequestCard: React.FC<RequestCardProps> = ({ request, onFulfill }) => {
    // Safe default: return null if request is missing
    if (!request) {
        return null;
    }

    return (
        <div className={`glass-card request-card ${request.urgency}`}>
            <div className="request-info">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`badge badge-${request.urgency}`}>{request.urgency}</span>
                    <span className="text-sm text-gray-400">#{request.id}</span>
                    <span className="text-sm text-gray-400">• {request.created_at ? new Date(request.created_at).toLocaleDateString() : 'Unknown Date'}</span>
                </div>
                <h4>{request.units} Unit{request.units > 1 ? 's' : ''} of {request.blood_type} Blood Required</h4>
                <div className="request-meta">
                    <span className="request-hospital">🏥 {request.hospital_name}, {
                        // @ts-ignore - hospital_city might not be in the stricter type if it was ad-hoc but api.ts uses generic or any for some joins
                        request.hospital_city || 'Unknown City'
                    }</span>
                    <span>📞 {request.contact_phone || 'Contact Hospital'}</span>
                </div>
                {request.notes && <p className="text-sm text-gray-400 mt-2">Note: {request.notes}</p>}
            </div>
            <div className="request-actions">
                {request.status === 'pending' ? (
                    <button className="btn btn-primary" onClick={() => onFulfill(request.id)}>
                        I Can Donating
                    </button>
                ) : (
                    <span className="badge badge-fulfilled">Fulfilled</span>
                )}
            </div>
        </div>
    );
};
