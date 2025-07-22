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
  Gift
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
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

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("applications");
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
            <TabsList className="grid w-full grid-cols-5">
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