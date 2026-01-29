import React, { useState } from 'react';
import InventoryGrid from '../components/dashboard/InventoryGrid';
import EmergencyFeed from '../components/dashboard/EmergencyFeed';
import RequestsMap from '../components/dashboard/RequestsMap';
import RapidRequestForm from '../components/dashboard/RapidRequestForm';
import { MOCK_INVENTORY, MOCK_REQUESTS } from '../data/mockDashboardData';
import { PlusCircle, Search } from 'lucide-react';

const HospitalDashboard = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleFormSubmit = (data: any) => {
        console.log("New Request Data:", data);
        setIsFormOpen(false);
        // Here we would call the API to broadcast the request
    };

    return (
        <div className="space-y-6 relative">
            {/* Modal Form Overlay */}
            {isFormOpen && (
                <RapidRequestForm 
                    onClose={() => setIsFormOpen(false)} 
                    onSubmit={handleFormSubmit} 
                />
            )}

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">Command Center</h2>
                    <p className="text-slate-500 text-sm">Overview of inventory, operations, and network status.</p>
                </div>
                
                <div className="flex gap-2">
                    <button className="btn bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors">
                        <Search size={16} className="mr-2" /> Search
                    </button>
                    <button 
                        onClick={() => setIsFormOpen(true)}
                        className="btn bg-teal-600 text-white hover:bg-teal-700 shadow-md flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        <PlusCircle size={16} className="mr-2" /> New Request
                    </button>
                </div>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Column: Inventory & Operations (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="panel p-4 flex flex-col border-l-4 border-l-emerald-500">
                            <span className="text-xs font-semibold text-emerald-600 uppercase">Total Units</span>
                            <span className="text-2xl font-bold text-slate-800 mt-1">1,248</span>
                            <span className="text-xs text-slate-400 mt-1">across all types</span>
                        </div>
                        <div className="panel p-4 flex flex-col border-l-4 border-l-amber-500">
                             <span className="text-xs font-semibold text-amber-600 uppercase">Expiring (48h)</span>
                            <span className="text-2xl font-bold text-slate-800 mt-1">12</span>
                            <span className="text-xs text-slate-400 mt-1">needs attention</span>
                        </div>
                        <div className="panel p-4 flex flex-col border-l-4 border-l-blue-500">
                             <span className="text-xs font-semibold text-blue-600 uppercase">Transfers In</span>
                            <span className="text-2xl font-bold text-slate-800 mt-1">5</span>
                            <span className="text-xs text-slate-400 mt-1">arriving today</span>
                        </div>
                    </div>

                    {/* Inventory Table */}
                    <InventoryGrid data={MOCK_INVENTORY} />
                </div>

                {/* Right Column: Live Feed & Map (1/3 width) */}
                <div className="space-y-6">
                    <EmergencyFeed requests={MOCK_REQUESTS} />
                    <RequestsMap />
                </div>
            </div>
        </div>
    );
};

export default HospitalDashboard;
