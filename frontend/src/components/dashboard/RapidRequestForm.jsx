import React, { useState } from 'react';
import { Zap, X, Save, AlertTriangle } from 'lucide-react';

const RapidRequestForm = ({ onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
        bloodType: '',
        urgency: 'Normal',
        units: 1,
        notes: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="panel w-full max-w-lg shadow-2xl animate-scale-in">
                <div className="panel-header bg-slate-50">
                    <div className="flex items-center space-x-2 text-teal-700">
                        <Zap size={20} />
                        <h3 className="panel-title">New Request</h3>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Blood Type</label>
                            <select 
                                className="form-select font-mono font-bold text-lg"
                                value={formData.bloodType}
                                onChange={(e) => setFormData({...formData, bloodType: e.target.value})}
                                required
                            >
                                <option value="">Select...</option>
                                {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Units</label>
                            <input 
                                type="number" 
                                min="1" 
                                max="20"
                                className="form-input font-mono font-bold text-lg"
                                value={formData.units}
                                onChange={(e) => setFormData({...formData, units: parseInt(e.target.value)})}
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Urgency Level</label>
                        <div className="grid grid-cols-3 gap-2">
                            {['Normal', 'High', 'Critical'].map((level) => (
                                <button
                                    key={level}
                                    type="button"
                                    onClick={() => setFormData({...formData, urgency: level})}
                                    className={`
                                        py-2 px-3 rounded-md text-sm font-medium border transition-all
                                        ${formData.urgency === level 
                                            ? level === 'Critical' 
                                                ? 'bg-rose-50 border-rose-500 text-rose-700 ring-1 ring-rose-500' 
                                                : level === 'High'
                                                    ? 'bg-amber-50 border-amber-500 text-amber-700 ring-1 ring-amber-500'
                                                    : 'bg-teal-50 border-teal-500 text-teal-700 ring-1 ring-teal-500'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}
                                    `}
                                >
                                    {level === 'Critical' && <AlertTriangle size={12} className="inline mr-1" />}
                                    {level}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Notes (Optional)</label>
                        <textarea 
                            className="form-textarea h-20 text-sm"
                            placeholder="Patient condition, specific requirements..."
                            value={formData.notes}
                            onChange={(e) => setFormData({...formData, notes: e.target.value})}
                        />
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 btn btn-secondary justify-center">
                            Cancel
                        </button>
                        <button type="submit" className={`flex-1 btn justify-center ${formData.urgency === 'Critical' ? 'btn-danger' : 'btn-primary'}`}>
                            <Save size={16} className="mr-2" />
                            Broadcast Request
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RapidRequestForm;
