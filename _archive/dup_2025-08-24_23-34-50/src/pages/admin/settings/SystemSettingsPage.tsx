import React, { useState } from 'react';
import { 
  Settings, Shield, Bell, Mail, Database, Server,
  Key, Users, DollarSign, Globe, Lock, Eye,
  Save, RefreshCw, AlertTriangle, CheckCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

const SystemSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    userRegistration: true,
    emailNotifications: true,
    smsNotifications: false,
    twoFactorAuth: true,
    contentModeration: true
  });

  const toggleSetting = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            System Settings
          </h1>
          <p className="text-xl text-muted-foreground">
            Configure platform-wide settings and preferences
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button className="btn-luxury">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 glass-morphism border-white/20">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card className="card-glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Platform Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input id="siteName" defaultValue="CABANA" className="glass-morphism" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input id="siteUrl" defaultValue="https://cabana.com" className="glass-morphism" />
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">Maintenance Mode</h4>
                  <p className="text-sm text-muted-foreground">Temporarily disable site access for updates</p>
                </div>
                <Switch 
                  checked={settings.maintenanceMode} 
                  onCheckedChange={() => toggleSetting('maintenanceMode')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">User Registration</h4>
                  <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                </div>
                <Switch 
                  checked={settings.userRegistration} 
                  onCheckedChange={() => toggleSetting('userRegistration')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="card-glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">Two-Factor Authentication</h4>
                  <p className="text-sm text-muted-foreground">Require 2FA for admin accounts</p>
                </div>
                <Switch 
                  checked={settings.twoFactorAuth} 
                  onCheckedChange={() => toggleSetting('twoFactorAuth')}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Session Timeout (minutes)</Label>
                  <Input defaultValue="30" className="glass-morphism" />
                </div>
                <div className="space-y-2">
                  <Label>Max Login Attempts</Label>
                  <Input defaultValue="5" className="glass-morphism" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-muted-foreground">Send email notifications for important events</p>
                </div>
                <Switch 
                  checked={settings.emailNotifications} 
                  onCheckedChange={() => toggleSetting('emailNotifications')}
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
                <div>
                  <h4 className="font-medium">SMS Notifications</h4>
                  <p className="text-sm text-muted-foreground">Send SMS alerts for critical issues</p>
                </div>
                <Switch 
                  checked={settings.smsNotifications} 
                  onCheckedChange={() => toggleSetting('smsNotifications')}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-6">
          <Card className="card-glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Payment Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Platform Fee (%)</Label>
                  <Input defaultValue="15" className="glass-morphism" />
                </div>
                <div className="space-y-2">
                  <Label>Minimum Payout ($)</Label>
                  <Input defaultValue="50" className="glass-morphism" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Supported Payment Methods</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                    <span className="text-sm">Credit Cards</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                    <span className="text-sm">PayPal</span>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                    <span className="text-sm">Crypto</span>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-gradient-glass border border-white/10">
                    <span className="text-sm">Bank Transfer</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card className="card-glass border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="h-5 w-5" />
                Advanced Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>CDN Endpoint</Label>
                  <Input defaultValue="https://cdn.cabana.com" className="glass-morphism" />
                </div>
                <div className="space-y-2">
                  <Label>API Rate Limit</Label>
                  <Input defaultValue="1000" className="glass-morphism" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Custom CSS</Label>
                <Textarea 
                  placeholder="Enter custom CSS rules..." 
                  rows={6} 
                  className="glass-morphism"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SystemSettingsPage;