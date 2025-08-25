import React from 'react';
import { 
  Server, Database, Activity, AlertTriangle, CheckCircle,
  HardDrive, Cpu, MemoryStick, Wifi, Zap, RefreshCw,
  Download, Settings, Shield, Clock, TrendingUp
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

const SystemManagementPage: React.FC = () => {
  return (
    <div className="min-h-screen p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gradient-luxury mb-2">
            System Management
          </h1>
          <p className="text-xl text-muted-foreground">
            Monitor system health, performance, and infrastructure
          </p>
        </div>
        <div className="flex gap-4">
          <Button className="btn-glass">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh Status
          </Button>
          <Button className="btn-luxury">
            <Download className="mr-2 h-4 w-4" />
            System Report
          </Button>
        </div>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="card-glass border-2 hover:border-green-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
                Healthy
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gradient mb-1">99.9%</p>
              <p className="text-sm text-muted-foreground">System Uptime</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-blue-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                <Cpu className="h-6 w-6 text-blue-400" />
              </div>
              <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
                Normal
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gradient mb-1">45%</p>
              <p className="text-sm text-muted-foreground">CPU Usage</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-purple-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                <MemoryStick className="h-6 w-6 text-purple-400" />
              </div>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                Optimal
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gradient mb-1">8.2GB</p>
              <p className="text-sm text-muted-foreground">Memory Used</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2 hover:border-yellow-500/30">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="h-12 w-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                <HardDrive className="h-6 w-6 text-yellow-400" />
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                82% Full
              </Badge>
            </div>
            <div>
              <p className="text-2xl font-bold text-gradient mb-1">1.2TB</p>
              <p className="text-sm text-muted-foreground">Storage Used</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Services Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="card-glass border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <Server className="h-5 w-5" />
              Core Services
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium">API Server</h4>
                  <p className="text-xs text-muted-foreground">Response time: 45ms</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-300">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium">Database</h4>
                  <p className="text-xs text-muted-foreground">Query time: 12ms</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-300">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium">CDN</h4>
                  <p className="text-xs text-muted-foreground">Global distribution</p>
                </div>
              </div>
              <Badge className="bg-green-500/20 text-green-300">Online</Badge>
            </div>
            
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-glass border border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                <div>
                  <h4 className="font-medium">Payment Gateway</h4>
                  <p className="text-xs text-muted-foreground">Maintenance mode</p>
                </div>
              </div>
              <Badge className="bg-yellow-500/20 text-yellow-300">Limited</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-glass border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-luxury">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">CPU Usage</span>
                <span className="text-sm text-muted-foreground">45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-muted-foreground">67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Disk I/O</span>
                <span className="text-sm text-muted-foreground">23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Network Usage</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
              <Progress value={78} className="h-2" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card className="card-glass border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-luxury">
            <AlertTriangle className="h-5 w-5" />
            System Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-white/10">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">System backup completed successfully</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">2 hours ago</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-white/10">
              <AlertTriangle className="h-4 w-4 text-yellow-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">High memory usage detected on server-02</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">4 hours ago</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-gradient-glass border border-white/10">
              <CheckCircle className="h-4 w-4 text-green-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium">Database optimization completed</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">6 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SystemManagementPage;