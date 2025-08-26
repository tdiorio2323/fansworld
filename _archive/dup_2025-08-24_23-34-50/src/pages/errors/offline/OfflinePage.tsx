import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, Globe, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const OfflinePage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [retryCount, setRetryCount] = useState(0);

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

  const handleRetry = () => {
    setRetryCount(prev => prev + 1);
    if (navigator.onLine) {
      window.location.reload();
    }
  };

  if (isOnline) {
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <div className="bg-gray-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <WifiOff className="h-10 w-10 text-gray-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Offline</h1>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          It looks like you've lost your internet connection. Please check your network settings and try again.
        </p>
        
        <div className="space-y-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg text-left">
            <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Globe className="w-4 h-4 mr-2" />
              Troubleshooting Tips:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Check your WiFi connection</li>
              <li>• Restart your router</li>
              <li>• Try mobile data</li>
              <li>• Contact your ISP</li>
            </ul>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button onClick={handleRetry} className="w-full bg-purple-600 hover:bg-purple-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again {retryCount > 0 && `(${retryCount})`}
          </Button>
          
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
            <Smartphone className="w-4 h-4" />
            <span>Switch to mobile data</span>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className={`w-3 h-3 rounded-full mx-auto ${isOnline ? 'bg-green-400' : 'bg-red-400'}`}></div>
          <p className="text-xs text-gray-500 mt-2">
            Status: {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default OfflinePage;