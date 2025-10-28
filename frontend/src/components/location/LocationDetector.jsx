import React from 'react';
import { useGeolocation } from '../../hooks/useGeolocation';

const LocationDetector = ({ onStateDetected }) => {
  const { location, detectedState, error, loading, detectLocation } = useGeolocation();

  React.useEffect(() => {
    if (detectedState && onStateDetected) {
      onStateDetected(detectedState);
    }
  }, [detectedState, onStateDetected]);

  return (
    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-3xl">📍</span>
          <div>
            <h3 className="font-semibold text-gray-800">Auto-Detect Your Location</h3>
            <p className="text-sm text-gray-600">
              {detectedState 
                ? `Detected: ${detectedState}`
                : 'Click to automatically select your state'}
            </p>
            {location && (
              <p className="text-xs text-gray-500">
                Coordinates: {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={detectLocation}
          disabled={loading}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            loading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg'
          }`}
        >
          {loading ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Detecting...
            </>
          ) : (
            <>
              🎯 Detect Location
            </>
          )}
        </button>
      </div>
      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          ⚠️ {error}. Please select your state manually.
        </div>
      )}
      {detectedState && (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded text-sm text-green-700">
          ✅ Location detected! Showing data for {detectedState}
        </div>
      )}
    </div>
  );
};

export default LocationDetector;
