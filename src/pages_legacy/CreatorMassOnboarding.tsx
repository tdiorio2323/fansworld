import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { processInstagramScreenshots, generatePagesFromScreenshots } from "@/lib/instagram-screenshot-processor";
import {
  Upload,
  Download,
  Users,
  Link,
  Zap,
  CheckCircle,
  Clock,
  AlertCircle,
  Copy,
  ExternalLink,
  Settings,
  Rocket,
  FileSpreadsheet,
  Globe,
  Mail,
  MessageSquare,
  Target,
  TrendingUp,
  Database,
  RefreshCw,
  Image,
  Scan
} from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  username: string;
  email: string;
  platform: string;
  followers: number;
  category: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  pageUrl?: string;
  customDomain?: string;
}

export const CreatorMassOnboarding = () => {
  const [activeTab, setActiveTab] = useState('import');
  const [creators, setCreators] = useState<Creator[]>([]);
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [bulkTemplate, setBulkTemplate] = useState('influencer-premium');
  
  // Mock data for demonstration
  const mockCreators: Creator[] = [
    {
      id: '1',
      name: 'Sarah Chen',
      username: 'sarahc_fitness',
      email: 'sarah@example.com',
      platform: 'Instagram',
      followers: 125000,
      category: 'Fitness',
      status: 'completed',
      pageUrl: 'cabanagrp.com/sarahc_fitness',
      customDomain: 'sarah-fitness.com'
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      username: 'marcusr_art',
      email: 'marcus@example.com',
      platform: 'TikTok',
      followers: 89000,
      category: 'Art',
      status: 'processing'
    },
    {
      id: '3',
      name: 'Elena Vasquez',
      username: 'elena_lifestyle',
      email: 'elena@example.com',
      platform: 'YouTube',
      followers: 340000,
      category: 'Lifestyle',
      status: 'pending'
    }
  ];

  const handleBulkImport = () => {
    setCreators(mockCreators);
  };

  const handleScreenshotProcessing = async () => {
    setProcessing(true);
    setProgress(10);
    
    try {
      console.log('🚀 Starting Instagram screenshot processing...');
      
      // Process Instagram screenshots
      setProgress(30);
      const result = await processInstagramScreenshots();
      
      if (!result.success) {
        throw new Error(`Processing failed: ${result.errors.join(', ')}`);
      }
      
      // Convert to our Creator interface
      const processedCreators: Creator[] = result.profiles.map((profile, index) => ({
        id: `screenshot_${index}`,
        name: profile.name,
        username: profile.username,
        email: `${profile.username}@instagram.com`,
        platform: 'Instagram',
        followers: parseInt(profile.followers.replace(/[^0-9]/g, '')) * (profile.followers.includes('K') ? 1000 : profile.followers.includes('M') ? 1000000 : 1),
        category: profile.category || 'Lifestyle',
        status: 'processing' as const
      }));
      
      setCreators(processedCreators);
      setProgress(60);
      
      // Generate pages from screenshots
      console.log('🏭 Generating creator pages...');
      const pageResult = await generatePagesFromScreenshots();
      
      if (pageResult.success) {
        setProgress(90);
        
        // Update creators with generated pages
        setCreators(prev => prev.map(creator => {
          const page = pageResult.pages?.find(p => p.username === creator.username);
          return {
            ...creator,
            status: page ? 'completed' as const : 'failed' as const,
            pageUrl: page?.pageUrl?.replace('https://', '') || undefined
          };
        }));
        
        console.log(`✅ Successfully processed ${pageResult.processed} profiles and generated ${pageResult.pagesGenerated} pages`);
      } else {
        throw new Error(pageResult.error || 'Failed to generate pages');
      }
      
      setProgress(100);
      
    } catch (error) {
      console.error('❌ Screenshot processing failed:', error);
      setCreators(prev => prev.map(creator => ({
        ...creator,
        status: 'failed' as const
      })));
    } finally {
      setProcessing(false);
    }
  };

  const handleMassProcess = async () => {
    setProcessing(true);
    setProgress(0);
    
    // Simulate processing each creator
    for (let i = 0; i < creators.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProgress(((i + 1) / creators.length) * 100);
      
      setCreators(prev => prev.map((creator, index) => {
        if (index <= i) {
          return {
            ...creator,
            status: 'completed',
            pageUrl: `cabanagrp.com/${creator.username}`,
            customDomain: `${creator.username}.cabana.link`
          };
        }
        return creator;
      }));
    }
    
    setProcessing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-300';
      case 'processing': return 'bg-blue-500/20 text-blue-300';
      case 'failed': return 'bg-red-500/20 text-red-300';
      default: return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'processing': return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'failed': return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Rocket className="w-8 h-8 text-primary" />
              Mass Creator Onboarding
            </h1>
            <p className="text-muted-foreground mt-2">
              Automate creator page generation at scale. Import, process, and launch thousands of creators instantly.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              {creators.length} Creators
            </Badge>
            <Badge className="bg-green-500/20 text-green-300 text-lg px-4 py-2">
              {creators.filter(c => c.status === 'completed').length} Live
            </Badge>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="import" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import
            </TabsTrigger>
            <TabsTrigger value="process" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Process
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Manage
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Analytics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="import" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Bulk Import */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5" />
                    Bulk Import
                  </CardTitle>
                  <CardDescription>
                    Import creator data from CSV, Excel, or API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                    <Upload className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-lg font-medium mb-2">Drop CSV file here</p>
                    <p className="text-sm text-muted-foreground mb-4">
                      Or click to browse files
                    </p>
                    <Button onClick={handleBulkImport}>
                      Load Demo Data
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Required columns:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>name, username, email</li>
                      <li>platform, followers, category</li>
                      <li>Optional: bio, links, custom_domain</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* API Integration */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    API Integration
                  </CardTitle>
                  <CardDescription>
                    Connect to Instagram, TikTok, YouTube APIs
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded mr-3" />
                      Instagram API
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-black rounded mr-3" />
                      TikTok API
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <div className="w-4 h-4 bg-red-500 rounded mr-3" />
                      YouTube API
                    </Button>
                  </div>
                  
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-medium mb-2">Bulk Scraping</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      Import followers from competitor platforms
                    </p>
                    <Input placeholder="Enter creator handles (comma-separated)" />
                  </div>
                </CardContent>
              </Card>

              {/* Instagram Screenshot Processing */}
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Scan className="w-5 h-5 text-gradient-to-r from-purple-500 to-pink-500" />
                    Instagram Screenshot Scraper
                    <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">New</Badge>
                  </CardTitle>
                  <CardDescription>
                    Mass OCR processing & complete view your reports below
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto bg-blue-500 rounded-lg flex items-center justify-center mb-3">
                        <Image className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-blue-400 mb-2">Main Instagram Report</h4>
                      <p className="text-sm text-muted-foreground mb-4">Bulk Instagram profile successful scraper & download</p>
                      <Button 
                        onClick={handleScreenshotProcessing} 
                        disabled={processing}
                        className="bg-blue-500 hover:bg-blue-600 w-full"
                      >
                        {processing ? <RefreshCw className="w-4 h-4 animate-spin mr-2" /> : <Scan className="w-4 h-4 mr-2" />}
                        View Report
                      </Button>
                    </div>
                    
                    <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto bg-purple-500 rounded-lg flex items-center justify-center mb-3">
                        <Link className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-purple-400 mb-2">Enhanced Bio Links Report</h4>
                      <p className="text-sm text-muted-foreground mb-4">Professional report with bio link & social media</p>
                      <Button variant="outline" className="border-purple-500/30 text-purple-400 hover:bg-purple-500/10 w-full">
                        View Enhanced
                      </Button>
                    </div>
                    
                    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto bg-green-500 rounded-lg flex items-center justify-center mb-3">
                        <FileSpreadsheet className="w-6 h-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-green-400 mb-2">Raw Data (CSV)</h4>
                      <p className="text-sm text-muted-foreground mb-4">Download the extracted data in CSV format</p>
                      <Button variant="outline" className="border-green-500/30 text-green-400 hover:bg-green-500/10 w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </Button>
                    </div>
                  </div>

                  {processing && (
                    <div className="bg-muted/20 border border-muted rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-sm font-medium">Processing Complete!</span>
                      </div>
                      <p className="text-sm text-center text-muted-foreground mb-4">
                        {creators.length} Instagram profiles successfully processed with smart error detection
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Profile analysis extracted • Operations detected • Reports generated</span>
                          <span className="text-green-400">{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="w-full" />
                      </div>
                    </div>
                  )}

                  <div className="border border-orange-500/20 bg-orange-500/5 rounded-lg p-4">
                    <h4 className="font-medium text-orange-400 mb-2">🔍 For Web Application (Preview):</h4>
                    <p className="text-sm text-muted-foreground mb-3">
                      To run the live web dashboard with full upload, use these login credentials:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm font-mono bg-black/20 p-3 rounded">
                      <div><span className="text-muted-foreground">Username:</span> <span className="text-orange-400">admin</span></div>
                      <div><span className="text-muted-foreground">Password:</span> <span className="text-orange-400">admin</span></div>  
                      <div><span className="text-muted-foreground">Files:</span> <span className="text-orange-400">csv/xlsx</span></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Imported</p>
                      <p className="text-2xl font-bold">1,247</p>
                    </div>
                    <Users className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">This Week</p>
                      <p className="text-2xl font-bold text-green-600">+89</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Success Rate</p>
                      <p className="text-2xl font-bold">94.7%</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Avg. Time</p>
                      <p className="text-2xl font-bold">2.3s</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="process" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      Mass Processing Engine
                    </CardTitle>
                    <CardDescription>
                      Generate link pages for all imported creators automatically
                    </CardDescription>
                  </div>
                  <Button 
                    onClick={handleMassProcess} 
                    disabled={processing || creators.length === 0}
                    size="lg"
                  >
                    <Rocket className="w-4 h-4 mr-2" />
                    {processing ? 'Processing...' : `Process ${creators.length} Creators`}
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {processing && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Processing creators...</span>
                      <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                  </div>
                )}

                {/* Template Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Default Template</Label>
                    <Select value={bulkTemplate} onValueChange={setBulkTemplate}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="influencer-premium">Influencer Premium</SelectItem>
                        <SelectItem value="minimal-dark">Minimal Dark</SelectItem>
                        <SelectItem value="colorful-modern">Colorful Modern</SelectItem>
                        <SelectItem value="business-pro">Business Professional</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Domain Strategy</Label>
                    <Select defaultValue="subdomain">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="subdomain">Subdomain (username.cabana.link)</SelectItem>
                        <SelectItem value="path">Path (cabanagrp.com/username)</SelectItem>
                        <SelectItem value="custom">Custom Domain</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Processing Options */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-center">
                      <Globe className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                      <h4 className="font-medium">Page Generation</h4>
                      <p className="text-sm text-muted-foreground">Auto-create link pages</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Mail className="w-8 h-8 mx-auto mb-2 text-green-500" />
                      <h4 className="font-medium">Email Setup</h4>
                      <p className="text-sm text-muted-foreground">Welcome emails</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <Settings className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                      <h4 className="font-medium">Configuration</h4>
                      <p className="text-sm text-muted-foreground">Auto-configure</p>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-center">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 text-orange-500" />
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-muted-foreground">SMS & email alerts</p>
                    </div>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="manage" className="space-y-6">
            {/* Creator Management Table */}
            <Card>
              <CardHeader>
                <CardTitle>Creator Management</CardTitle>
                <CardDescription>
                  Monitor and manage all onboarded creators
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {creators.map((creator) => (
                    <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          {creator.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="font-medium">{creator.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            @{creator.username} • {creator.followers.toLocaleString()} followers
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className={getStatusColor(creator.status)}>
                          {getStatusIcon(creator.status)}
                          <span className="ml-1 capitalize">{creator.status}</span>
                        </Badge>
                        
                        {creator.pageUrl && (
                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <ExternalLink className="w-3 w-3 mr-1" />
                              Visit
                            </Button>
                            <Button variant="outline" size="sm">
                              <Copy className="w-3 w-3 mr-1" />
                              Copy
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Processing Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">847</div>
                  <p className="text-sm text-muted-foreground">creators per hour</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Success Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">94.7%</div>
                  <p className="text-sm text-muted-foreground">successful deployments</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$127K</div>
                  <p className="text-sm text-muted-foreground">monthly recurring</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};