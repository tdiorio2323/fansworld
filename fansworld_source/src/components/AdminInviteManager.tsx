import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  Edit, 
  Clock, 
  Users, 
  CheckCircle, 
  XCircle,
  Calendar,
  Mail,
  Link
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Invite {
  id: string;
  invite_code: string;
  passcode: string;
  intended_for: string;
  description: string;
  status: 'active' | 'used' | 'expired' | 'disabled';
  max_uses: number;
  current_uses: number;
  expires_at: string | null;
  created_at: string;
  used_at: string | null;
  creator?: { display_name: string; username: string };
  user?: { display_name: string; username: string };
}

export function AdminInviteManager() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPasscodes, setShowPasscodes] = useState<Record<string, boolean>>({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Create invite form state
  const [createForm, setCreateForm] = useState({
    intended_for: "",
    description: "",
    expires_in_days: "",
    max_uses: "1"
  });

  const loadInvites = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-invites', {
        body: { action: 'list' }
      });

      if (error) throw error;
      setInvites(data.invites || []);
    } catch (error) {
      console.error('Error loading invites:', error);
      toast({
        title: "Error",
        description: "Failed to load invites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadInvites();
  }, [loadInvites]);

  const createInvite = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('manage-invites', {
        body: {
          action: 'create',
          intended_for: createForm.intended_for,
          description: createForm.description,
          expires_in_days: createForm.expires_in_days ? parseInt(createForm.expires_in_days) : null,
          max_uses: parseInt(createForm.max_uses)
        }
      });

      if (error) throw error;

      toast({
        title: "Invite Created",
        description: "New invite has been generated successfully",
      });

      setCreateForm({ intended_for: "", description: "", expires_in_days: "", max_uses: "1" });
      setIsCreateDialogOpen(false);
      loadInvites();

      // Auto-copy invite URL
      if (data.invite?.invite_url) {
        await navigator.clipboard.writeText(data.invite.invite_url);
        toast({
          title: "URL Copied",
          description: "Invite URL has been copied to clipboard",
        });
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      toast({
        title: "Error",
        description: "Failed to create invite",
        variant: "destructive",
      });
    }
  };

  const updateInviteStatus = async (inviteId: string, newStatus: string) => {
    try {
      const { error } = await supabase.functions.invoke('manage-invites', {
        body: {
          action: 'update',
          invite_id: inviteId,
          status: newStatus
        }
      });

      if (error) throw error;

      toast({
        title: "Invite Updated",
        description: `Invite status changed to ${newStatus}`,
      });

      loadInvites();
    } catch (error) {
      console.error('Error updating invite:', error);
      toast({
        title: "Error",
        description: "Failed to update invite",
        variant: "destructive",
      });
    }
  };

  const deleteInvite = async (inviteId: string) => {
    if (!confirm("Are you sure you want to delete this invite?")) return;

    try {
      const { error } = await supabase.functions.invoke('manage-invites', {
        body: {
          action: 'delete',
          invite_id: inviteId
        }
      });

      if (error) throw error;

      toast({
        title: "Invite Deleted",
        description: "Invite has been permanently deleted",
      });

      loadInvites();
    } catch (error) {
      console.error('Error deleting invite:', error);
      toast({
        title: "Error",
        description: "Failed to delete invite",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied",
        description: `${label} copied to clipboard`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      used: "secondary",
      expired: "destructive",
      disabled: "outline"
    } as const;

    const icons = {
      active: CheckCircle,
      used: Users,
      expired: Clock,
      disabled: XCircle
    };

    const Icon = icons[status as keyof typeof icons];

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        <Icon className="w-3 h-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const stats = {
    total: invites.length,
    active: invites.filter(i => i.status === 'active').length,
    used: invites.filter(i => i.status === 'used').length,
    expired: invites.filter(i => i.status === 'expired').length
  };

  if (loading) {
    return <div className="flex items-center justify-center p-8">Loading invites...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Link className="w-8 h-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">Total Invites</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.used}</p>
                <p className="text-sm text-muted-foreground">Used</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.expired}</p>
                <p className="text-sm text-muted-foreground">Expired</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Invite Management</h2>
          <p className="text-muted-foreground">Create and manage platform invitations</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="btn-chrome">
              <Plus className="w-4 h-4 mr-2" />
              Create Invite
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Invite</DialogTitle>
              <DialogDescription>
                Generate a new invite link for platform access
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="intended_for">Intended For (Optional)</Label>
                <Input
                  id="intended_for"
                  placeholder="Email or name"
                  value={createForm.intended_for}
                  onChange={(e) => setCreateForm({ ...createForm, intended_for: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Internal notes about this invite"
                  value={createForm.description}
                  onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max_uses">Max Uses</Label>
                  <Select value={createForm.max_uses} onValueChange={(value) => setCreateForm({ ...createForm, max_uses: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 time</SelectItem>
                      <SelectItem value="5">5 times</SelectItem>
                      <SelectItem value="10">10 times</SelectItem>
                      <SelectItem value="25">25 times</SelectItem>
                      <SelectItem value="100">100 times</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expires_in_days">Expires In (Days)</Label>
                  <Input
                    id="expires_in_days"
                    type="number"
                    placeholder="Never"
                    value={createForm.expires_in_days}
                    onChange={(e) => setCreateForm({ ...createForm, expires_in_days: e.target.value })}
                  />
                </div>
              </div>
              
              <Button onClick={createInvite} className="w-full btn-chrome">
                Create Invite
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Invites Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Invites</CardTitle>
          <CardDescription>
            Manage all platform invitations and track their usage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Passcode</TableHead>
                <TableHead>Intended For</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Usage</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invites.map((invite) => (
                <TableRow key={invite.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {invite.invite_code}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(
                          `${window.location.origin}/invite/${invite.invite_code}`,
                          "Invite URL"
                        )}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm">
                        {showPasscodes[invite.id] ? invite.passcode : "••••••"}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPasscodes({
                          ...showPasscodes,
                          [invite.id]: !showPasscodes[invite.id]
                        })}
                      >
                        {showPasscodes[invite.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(invite.passcode, "Passcode")}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      {invite.intended_for && (
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="w-3 h-3" />
                          {invite.intended_for}
                        </div>
                      )}
                      {invite.description && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {invite.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>{getStatusBadge(invite.status)}</TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {invite.current_uses} / {invite.max_uses}
                      {invite.used_at && (
                        <div className="text-xs text-muted-foreground">
                          Last: {new Date(invite.used_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="text-sm">
                      {new Date(invite.created_at).toLocaleDateString()}
                      {invite.expires_at && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Expires: {new Date(invite.expires_at).toLocaleDateString()}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {invite.status === 'active' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateInviteStatus(invite.id, 'disabled')}
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                      )}
                      {invite.status === 'disabled' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => updateInviteStatus(invite.id, 'active')}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteInvite(invite.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {invites.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No invites created yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}