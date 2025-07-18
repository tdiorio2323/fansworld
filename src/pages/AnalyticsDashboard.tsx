import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Users, 
  Mail, 
  Crown,
  Link,
  BarChart3,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Filter
} from "lucide-react";
import { LinkTracker } from "@/components/LinkTracker";
import { VipCodeTracker } from "@/components/VipCodeTracker";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DashboardStats {
  waitlist: {
    total_signups: number;
    recent_signups: number;
    sources: Record<string, number>;
  };
  invites: {
    total_invites: number;
    used_invites: number;
    active_invites: number;
    expired_invites: number;
    by_type: Record<string, number>;
  };
  links: {
    total_links: number;
    total_clicks: number;
    unique_clicks: number;
    recent_clicks: number;
  };
}

export function AnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Load waitlist stats
      const { data: waitlistStats, error: waitlistError } = await supabase.rpc('get_waitlist_stats');
      if (waitlistError) throw waitlistError;

      // Load invite stats  
      const { data: inviteStats, error: inviteError } = await supabase.rpc('get_invite_stats');
      if (inviteError) throw inviteError;

      // Load link analytics
      const { data: linkStats, error: linkError } = await supabase.rpc('get_link_analytics');
      if (linkError) throw linkError;

      setStats({
        waitlist: waitlistStats || { total_signups: 0, recent_signups: 0, sources: {} },
        invites: inviteStats || { total_invites: 0, used_invites: 0, active_invites: 0, expired_invites: 0, by_type: {} },
        links: linkStats || { total_links: 0, total_clicks: 0, unique_clicks: 0, recent_clicks: 0 }
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard statistics",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const exportData = async () => {
    try {
      // Get waitlist data
      const { data: waitlistData } = await supabase
        .from('waitlist')
        .select('*')
        .order('created_at', { ascending: false });

      // Get invite data
      const { data: inviteData } = await supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false });

      // Get link tracking data
      const { data: linkData } = await supabase
        .from('link_tracking')
        .select('*')
        .order('created_at', { ascending: false });

      const exportData = {
        exported_at: new Date().toISOString(),
        waitlist: waitlistData,
        invites: inviteData,
        links: linkData,
        summary: stats
      };

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `fansworld-analytics-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Export Complete",
        description: "Analytics data has been downloaded",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export analytics data",
        variant: "destructive"
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-white">Loading dashboard...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white font-['Playfair_Display']">
              Fansworld Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Track waitlist growth, VIP codes, and link performance
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={loadDashboardStats}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Button
              onClick={exportData}
              variant="outline"
              size="sm"
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <Mail className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.waitlist.total_signups}</div>
                <div className="text-gray-400 text-sm">Waitlist Signups</div>
                <div className="text-xs text-green-400 mt-1">
                  +{stats.waitlist.recent_signups} this week
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <Crown className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.invites.active_invites}</div>
                <div className="text-gray-400 text-sm">Active VIP Codes</div>
                <div className="text-xs text-purple-400 mt-1">
                  {stats.invites.used_invites} used
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <Link className="h-8 w-8 text-green-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.links.total_links}</div>
                <div className="text-gray-400 text-sm">Tracked Links</div>
                <div className="text-xs text-green-400 mt-1">
                  {stats.links.total_clicks} total clicks
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">{stats.links.unique_clicks}</div>
                <div className="text-gray-400 text-sm">Unique Visitors</div>
                <div className="text-xs text-purple-400 mt-1">
                  {stats.links.recent_clicks} recent
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-pink-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Math.round((stats.links.unique_clicks / stats.links.total_clicks) * 100) || 0}%
                </div>
                <div className="text-gray-400 text-sm">Click-through Rate</div>
                <div className="text-xs text-pink-400 mt-1">
                  {stats.links.total_clicks} total clicks
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-6 text-center">
                <BarChart3 className="h-8 w-8 text-orange-400 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {Math.round((stats.invites.used_invites / stats.invites.total_invites) * 100) || 0}%
                </div>
                <div className="text-gray-400 text-sm">VIP Conversion</div>
                <div className="text-xs text-orange-400 mt-1">
                  {stats.invites.used_invites}/{stats.invites.total_invites} codes
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Source Breakdown */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Waitlist Sources</CardTitle>
                <CardDescription className="text-gray-300">
                  Where your signups are coming from
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.waitlist.sources || {}).map(([source, count]) => (
                    <div key={source} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                        <span className="text-white capitalize">{source.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                            style={{ 
                              width: `${(count / Math.max(...Object.values(stats.waitlist.sources || {}))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(stats.waitlist.sources || {}).length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      No waitlist data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <CardTitle className="text-white">VIP Code Types</CardTitle>
                <CardDescription className="text-gray-300">
                  Distribution of invite types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.invites.by_type || {}).map(([type, count]) => (
                    <div key={type} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4 text-yellow-400" />
                        <span className="text-white capitalize">{type.replace('_', ' ')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                            style={{ 
                              width: `${(count / Math.max(...Object.values(stats.invites.by_type || {}))) * 100}%` 
                            }}
                          />
                        </div>
                        <span className="text-white font-semibold w-8 text-right">{count}</span>
                      </div>
                    </div>
                  ))}
                  
                  {Object.keys(stats.invites.by_type || {}).length === 0 && (
                    <div className="text-center py-4 text-gray-400">
                      No VIP code data available
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-black/20 border border-white/10">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-purple-600">
              <BarChart3 className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="links" className="text-white data-[state=active]:bg-purple-600">
              <Link className="h-4 w-4 mr-2" />
              Link Tracking
            </TabsTrigger>
            <TabsTrigger value="vip" className="text-white data-[state=active]:bg-purple-600">
              <Crown className="h-4 w-4 mr-2" />
              VIP Codes
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Activity */}
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10 md:col-span-2 lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white">Recent Activity</CardTitle>
                  <CardDescription className="text-gray-300">
                    Latest platform activity and conversions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-blue-400" />
                        <div>
                          <div className="text-white font-medium">New Waitlist Signup</div>
                          <div className="text-xs text-gray-400">from coming_soon_page</div>
                        </div>
                      </div>
                      <Badge className="bg-blue-600/20 text-blue-300">Recent</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <div className="flex items-center gap-3">
                        <Crown className="h-5 w-5 text-yellow-400" />
                        <div>
                          <div className="text-white font-medium">VIP Code Used</div>
                          <div className="text-xs text-gray-400">CREATOR01 → early access</div>
                        </div>
                      </div>
                      <Badge className="bg-green-600/20 text-green-300">Converted</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-black/20 rounded border border-white/10">
                      <div className="flex items-center gap-3">
                        <Link className="h-5 w-5 text-purple-400" />
                        <div>
                          <div className="text-white font-medium">Link Clicked</div>
                          <div className="text-xs text-gray-400">fansworld.lux/l/tdstud</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-600/20 text-purple-300">Tracked</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    onClick={() => window.open('/coming-soon', '_blank')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    View Coming Soon Page
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-yellow-500 text-yellow-300 hover:bg-yellow-500/10"
                    onClick={() => document.querySelector('[data-value="vip"]')?.click()}
                  >
                    <Crown className="h-4 w-4 mr-2" />
                    Create VIP Code
                  </Button>
                  
                  <Button 
                    variant="outline"
                    className="w-full border-blue-500 text-blue-300 hover:bg-blue-500/10"
                    onClick={() => document.querySelector('[data-value="links"]')?.click()}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Track New Link
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="links">
            <LinkTracker />
          </TabsContent>

          <TabsContent value="vip">
            <VipCodeTracker />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}