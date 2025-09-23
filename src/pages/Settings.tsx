import { useState } from "react";
import { motion } from "framer-motion";
// Removed broken image import - using CSS gradient instead
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  CreditCard,
  Eye,
  EyeOff,
  Upload,
  Save,
  Trash2,
  Moon,
  Sun,
  Monitor,
  Smartphone,
  Mail,
  MessageSquare,
  Heart,
  DollarSign,
  ArrowLeft,
  Settings as SettingsIcon
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface ProfileData {
  displayName: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  website: string;
  birthDate: string;
  avatar: string;
  coverImage: string;
  subscriptionPrice: string;
  isVerified: boolean;
  isPremium: boolean;
}

interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  newSubscribers: boolean;
  newMessages: boolean;
  newTips: boolean;
  newComments: boolean;
  subscriptionExpiring: boolean;
  marketingEmails: boolean;
  weeklyReports: boolean;
}

interface PrivacySettings {
  profileVisibility: 'public' | 'subscribers' | 'private';
  showOnlineStatus: boolean;
  allowDirectMessages: 'everyone' | 'subscribers' | 'none';
  showEarnings: boolean;
  showSubscriberCount: boolean;
  allowContentDownload: boolean;
  requirePaymentForMessages: boolean;
  minimumTipAmount: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: "Lilu ✨",
    username: "lilu_f",
    email: "lilu@example.com",
    bio: "Content creator sharing my lifestyle and exclusive moments. Join my world! 💎\n\n✨ Daily posts\n💌 Personal messages\n🔥 Exclusive content",
    location: "Los Angeles, CA",
    website: "linktr.ee/lilu_f",
    birthDate: "1995-06-15",
    avatar: "/placeholder.svg",
    coverImage: "/placeholder.svg",
    subscriptionPrice: "12.99",
    isVerified: true,
    isPremium: true
  });

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    newSubscribers: true,
    newMessages: true,
    newTips: true,
    newComments: false,
    subscriptionExpiring: true,
    marketingEmails: false,
    weeklyReports: true
  });

  const handleFileUpload = (type: 'avatar' | 'cover') => {
    alert(`${type === 'avatar' ? 'Profile picture' : 'Cover image'} upload functionality coming soon!`);
  };

  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: 'public',
    showOnlineStatus: true,
    allowDirectMessages: 'subscribers',
    showEarnings: false,
    showSubscriberCount: true,
    allowContentDownload: false,
    requirePaymentForMessages: false,
    minimumTipAmount: '5.00'
  });

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const updateProfileData = (field: keyof ProfileData, value: string | boolean) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const updateNotification = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const updatePrivacy = (field: keyof PrivacySettings, value: string | boolean) => {
    setPrivacy(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    // Handle save profile logic
    console.log('Saving profile:', profileData);
    alert('Profile saved successfully! 🎉');
  };

  const handleChangePassword = () => {
    // Handle password change logic
    console.log('Changing password');
  };

  return (
    <div 
      className="min-h-screen bg-background relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(94, 234, 212, 0.2) 0%, rgba(147, 51, 234, 0.2) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
      
      <div className="glass-morphism border-b border-border/60 sticky top-0 z-40 backdrop-blur-3xl">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => window.history.back()}
                className="p-2 text-foreground hover:bg-accent"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <SettingsIcon className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">Settings</h1>
                  <p className="text-xs text-muted-foreground">Account preferences</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="glass-morphism border border-border/60 p-1 grid grid-cols-2 lg:grid-cols-5 backdrop-blur-2xl bg-background/75">
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center gap-2 text-foreground"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center gap-2 text-foreground"
            >
              <Lock className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center gap-2 text-foreground"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger 
              value="privacy" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center gap-2 text-foreground"
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="data-[state=active]:bg-gradient-primary data-[state=active]:text-white flex items-center gap-2 text-foreground"
            >
              <CreditCard className="w-4 h-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            {/* Profile Picture & Cover */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    Profile Media
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Upload your profile picture and cover image
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex flex-col sm:flex-row gap-6">
                    <div className="text-center">
                      <Avatar className="w-24 h-24 mx-auto mb-4 ring-4 ring-border/40">
                        <AvatarImage src={profileData.avatar} />
                        <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                          {profileData.displayName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border/60 hover:bg-accent text-foreground"
                        onClick={() => handleFileUpload('avatar')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Avatar
                      </Button>
                    </div>
                    
                    <div className="flex-1">
                      <div className="aspect-[3/1] bg-muted rounded-xl mb-4 overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                          <div className="text-center">
                            <Upload className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">Cover photo</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-border/60 hover:bg-accent text-foreground"
                        onClick={() => handleFileUpload('cover')}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Change Cover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Basic Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="text-foreground">Basic Information</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Update your profile information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="displayName" className="text-foreground font-medium">Display Name</Label>
                      <Input
                        id="displayName"
                        value={profileData.displayName}
                        onChange={(e) => updateProfileData('displayName', e.target.value)}
                        className="mt-1 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="username" className="text-foreground font-medium">Username</Label>
                      <Input
                        id="username"
                        value={profileData.username}
                        onChange={(e) => updateProfileData('username', e.target.value)}
                        className="mt-1 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => updateProfileData('email', e.target.value)}
                        className="mt-1 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subscriptionPrice" className="text-foreground font-medium">Subscription Price</Label>
                      <div className="relative mt-1">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="subscriptionPrice"
                          type="number"
                          value={profileData.subscriptionPrice}
                          onChange={(e) => updateProfileData('subscriptionPrice', e.target.value)}
                          className="pl-10 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                          step="0.01"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="bio" className="text-foreground font-medium">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => updateProfileData('bio', e.target.value)}
                      className="mt-1 min-h-[120px] border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                      placeholder="Tell your fans about yourself..."
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={handleSaveProfile} className="btn-chrome">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    Security Settings
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Keep your account safe and secure
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword" className="text-foreground font-medium">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwords.currentPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, currentPassword: e.target.value}))}
                        className="mt-1 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="newPassword" className="text-foreground font-medium">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwords.newPassword}
                        onChange={(e) => setPasswords(prev => ({...prev, newPassword: e.target.value}))}
                        className="mt-1 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                      />
                    </div>

                    <Button onClick={handleChangePassword} className="btn-chrome">
                      Update Password
                    </Button>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-600">
                        Add extra security to your account
                      </p>
                    </div>
                    <Button variant="outline" className="border-border/60 hover:bg-accent text-foreground">
                      Enable 2FA
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                      <Bell className="w-5 h-5 text-white" />
                    </div>
                    Notifications
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    Choose how you want to be notified
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    {[
                      { id: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email', checked: notifications.emailNotifications },
                      { id: 'pushNotifications', label: 'Push Notifications', desc: 'Get notifications on your device', checked: notifications.pushNotifications },
                      { id: 'newSubscribers', label: 'New Subscribers', desc: 'When someone subscribes', checked: notifications.newSubscribers },
                      { id: 'newMessages', label: 'New Messages', desc: 'Direct message alerts', checked: notifications.newMessages }
                    ].map(item => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                        <div>
                          <p className="font-medium text-foreground">{item.label}</p>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </div>
                        <Switch
                          checked={item.checked}
                          onCheckedChange={(checked) => updateNotification(item.id as keyof NotificationSettings, checked)}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-foreground font-medium">Profile Visibility</Label>
                    <Select value={privacy.profileVisibility} onValueChange={(value) => updatePrivacy('profileVisibility', value)}>
                      <SelectTrigger className="mt-1 border-border/60 bg-background text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">Public</SelectItem>
                        <SelectItem value="subscribers">Subscribers Only</SelectItem>
                        <SelectItem value="private">Private</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-muted/30 rounded-xl">
                    <div>
                      <p className="font-medium text-foreground">Show Subscriber Count</p>
                      <p className="text-sm text-muted-foreground">Display publicly</p>
                    </div>
                    <Switch
                      checked={privacy.showSubscriberCount}
                      onCheckedChange={(checked) => updatePrivacy('showSubscriberCount', checked)}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="billing" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass-morphism border border-border/60 backdrop-blur-2xl bg-background/75">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-foreground">
                    <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                      <CreditCard className="w-5 h-5 text-white" />
                    </div>
                    Billing & Payouts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-gray-700 font-medium">Minimum Tip Amount</Label>
                    <div className="relative mt-1">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="number"
                        value={privacy.minimumTipAmount}
                        onChange={(e) => updatePrivacy('minimumTipAmount', e.target.value)}
                        className="pl-10 border-border/60 focus:border-primary focus:ring-primary bg-background text-foreground"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  </div>
                  
                  <Button variant="outline" className="w-full border-border/60 hover:bg-accent text-foreground">
                    <CreditCard className="w-4 h-4 mr-2" />
                    Manage Payout Methods
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}