import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, Twitter, Instagram, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

const MaintenancePage = () => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1));
    }, 100);
    
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center px-4">
      <Card className="max-w-lg w-full p-8 text-center bg-white/80 backdrop-blur-sm border-0 shadow-2xl">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wrench className="h-10 w-10 text-blue-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Under Maintenance</h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          We're currently upgrading CABANA to serve you better. Our premium creator platform will be back online shortly with exciting new features!
        </p>
        
        <div className="mb-8">
          <div className="flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-purple-600 mr-2" />
            <span className="text-sm font-medium text-gray-700">Estimated completion</span>
          </div>
          <p className="text-2xl font-bold text-purple-600 mb-4">2 hours</p>
          <Progress value={progress} className="w-full h-2" />
        </div>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-800 mb-2">What's New?</h3>
            <ul className="text-sm text-gray-600 space-y-1 text-left">
              <li>• Enhanced creator analytics</li>
              <li>• Improved payment system</li>
              <li>• Better mobile experience</li>
              <li>• Advanced security features</li>
            </ul>
          </div>
          
          <div className="pt-4">
            <p className="text-sm text-gray-500 mb-4">Stay connected with us:</p>
            <div className="flex justify-center space-x-4">
              <Button size="sm" variant="outline" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" className="p-2">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need immediate assistance? <Link to="mailto:support@cabana.com" className="text-purple-600 hover:underline">Contact Emergency Support</Link>
          </p>
        </div>
      </Card>
    </div>
  );
};

export default MaintenancePage;