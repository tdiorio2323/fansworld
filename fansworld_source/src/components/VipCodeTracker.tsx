import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Crown, 
  Copy, 
  Mail, 
  MessageSquare,
  Share2,
  Users,
  Key,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface VipCode {
  id: string;
  code: string;
  email?: string;
  used: boolean;
  used_by?: string;
  used_at?: string;
  expires_at?: string;
  invite_type: string;
  created_at: string;
}

interface VipLink {
  id: string;
  vip_code: string;
  tracking_url: string;
  short_code: string;
  sent_to?: string;
  sent_via: string;
  campaign_name?: string;
  created_at: string;
}

export function VipCodeTracker() {
  const [vipCode, setVipCode] = useState("");
  const [sentTo, setSentTo] = useState("");
  const [sentVia, setSentVia] = useState("email");
  const [campaignName, setCampaignName] = useState("");
  const [bulkEmails, setBulkEmails] = useState("");
  const [isCreatingLink, setIsCreatingLink] = useState(false);
  const [isCreatingCode, setIsCreatingCode] = useState(false);
  const [vipCodes, setVipCodes] = useState<VipCode[]>([]);
  const [vipLinks, setVipLinks] = useState<VipLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const baseUrl = "https://fansworld.lux/vip/";

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = useCallback(async () => {
    try {
      // Load VIP codes
      const { data: codesData, error: codesError } = await supabase
        .from('invites')
        .select('*')
        .order('created_at', { ascending: false });

      if (codesError) throw codesError;
      setVipCodes(codesData || []);

      // Load VIP tracking links
      const { data: linksData, error: linksError } = await supabase
        .from('vip_link_tracking')
        .select('*')
        .order('created_at', { ascending: false });

      if (linksError) throw linksError;
      setVipLinks(linksData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load VIP data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createVipCode = async () => {
    setIsCreatingCode(true);
    
    try {
      const { data, error } = await supabase.rpc('create_invite_code', {
        invite_type: 'early_access',
        expires_days: 30
      });

      if (error) throw error;

      toast({
        title: "VIP Code Created!",
        description: `New code: ${data}`,
      });

      loadData();
    } catch (error: unknown) {
      console.error('VIP code creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create VIP code",
        variant: "destructive"
      });
    } finally {
      setIsCreatingCode(false);
    }
  };

  const createVipLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vipCode || !sentTo) return;

    setIsCreatingLink(true);
    
    try {
      const { data, error } = await supabase.rpc('create_vip_access_link', {
        vip_code: vipCode,
        sent_to: sentTo,
        sent_via: sentVia,
        campaign_name: campaignName || null
      });

      if (error) throw error;

      toast({
        title: "VIP Link Created!",
        description: `Tracking URL: ${data.short_url}`,
      });

      // Clear form
      setVipCode("");
      setSentTo("");
      setCampaignName("");

      loadData();
    } catch (error: unknown) {
      console.error('VIP link creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create VIP link",
        variant: "destructive"
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const createBulkVipLinks = async () => {
    if (!vipCode || !bulkEmails.trim()) return;

    const emails = bulkEmails.split('\n').map(email => email.trim()).filter(email => email);
    setIsCreatingLink(true);

    try {
      const promises = emails.map(email => 
        supabase.rpc('create_vip_access_link', {
          vip_code: vipCode,
          sent_to: email,
          sent_via: 'bulk_email',
          campaign_name: campaignName || 'Bulk VIP Distribution'
        })
      );

      const results = await Promise.all(promises);
      
      toast({
        title: "Bulk VIP Links Created!",
        description: `Created ${emails.length} tracking links`,
      });

      setBulkEmails("");
      loadData();
    } catch (error: unknown) {
      console.error('Bulk VIP link creation error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create bulk VIP links",
        variant: "destructive"
      });
    } finally {
      setIsCreatingLink(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    });
  };

  const getStatusBadge = (code: VipCode) => {
    if (code.used) {
      return <Badge className="bg-green-600/20 text-green-300">Used</Badge>;
    }
    if (code.expires_at && new Date(code.expires_at) < new Date()) {
      return <Badge className="bg-red-600/20 text-red-300">Expired</Badge>;
    }
    return <Badge className="bg-yellow-600/20 text-yellow-300">Active</Badge>;
  };

  const getSentViaIcon = (sentVia: string) => {
    switch (sentVia) {
      case 'email': return <Mail className="h-4 w-4" />;
      case 'sms': return <MessageSquare className="h-4 w-4" />;
      case 'social': return <Share2 className="h-4 w-4" />;
      default: return <Share2 className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
        <CardContent className="p-8 text-center">
          <div className="text-white">Loading VIP tracker...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white">VIP Code Tracker</h2>
          <p className="text-gray-400">Manage and track VIP access codes for top creators</p>
        </div>
        <Button 
          onClick={createVipCode}
          disabled={isCreatingCode}
          className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          {isCreatingCode ? "Creating..." : "New VIP Code"}
        </Button>
      </div>

      {/* Create VIP Tracking Link */}
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-400" />
            Create VIP Tracking Link
          </CardTitle>
          <CardDescription className="text-gray-300">
            Generate a trackable link for VIP code distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={createVipLink} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">VIP Code *</label>
                <Select value={vipCode} onValueChange={setVipCode}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue placeholder="Select a VIP code" />
                  </SelectTrigger>
                  <SelectContent>
                    {vipCodes.filter(code => !code.used).map((code) => (
                      <SelectItem key={code.code} value={code.code}>
                        {code.code} - {code.invite_type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Send To *</label>
                <Input
                  placeholder="creator@example.com or @username"
                  value={sentTo}
                  onChange={(e) => setSentTo(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Send Via</label>
                <Select value={sentVia} onValueChange={setSentVia}>
                  <SelectTrigger className="bg-black/20 border-white/10 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                    <SelectItem value="social">Social Media</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">Campaign Name</label>
                <Input
                  placeholder="VIP Creator Outreach"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  className="bg-black/20 border-white/10 text-white"
                />
              </div>
            </div>

            <Button 
              type="submit"
              disabled={isCreatingLink}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              {isCreatingLink ? "Creating..." : "Create VIP Link"}
            </Button>
          </form>

          {/* Bulk Creation */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <h3 className="text-white font-semibold mb-4">Bulk VIP Link Creation</h3>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter email addresses, one per line..."
                value={bulkEmails}
                onChange={(e) => setBulkEmails(e.target.value)}
                className="bg-black/20 border-white/10 text-white min-h-[100px]"
              />
              <Button 
                onClick={createBulkVipLinks}
                disabled={isCreatingLink || !vipCode || !bulkEmails.trim()}
                variant="outline"
                className="border-purple-500 text-purple-300 hover:bg-purple-500/10"
              >
                Create Bulk VIP Links ({bulkEmails.split('\n').filter(e => e.trim()).length} emails)
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* VIP Codes Overview */}
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Active VIP Codes</CardTitle>
          <CardDescription className="text-gray-300">
            Manage your VIP access codes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vipCodes.slice(0, 10).map((code) => (
              <div key={code.id} className="flex items-center justify-between p-4 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-center gap-3">
                  <Key className="h-5 w-5 text-yellow-400" />
                  <div>
                    <div className="flex items-center gap-2">
                      <code className="text-white font-mono text-lg">{code.code}</code>
                      {getStatusBadge(code)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {code.invite_type} • Created {new Date(code.created_at).toLocaleDateString()}
                      {code.expires_at && (
                        <> • Expires {new Date(code.expires_at).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {code.used ? (
                    <div className="text-center">
                      <CheckCircle className="h-5 w-5 text-green-400 mx-auto" />
                      <div className="text-xs text-gray-400">Used</div>
                    </div>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(code.code)}
                      className="text-purple-300 hover:text-purple-200"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
            
            {vipCodes.length === 0 && (
              <div className="text-center py-8">
                <Crown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No VIP codes yet</h3>
                <p className="text-gray-400">Create your first VIP code to get started</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* VIP Tracking Links */}
      <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">VIP Tracking Links</CardTitle>
          <CardDescription className="text-gray-300">
            Monitor your VIP code distribution
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vipLinks.map((link) => (
              <div key={link.id} className="p-4 bg-black/20 rounded-lg border border-white/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <code className="text-purple-300 font-mono">{link.vip_code}</code>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {link.campaign_name || 'No campaign'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">Tracking URL:</span>
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
                      
                      <div className="flex items-center gap-4 text-gray-400">
                        <div className="flex items-center gap-1">
                          {getSentViaIcon(link.sent_via)}
                          <span>Sent via {link.sent_via}</span>
                        </div>
                        {link.sent_to && (
                          <div>
                            To: {link.sent_to}
                          </div>
                        )}
                        <div>
                          {new Date(link.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {vipLinks.length === 0 && (
              <div className="text-center py-8">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-white text-lg font-semibold mb-2">No tracking links yet</h3>
                <p className="text-gray-400">Create your first VIP tracking link to monitor distribution</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}