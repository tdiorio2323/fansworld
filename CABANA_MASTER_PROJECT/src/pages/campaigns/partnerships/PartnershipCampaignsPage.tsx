import React from 'react';
import { Handshake, Building, Users, TrendingUp, DollarSign, Target, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const PartnershipCampaignsPage = () => {
  const partnerships = [
    {
      id: 1,
      name: 'Creative Alliance Partnership',
      partner: 'Creative Studios Network',
      type: 'Cross-promotion',
      status: 'active',
      reach: 1200000,
      conversions: 2340,
      revenue: 156000,
      startDate: '2024-01-15'
    },
    {
      id: 2,
      name: 'Tech Integration Campaign',
      partner: 'TechSolutions Corp',
      type: 'Product Integration',
      status: 'active',
      reach: 890000,
      conversions: 1567,
      revenue: 89000,
      startDate: '2024-02-01'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Partnership Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Collaborate with strategic partners to expand your reach</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Active Partnerships</p>
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-xs text-purple-500">Running campaigns</p>
                </div>
                <Handshake className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Partner Reach</p>
                  <p className="text-2xl font-bold text-blue-600">8.9M</p>
                  <p className="text-xs text-blue-500">Combined audience</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Conversions</p>
                  <p className="text-2xl font-bold text-green-600">3,907</p>
                  <p className="text-xs text-green-500">From partnerships</p>
                </div>
                <Target className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Revenue</p>
                  <p className="text-2xl font-bold text-orange-600">$245K</p>
                  <p className="text-xs text-orange-500">Partnership revenue</p>
                </div>
                <DollarSign className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Active Partnership Campaigns</CardTitle>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Partnership
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {partnerships.map((partnership) => (
                <div key={partnership.id} className="p-6 bg-gray-50/70 rounded-lg">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{partnership.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">with {partnership.partner}</p>
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800">{partnership.status}</Badge>
                        <Badge variant="outline">{partnership.type}</Badge>
                        <span className="text-sm text-gray-500">Since {partnership.startDate}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">${partnership.revenue.toLocaleString()}</p>
                      <p className="text-sm text-gray-500">Revenue Generated</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Reach</p>
                      <p className="font-semibold">{(partnership.reach / 1000000).toFixed(1)}M</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversions</p>
                      <p className="font-semibold">{partnership.conversions.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Conversion Rate</p>
                      <p className="font-semibold">{((partnership.conversions / partnership.reach) * 100).toFixed(2)}%</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Revenue per Conversion</p>
                      <p className="font-semibold">${(partnership.revenue / partnership.conversions).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PartnershipCampaignsPage;