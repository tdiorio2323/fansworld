import React, { useState } from 'react';
import { Settings, User, Shield, Bell, CreditCard, Eye, Lock, Globe, Palette, Download, Save } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

const CreatorSettingsPage = () => {
  const [profileData, setProfileData] = useState({
    displayName: 'Sophia Chen',
    username: 'sophiachen',
    bio: 'Fashion & lifestyle content creator ✨ Sharing my journey through style, travel, and self-discovery.',
    email: 'sophia@example.com',
    location: 'New York, NY',
    website: 'https://sophiachen.com'
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowMessages: true,
    requireSubscription: false,
    showTips: true,
    contentWatermark: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    newSubscribers: true,
    newMessages: true,
    paymentUpdates: true,
    marketingEmails: false
  });

  const [paymentSettings, setPaymentSettings] = useState({
    subscriptionPrice: '15.99',
    currency: 'USD',
    payoutMethod: 'bank',
    autoWithdraw: false,
    minimumTip: '5.00'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
            Creator Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and preferences</p>
        </div>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/70 backdrop-blur-sm">
            <TabsTrigger value="profile" className="flex items-center space-x-2">
              <User className="w-4 h-4" />
              <span>Profile</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="w-4 h-4" />
              <span>Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger value="advanced" className="flex items-center space-x-2">
              <Settings className="w-4 h-4" />
              <span>Advanced</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-purple-600" />
                  Profile Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616c2f8b93e?w=150" />
                    <AvatarFallback>SC</AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                      Upload New Photo
                    </Button>
                    <p className="text-sm text-gray-500">Recommended: 400x400px, max 5MB</p>
                  </div>
                </div>

                {/* Profile Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="displayName">Display Name</Label>
                    <Input
                      id="displayName"
                      value={profileData.displayName}
                      onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={profileData.username}
                      onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                      placeholder="@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={profileData.location}
                      onChange={(e) => setProfileData({...profileData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                    rows={4}
                    placeholder="Tell your fans about yourself..."
                  />
                  <p className="text-sm text-gray-500">{profileData.bio.length}/500 characters</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({...profileData, website: e.target.value})}
                    placeholder="https://yourwebsite.com"
                  />
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Privacy Settings */}
          <TabsContent value="privacy" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-purple-600" />
                  Privacy & Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Profile Visibility</Label>
                      <p className="text-sm text-gray-500">Control who can see your profile</p>
                    </div>
                    <Select value={privacySettings.profileVisibility}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="subscribers">Subscribers</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Show Online Status</Label>
                      <p className="text-sm text-gray-500">Let fans know when you're online</p>
                    </div>
                    <Switch
                      checked={privacySettings.showOnlineStatus}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, showOnlineStatus: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Allow Messages</Label>
                      <p className="text-sm text-gray-500">Let fans send you direct messages</p>
                    </div>
                    <Switch
                      checked={privacySettings.allowMessages}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, allowMessages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Require Subscription</Label>
                      <p className="text-sm text-gray-500">Only subscribers can message you</p>
                    </div>
                    <Switch
                      checked={privacySettings.requireSubscription}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, requireSubscription: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Content Watermark</Label>
                      <p className="text-sm text-gray-500">Add watermark to protect your content</p>
                    </div>
                    <Switch
                      checked={privacySettings.contentWatermark}
                      onCheckedChange={(checked) => setPrivacySettings({...privacySettings, contentWatermark: checked})}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                    <Save className="w-4 h-4 mr-2" />
                    Save Privacy Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="w-5 h-5 mr-2 text-purple-600" />
                  Notification Preferences
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive notifications via email</p>
                    </div>
                    <Switch
                      checked={notificationSettings.emailNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, emailNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Push Notifications</Label>
                      <p className="text-sm text-gray-500">Get real-time push notifications</p>
                    </div>
                    <Switch
                      checked={notificationSettings.pushNotifications}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, pushNotifications: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Subscribers</Label>
                      <p className="text-sm text-gray-500">Notify when someone subscribes</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newSubscribers}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newSubscribers: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>New Messages</Label>
                      <p className="text-sm text-gray-500">Alert for new direct messages</p>
                    </div>
                    <Switch
                      checked={notificationSettings.newMessages}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, newMessages: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payment Updates</Label>
                      <p className="text-sm text-gray-500">Notifications for earnings and payouts</p>
                    </div>
                    <Switch
                      checked={notificationSettings.paymentUpdates}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, paymentUpdates: checked})}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive promotional content and tips</p>
                    </div>
                    <Switch
                      checked={notificationSettings.marketingEmails}
                      onCheckedChange={(checked) => setNotificationSettings({...notificationSettings, marketingEmails: checked})}
                    />
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Notification Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payments" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
                  Payment Configuration
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subscriptionPrice">Subscription Price</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <Input
                        id="subscriptionPrice"
                        value={paymentSettings.subscriptionPrice}
                        onChange={(e) => setPaymentSettings({...paymentSettings, subscriptionPrice: e.target.value})}
                        placeholder="15.99"
                      />
                      <span className="text-gray-500">/ month</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="minimumTip">Minimum Tip Amount</Label>
                    <div className="flex items-center space-x-2">
                      <span className="text-gray-500">$</span>
                      <Input
                        id="minimumTip"
                        value={paymentSettings.minimumTip}
                        onChange={(e) => setPaymentSettings({...paymentSettings, minimumTip: e.target.value})}
                        placeholder="5.00"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Payout Method</Label>
                      <p className="text-sm text-gray-500">How you receive your earnings</p>
                    </div>
                    <Select value={paymentSettings.payoutMethod}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank">Bank Transfer</SelectItem>
                        <SelectItem value="paypal">PayPal</SelectItem>
                        <SelectItem value="crypto">Cryptocurrency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Auto Withdraw</Label>
                      <p className="text-sm text-gray-500">Automatically withdraw weekly earnings</p>
                    </div>
                    <Switch
                      checked={paymentSettings.autoWithdraw}
                      onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, autoWithdraw: checked})}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Tax Information</h4>
                    <p className="text-sm text-blue-700 mb-3">
                      Please ensure your tax information is up to date for accurate reporting.
                    </p>
                    <Button variant="outline" className="border-blue-200 text-blue-600">
                      Update Tax Info
                    </Button>
                  </div>
                </div>

                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Save className="w-4 h-4 mr-2" />
                  Save Payment Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-purple-600" />
                  Advanced Options
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Data Export</h4>
                    <p className="text-sm text-yellow-700 mb-3">
                      Download a copy of all your CABANA data including content, messages, and analytics.
                    </p>
                    <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export My Data
                    </Button>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Account Deactivation</h4>
                    <p className="text-sm text-red-700 mb-3">
                      Temporarily disable your account. You can reactivate it anytime.
                    </p>
                    <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50">
                      Deactivate Account
                    </Button>
                  </div>

                  <div className="bg-gray-900 p-4 rounded-lg">
                    <h4 className="font-semibold text-white mb-2">Delete Account</h4>
                    <p className="text-sm text-gray-300 mb-3">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive">
                      Delete Account Permanently
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CreatorSettingsPage;