import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function AdminTest() {
  const [inviteCode, setInviteCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Generate a test invite directly
  const createTestInvite = async () => {
    setLoading(true);
    try {
      // Generate random codes
      const testInviteCode = "VIP-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      const testPasscode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // Insert directly into invites table
      const { data, error } = await supabase
        .from("invites")
        .insert({
          invite_code: testInviteCode,
          passcode: testPasscode,
          intended_for: "Test Launch User",
          description: "Test VIP invite for launch testing",
          max_uses: 5,
          current_uses: 0,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
          status: "active",
          created_by: "00000000-0000-0000-0000-000000000000" // placeholder UUID
        })
        .select()
        .single();

      if (error) throw error;

      setInviteCode(testInviteCode);
      setPasscode(testPasscode);
      
      toast.success("Test invite created!");
      console.log("Created invite:", data);
      
    } catch (error) {
      console.error("Error creating test invite:", error);
      toast.error("Failed to create test invite: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // List existing invites
  const listInvites = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("invites")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setInvites(data || []);
      toast.success(`Found ${data?.length || 0} invites`);
      
    } catch (error) {
      console.error("Error listing invites:", error);
      toast.error("Failed to list invites: " + (error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Admin Test Panel
          </h1>
          <p className="text-slate-400">Direct database testing for VIP invites</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Test Invite */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Create Test VIP Invite</CardTitle>
              <CardDescription>Generate a test invite code directly</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={createTestInvite} 
                disabled={loading}
                className="w-full btn-chrome"
              >
                {loading ? "Creating..." : "Create Test Invite"}
              </Button>
              
              {inviteCode && (
                <div className="space-y-2">
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Invite Code:</p>
                    <code className="text-green-400 font-mono">{inviteCode}</code>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Passcode:</p>
                    <code className="text-green-400 font-mono">{passcode}</code>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-lg">
                    <p className="text-sm text-slate-400">Test URL:</p>
                    <code className="text-blue-400 font-mono text-xs">
                      https://cabana.tdstudiosny.com/invite/{inviteCode}
                    </code>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* List Invites */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Existing Invites</CardTitle>
              <CardDescription>View all invite codes in database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={listInvites} 
                disabled={loading}
                className="w-full btn-chrome"
              >
                {loading ? "Loading..." : "List All Invites"}
              </Button>
              
              {invites.length > 0 && (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {invites.map((invite: any) => (
                    <div key={invite.id} className="bg-slate-900 p-3 rounded-lg">
                      <div className="flex justify-between items-center">
                        <code className="text-green-400">{invite.invite_code}</code>
                        <span className="text-xs text-slate-500">
                          {invite.current_uses}/{invite.max_uses} uses
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{invite.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Test Instructions */}
        <Card className="bg-slate-800 border-slate-700 mt-6">
          <CardHeader>
            <CardTitle className="text-white">Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300">
            <ol className="list-decimal list-inside space-y-2">
              <li>Click "Create Test Invite" to generate a VIP code</li>
              <li>Copy the invite URL that's generated</li>
              <li>Open the URL in a new incognito/private window</li>
              <li>Test the invite redemption process</li>
              <li>Check if the usage count increases</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}