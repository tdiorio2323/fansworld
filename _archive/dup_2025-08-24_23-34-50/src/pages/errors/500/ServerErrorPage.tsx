import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ServerErrorPage = () => {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle className="h-10 w-10 text-orange-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">500</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Server Error</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          Oops! Something went wrong on our end. Our team has been notified and is working to fix this issue.
        </p>
        
        <div className="space-y-3">
          <Button onClick={handleRefresh} className="w-full bg-purple-600 hover:bg-purple-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="ghost" className="w-full">
            <Link to="/support">
              <MessageCircle className="w-4 h-4 mr-2" />
              Contact Support
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ServerErrorPage;