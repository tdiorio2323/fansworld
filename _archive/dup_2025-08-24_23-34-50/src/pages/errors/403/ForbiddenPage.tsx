import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const ForbiddenPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Shield className="h-10 w-10 text-red-600" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Access Forbidden</h2>
        
        <p className="text-gray-600 mb-8 leading-relaxed">
          You don't have permission to access this premium content. Please contact support or upgrade your membership to continue.
        </p>
        
        <div className="space-y-3">
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" className="w-full">
            <Link to="/discover">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Browse Creators
            </Link>
          </Button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help? <Link to="/support" className="text-purple-600 hover:underline">Contact Support</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default ForbiddenPage;