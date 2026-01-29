import React from 'react';
import { AlertTriangle, Clock, ArrowRight } from 'lucide-react';

const EmergencyFeed = ({ requests }) => {
    return (
        <div className="panel h-full flex flex-col">
            <div className="panel-header border-l-4 border-l-rose-500">
                <div className="flex items-center space-x-2">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                    </span>
                    <h3 className="panel-title text-rose-700">Live Networking Feed</h3>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 bg-rose-100 text-rose-700 rounded-full">
                    3 ACTIVE
                </span>
            </div>
            
            <div className="flex-1 overflow-y-auto p-0 divide-y divide-slate-50">
                {requests.map((req) => (
                    <div key={req.id} className="p-4 hover:bg-rose-50/30 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="font-semibold text-slate-800 flex items-center">
                                <AlertTriangle size={14} className="text-rose-500 mr-2" />
                                {req.hospital}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center">
                                <Clock size={12} className="mr-1" /> {req.time}
                            </span>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                            <div className="flex items-center space-x-2 text-sm">
                                <span className="font-mono font-bold bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                                    {req.bloodType}
                                </span>
                                <span className="text-slate-500">needed immediately.</span>
                            </div>
                            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white border border-slate-200 rounded-full shadow-sm text-rose-600">
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            <div className="p-3 border-t border-slate-100 bg-slate-50 text-center">
                <button className="text-xs font-medium text-slate-500 hover:text-slate-800">
                    View All Activity Log
                </button>
            </div>
        </div>
    );
};

export default EmergencyFeed;
