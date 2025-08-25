import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, TrendingUp, Ticket, Camera, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const EventCampaignsPage = () => {
  const upcomingEvents = [
    {
      id: 1,
      name: 'CABANA Creator Summit 2024',
      type: 'Conference',
      date: '2024-09-15',
      time: '09:00 AM PST',
      location: 'Los Angeles Convention Center',
      capacity: 2000,
      registered: 1567,
      revenue: 245000,
      status: 'active',
      featured: true
    },
    {
      id: 2,
      name: 'Virtual Content Workshop',
      type: 'Workshop',
      date: '2024-07-20',
      time: '02:00 PM PST',
      location: 'Online Event',
      capacity: 500,
      registered: 423,
      revenue: 42300,
      status: 'active',
      featured: false
    },
    {
      id: 3,
      name: 'Creator Meetup - NYC',
      type: 'Meetup',
      date: '2024-08-05',
      time: '06:00 PM EST',
      location: 'Brooklyn Creative Space',
      capacity: 100,
      registered: 89,
      revenue: 0,
      status: 'active',
      featured: false
    }
  ];

  const eventMetrics = [
    { month: 'Jan', events: 3, attendees: 245, revenue: 12500 },
    { month: 'Feb', events: 2, attendees: 189, revenue: 9800 },
    { month: 'Mar', events: 4, attendees: 356, revenue: 18900 },
    { month: 'Apr', events: 5, attendees: 467, revenue: 23400 },
    { month: 'May', events: 3, attendees: 298, revenue: 15600 },
    { month: 'Jun', events: 6, attendees: 589, revenue: 28900 }
  ];

  const eventTypes = [
    { type: 'Virtual Events', count: 12, attendees: 2340, revenue: 78000 },
    { type: 'In-Person Meetups', count: 8, attendees: 890, revenue: 15600 },
    { type: 'Workshops', count: 6, attendees: 567, revenue: 34500 },
    { type: 'Conferences', count: 2, attendees: 1200, revenue: 125000 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Event Campaigns
          </h1>
          <p className="text-gray-600 text-lg">Create and manage events to engage your community</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-xs text-purple-500">Next 3 months</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Attendees</p>
                  <p className="text-2xl font-bold text-blue-600">2,079</p>
                  <p className="text-xs text-blue-500">Registered</p>
                </div>
                <Users className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Event Revenue</p>
                  <p className="text-2xl font-bold text-green-600">$287K</p>
                  <p className="text-xs text-green-500">This year</p>
                </div>
                <Ticket className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Attendance</p>
                  <p className="text-2xl font-bold text-orange-600">87%</p>
                  <p className="text-xs text-orange-500">Show-up rate</p>
                </div>
                <TrendingUp className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="analytics">Event Analytics</TabsTrigger>
            <TabsTrigger value="types">Event Types</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Events</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="font-semibold text-gray-900 text-lg">{event.name}</h3>
                            {event.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                          </div>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {event.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {event.location}
                            </div>
                          </div>
                          <Badge variant="outline" className="mt-2">{event.type}</Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-green-600">${event.revenue.toLocaleString()}</p>
                          <p className="text-sm text-gray-500">Revenue</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Capacity</p>
                          <p className="font-semibold">{event.capacity} attendees</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Registered</p>
                          <p className="font-semibold">{event.registered} people</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Availability</p>
                          <p className="font-semibold">{event.capacity - event.registered} spots left</p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Registration Progress</span>
                          <span className="font-medium">{((event.registered / event.capacity) * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={(event.registered / event.capacity) * 100} className="h-3" />
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" className="border-purple-200 text-purple-600">
                          View Details
                        </Button>
                        <Button size="sm" variant="outline" className="border-blue-200 text-blue-600">
                          Edit Event
                        </Button>
                        <Button size="sm" variant="outline" className="border-green-200 text-green-600">
                          <Camera className="w-4 h-4 mr-1" />
                          Promote
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
                <CardTitle>Event Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={eventMetrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="month" stroke="#666" />
                    <YAxis stroke="#666" />
                    <Tooltip />
                    <Line type="monotone" dataKey="events" stroke="#8B5CF6" strokeWidth={3} name="Events Held" />
                    <Line type="monotone" dataKey="attendees" stroke="#10B981" strokeWidth={3} name="Total Attendees" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="types" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {eventTypes.map((type, index) => (
                <Card key={index} className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
                  <CardContent className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">{type.type}</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Events Held</span>
                        <span className="font-semibold">{type.count}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Attendees</span>
                        <span className="font-semibold">{type.attendees.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Revenue Generated</span>
                        <span className="font-semibold text-green-600">${type.revenue.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EventCampaignsPage;