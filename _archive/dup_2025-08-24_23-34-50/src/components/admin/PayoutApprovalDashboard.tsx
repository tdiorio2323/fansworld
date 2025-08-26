import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DollarSign, 
  Users, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Eye,
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react';
import { useAdminPayouts, useCurrencyFormatter } from '@/hooks/useStripeConnect';
import { useAuth } from '@/hooks/useAuth';

interface PayoutRequest {
  id: string;
  creator_id: string;
  request_type: 'emergency' | 'automatic' | 'manual';
  requested_amount: number;
  created_at: string;
  net_payout_amount: number;
  processing_fee: number;
  notes?: string;
}

export const PayoutApprovalDashboard: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  const { user } = useAuth();
  const { formatCurrency } = useCurrencyFormatter();
  const {
    allPendingRequests,
    allPendingLoading,
    processRequest,
    totalPendingAmount,
    pendingCount
  } = useAdminPayouts();

  const handleApprove = async (requestId: string) => {
    if (!user?.id) return;
    
    setIsProcessing(true);
    try {
      await processRequest.mutateAsync({
        requestId,
        approved: true,
        adminUserId: user.id
      });
      setSelectedRequest(null);
    } catch (error: unknown) {
      console.error('Error approving payout request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (requestId: string) => {
    if (!user?.id || !rejectionReason.trim()) return;
    
    setIsProcessing(true);
    try {
      await processRequest.mutateAsync({
        requestId,
        approved: false,
        rejectionReason: rejectionReason.trim(),
        adminUserId: user.id
      });
      setSelectedRequest(null);
      setRejectionReason('');
    } catch (error: unknown) {
      console.error('Error rejecting payout request:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getRequestTypeColor = (type: PayoutRequest['request_type']) => {
    switch (type) {
      case 'emergency':
        return 'destructive';
      case 'automatic':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const getRequestTypePriority = (type: PayoutRequest['request_type']) => {
    switch (type) {
      case 'emergency':
        return 1;
      case 'manual':
        return 2;
      case 'automatic':
        return 3;
      default:
        return 4;
    }
  };

  // Sort requests by priority (emergency first) and then by creation date
  const sortedRequests = [...(allPendingRequests || [])].sort((a: PayoutRequest, b: PayoutRequest) => {
    const priorityDiff = getRequestTypePriority(a.request_type) - getRequestTypePriority(b.request_type);
    if (priorityDiff !== 0) return priorityDiff;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const selectedRequestData = sortedRequests.find((r: PayoutRequest) => r.id === selectedRequest);

  if (allPendingLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Payout Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve creator payout requests
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="px-3 py-1">
            {pendingCount} pending requests
          </Badge>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingCount}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pending Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalPendingAmount)}</div>
            <p className="text-xs text-muted-foreground">
              Total requested
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Emergency Requests</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sortedRequests.filter((r: PayoutRequest) => r.request_type === 'emergency').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Require immediate attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Creators</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sortedRequests.map((r: PayoutRequest) => r.creator_id)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              With pending payouts
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pending Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Payout Requests</CardTitle>
        </CardHeader>
        <CardContent>
          {sortedRequests.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">All Caught Up!</h3>
              <p className="text-muted-foreground">
                No pending payout requests requiring approval.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Emergency Requests Alert */}
              {sortedRequests.some((r: PayoutRequest) => r.request_type === 'emergency') && (
                <Alert className="border-amber-200 bg-amber-50">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800">
                    {sortedRequests.filter((r: PayoutRequest) => r.request_type === 'emergency').length} emergency 
                    request{sortedRequests.filter((r: PayoutRequest) => r.request_type === 'emergency').length > 1 ? 's' : ''} 
                    {' '}require immediate attention.
                  </AlertDescription>
                </Alert>
              )}

              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Creator</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Net Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedRequests.map((request: PayoutRequest) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="flex flex-col">
                              <span className="font-medium">
                                Creator {request.creator_id.slice(0, 8)}...
                              </span>
                              <span className="text-sm text-muted-foreground">
                                Request #{request.id.slice(0, 8)}...
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="font-medium">
                            {formatCurrency(request.requested_amount)}
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <Badge variant={getRequestTypeColor(request.request_type)}>
                            {request.request_type}
                          </Badge>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">
                              {new Date(request.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {formatCurrency(request.net_payout_amount)}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Fee: {formatCurrency(request.processing_fee)}
                            </span>
                          </div>
                        </TableCell>
                        
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setSelectedRequest(request.id)}
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Review
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-2xl">
                                <DialogHeader>
                                  <DialogTitle>Review Payout Request</DialogTitle>
                                </DialogHeader>
                                
                                {selectedRequestData && (
                                  <div className="space-y-6">
                                    {/* Request Details */}
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="font-medium mb-2">Request Information</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span>Request ID:</span>
                                            <span className="font-mono">{selectedRequestData.id.slice(0, 8)}...</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Creator ID:</span>
                                            <span className="font-mono">{selectedRequestData.creator_id.slice(0, 8)}...</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Type:</span>
                                            <Badge variant={getRequestTypeColor(selectedRequestData.request_type)}>
                                              {selectedRequestData.request_type}
                                            </Badge>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Requested:</span>
                                            <span>{new Date(selectedRequestData.created_at).toLocaleString()}</span>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div>
                                        <h4 className="font-medium mb-2">Amount Breakdown</h4>
                                        <div className="space-y-2 text-sm">
                                          <div className="flex justify-between">
                                            <span>Requested Amount:</span>
                                            <span>{formatCurrency(selectedRequestData.requested_amount)}</span>
                                          </div>
                                          <div className="flex justify-between">
                                            <span>Processing Fee:</span>
                                            <span className="text-red-600">-{formatCurrency(selectedRequestData.processing_fee)}</span>
                                          </div>
                                          <div className="flex justify-between font-medium border-t pt-2">
                                            <span>Net Payout:</span>
                                            <span>{formatCurrency(selectedRequestData.net_payout_amount)}</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>

                                    {/* Notes */}
                                    {selectedRequestData.notes && (
                                      <div>
                                        <h4 className="font-medium mb-2">Notes</h4>
                                        <div className="p-3 bg-muted rounded-lg text-sm">
                                          {selectedRequestData.notes}
                                        </div>
                                      </div>
                                    )}

                                    {/* Rejection Reason Input */}
                                    <div className="space-y-2">
                                      <label className="text-sm font-medium">
                                        Rejection Reason (if rejecting)
                                      </label>
                                      <Textarea
                                        placeholder="Provide a reason for rejection..."
                                        value={rejectionReason}
                                        onChange={(e) => setRejectionReason(e.target.value)}
                                        rows={3}
                                      />
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex justify-end gap-4">
                                      <Button
                                        variant="outline"
                                        onClick={() => handleReject(selectedRequestData.id)}
                                        disabled={isProcessing || !rejectionReason.trim()}
                                      >
                                        <XCircle className="h-4 w-4 mr-2" />
                                        {isProcessing ? 'Processing...' : 'Reject'}
                                      </Button>
                                      <Button
                                        onClick={() => handleApprove(selectedRequestData.id)}
                                        disabled={isProcessing}
                                      >
                                        <CheckCircle className="h-4 w-4 mr-2" />
                                        {isProcessing ? 'Processing...' : 'Approve & Process'}
                                      </Button>
                                    </div>

                                    {/* Warning for emergency requests */}
                                    {selectedRequestData.request_type === 'emergency' && (
                                      <Alert className="border-amber-200 bg-amber-50">
                                        <AlertCircle className="h-4 w-4 text-amber-600" />
                                        <AlertDescription className="text-amber-800">
                                          This is an emergency payout request that may incur additional fees.
                                        </AlertDescription>
                                      </Alert>
                                    )}
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};