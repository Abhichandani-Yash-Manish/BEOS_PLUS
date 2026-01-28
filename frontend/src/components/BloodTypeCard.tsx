import React from 'react';
import { BloodType } from '../types/models';
import './BloodTypeCard.css';

interface BloodTypeCardProps {
    type: BloodType;
    count: number;
    available?: boolean;
    onClick?: () => void;
}

const BloodTypeCard: React.FC<BloodTypeCardProps> = ({ type, count, available = false, onClick }) => {
    return (
        <div className="blood-type-card glass-card" onClick={onClick}>
            <div className="blood-type-badge">{type}</div>
            <div className="blood-type-info">
                <span className="blood-type-count">{count}</span>
                <span className="blood-type-label">
                    {available ? 'Available Donors' : 'Units Available'}
                </span>
            </div>
        </div>
    );
};

export default BloodTypeCard;
