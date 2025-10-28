import { useState, useEffect } from 'react';

// Indian states with approximate center coordinates
const STATE_COORDINATES = {
  'ANDHRA PRADESH': { lat: 15.9129, lon: 79.7400 },
  'ARUNACHAL PRADESH': { lat: 28.2180, lon: 94.7278 },
  'ASSAM': { lat: 26.2006, lon: 92.9376 },
  'BIHAR': { lat: 25.0961, lon: 85.3131 },
  'CHHATTISGARH': { lat: 21.2787, lon: 81.8661 },
  'GOA': { lat: 15.2993, lon: 74.1240 },
  'GUJARAT': { lat: 22.2587, lon: 71.1924 },
  'HARYANA': { lat: 29.0588, lon: 76.0856 },
  'HIMACHAL PRADESH': { lat: 31.1048, lon: 77.1734 },
  'JHARKHAND': { lat: 23.6102, lon: 85.2799 },
  'KARNATAKA': { lat: 15.3173, lon: 75.7139 },
  'KERALA': { lat: 10.8505, lon: 76.2711 },
  'MADHYA PRADESH': { lat: 22.9734, lon: 78.6569 },
  'MAHARASHTRA': { lat: 19.7515, lon: 75.7139 },
  'MANIPUR': { lat: 24.6637, lon: 93.9063 },
  'MEGHALAYA': { lat: 25.4670, lon: 91.3662 },
  'MIZORAM': { lat: 23.1645, lon: 92.9376 },
  'NAGALAND': { lat: 26.1584, lon: 94.5624 },
  'ODISHA': { lat: 20.9517, lon: 85.0985 },
  'PUNJAB': { lat: 31.1471, lon: 75.3412 },
  'RAJASTHAN': { lat: 27.0238, lon: 74.2179 },
  'SIKKIM': { lat: 27.5330, lon: 88.5122 },
  'TAMIL NADU': { lat: 11.1271, lon: 78.6569 },
  'TELANGANA': { lat: 18.1124, lon: 79.0193 },
  'TRIPURA': { lat: 23.9408, lon: 91.9882 },
  'UTTAR PRADESH': { lat: 26.8467, lon: 80.9462 },
  'UTTARAKHAND': { lat: 30.0668, lon: 79.0193 },
  'WEST BENGAL': { lat: 22.9868, lon: 87.8550 },
  'JAMMU AND KASHMIR': { lat: 33.7782, lon: 76.5762 },
  'LADAKH': { lat: 34.1526, lon: 77.5770 },
};

// Calculate distance between two coordinates (Haversine formula)
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Find nearest state based on coordinates
const findNearestState = (lat, lon) => {
  let nearestState = null;
  let minDistance = Infinity;

  Object.entries(STATE_COORDINATES).forEach(([state, coords]) => {
    const distance = calculateDistance(lat, lon, coords.lat, coords.lon);
    if (distance < minDistance) {
      minDistance = distance;
      nearestState = state;
    }
  });

  return nearestState;
};

export const useGeolocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [detectedState, setDetectedState] = useState(null);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLocation({ lat: latitude, lon: longitude });
        
        // Find nearest state
        const state = findNearestState(latitude, longitude);
        setDetectedState(state);
        
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  useEffect(() => {
    // Auto-detect on mount
    // detectLocation();
  }, []);

  return {
    location,
    detectedState,
    error,
    loading,
    detectLocation
  };
};

export default useGeolocation;
