import React, { useState, useEffect } from 'react';
import {
    getMyHospitalProfile,
    createRequest,
    getRequests,
    cancelRequest,
    fulfillRequest,
    getDonors
} from '../services/api';
// @ts-ignore
import { useToast } from '../context/ToastContext';
// @ts-ignore
import { useSocket } from '../context/SocketContext';
import { RequestForm, ActiveRequestsList, MatchedDonors, BloodInventoryGrid } from '../components/HospitalComponents';
import { LiveRequestTracker, MassCasualtyTrigger, HospitalStatsGrid } from '../components/LiveRequestTracker';
import { BloodRequest, Donor, Hospital } from '../types/models';
import './HospitalDashboard.css';

const HospitalDashboard: React.FC = () => {
    const { showToast } = useToast();
    const socket = useSocket();
    const [profile, setProfile] = useState<Hospital | null>(null);
    const [activeTab, setActiveTab] = useState('command');
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [crisisMode, setCrisisMode] = useState(false);

    // Matched Donors State
    const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
    const [matchedDonors, setMatchedDonors] = useState<Donor[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Real-time updates via WebSocket
    useEffect(() => {
        if (!socket) return;

        socket.on('request-update', (updatedRequest: BloodRequest) => {
            setRequests(prev => prev.map(r =>
                r.id === updatedRequest.id ? { ...r, ...updatedRequest } : r
            ));
        });

        socket.on('request-fulfilled', (data: any) => {
            showToast(`🎉 Request #${data.request_id} has been fulfilled!`, 'success');
            fetchDashboardData();
        });

        return () => {
            socket.off('request-update');
            socket.off('request-fulfilled');
        };
    }, [socket, showToast]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const profileRes = await getMyHospitalProfile();
            // @ts-ignore
            setProfile(profileRes.data || profileRes);

            const requestsRes = await getRequests({
                // @ts-ignore
                hospital_id: (profileRes.data || profileRes).id,
                status: 'pending'
            });
            // @ts-ignore
            setRequests(requestsRes.data || requestsRes);

        } catch (error: any) {
            console.error(error);
            showToast('Failed to load dashboard data: ' + error.message, 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateRequest = async (formData: any) => {
        if (!profile) return;
        try {
            setActionLoading(true);
            const data = {
                ...formData,
                hospital_id: profile.id,
                status: 'pending',
                // If crisis mode is active, auto-set to critical
                urgency: crisisMode ? 'critical' : formData.urgency
            };

            await createRequest(data);
            showToast('Emergency request broadcasted successfully!', 'success');

            // Refresh requests and switch to tracker view
            await fetchDashboardData();
            setActiveTab('command');
        } catch (error: any) {
            showToast('Failed to create request: ' + error.message, 'error');
        } finally {
            setActionLoading(false);
        }
    };

    const handleCancelRequest = async (id: number) => {
        if (!window.confirm('Are you sure you want to cancel this request?')) return;

        try {
            await cancelRequest(id);
            showToast('Request cancelled.', 'info');
            fetchDashboardData();
        } catch (error) {
            showToast('Failed to cancel request.', 'error');
        }
    };

    const handleFulfillRequest = async (id: number) => {
        if (!window.confirm('Mark this request as fulfilled?')) return;

        try {
            const response = await fulfillRequest(id);
             // @ts-ignore
            setRequests(prev => prev.map(r => r.id === id ? (response.data || response) : r));
            showToast('Request fulfilled successfully!', 'success');
            // Refresh stats
            fetchDashboardData();
        } catch (error: any) {
            showToast('Failed to fulfill request: ' + error.message, 'error');
        }
    };

    const handleFindDonors = async (request: BloodRequest) => {
        if (!profile) return;
        try {
            setSelectedRequest(request);
            setActiveTab('donors');
            setLoading(true);

            // Find donors with same blood type and city
            const res = await getDonors({
                blood_type: request.blood_type,
                city: profile.city,
                available: 'true'
            });
            // @ts-ignore
            setMatchedDonors(res.data || res);

        } catch (error) {
            showToast('Failed to find donors.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleCrisisToggle = async (activate: boolean) => {
        if (!profile) return;
        try {
            setActionLoading(true);
            setCrisisMode(activate);

            if (activate) {
                showToast('🚨 CRISIS MODE ACTIVATED - All resources notified!', 'error');
                // Emit crisis event via WebSocket
                if (socket) {
                    socket.emit('crisis-mode', {
                        hospital_id: profile.id,
                        hospital_name: profile.name,
                        city: profile.city,
                        active: true
                    });
                }
            } else {
                showToast('Crisis mode deactivated', 'info');
                if (socket) {
                    socket.emit('crisis-mode', {
                        hospital_id: profile.id,
                        active: false
                    });
                }
            }
        } catch (error) {
            showToast('Failed to toggle crisis mode', 'error');
        } finally {
            setActionLoading(false);
        }
    };

    if (loading && !profile) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="spinner"></div>
            </div>
        );
    }

    if (!profile) return <div>Access Denied. Not a hospital account.</div>;

    return (
        <div className={`hospital-dashboard ${crisisMode ? 'crisis-active' : ''}`}>
            <div className="container section">
                <header className="dashboard-header">
                    <div className="dashboard-welcome">
                        <h1>🏥 {profile.name}</h1>
                        <p className="text-gray-400">{profile.city} • Emergency Command Center</p>
                    </div>
                </header>

                {/* Crisis Trigger - Always Visible */}
                <MassCasualtyTrigger
                    onTrigger={handleCrisisToggle}
                    isActive={crisisMode}
                    loading={actionLoading}
                />

                {/* Stats Grid */}
                <HospitalStatsGrid requests={requests} profile={profile} />

                <div className="dashboard-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'command' ? 'active' : ''}`}
                        onClick={() => setActiveTab('command')}
                    >
                        🎯 Command Center
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'create' ? 'active' : ''}`}
                        onClick={() => setActiveTab('create')}
                    >
                        ➕ New Request
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
                        onClick={() => setActiveTab('active')}
                    >
                        📋 Active ({requests.length})
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'donors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('donors')}
                    >
                        👥 Match Donors
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'inventory' ? 'active' : ''}`}
                        onClick={() => setActiveTab('inventory')}
                    >
                        📦 Inventory
                    </button>
                </div>

                <div className="dashboard-content animate-fade-in">
                    {activeTab === 'command' && (
                        <LiveRequestTracker
                            requests={requests}
                            onRequestClick={handleFindDonors}
                        />
                    )}

                    {activeTab === 'create' && (
                        <div className="glass-card request-form-card">
                            <RequestForm onSubmit={handleCreateRequest} loading={actionLoading} />
                            {crisisMode && (
                                <div className="crisis-notice">
                                    ⚠️ Crisis Mode Active - All requests will be marked as CRITICAL
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'active' && (
                        <ActiveRequestsList
                            requests={requests}
                            onCancel={handleCancelRequest}
                            onFulfill={handleFulfillRequest}
                            onMatch={handleFindDonors}
                        />
                    )}

                    {activeTab === 'donors' && (
                        <div>
                            {selectedRequest ? (
                                <div>
                                    <div className="mb-4">
                                        <h3>Matching Donors for Request #{selectedRequest.id}</h3>
                                        <p className="text-gray-400">
                                            Looking for <strong>{selectedRequest.blood_type}</strong> donors in <strong>{profile.city}</strong>
                                        </p>
                                    </div>
                                    <MatchedDonors donors={matchedDonors} />
                                </div>
                            ) : (
                                <div className="empty-state glass-card">
                                    <p>Select a request from "Active Requests" to find compatible donors.</p>
                                    <button className="btn btn-secondary mt-4" onClick={() => setActiveTab('active')}>
                                        Go to Active Requests
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'inventory' && (
                        <div className="glass-card p-6">
                            <BloodInventoryGrid />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
