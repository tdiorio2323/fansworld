import React, { useState } from 'react';
import { FileText, Download, Calendar, Filter, TrendingUp, BarChart3, PieChart, Activity, Clock, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const ReportsAnalyticsPage = () => {
  const [selectedReport, setSelectedReport] = useState('revenue');
  const [reportPeriod, setReportPeriod] = useState('monthly');

  const reportTemplates = [
    {
      id: 'revenue',
      name: 'Revenue Report',
      description: 'Comprehensive revenue analysis and forecasting',
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
      frequency: 'Monthly',
      size: '2.3 MB',
      lastGenerated: '2024-04-15'
    },
    {
      id: 'performance',
      name: 'Performance Dashboard',
      description: 'Key performance indicators and metrics overview',
      icon: BarChart3,
      color: 'from-blue-500 to-cyan-500',
      frequency: 'Weekly',
      size: '1.8 MB',
      lastGenerated: '2024-04-12'
    },
    {
      id: 'audience',
      name: 'Audience Insights',
      description: 'User demographics and behavior analysis',
      icon: PieChart,
      color: 'from-purple-500 to-pink-500',
      frequency: 'Monthly',
      size: '3.1 MB',
      lastGenerated: '2024-04-10'
    },
    {
      id: 'content',
      name: 'Content Analytics',
      description: 'Content performance and engagement metrics',
      icon: Activity,
      color: 'from-orange-500 to-red-500',
      frequency: 'Weekly',
      size: '2.7 MB',
      lastGenerated: '2024-04-14'
    }
  ];

  const scheduledReports = [
    { name: 'Weekly Performance Summary', nextRun: '2024-04-21 09:00', recipients: 5, format: 'PDF' },
    { name: 'Monthly Revenue Breakdown', nextRun: '2024-05-01 08:00', recipients: 8, format: 'Excel' },
    { name: 'Creator Performance Review', nextRun: '2024-04-28 10:00', recipients: 3, format: 'PDF' },
    { name: 'User Engagement Report', nextRun: '2024-04-25 09:30', recipients: 6, format: 'CSV' }
  ];

  const recentReports = [
    { name: 'Q1 2024 Revenue Analysis', generated: '2024-04-15 14:30', size: '4.2 MB', downloads: 12, format: 'PDF' },
    { name: 'Creator Onboarding Metrics', generated: '2024-04-14 11:20', size: '1.9 MB', downloads: 8, format: 'Excel' },
    { name: 'User Acquisition Report', generated: '2024-04-13 16:45', size: '2.8 MB', downloads: 15, format: 'PDF' },
    { name: 'Content Moderation Summary', generated: '2024-04-12 09:15', size: '1.3 MB', downloads: 6, format: 'CSV' },
    { name: 'Payment Processing Analysis', generated: '2024-04-11 13:30', size: '3.5 MB', downloads: 10, format: 'Excel' }
  ];

  const reportMetrics = [
    { metric: 'Reports Generated', value: '248', change: '+12%', period: 'This month' },
    { metric: 'Scheduled Reports', value: '24', change: '+3', period: 'Active schedules' },
    { metric: 'Total Downloads', value: '1,456', change: '+18%', period: 'This month' },
    { metric: 'Avg. Report Size', value: '2.8 MB', change: '-5%', period: 'Last 30 days' }
  ];

  const reportTrendsData = [
    { date: '2024-01', generated: 45, downloaded: 234, shared: 67 },
    { date: '2024-02', generated: 52, downloaded: 298, shared: 84 },
    { date: '2024-03', generated: 61, downloaded: 356, shared: 102 },
    { date: '2024-04', generated: 73, downloaded: 428, shared: 125 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Reports & Analytics
          </h1>
          <p className="text-gray-600 text-lg">Generate, schedule and manage analytical reports</p>
        </div>

        {/* Report Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reportMetrics.map((metric, index) => (
            <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{metric.metric}</p>
                    <p className="text-2xl font-bold text-purple-600">{metric.value}</p>
                    <p className="text-xs text-green-500 mt-1">{metric.change} • {metric.period}</p>
                  </div>
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="templates" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="templates">Report Templates</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="recent">Recent Reports</TabsTrigger>
            <TabsTrigger value="analytics">Report Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="templates" className="space-y-6">
            {/* Report Templates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card key={template.id} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${template.color}`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                            <Calendar className="w-4 h-4 mr-1" />
                            Schedule
                          </Button>
                          <Button size="sm" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            <Download className="w-4 h-4 mr-1" />
                            Generate
                          </Button>
                        </div>
                      </div>
                      
                      <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-3 gap-4 text-center text-sm">
                        <div>
                          <p className="text-gray-500">Frequency</p>
                          <p className="font-semibold text-gray-900">{template.frequency}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Avg. Size</p>
                          <p className="font-semibold text-gray-900">{template.size}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Last Generated</p>
                          <p className="font-semibold text-gray-900">{template.lastGenerated}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Custom Report Builder */}
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Custom Report Builder</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
                    <select 
                      value={selectedReport}
                      onChange={(e) => setSelectedReport(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="revenue">Revenue Analysis</option>
                      <option value="user">User Analytics</option>
                      <option value="content">Content Performance</option>
                      <option value="creator">Creator Metrics</option>
                      <option value="engagement">Engagement Insights</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                    <select 
                      value={reportPeriod}
                      onChange={(e) => setReportPeriod(e.target.value)}
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                      <option value="quarterly">Quarterly</option>
                      <option value="custom">Custom Range</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Export Format</label>
                    <select className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="pdf">PDF Report</option>
                      <option value="excel">Excel Spreadsheet</option>
                      <option value="csv">CSV Data</option>
                      <option value="json">JSON Export</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Custom Report
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Report
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-600">
                    <Filter className="w-4 h-4 mr-2" />
                    Advanced Options
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scheduled" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Scheduled Reports</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Calendar className="w-4 h-4 mr-2" />
                    New Schedule
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {scheduledReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
                          <Clock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{report.name}</p>
                          <p className="text-sm text-gray-600">Next run: {report.nextRun}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{report.format}</Badge>
                            <span className="text-xs text-gray-500">{report.recipients} recipients</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Edit
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          Run Now
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-200 text-red-600">
                          Pause
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recent" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Recent Reports</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" className="border-purple-200 text-purple-600">
                      <Filter className="w-4 h-4 mr-2" />
                      Filter
                    </Button>
                    <Button variant="outline" className="border-purple-200 text-purple-600">
                      View All
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentReports.map((report, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{report.name}</p>
                          <p className="text-sm text-gray-600">Generated: {report.generated}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge variant="outline">{report.format}</Badge>
                            <span className="text-xs text-gray-500">{report.size}</span>
                            <span className="text-xs text-blue-500">{report.downloads} downloads</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Preview
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          <Share2 className="w-4 h-4" />
                          Share
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Report Generation Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={reportTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255,255,255,0.95)', 
                        border: 'none', 
                        borderRadius: '8px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                      }} 
                    />
                    <Line type="monotone" dataKey="generated" stroke="#8B5CF6" strokeWidth={3} name="Generated" />
                    <Line type="monotone" dataKey="downloaded" stroke="#10B981" strokeWidth={3} name="Downloaded" />
                    <Line type="monotone" dataKey="shared" stroke="#F59E0B" strokeWidth={3} name="Shared" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Most Popular Report</h3>
                  <p className="text-2xl font-bold mb-1">Revenue Analysis</p>
                  <p className="text-blue-100 text-sm">Generated 48 times this month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Download className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Download Rate</h3>
                  <p className="text-2xl font-bold mb-1">94.2%</p>
                  <p className="text-green-100 text-sm">Average across all reports</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Share2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Sharing Activity</h3>
                  <p className="text-2xl font-bold mb-1">28%</p>
                  <p className="text-purple-100 text-sm">Reports shared externally</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ReportsAnalyticsPage;