
import React, { useState, useEffect } from 'react';

const OfflineStatus: React.FC = () => {
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

  if (isOnline) {
    return (
      <div className="hidden sm:flex items-center gap-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter animate-in fade-in">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        Sincronizado
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-1 rounded-full border border-rose-100 uppercase tracking-tighter animate-pulse">
      <i className="fas fa-wifi-slash"></i>
      Modo Offline
    </div>
  );
};

export default OfflineStatus;
