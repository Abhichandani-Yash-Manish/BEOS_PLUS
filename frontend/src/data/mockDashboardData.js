export const MOCK_INVENTORY = [
  { type: 'A+', units: 24, status: 'Healthy', lastUpdated: '10 mins ago', expiryWarning: 2 },
  { type: 'A-', units: 4, status: 'Critical', lastUpdated: '2 mins ago', expiryWarning: 0 },
  { type: 'B+', units: 18, status: 'Stable', lastUpdated: '1 hour ago', expiryWarning: 1 },
  { type: 'B-', units: 8, status: 'Low', lastUpdated: '25 mins ago', expiryWarning: 0 },
  { type: 'AB+', units: 12, status: 'Stable', lastUpdated: '3 hours ago', expiryWarning: 0 },
  { type: 'AB-', units: 3, status: 'Critical', lastUpdated: '1 min ago', expiryWarning: 0 },
  { type: 'O+', units: 45, status: 'Healthy', lastUpdated: '5 mins ago', expiryWarning: 5 },
  { type: 'O-', units: 2, status: 'Critical', lastUpdated: 'JUST NOW', expiryWarning: 0 },
];

export const MOCK_REQUESTS = [
  { id: 'REQ-2024-001', hospital: 'City General', bloodType: 'O-', urgency: 'Critical', time: '2 mins ago' },
  { id: 'REQ-2024-002', hospital: 'St. Marys Trauma', bloodType: 'A-', urgency: 'High', time: '15 mins ago' },
  { id: 'REQ-2024-003', hospital: 'Metro Childrens', bloodType: 'AB+', urgency: 'Normal', time: '1 hour ago' },
];
