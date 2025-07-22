import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Link, 
  Copy, 
  ExternalLink, 
  TrendingUp, 
  Users, 
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  BarChart3,
  Plus,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TrackedLink {
  id: string;
  original_url: string;
  short_code: string;
  campaign_name?: string;
  source?: string;
  clicks?: number;
  unique_clicks?: number;
  
  created_at: string;
}

interface LinkAnalytics {
  total_links: number;
  total_clicks: number;
  unique_clicks: number;
  recent_clicks: number;
  top_links: TrackedLink[];
  device_breakdown: Record<string, number>;
  geographic_breakdown: Record<string, number>;
}

export function LinkTracker() {
  const [originalUrl, setOriginalUrl] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [customAlias, setCustomAlias] = useState("");
  const [source, setSource] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [links, setLinks] = useState<TrackedLink[]>([]);
  const [analytics, setAnalytics] = useState<LinkAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = "https://fansworld.lux/l/";

  // Temporarily commented out to resolve parsing error
  /*
  useEffect(() => {
    loadLinks();
    loadAnalytics();
  }, [loadLinks, loadAnalytics]);

  // const loadLinks = useCallback(async () => {
  //   try {
  //     const { data, error } = await supabase
  //       .from('link_tracking')
  //       .select(`
  //         *,
  //         link_clicks
  //       `)
  //       .order('created_at', { ascending: false });

  //     if (error) throw error;

  //     const formattedLinks = data?.map((link: any) => {
  //       const clicks = link.link_clicks?.length || 0;
  //       const uniqueClicks = new Set(link.link_clicks?.map((click: { ip_address: string }) => click.ip_address)).size;
  //       return {
  //         ...link,
  //         clicks,
  //         unique_clicks: uniqueClicks
  //       };
  //     }) || [];

  //     setLinks(formattedLinks);
  //   } catch (error) {
  //     console.error('Error loading links:', error);
  //     toast({
  //       title: "Error",
  //       description: "Failed to load links",
  //       variant: "destructive"
  //     });
  //   } finally {
  //     setLoading(false);
  //   }
  // }, []);
  */

  const loadAnalytics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_link_analytics');
      
      if (error) throw error;
      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    }
  }, []);

  const createLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!originalUrl) return;

    setIsCreating(true);
    
    try {
      const { data, error } = await supabase.rpc('create_tracked_link', {
        original_url: originalUrl,
        campaign_name: campaignName || null,
        source: source || null,
        custom_alias: customAlias || null
      });

      if (error) throw error;

      toast({
        title: "Link Created!",
        description: `Short URL: ${data.short_url}`,
      });

      // Clear form
      setOriginalUrl("");
      setCampaignName("");
      setCustomAlias("");
      setSource("");

      // Reload data
      loadLinks();
      loadAnalytics();
    } catch (error: unknown) {
      console.error('Link creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create link",
        variant: "destructive"
      });
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case 'mobile': return <Smartphone className="h-4 w-4" />;
      case 'tablet': return <Tablet className="h-4 w-4" />;
      case 'desktop': return <Monitor className="h-4 w-4" />;
      default: return <Monitor className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">Link Tracker</h2>
          <p className="text-gray-400">Create and track custom links for your campaigns</p>
        </div>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </Button>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="bg-black/20 border border-white/10">
          <TabsTrigger value="create" className="text-white data-[state=active]:bg-purple-600">
            <Plus className="h-4 w-4 mr-2" />
            Create Link
          </TabsTrigger>
          <TabsTrigger value="links" className="text-white data-[state=active]:bg-purple-600">
            <Link className="h-4 w-4 mr-2" />
            My Links
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white data-[state=active]:bg-purple-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create">
          <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Create Tracked Link</CardTitle>
              <CardDescription className="text-gray-300">
                Generate a custom short link with tracking capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={createLink} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Original URL *</label>
                    <Input
                      type="url"
                      placeholder="https://example.com"
                      value={originalUrl}
                      onChange={(e) => setOriginalUrl(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Campaign Name</label>
                    <Input
                      placeholder="Summer 2024 Launch"
                      value={campaignName}
                      onChange={(e) => setCampaignName(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Custom Alias (Optional)</label>
                    <Input
                      placeholder="my-custom-link"
                      value={customAlias}
                      onChange={(e) => setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                      className="bg-black/20 border-white/10 text-white"
                    />
                    <p className="text-xs text-gray-400">
                      Will be: {baseUrl}{customAlias || 'abc123'}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-white">Source</label>
                    <Input
                      placeholder="email, instagram, twitter"
                      value={source}
                      onChange={(e) => setSource(e.target.value)}
                      className="bg-black/20 border-white/10 text-white"
                    />
                  </div>
                </div>

                <Button 
                  type="submit"
                  disabled={isCreating}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  {isCreating ? "Creating..." : "Create Tracked Link"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links">
          <div className="space-y-4">
            {loading ? (
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardContent className="p-8 text-center">
                  <div className="text-white">Loading links...</div>
                </CardContent>
              </Card>
            ) : links.length === 0 ? (
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardContent className="p-8 text-center">
                  <Link className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">No links yet</h3>
                  <p className="text-gray-400">Create your first tracked link to get started</p>
                </CardContent>
              </Card>
            ) : (
              links.map((link) => (
                <Card key={link.id} className="backdrop-blur-xl bg-black/20 border border-white/10">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-white font-semibold truncate">
                            {link.campaign_name || 'Untitled Link'}
                          </h3>
                          {link.source && (
                            <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">
                              {link.source}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-400">Short URL:</span>
                            <code className="text-purple-300 bg-black/20 px-2 py-1 rounded">
                              {baseUrl}{link.short_code}
                            </code>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => copyToClipboard(`${baseUrl}${link.short_code}`)}
                              className="h-6 w-6 p-0"
                            >
                              <Copy className="h-3 w-3" />
                            </Button>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-400">
                            <span>Target:</span>
                            <span className="truncate">{link.original_url}</span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => window.open(link.original_url, '_blank')}
                              className="h-6 w-6 p-0"
                            >
                              <ExternalLink className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2 ml-4">
                        <div className="flex items-center gap-4 text-sm">
                          <div className="text-center">
                            <div className="text-white font-semibold">{link.clicks || 0}</div>
                            <div className="text-gray-400">Clicks</div>
                          </div>
                          <div className="text-center">
                            
                            <div className="text-gray-400">Unique</div>
                          </div>
                        </div>
                        <div className="text-xs text-gray-400">
                          Created {new Date(link.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          {analytics ? (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                  <CardContent className="p-6 text-center">
                    <TrendingUp className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{analytics.total_clicks}</div>
                    <div className="text-gray-400 text-sm">Total Clicks</div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                  <CardContent className="p-6 text-center">
                    <Users className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{analytics.unique_clicks}</div>
                    <div className="text-gray-400 text-sm">Unique Visitors</div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                  <CardContent className="p-6 text-center">
                    <Link className="h-8 w-8 text-green-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{analytics.total_links}</div>
                    <div className="text-gray-400 text-sm">Active Links</div>
                  </CardContent>
                </Card>
                
                <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                  <CardContent className="p-6 text-center">
                    <BarChart3 className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">{analytics.recent_clicks}</div>
                    <div className="text-gray-400 text-sm">Last 7 Days</div>
                  </CardContent>
                </Card>
              </div>

              {/* Device Breakdown */}
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Device Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.device_breakdown || {}).map(([device, count]) => (
                      <div key={device} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getDeviceIcon(device)}
                          <span className="text-white capitalize">{device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                              style={{ 
                                width: `${(count / Math.max(...Object.values(analytics.device_breakdown || {}))) * 100}%` 
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

              {/* Geographic Breakdown */}
              <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Geographic Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(analytics.geographic_breakdown || {}).slice(0, 10).map(([country, count]) => (
                      <div key={country} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-400" />
                          <span className="text-white">{country === 'unknown' ? 'Unknown' : country}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ 
                                width: `${(count / Math.max(...Object.values(analytics.geographic_breakdown || {}))) * 100}%` 
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
          ) : (
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardContent className="p-8 text-center">
                <div className="text-white">Loading analytics...</div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}