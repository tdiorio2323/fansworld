import React, { useState } from 'react';
import { Send, MessageCircle, Mail, Phone, Clock, MapPin, HelpCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    category: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    // Handle success/error states here
  };

  const contactOptions = [
    {
      title: 'Live Chat',
      description: 'Chat with our support team',
      icon: MessageCircle,
      availability: 'Available now',
      color: 'text-green-600 bg-green-50'
    },
    {
      title: 'Email Support',
      description: 'support@cabana.com',
      icon: Mail,
      availability: '24/7 response',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      title: 'Phone Support',
      description: '+1 (555) 123-4567',
      icon: Phone,
      availability: 'Mon-Fri 9AM-6PM',
      color: 'text-purple-600 bg-purple-50'
    }
  ];

  const faqTopics = [
    { title: 'Account & Billing', count: 15 },
    { title: 'Content Creation', count: 23 },
    { title: 'Privacy & Security', count: 8 },
    { title: 'Technical Issues', count: 12 },
    { title: 'Payments & Earnings', count: 19 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Get In Touch</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're here to help! Reach out to our support team for assistance with your CABANA experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center text-gray-900">
                  <Send className="h-5 w-5 mr-2 text-purple-600" />
                  Send us a message
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="billing">Billing & Payments</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="content">Content Issues</SelectItem>
                          <SelectItem value="account">Account Help</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        placeholder="Brief description of your issue"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Please provide as much detail as possible..."
                      rows={6}
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Contact Options */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Contact Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactOptions.map((option, index) => {
                  const Icon = option.icon;
                  return (
                    <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-lg ${option.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        <p className="text-sm text-gray-600">{option.description}</p>
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {option.availability}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* FAQ Topics */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2 text-purple-600" />
                  Popular Topics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faqTopics.map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors cursor-pointer">
                      <span className="text-sm font-medium text-gray-700">{topic.title}</span>
                      <Badge variant="outline" className="text-xs">
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  View All FAQ
                </Button>
              </CardContent>
            </Card>

            {/* Office Hours */}
            <Card className="bg-gradient-to-br from-purple-500 to-pink-500 text-white border-0">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Clock className="h-6 w-6 mr-2" />
                  <h3 className="font-semibold">Support Hours</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9AM - 6PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10AM - 4PM EST</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span className="text-sm">New York, NY (EST)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;