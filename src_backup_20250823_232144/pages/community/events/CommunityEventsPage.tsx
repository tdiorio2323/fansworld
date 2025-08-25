import React, { useState } from 'react';
import { Calendar, Users, MapPin, Clock, Heart, MessageCircle, Share2, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CommunityEventsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const upcomingEvents = [
    {
      id: 1,
      title: 'Weekly Creator Meetup',
      description: 'Join fellow creators for networking and collaboration',
      date: '2024-07-25',
      time: '7:00 PM PST',
      location: 'Virtual Event',
      organizer: 'Sarah Creator',
      attendees: 89,
      maxAttendees: 100,
      category: 'networking',
      isVirtual: true,
      likes: 45,
      comments: 12
    },
    {
      id: 2,
      title: 'Content Strategy Workshop',
      description: 'Learn advanced content strategies from top creators',
      date: '2024-07-28',
      time: '2:00 PM PST',
      location: 'Los Angeles, CA',
      organizer: 'Mike Growth',
      attendees: 67,
      maxAttendees: 80,
      category: 'workshop',
      isVirtual: false,
      likes: 78,
      comments: 23
    },
    {
      id: 3,
      title: 'Live Collaboration Session',
      description: 'Real-time content creation with community members',
      date: '2024-07-30',
      time: '8:00 PM PST',
      location: 'Virtual Event',
      organizer: 'Emma Collab',
      attendees: 156,
      maxAttendees: 200,
      category: 'collaboration',
      isVirtual: true,
      likes: 92,
      comments: 34
    }
  ];

  const eventCategories = [
    { id: 'all', name: 'All Events', count: 12, icon: Calendar },
    { id: 'networking', name: 'Networking', count: 4, icon: Users },
    { id: 'workshop', name: 'Workshops', count: 3, icon: Users },
    { id: 'collaboration', name: 'Collaborations', count: 3, icon: MessageCircle },
    { id: 'social', name: 'Social', count: 2, icon: Heart }
  ];

  const pastEvents = [
    {
      id: 4,
      title: 'Monthly Creator Awards',
      date: '2024-06-20',
      attendees: 234,
      rating: 4.8,
      highlights: ['Awards Ceremony', 'Networking', 'Live Performances']
    },
    {
      id: 5,
      title: 'Brand Partnership Panel',
      date: '2024-06-15',
      attendees: 156,
      rating: 4.9,
      highlights: ['Industry Experts', 'Q&A Session', 'Partnership Tips']
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'networking': return 'bg-blue-100 text-blue-800';
      case 'workshop': return 'bg-green-100 text-green-800';
      case 'collaboration': return 'bg-purple-100 text-purple-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Community Events
          </h1>
          <p className="text-gray-600 text-lg">Connect, learn, and grow with fellow creators</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Upcoming Events</p>
                  <p className="text-2xl font-bold text-purple-600">8</p>
                  <p className="text-xs text-purple-500">This month</p>
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
                  <p className="text-2xl font-bold text-blue-600">312</p>
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
                  <p className="text-sm text-gray-600 mb-1">Events Hosted</p>
                  <p className="text-2xl font-bold text-green-600">24</p>
                  <p className="text-xs text-green-500">This year</p>
                </div>
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Avg Rating</p>
                  <p className="text-2xl font-bold text-orange-600">4.7</p>
                  <p className="text-xs text-orange-500">Out of 5.0</p>
                </div>
                <Heart className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {eventCategories.map((category) => {
            const Icon = category.icon;
            return (
              <Card 
                key={category.id}
                className={`cursor-pointer transition-all hover:scale-105 ${
                  selectedCategory === category.id 
                    ? 'ring-2 ring-purple-400 bg-white/90' 
                    : 'bg-white/70 hover:bg-white/80'
                } backdrop-blur-sm border-0 shadow-xl`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-sm">{category.name}</h3>
                  <p className="text-xs text-gray-500">{category.count} events</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
            <TabsTrigger value="past">Past Events</TabsTrigger>
            <TabsTrigger value="hosting">Host Event</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Upcoming Community Events</CardTitle>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {upcomingEvents.map((event) => (
                    <div key={event.id} className="p-6 bg-gray-50/70 rounded-lg">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900 text-lg">{event.title}</h3>
                            {event.isVirtual && <Badge variant="outline">Virtual</Badge>}
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="w-4 h-4 mr-2" />
                              {event.location}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Users className="w-4 h-4 mr-2" />
                              {event.attendees}/{event.maxAttendees} attending
                            </div>
                          </div>

                          <div className="flex items-center space-x-4">
                            <Badge className={getCategoryColor(event.category)}>
                              {event.category}
                            </Badge>
                            <span className="text-sm text-gray-500">by {event.organizer}</span>
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="flex items-center text-sm text-gray-500">
                              <Heart className="w-4 h-4 mr-1" />
                              {event.likes}
                            </div>
                            <div className="flex items-center text-sm text-gray-500">
                              <MessageCircle className="w-4 h-4 mr-1" />
                              {event.comments}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                              Join Event
                            </Button>
                            <Button size="sm" variant="outline" className="w-full border-blue-200 text-blue-600">
                              <Share2 className="w-4 h-4 mr-1" />
                              Share
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="past" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Past Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastEvents.map((event) => (
                    <div key={event.id} className="p-4 bg-gray-50/70 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{event.title}</h3>
                          <p className="text-sm text-gray-600">{event.date}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1">
                            <span className="text-lg font-bold text-yellow-600">{event.rating}</span>
                            <Heart className="w-4 h-4 text-yellow-500 fill-current" />
                          </div>
                          <p className="text-sm text-gray-500">{event.attendees} attended</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {event.highlights.map((highlight, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hosting" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle>Host Your Own Event</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                    <Calendar className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Create Amazing Community Events</h3>
                    <p className="text-gray-600 mb-6">
                      Connect with fellow creators by hosting workshops, meetups, collaborations, and more. 
                      Our platform makes it easy to organize and manage your events.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-blue-100 flex items-center justify-center">
                        <Users className="w-8 h-8 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-1">Easy Setup</h4>
                      <p className="text-sm text-gray-600">Create events in minutes with our intuitive tools</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-green-100 flex items-center justify-center">
                        <MessageCircle className="w-8 h-8 text-green-600" />
                      </div>
                      <h4 className="font-semibold mb-1">Built-in Promotion</h4>
                      <p className="text-sm text-gray-600">Reach thousands of creators automatically</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-purple-100 flex items-center justify-center">
                        <Heart className="w-8 h-8 text-purple-600" />
                      </div>
                      <h4 className="font-semibold mb-1">Community Support</h4>
                      <p className="text-sm text-gray-600">Get help from our event management team</p>
                    </div>
                  </div>
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    Start Creating Your Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommunityEventsPage;