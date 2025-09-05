import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  User,
  Mail,
  Phone,
  Globe,
  DollarSign,
  BarChart3,
  Settings,
  Palette,
  Link,
  Eye,
  Copy,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Calendar,
  TrendingUp,
  Users,
  MousePointer,
  ExternalLink
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  phone?: string;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'pending';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  created_at: string;
  last_active: string;
  total_clicks: number;
  total_links: number;
  monthly_revenue: number;
  conversion_rate: number;
  website_url?: string;
  bio?: string;
  custom_domain?: string;
}

interface ClientDetailModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (client: Client) => void;
  onDelete: (clientId: string) => void;
}

export const ClientDetailModal = ({
  client,
  isOpen,
  onClose,
  onSave,
  onDelete
}: ClientDetailModalProps) => {
  const [editedClient, setEditedClient] = useState<Client | null>(client);
  const [activeTab, setActiveTab] = useState('profile');
  const [isDeleting, setIsDeleting] = useState(false);

  // Mock analytics data
  const analytics = {
    weeklyClicks: [120, 150, 180, 220, 190, 240, 280],
    topLinks: [
      { name: 'Instagram', clicks: 1250, url: 'https://instagram.com/user' },
      { name: 'YouTube', clicks: 890, url: 'https://youtube.com/user' },
      { name: 'Website', clicks: 670, url: 'https://website.com' },
      { name: 'Store', clicks: 450, url: 'https://store.com' }
    ],
    recentActivity: [
      { action: 'Link clicked', details: 'Instagram link', time: '2 minutes ago' },
      { action: 'Profile viewed', details: 'From mobile device', time: '5 minutes ago' },
      { action: 'Link added', details: 'New TikTok link', time: '1 hour ago' },
      { action: 'Theme updated', details: 'Changed to dark theme', time: '3 hours ago' }
    ]
  };

  const handleSave = () => {
    if (editedClient) {
      onSave(editedClient);
      onClose();
    }
  };

  const handleDelete = async () => {
    if (client && isDeleting) {
      onDelete(client.id);
      onClose();
    }
  };

  if (!client) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] overflow-hidden">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                {client.name.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <DialogTitle className="text-2xl">{client.name}</DialogTitle>
                <DialogDescription>@{client.username}</DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={`${
                client.status === 'active' ? 'bg-green-500/20 text-green-300' :
                client.status === 'inactive' ? 'bg-red-500/20 text-red-300' :
                'bg-yellow-500/20 text-yellow-300'
              }`}>
                {client.status}
              </Badge>
              <Badge className={`${
                client.subscription_tier === 'enterprise' ? 'bg-purple-500/20 text-purple-300' :
                client.subscription_tier === 'premium' ? 'bg-blue-500/20 text-blue-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {client.subscription_tier}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="w-4 h-4" />
              Links
            </TabsTrigger>
            <TabsTrigger value="appearance" className="flex items-center gap-2">
              <Palette className="w-4 h-4" />
              Appearance
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={editedClient?.name || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, name: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={editedClient?.username || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, username: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={editedClient?.email || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, email: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={editedClient?.phone || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, phone: e.target.value} : null)}
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="status">Account Status</Label>
                      <Select 
                        value={editedClient?.status} 
                        onValueChange={(value: 'active' | 'inactive' | 'pending') => 
                          setEditedClient(prev => prev ? {...prev, status: value} : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="tier">Subscription Tier</Label>
                      <Select 
                        value={editedClient?.subscription_tier} 
                        onValueChange={(value: 'basic' | 'premium' | 'enterprise') => 
                          setEditedClient(prev => prev ? {...prev, subscription_tier: value} : null)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="basic">Basic</SelectItem>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="enterprise">Enterprise</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="domain">Custom Domain</Label>
                      <Input
                        id="domain"
                        placeholder="custom-domain.com"
                        value={editedClient?.custom_domain || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, custom_domain: e.target.value} : null)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        placeholder="Client bio..."
                        value={editedClient?.bio || ''}
                        onChange={(e) => setEditedClient(prev => prev ? {...prev, bio: e.target.value} : null)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-bold">{client.total_clicks.toLocaleString()}</p>
                      </div>
                      <MousePointer className="h-8 w-8 text-blue-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Links</p>
                        <p className="text-2xl font-bold">{client.total_links}</p>
                      </div>
                      <Link className="h-8 w-8 text-green-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                        <p className="text-2xl font-bold">${client.monthly_revenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-yellow-500" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                        <p className="text-2xl font-bold">{client.conversion_rate.toFixed(1)}%</p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-purple-500" />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Clicks</CardTitle>
                    <CardDescription>Click performance over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-40 flex items-end justify-between gap-2">
                      {analytics.weeklyClicks.map((clicks, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <div
                            className="bg-primary/20 rounded-t transition-all duration-300 hover:bg-primary/30"
                            style={{
                              height: `${(clicks / Math.max(...analytics.weeklyClicks)) * 120}px`,
                              width: '20px'
                            }}
                          />
                          <span className="text-xs text-muted-foreground">{clicks}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Performing Links</CardTitle>
                    <CardDescription>Most clicked links this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {analytics.topLinks.map((link, index) => (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{link.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-32">{link.url}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{link.clicks.toLocaleString()}</span>
                            <Button variant="ghost" size="sm">
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest actions and events</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {analytics.recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{activity.action}</p>
                          <p className="text-sm text-muted-foreground">{activity.details}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="links" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Link Management</CardTitle>
                      <CardDescription>Manage client's link-in-bio content</CardDescription>
                    </div>
                    <Button>
                      <Link className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Link className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Link Management</h3>
                    <p className="text-muted-foreground">Link management interface coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Theme Customization</CardTitle>
                  <CardDescription>Customize the client's link-in-bio appearance</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Palette className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Theme Editor</h3>
                    <p className="text-muted-foreground">Theme customization tools coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Advanced Settings</CardTitle>
                  <CardDescription>Configure advanced client settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Analytics Tracking</h4>
                      <p className="text-sm text-muted-foreground">Enable detailed analytics collection</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SEO Optimization</h4>
                      <p className="text-sm text-muted-foreground">Optimize page for search engines</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Social Media Integration</h4>
                      <p className="text-sm text-muted-foreground">Enable social media auto-posting</p>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">White Label Mode</h4>
                      <p className="text-sm text-muted-foreground">Remove Cabana branding</p>
                    </div>
                    <Switch />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-red-600">Danger Zone</CardTitle>
                  <CardDescription>Irreversible and destructive actions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                      <div>
                        <h4 className="font-medium text-red-600">Delete Client Account</h4>
                        <p className="text-sm text-muted-foreground">
                          Permanently delete this client and all associated data
                        </p>
                      </div>
                      <Button
                        variant="destructive"
                        onClick={() => setIsDeleting(true)}
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => window.open(`/preview/${client.username}`, '_blank')}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button variant="outline">
              <Copy className="h-4 w-4 mr-2" />
              Clone
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {isDeleting && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-background p-6 rounded-lg max-w-md"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <h3 className="text-lg font-semibold mb-2">Delete Client Account</h3>
                <p className="text-muted-foreground mb-4">
                  Are you sure you want to delete {client.name}'s account? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsDeleting(false)}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    Delete Account
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
};