import React from 'react';
import { MoreHorizontal, AlertCircle, TrendingDown, TrendingUp } from 'lucide-react';

const InventoryGrid = ({ data }) => {
    return (
        <div className="panel overflow-hidden">
            <div className="panel-header">
                <h3 className="panel-title">Live Inventory Status</h3>
                <button className="text-sm text-teal-600 hover:text-teal-700 font-medium">Manage Stock</button>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-3 font-medium">Blood Type</th>
                            <th className="px-6 py-3 font-medium">Units Available</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium">Last Updated</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {data.map((item) => (
                            <tr key={item.type} className="hover:bg-slate-50/50 transition-colors group">
                                <td className="px-6 py-3 font-mono font-bold text-slate-700 text-base">
                                    {item.type}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-slate-900">{item.units}</span>
                                        {item.units < 10 && <TrendingDown size={14} className="text-rose-500" />}
                                        {item.units > 20 && <TrendingUp size={14} className="text-emerald-500" />}
                                    </div>
                                    {item.expiryWarning > 0 && (
                                        <span className="text-xs text-amber-600 flex items-center mt-1">
                                            <AlertCircle size={10} className="mr-1" />
                                            {item.expiryWarning} expiring soon
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-3">
                                    <span className={`
                                        inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                        ${item.status === 'Healthy' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : ''}
                                        ${item.status === 'Stable' ? 'bg-blue-50 text-blue-700 border border-blue-100' : ''}
                                        ${item.status === 'Low' ? 'bg-amber-50 text-amber-700 border border-amber-100' : ''}
                                        ${item.status === 'Critical' ? 'bg-rose-50 text-rose-700 border border-rose-100 animate-pulse' : ''}
                                    `}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="px-6 py-3 text-slate-400 text-xs">
                                    {item.lastUpdated}
                                </td>
                                <td className="px-6 py-3 text-right">
                                    <button className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-100">
                                        <MoreHorizontal size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InventoryGrid;
