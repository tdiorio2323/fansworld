import React from 'react';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to FansWorld</h1>
          <p className="text-xl mb-8">The ultimate creator platform</p>
          <div className="space-x-4">
            <a href="/auth" className="bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100">
              Sign In
            </a>
            <a href="/register" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600">
              Get Started
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;