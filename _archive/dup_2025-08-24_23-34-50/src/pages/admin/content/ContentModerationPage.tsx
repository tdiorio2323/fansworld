import React, { useState } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, Eye, Flag,
  MessageSquare, Image, Video, Clock, User, MoreVertical,
  Search, Filter, Download, RefreshCw, FileText, Ban
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ContentItem {
  id: string;
  type: 'image' | 'video' | 'text' | 'livestream';
  title: string;
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  reportCount: number;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  timestamp: string;
  thumbnail?: string;
  preview: string;
}

interface ModerationStats {
  pending: number;
  reviewed: number;
  flagged: number;
  totalReports: number;
}

const ContentModerationPage: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('pending');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');

  const stats: ModerationStats = {
    pending: 47,
    reviewed: 189,
    flagged: 12,
    totalReports: 248
  };

  const mockContent: ContentItem[] = [
    {
      id: '1',
      type: 'image',
      title: 'Premium Photo Set - Beach Collection',
      creator: {
        id: 'cr1',
        name: 'Sarah Chen',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      reportCount: 3,
      status: 'pending',
      timestamp: '2 hours ago',
      preview: 'Beach-themed premium content featuring artistic photography...'
    },
    {
      id: '2',
      type: 'video',
      title: 'Exclusive Behind the Scenes',
      creator: {
        id: 'cr2',
        name: 'Alex Rivera',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      reportCount: 1,
      status: 'flagged',
      timestamp: '4 hours ago',
      preview: 'Behind-the-scenes content from recent photo shoot...'
    },
    {
      id: '3',
      type: 'livestream',
      title: 'Live Q&A Session',
      creator: {
        id: 'cr3',
        name: 'Maya Johnson',
        avatar: '/api/placeholder/40/40',
        verified: false
      },
      reportCount: 7,
      status: 'pending',
      timestamp: '6 hours ago',
      preview: 'Interactive live session with fan Q&A and exclusive content...'
    },
    {
      id: '4',
      type: 'text',
      title: 'Personal Update Post',
      creator: {
        id: 'cr4',
        name: 'Jordan Smith',
        avatar: '/api/placeholder/40/40',
        verified: true
      },
      reportCount: 0,
      status: 'approved',
      timestamp: '8 hours ago',
      preview: 'Personal update sharing thoughts and upcoming content plans...'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'flagged':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'text':
        return <FileText className="h-4 w-4" />;
      case 'livestream':
        return <Video className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const ContentCard: React.FC<{ item: ContentItem }> = ({ item }) => (
    <Card className="card-glass border-2 hover:border-primary/30 transition-all duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-primary/20">
              <AvatarImage src={item.creator.avatar} />
              <AvatarFallback className="bg-gradient-luxury text-white font-semibold">
                {item.creator.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground">{item.creator.name}</h3>
                {item.creator.verified && (
                  <CheckCircle className="h-4 w-4 text-primary" />
                )}
              </div>
              <p className="text-sm text-muted-foreground">{item.timestamp}</p>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass-morphism border-primary/20">
              <DropdownMenuItem>
                <Eye className="h-4 w-4 mr-2" />
                View Full Content
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="h-4 w-4 mr-2" />
                View Creator Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400">
                <Ban className="h-4 w-4 mr-2" />
                Suspend Creator
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            {getTypeIcon(item.type)}
            <h4 className="font-medium text-foreground">{item.title}</h4>
            <Badge className={getStatusColor(item.status)}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {item.preview}
          </p>

          {item.reportCount > 0 && (
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-300">
                {item.reportCount} report{item.reportCount > 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <div className="flex gap-2">
            <Button size="sm" className="btn-glass">
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve
            </Button>
            <Button size="sm" variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30">
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
          </div>
          <Button size="sm" variant="ghost" className="text-primary">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            Content Moderation
          </h1>
          <p className="text-xl text-muted-foreground">
            Review and manage platform content for safety and compliance
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.pending}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <Clock className="h-7 w-7 text-yellow-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Reviewed Today</p>
                <p className="text-3xl font-bold text-green-400">{stats.reviewed}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-7 w-7 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-2 hover:border-orange-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Flagged Content</p>
                <p className="text-3xl font-bold text-orange-400">{stats.flagged}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                <AlertTriangle className="h-7 w-7 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-glass border-2 hover:border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Reports</p>
                <p className="text-3xl font-bold text-red-400">{stats.totalReports}</p>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-red-500/20 flex items-center justify-center">
                <Flag className="h-7 w-7 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="card-glass border-2">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search content, creators, or reports..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass-morphism border-white/20"
              />
            </div>
            <div className="flex gap-4">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-40 glass-morphism border-white/20">
                  <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent className="glass-morphism border-primary/20">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="text">Text Posts</SelectItem>
                  <SelectItem value="livestream">Live Streams</SelectItem>
                </SelectContent>
              </Select>
              <Button className="btn-glass">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 glass-morphism border-white/20">
          <TabsTrigger value="pending" className="data-[state=active]:bg-gradient-luxury">
            Pending ({stats.pending})
          </TabsTrigger>
          <TabsTrigger value="flagged" className="data-[state=active]:bg-gradient-luxury">
            Flagged ({stats.flagged})
          </TabsTrigger>
          <TabsTrigger value="approved" className="data-[state=active]:bg-gradient-luxury">
            Approved
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-gradient-luxury">
            Rejected
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockContent
              .filter(item => item.status === 'pending')
              .map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockContent
              .filter(item => item.status === 'flagged')
              .map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="approved" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {mockContent
              .filter(item => item.status === 'approved')
              .map(item => (
                <ContentCard key={item.id} item={item} />
              ))}
          </div>
        </TabsContent>

        <TabsContent value="rejected" className="space-y-6">
          <div className="text-center py-12">
            <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No Rejected Content</h3>
            <p className="text-muted-foreground">All content reviews have been processed successfully.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ContentModerationPage;