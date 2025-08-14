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
  RefreshCw,
  Download
} from "lucide-react";
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

// Mock data for demo
const mockStats: DashboardStats = {
  waitlist: {
    total_signups: 2847,
    recent_signups: 127,
    sources: {
      'instagram': 1243,
      'twitter': 847,
      'tiktok': 421,
      'referral': 336
    }
  },
  invites: {
    total_invites: 500,
    used_invites: 284,
    active_invites: 216,
    expired_invites: 0,
    by_type: {
      'creator': 150,
      'influencer': 89,
      'early_access': 45
    }
  },
  links: {
    total_links: 12,
    total_clicks: 5742,
    unique_clicks: 4891,
    recent_clicks: 89
  }
};

export function DemoAnalyticsDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDemoData();
  }, []);

  const loadDemoData = async () => {
    setLoading(true);
    // Simulate loading delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    setStats(mockStats);
    setLoading(false);
    
    toast({
      title: "Demo Mode",
      description: "Showing mock analytics data",
    });
  };

  const exportData = async () => {
    const exportData = {
      exported_at: new Date().toISOString(),
      note: "This is demo data from Cabana platform",
      summary: stats
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cabana-demo-analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Demo Export Complete",
      description: "Demo analytics data has been downloaded",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 p-6">
        <div className="max-w-7xl mx-auto">
          <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
            <CardContent className="p-8 text-center">
              <div className="text-white">Loading demo dashboard...</div>
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
              Cabana Analytics Dashboard
            </h1>
            <p className="text-gray-400 mt-2">
              Track creator growth, VIP codes, and engagement (Demo Mode)
            </p>
            <Badge className="mt-2 bg-purple-600/20 text-purple-300">Demo Data</Badge>
          </div>
          
          <div className="flex items-center gap-3">
            <Button
              onClick={loadDemoData}
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
              Export Demo Data
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
                <div className="text-gray-400 text-sm">Creator Signups</div>
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
                <div className="text-gray-400 text-sm">Engagement Rate</div>
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
                <CardTitle className="text-white">Creator Sources</CardTitle>
                <CardDescription className="text-gray-300">
                  Where your creators are coming from
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
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Demo Notice */}
        <Card className="backdrop-blur-xl bg-blue-600/20 border border-blue-400/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-400" />
              <div>
                <h3 className="text-white font-semibold">Demo Mode Active</h3>
                <p className="text-blue-200 text-sm">
                  This dashboard shows mock data. Connect to Supabase to see real analytics.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
