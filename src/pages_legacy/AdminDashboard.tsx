import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AdminInviteManager } from "@/components/AdminInviteManager";
import { ReferralManagement } from "@/components/admin/ReferralManagement";
import Navbar from "@/components/Navbar";
import { 
  Users, 
  UserPlus, 
  Shield, 
  Settings,
  BarChart3,
  Link as LinkIcon,
  DollarSign,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Crown,
  Filter,
  Gift,
  Plus,
  Copy,
  Globe,
  Download,
  Upload
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@/integrations/supabase/supabase';
import { useToast } from "@/hooks/use-toast";

interface CreatorApplication {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  primary_platform: string;
  total_followers: number;
  monthly_earnings: number;
  interested_package: string;
  status: string;
  created_at: string;
  progress_stage: number;
}

interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar_url: string | null;
  status: 'active' | 'inactive' | 'pending';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
  created_at: string;
  last_active: string;
  total_clicks: number;
  total_links: number;
  monthly_revenue: number;
  conversion_rate: number;
}

interface DashboardStats {
  totalClients: number;
  activeClients: number;
  totalRevenue: number;
  totalClicks: number;
  avgConversionRate: number;
  monthlyGrowth: number;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("clients");
  const [clients, setClients] = useState<Client[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    activeClients: 0,
    totalRevenue: 0,
    totalClicks: 0,
    avgConversionRate: 0,
    monthlyGrowth: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  // Load mock client data
  useState(() => {
    const mockClients: Client[] = [
      {
        id: "1",
        name: "Sarah Chen",
        username: "sarahc",
        email: "sarah@example.com",
        avatar_url: null,
        status: "active",
        subscription_tier: "premium",
        created_at: "2024-01-15",
        last_active: "2024-02-01",
        total_clicks: 15420,
        total_links: 12,
        monthly_revenue: 97.50,
        conversion_rate: 3.2
      },
      {
        id: "2",
        name: "Marcus Rodriguez",
        username: "marcusr",
        email: "marcus@example.com",
        avatar_url: null,
        status: "active",
        subscription_tier: "enterprise",
        created_at: "2024-01-08",
        last_active: "2024-02-01",
        total_clicks: 28350,
        total_links: 24,
        monthly_revenue: 247.80,
        conversion_rate: 4.1
      },
      {
        id: "3",
        name: "Elena Vasquez",
        username: "elenav",
        email: "elena@example.com",
        avatar_url: null,
        status: "pending",
        subscription_tier: "basic",
        created_at: "2024-01-30",
        last_active: "2024-01-31",
        total_clicks: 0,
        total_links: 0,
        monthly_revenue: 0,
        conversion_rate: 0
      }
    ];
    
    setClients(mockClients);
    
    const activeClients = mockClients.filter(c => c.status === 'active').length;
    const totalRevenue = mockClients.reduce((sum, c) => sum + c.monthly_revenue, 0);
    const totalClicks = mockClients.reduce((sum, c) => sum + c.total_clicks, 0);
    const avgConversionRate = mockClients.reduce((sum, c) => sum + c.conversion_rate, 0) / mockClients.length;

    setStats({
      totalClients: mockClients.length,
      activeClients,
      totalRevenue,
      totalClicks,
      avgConversionRate,
      monthlyGrowth: 23.5
    });
  });

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || client.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-300';
      case 'inactive': return 'bg-red-500/20 text-red-300';
      case 'pending': return 'bg-yellow-500/20 text-yellow-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'enterprise': return 'bg-purple-500/20 text-purple-300';
      case 'premium': return 'bg-blue-500/20 text-blue-300';
      case 'basic': return 'bg-gray-500/20 text-gray-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };
  const [selectedApplication, setSelectedApplication] = useState<CreatorApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [reviewNotes, setReviewNotes] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch all applications
  const { data: applications, isLoading: applicationsLoading } = useQuery({
    queryKey: ['admin-applications', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('creator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as CreatorApplication[];
    },
  });

  // Fetch stats
  const { data: stats } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creator_applications')
        .select('status, monthly_earnings, total_followers, interested_package');

      if (error) throw error;

      const totalApplications = data.length;
      const approvedApplications = data.filter(app => app.status === 'approved').length;
      const pendingApplications = data.filter(app => app.status === 'pending').length;
      const totalRevenue = data.reduce((sum, app) => sum + (app.monthly_earnings || 0), 0);

      return {
        totalApplications,
        approvedApplications,
        pendingApplications,
        totalRevenue
      };
    },
  });

  // Update application status
  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const { data, error } = await supabase
        .from('creator_applications')
        .update({ 
          status,
          review_notes: notes,
          reviewed_at: new Date().toISOString(),
          progress_stage: status === 'approved' ? 5 : status === 'under_review' ? 2 : 1
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast({
        title: "Application Updated",
        description: "Application status has been updated successfully.",
      });
      setSelectedApplication(null);
      setReviewNotes('');
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-600';
      case 'rejected': return 'bg-red-600';
      case 'under_review': return 'bg-blue-600';
      case 'on_hold': return 'bg-yellow-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'under_review': return <Eye className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleStatusUpdate = (status: string) => {
    if (selectedApplication) {
      updateApplicationMutation.mutate({
        id: selectedApplication.id,
        status,
        notes: reviewNotes
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="lg:pl-64 pb-20 lg:pb-0">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Crown className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">TD Studios Admin</h1>
              <p className="text-muted-foreground">
                Manage creator applications and agency operations
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.totalApplications || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Applications</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.approvedApplications || 0}</p>
                    <p className="text-sm text-muted-foreground">Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{stats?.pendingApplications || 0}</p>
                    <p className="text-sm text-muted-foreground">Pending Review</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-8 h-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">${stats?.totalRevenue.toLocaleString() || 0}</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="clients" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clients
              </TabsTrigger>
              <TabsTrigger value="templates" className="flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Templates
              </TabsTrigger>
              <TabsTrigger value="applications" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Applications
              </TabsTrigger>
              <TabsTrigger value="invites" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Invites
              </TabsTrigger>
              <TabsTrigger value="referrals" className="flex items-center gap-2">
                <Gift className="w-4 h-4" />
                Referrals
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-6">
              {/* Client Stats Overview */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clients</p>
                        <p className="text-2xl font-bold">{stats.totalClients}</p>
                      </div>
                      <Users className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Active</p>
                        <p className="text-2xl font-bold text-green-600">{stats.activeClients}</p>
                      </div>
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Revenue</p>
                        <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue.toFixed(2)}</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Clicks</p>
                        <p className="text-2xl font-bold">{stats.totalClicks.toLocaleString()}</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Avg CVR</p>
                        <p className="text-2xl font-bold">{stats.avgConversionRate.toFixed(1)}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-muted-foreground" />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Growth</p>
                        <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                      </div>
                      <BarChart3 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Client Management */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Client Management</CardTitle>
                    <Button>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Add Client
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Filters */}
                  <div className="flex gap-4 mb-6">
                    <Input
                      placeholder="Search clients..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="max-w-xs">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Client Table */}
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Client</th>
                          <th className="text-left p-4 font-medium">Status</th>
                          <th className="text-left p-4 font-medium">Tier</th>
                          <th className="text-left p-4 font-medium">Clicks</th>
                          <th className="text-left p-4 font-medium">Revenue</th>
                          <th className="text-left p-4 font-medium">CVR</th>
                          <th className="text-left p-4 font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredClients.map((client) => (
                          <tr key={client.id} className="border-t hover:bg-muted/50">
                            <td className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                  {client.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="font-medium">{client.name}</div>
                                  <div className="text-sm text-muted-foreground">@{client.username}</div>
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <Badge className={`${getStatusColor(client.status)} text-white`}>
                                {client.status}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <Badge className={getTierColor(client.subscription_tier)}>
                                {client.subscription_tier}
                              </Badge>
                            </td>
                            <td className="p-4">{client.total_clicks.toLocaleString()}</td>
                            <td className="p-4">${client.monthly_revenue.toFixed(2)}</td>
                            <td className="p-4">{client.conversion_rate.toFixed(1)}%</td>
                            <td className="p-4">
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Settings className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="templates" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Template Management</CardTitle>
                      <CardDescription>Create and manage link-in-bio templates for bulk deployment</CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Export Templates
                      </Button>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Template
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Template Cards */}
                    {[
                      {
                        id: 1,
                        name: "Influencer Premium",
                        description: "High-converting template for lifestyle influencers",
                        deployments: 15,
                        avgCvr: 4.2,
                        preview: "/api/placeholder/300/200"
                      },
                      {
                        id: 2,
                        name: "Business Professional",
                        description: "Clean template for business professionals",
                        deployments: 8,
                        avgCvr: 3.8,
                        preview: "/api/placeholder/300/200"
                      },
                      {
                        id: 3,
                        name: "Creative Artist",
                        description: "Colorful template for artists and creators",
                        deployments: 12,
                        avgCvr: 3.5,
                        preview: "/api/placeholder/300/200"
                      }
                    ].map((template) => (
                      <Card key={template.id} className="overflow-hidden">
                        <div className="aspect-video bg-muted relative">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Globe className="h-12 w-12 text-muted-foreground" />
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{template.name}</h3>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">
                                {template.deployments} deployments
                              </span>
                              <span className="font-medium text-green-600">
                                {template.avgCvr}% CVR
                              </span>
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button size="sm" variant="outline" className="flex-1">
                                <Eye className="h-3 w-3 mr-1" />
                                Preview
                              </Button>
                              <Button size="sm" variant="outline" className="flex-1">
                                <Copy className="h-3 w-3 mr-1" />
                                Clone
                              </Button>
                              <Button size="sm" className="flex-1">
                                Deploy
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    
                    {/* Create New Template Card */}
                    <Card className="border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors cursor-pointer">
                      <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                          <Plus className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold mb-2">Create New Template</h3>
                        <p className="text-sm text-muted-foreground text-center">
                          Start from scratch or duplicate an existing template
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Applications List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Creator Applications</CardTitle>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4 text-muted-foreground" />
                          <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Status</SelectItem>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="under_review">Under Review</SelectItem>
                              <SelectItem value="approved">Approved</SelectItem>
                              <SelectItem value="rejected">Rejected</SelectItem>
                              <SelectItem value="on_hold">On Hold</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {applicationsLoading ? (
                          <div className="text-center py-8">Loading applications...</div>
                        ) : applications?.map((app) => (
                          <div
                            key={app.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${
                              selectedApplication?.id === app.id
                                ? 'border-primary bg-primary/5'
                                : 'border-border hover:border-primary/50'
                            }`}
                            onClick={() => setSelectedApplication(app)}
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">
                                  {app.first_name} {app.last_name}
                                </h3>
                                <p className="text-sm text-muted-foreground">{app.email}</p>
                                <p className="text-sm text-muted-foreground">
                                  {app.total_followers.toLocaleString()} followers • ${app.monthly_earnings.toLocaleString()}/month
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`${getStatusColor(app.status)} text-white`}>
                                  {getStatusIcon(app.status)}
                                  <span className="ml-1 capitalize">{app.status.replace('_', ' ')}</span>
                                </Badge>
                                <div className="text-xs text-muted-foreground">
                                  {new Date(app.created_at).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Application Details */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle>Application Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedApplication ? (
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-bold">
                              {selectedApplication.first_name} {selectedApplication.last_name}
                            </h3>
                            <p className="text-muted-foreground">{selectedApplication.email}</p>
                            <p className="text-muted-foreground">{selectedApplication.phone}</p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Platform:</span>
                              <span className="capitalize">{selectedApplication.primary_platform}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Followers:</span>
                              <span>{selectedApplication.total_followers.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Monthly Earnings:</span>
                              <span>${selectedApplication.monthly_earnings.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Package:</span>
                              <span className="capitalize">{selectedApplication.interested_package}</span>
                            </div>
                          </div>

                          <div>
                            <Label>Review Notes</Label>
                            <Textarea
                              value={reviewNotes}
                              onChange={(e) => setReviewNotes(e.target.value)}
                              placeholder="Add review notes..."
                              className="mt-2"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              onClick={() => handleStatusUpdate('approved')}
                              className="bg-green-600 hover:bg-green-700"
                              disabled={updateApplicationMutation.isPending}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate('rejected')}
                              variant="destructive"
                              disabled={updateApplicationMutation.isPending}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate('under_review')}
                              className="bg-blue-600 hover:bg-blue-700"
                              disabled={updateApplicationMutation.isPending}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                            <Button
                              onClick={() => handleStatusUpdate('on_hold')}
                              className="bg-yellow-600 hover:bg-yellow-700"
                              disabled={updateApplicationMutation.isPending}
                            >
                              <Clock className="h-4 w-4 mr-1" />
                              Hold
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground py-8">
                          Select an application to view details
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="invites" className="space-y-6">
              <AdminInviteManager />
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    View and manage all platform users
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">User Management</h3>
                    <p className="text-muted-foreground">
                      User management features coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              <ReferralManagement />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Settings</CardTitle>
                  <CardDescription>
                    Configure global platform settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <Settings className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Platform Settings</h3>
                    <p className="text-muted-foreground">
                      Platform configuration options coming soon
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}