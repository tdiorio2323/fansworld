import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Send,
  Upload,
  Download,
  Copy,
  Settings,
  Zap,
  CheckSquare,
  AlertCircle,
  RefreshCw,
  FileText,
  Globe,
  Palette,
  Mail,
  MessageSquare,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

interface Client {
  id: string;
  name: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'pending';
  subscription_tier: 'basic' | 'premium' | 'enterprise';
}

interface BulkOperationsPanelProps {
  clients: Client[];
  selectedClients: string[];
  onSelectClient: (clientId: string) => void;
  onSelectAll: () => void;
  onClearSelection: () => void;
}

export const BulkOperationsPanel = ({
  clients,
  selectedClients,
  onSelectClient,
  onSelectAll,
  onClearSelection
}: BulkOperationsPanelProps) => {
  const [activeTab, setActiveTab] = useState('operations');
  const [bulkEmailSubject, setBulkEmailSubject] = useState('');
  const [bulkEmailMessage, setBulkEmailMessage] = useState('');
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [templateId, setTemplateId] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [tierUpdate, setTierUpdate] = useState('');

  const selectedClientsData = clients.filter(client => selectedClients.includes(client.id));

  const handleBulkOperation = async (operation: string) => {
    setIsProcessing(true);
    setDeploymentProgress(0);

    // Simulate progress
    for (let i = 0; i <= 100; i += 10) {
      setDeploymentProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    console.log(`Bulk operation: ${operation} for clients:`, selectedClients);
    setIsProcessing(false);
    onClearSelection();
  };

  const handleTemplateDeployment = () => {
    if (!templateId) return;
    handleBulkOperation(`deploy-template-${templateId}`);
  };

  const handleStatusUpdate = () => {
    if (!statusUpdate) return;
    handleBulkOperation(`update-status-${statusUpdate}`);
  };

  const handleTierUpdate = () => {
    if (!tierUpdate) return;
    handleBulkOperation(`update-tier-${tierUpdate}`);
  };

  const handleBulkEmail = () => {
    if (!bulkEmailSubject || !bulkEmailMessage) return;
    handleBulkOperation('send-bulk-email');
    setBulkEmailSubject('');
    setBulkEmailMessage('');
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Bulk Operations
            </CardTitle>
            <CardDescription>
              Manage multiple clients simultaneously
            </CardDescription>
          </div>
          {selectedClients.length > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {selectedClients.length} selected
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {selectedClients.length === 0 ? (
          <div className="text-center py-8">
            <CheckSquare className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Clients Selected</h3>
            <p className="text-muted-foreground mb-4">
              Select one or more clients to perform bulk operations
            </p>
            <Button onClick={onSelectAll} variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Select All Clients
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Selected Clients Summary */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckSquare className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">
                    {selectedClients.length} client{selectedClients.length > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedClientsData.map(c => c.name).join(', ')}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onClearSelection}>
                Clear Selection
              </Button>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Processing...</span>
                  <span className="text-sm text-muted-foreground">{deploymentProgress}%</span>
                </div>
                <Progress value={deploymentProgress} className="w-full" />
              </motion.div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="operations" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Operations
                </TabsTrigger>
                <TabsTrigger value="deployment" className="flex items-center gap-2">
                  <Globe className="w-4 h-4" />
                  Deploy
                </TabsTrigger>
                <TabsTrigger value="communication" className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email
                </TabsTrigger>
                <TabsTrigger value="analytics" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="operations" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Status Updates */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Status Management</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="status-update">New Status</Label>
                        <Select value={statusUpdate} onValueChange={setStatusUpdate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleStatusUpdate} 
                        disabled={!statusUpdate || isProcessing}
                        className="w-full"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Update Status
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Tier Updates */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Subscription Tiers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <Label htmlFor="tier-update">New Tier</Label>
                        <Select value={tierUpdate} onValueChange={setTierUpdate}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tier" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="basic">Basic</SelectItem>
                            <SelectItem value="premium">Premium</SelectItem>
                            <SelectItem value="enterprise">Enterprise</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button 
                        onClick={handleTierUpdate} 
                        disabled={!tierUpdate || isProcessing}
                        className="w-full"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Update Tier
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button
                        variant="outline"
                        onClick={() => handleBulkOperation('backup-data')}
                        disabled={isProcessing}
                        className="flex flex-col h-20 gap-2"
                      >
                        <Download className="w-5 h-5" />
                        <span className="text-sm">Backup Data</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBulkOperation('sync-analytics')}
                        disabled={isProcessing}
                        className="flex flex-col h-20 gap-2"
                      >
                        <RefreshCw className="w-5 h-5" />
                        <span className="text-sm">Sync Analytics</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBulkOperation('generate-reports')}
                        disabled={isProcessing}
                        className="flex flex-col h-20 gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        <span className="text-sm">Reports</span>
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => handleBulkOperation('clone-settings')}
                        disabled={isProcessing}
                        className="flex flex-col h-20 gap-2"
                      >
                        <Copy className="w-5 h-5" />
                        <span className="text-sm">Clone Settings</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="deployment" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="w-5 h-5" />
                      Template Deployment
                    </CardTitle>
                    <CardDescription>
                      Deploy templates to selected clients simultaneously
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="template-select">Select Template</Label>
                      <Select value={templateId} onValueChange={setTemplateId}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose a template" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="influencer-premium">Influencer Premium</SelectItem>
                          <SelectItem value="business-professional">Business Professional</SelectItem>
                          <SelectItem value="creative-artist">Creative Artist</SelectItem>
                          <SelectItem value="minimal-dark">Minimal Dark</SelectItem>
                          <SelectItem value="colorful-modern">Colorful Modern</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Deployment Preview</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        This will deploy the selected template to {selectedClients.length} client{selectedClients.length > 1 ? 's' : ''}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="w-4 h-4 text-yellow-500" />
                        <span>Existing customizations will be preserved</span>
                      </div>
                    </div>

                    <Button 
                      onClick={handleTemplateDeployment} 
                      disabled={!templateId || isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Deploy Template to {selectedClients.length} Client{selectedClients.length > 1 ? 's' : ''}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="communication" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Mail className="w-5 h-5" />
                      Bulk Email Campaign
                    </CardTitle>
                    <CardDescription>
                      Send personalized emails to selected clients
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email-subject">Subject Line</Label>
                      <Input
                        id="email-subject"
                        value={bulkEmailSubject}
                        onChange={(e) => setBulkEmailSubject(e.target.value)}
                        placeholder="Enter email subject..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="email-message">Message</Label>
                      <Textarea
                        id="email-message"
                        value={bulkEmailMessage}
                        onChange={(e) => setBulkEmailMessage(e.target.value)}
                        placeholder="Enter your message..."
                        rows={6}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        Use [NAME] for personalization. Available variables: [NAME], [USERNAME], [TIER]
                      </p>
                    </div>

                    <div className="p-4 bg-muted/50 rounded-lg">
                      <h4 className="font-medium mb-2">Email Preview</h4>
                      <div className="text-sm space-y-1">
                        <p><strong>To:</strong> {selectedClients.length} recipients</p>
                        <p><strong>Subject:</strong> {bulkEmailSubject || 'No subject'}</p>
                        <p><strong>Message:</strong> {bulkEmailMessage ? `${bulkEmailMessage.slice(0, 100)}${bulkEmailMessage.length > 100 ? '...' : ''}` : 'No message'}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleBulkEmail} 
                      disabled={!bulkEmailSubject || !bulkEmailMessage || isProcessing}
                      className="w-full"
                      size="lg"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send to {selectedClients.length} Client{selectedClients.length > 1 ? 's' : ''}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Generate Reports</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('performance-report')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <TrendingUp className="w-4 h-4 mr-2" />
                        Performance Report
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('engagement-report')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Engagement Report
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('revenue-report')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Revenue Report
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">Data Export</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('export-csv')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Export to CSV
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('export-json')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Export to JSON
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleBulkOperation('backup-full')}
                        disabled={isProcessing}
                        className="w-full justify-start"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Full Backup
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};