"use client";

import React, { useState, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { FrostedButton } from "@/components/ui/frosted-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Crown, 
  Search, 
  Filter, 
  Download, 
  Mail, 
  Phone, 
  Calendar,
  Users,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Star,
  Eye,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

interface WaitlistEntry {
  id: string;
  email: string;
  name?: string;
  handle?: string;
  phone?: string;
  priority: 'NORMAL' | 'VIP';
  status: 'WAITLISTED' | 'APPROVED' | 'INVITED' | 'REJECTED';
  referrer?: string;
  notes?: string;
  invite_code?: string;
  created_at: string;
  updated_at: string;
}

export default function AdminVipPage() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedEntries, setSelectedEntries] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<WaitlistEntry | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [reviewNotes, setReviewNotes] = useState("");

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setEntries([
        {
          id: "1",
          email: "creator@example.com",
          name: "Jane Creator",
          handle: "@janecreator",
          phone: "+1234567890",
          priority: "VIP",
          status: "WAITLISTED",
          referrer: "instagram",
          notes: "High engagement creator with 100k followers",
          created_at: "2024-01-15T10:00:00Z",
          updated_at: "2024-01-15T10:00:00Z"
        },
        {
          id: "2", 
          email: "influencer@example.com",
          name: "Mike Influencer",
          handle: "@mikeinfluencer",
          priority: "NORMAL",
          status: "APPROVED",
          referrer: "twitter",
          notes: "Consistent content creator",
          created_at: "2024-01-14T15:30:00Z",
          updated_at: "2024-01-16T09:15:00Z"
        },
        {
          id: "3",
          email: "blogger@example.com", 
          name: "Sarah Blogger",
          priority: "NORMAL",
          status: "INVITED",
          referrer: "site",
          invite_code: "VIP-ABC123",
          created_at: "2024-01-13T12:00:00Z",
          updated_at: "2024-01-17T14:20:00Z"
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const stats = {
    total: entries.length,
    waitlisted: entries.filter(e => e.status === 'WAITLISTED').length,
    approved: entries.filter(e => e.status === 'APPROVED').length,
    invited: entries.filter(e => e.status === 'INVITED').length,
    rejected: entries.filter(e => e.status === 'REJECTED').length,
    vip: entries.filter(e => e.priority === 'VIP').length
  };

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      entry.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.handle?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || entry.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || entry.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'WAITLISTED': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'APPROVED': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'INVITED': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'REJECTED': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'WAITLISTED': return <Clock className="h-4 w-4" />;
      case 'APPROVED': return <CheckCircle className="h-4 w-4" />;
      case 'INVITED': return <Mail className="h-4 w-4" />;
      case 'REJECTED': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedEntries(new Set(filteredEntries.map(e => e.id)));
    } else {
      setSelectedEntries(new Set());
    }
  };

  const handleSelectEntry = (entryId: string, checked: boolean) => {
    const newSelected = new Set(selectedEntries);
    if (checked) {
      newSelected.add(entryId);
    } else {
      newSelected.delete(entryId);
    }
    setSelectedEntries(newSelected);
  };

  const handleBulkAction = async (action: string) => {
    setActionLoading(true);
    // Simulate API call
    setTimeout(() => {
      console.log(`Bulk action ${action} on entries:`, Array.from(selectedEntries));
      setActionLoading(false);
      setSelectedEntries(new Set());
    }, 1000);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ["Email", "Name", "Handle", "Phone", "Status", "Priority", "Referrer", "Created", "Notes"].join(","),
      ...filteredEntries.map(entry => [
        entry.email,
        entry.name || "",
        entry.handle || "",
        entry.phone || "",
        entry.status,
        entry.priority,
        entry.referrer || "",
        new Date(entry.created_at).toLocaleDateString(),
        `"${entry.notes || ""}"`
      ].join(","))
    ].join("\\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vip-waitlist-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <GlassCard className="p-8">
          <div className="text-center">
            <Crown className="mx-auto h-12 w-12 text-yellow-400 animate-spin mb-4" />
            <p className="text-white">Loading VIP waitlist...</p>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <Crown className="h-8 w-8 text-yellow-400" />
            VIP Waitlist Admin
          </h1>
          <p className="text-gray-400">Manage and review VIP waitlist applications</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8"
        >
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-white mb-1">{stats.total}</div>
            <div className="text-sm text-gray-400">Total</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-400 mb-1">{stats.waitlisted}</div>
            <div className="text-sm text-gray-400">Waitlisted</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-green-400 mb-1">{stats.approved}</div>
            <div className="text-sm text-gray-400">Approved</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">{stats.invited}</div>
            <div className="text-sm text-gray-400">Invited</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-red-400 mb-1">{stats.rejected}</div>
            <div className="text-sm text-gray-400">Rejected</div>
          </GlassCard>
          <GlassCard className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-400 mb-1">{stats.vip}</div>
            <div className="text-sm text-gray-400">VIP Priority</div>
          </GlassCard>
        </motion.div>

        {/* Filters and Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <GlassCard className="p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-auto">
                <div className="relative w-full md:w-64">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search entries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="WAITLISTED">Waitlisted</SelectItem>
                    <SelectItem value="APPROVED">Approved</SelectItem>
                    <SelectItem value="INVITED">Invited</SelectItem>
                    <SelectItem value="REJECTED">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-full md:w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="NORMAL">Normal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                {selectedEntries.size > 0 && (
                  <>
                    <FrostedButton
                      variant="success"
                      size="sm"
                      loading={actionLoading}
                      onClick={() => handleBulkAction("approve")}
                    >
                      Approve ({selectedEntries.size})
                    </FrostedButton>
                    <FrostedButton
                      variant="primary"
                      size="sm"
                      loading={actionLoading}
                      onClick={() => handleBulkAction("invite")}
                    >
                      Invite ({selectedEntries.size})
                    </FrostedButton>
                  </>
                )}
                <FrostedButton
                  variant="ghost"
                  size="sm"
                  onClick={handleExportCSV}
                  leftIcon={<Download className="h-4 w-4" />}
                >
                  Export CSV
                </FrostedButton>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Entries Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedEntries.size === filteredEntries.length && filteredEntries.length > 0}
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left text-gray-300 font-medium">User</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Contact</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Status</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Priority</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Source</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Date</th>
                    <th className="p-4 text-left text-gray-300 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <motion.tr
                      key={entry.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <Checkbox
                          checked={selectedEntries.has(entry.id)}
                          onCheckedChange={(checked) => handleSelectEntry(entry.id, !!checked)}
                        />
                      </td>
                      <td className="p-4">
                        <div>
                          <div className="font-medium text-white">
                            {entry.name || "Unknown"}
                          </div>
                          <div className="text-sm text-gray-400">{entry.email}</div>
                          {entry.handle && (
                            <div className="text-sm text-blue-400">{entry.handle}</div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-sm text-gray-400">
                            <Mail className="h-3 w-3" />
                            <span className="truncate max-w-32">{entry.email}</span>
                          </div>
                          {entry.phone && (
                            <div className="flex items-center gap-1 text-sm text-gray-400">
                              <Phone className="h-3 w-3" />
                              <span>{entry.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge className={getStatusColor(entry.status)}>
                          {getStatusIcon(entry.status)}
                          <span className="ml-1">{entry.status}</span>
                        </Badge>
                      </td>
                      <td className="p-4">
                        <Badge 
                          className={entry.priority === 'VIP' ? 
                            'bg-purple-500/20 text-purple-300 border-purple-500/30' : 
                            'bg-gray-500/20 text-gray-300 border-gray-500/30'
                          }
                        >
                          {entry.priority === 'VIP' && <Crown className="h-3 w-3 mr-1" />}
                          {entry.priority}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-sm text-gray-400 capitalize">
                          {entry.referrer || 'Unknown'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="text-sm text-gray-400">
                          {new Date(entry.created_at).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-4">
                        <FrostedButton
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEntry(entry)}
                          leftIcon={<Eye className="h-4 w-4" />}
                        >
                          View
                        </FrostedButton>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredEntries.length === 0 && (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-600 mb-4" />
                  <p className="text-gray-400">No entries found matching your filters</p>
                </div>
              )}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}