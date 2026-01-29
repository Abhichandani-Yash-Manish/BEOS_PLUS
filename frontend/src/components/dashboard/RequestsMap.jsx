import React from 'react';
import { Map, Maximize2 } from 'lucide-react';

const RequestsMap = () => {
    return (
        <div className="panel h-64 bg-slate-100 border-dashed border-2 border-slate-300 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
            {/* Artistic pattern to simulate map */}
            <div className="absolute inset-0 opacity-10" 
                 style={{backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px'}}>
            </div>
            
            <Map size={48} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Regional Network Map</span>
            
            <button className="absolute top-2 right-2 p-2 bg-white rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-teal-600">
                <Maximize2 size={16} />
            </button>
        </div>
    );
};

export default RequestsMap;
