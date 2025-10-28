import React, { useState, useEffect } from 'react';

const OfflineDetector = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white py-3 px-4 shadow-lg">
      <div className="container mx-auto flex items-center justify-center gap-3">
        <span className="text-2xl">📡</span>
        <div>
          <p className="font-semibold">You are offline</p>
          <p className="text-sm">Some features may not work without an internet connection</p>
        </div>
      </div>
    </div>
  );
};

export default OfflineDetector;
