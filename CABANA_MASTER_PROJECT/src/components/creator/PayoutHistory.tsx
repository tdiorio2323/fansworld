import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Download, 
  Search, 
  Filter, 
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { PayoutRequest } from '@/lib/stripe-connect';
import { useCurrencyFormatter, usePayoutStatus } from '@/hooks/useStripeConnect';

interface PayoutHistoryProps {
  requests: PayoutRequest[];
}

export const PayoutHistory: React.FC<PayoutHistoryProps> = ({ requests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const { formatCurrency } = useCurrencyFormatter();
  const { getStatusColor, getStatusText } = usePayoutStatus();

  // Filter requests
  const filteredRequests = requests.filter(request => {
    const matchesSearch = !searchTerm || 
      request.notes?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    const matchesDate = dateRange === 'all' || (() => {
      const requestDate = new Date(request.created_at);
      const now = new Date();
      
      switch (dateRange) {
        case 'week':
          return requestDate >= new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        case 'month':
          return requestDate >= new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        case 'quarter':
          return requestDate >= new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        default:
          return true;
      }
    })();
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(startIndex, startIndex + itemsPerPage);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'approved':
      case 'processing':
        return <AlertCircle className="h-4 w-4" />;
      case 'completed':
      case 'paid':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const exportToCSV = () => {
    const headers = ['Date', 'Amount', 'Status', 'Type', 'Processing Fee', 'Net Amount', 'Notes'];
    const csvData = filteredRequests.map(request => [
      new Date(request.created_at).toLocaleDateString(),
      (request.requested_amount / 100).toFixed(2),
      request.status,
      request.request_type,
      (request.processing_fee / 100).toFixed(2),
      (request.net_payout_amount / 100).toFixed(2),
      request.notes || ''
    ]);
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payout-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center h-64">
          <DollarSign className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Payout History</h3>
          <p className="text-muted-foreground text-center">
            Once you request payouts, they'll appear here with their status and details.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Payout History</CardTitle>
          <Button onClick={exportToCSV} variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by ID or notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="week">Last 7 Days</SelectItem>
              <SelectItem value="month">Last 30 Days</SelectItem>
              <SelectItem value="quarter">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted rounded-lg">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Requests</p>
            <p className="font-medium">{filteredRequests.length}</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Requested</p>
            <p className="font-medium">
              {formatCurrency(filteredRequests.reduce((sum, r) => sum + r.requested_amount, 0))}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Paid</p>
            <p className="font-medium">
              {formatCurrency(
                filteredRequests
                  .filter(r => r.status === 'completed' || r.status === 'paid')
                  .reduce((sum, r) => sum + r.net_payout_amount, 0)
              )}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Total Fees</p>
            <p className="font-medium">
              {formatCurrency(filteredRequests.reduce((sum, r) => sum + r.processing_fee, 0))}
            </p>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Processing Fee</TableHead>
                <TableHead>Net Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(request.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(request.requested_amount)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant={getStatusColor(request.status) as any}
                      className="flex items-center gap-1"
                    >
                      {getStatusIcon(request.status)}
                      {getStatusText(request.status)}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <Badge 
                      variant={request.request_type === 'emergency' ? 'destructive' : 'outline'}
                    >
                      {request.request_type}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(request.processing_fee)}
                    </span>
                  </TableCell>
                  
                  <TableCell>
                    <div className="font-medium">
                      {formatCurrency(request.net_payout_amount)}
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {request.stripe_transfer_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            // In a real app, this would link to Stripe dashboard
                            console.log('View transfer:', request.stripe_transfer_id);
                          }}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredRequests.length)} of {filteredRequests.length} results
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};