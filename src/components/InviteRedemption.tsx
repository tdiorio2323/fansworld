import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { 
  Key, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  Mail,
  Clock,
  Users
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface InviteInfo {
  intended_for: string;
  description: string;
  remaining_uses: number;
}

export function InviteRedemption() {
  const { inviteCode } = useParams<{ inviteCode: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [inviteInfo, setInviteInfo] = useState<InviteInfo | null>(null);
  const [error, setError] = useState("");
  interface ValidInviteInfo {
  id: string;
  // Add other properties of the invite object if known
}
  const [validInvite, setValidInvite] = useState<ValidInviteInfo | null>(null);
  const [checkingInvite, setCheckingInvite] = useState(true);

  useEffect(() => {
    if (inviteCode) {
      checkInviteCode();
    }
  }, [inviteCode, checkInviteCode]);

  const checkInviteCode = useCallback(async () => {
    try {
      setCheckingInvite(true);
      const { data, error } = await supabase.functions.invoke('redeem-invite', {
        body: {
          action: 'check',
          invite_code: inviteCode
        }
      });

      if (error || !data.success) {
        setError(data?.error || "Invalid invite code");
        return;
      }

      setInviteInfo(data.invite);
    } catch (error) {
      console.error('Error checking invite:', error);
      setError("Failed to validate invite code");
    } finally {
      setCheckingInvite(false);
    }
  }, [inviteCode]);

  const validatePasscode = async () => {
    if (!passcode.trim()) {
      setError("Please enter the passcode");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase.functions.invoke('redeem-invite', {
        body: {
          action: 'validate',
          invite_code: inviteCode,
          passcode: passcode.trim()
        }
      });

      if (error || !data.success) {
        setError(data?.error || "Invalid passcode");
        return;
      }

      setValidInvite(data.invite);
      
      toast({
        title: "Invite Validated!",
        description: "You can now proceed with registration",
      });

      // Store invite validation in sessionStorage for registration process
      sessionStorage.setItem('validatedInvite', JSON.stringify({
        inviteCode,
        passcode: passcode.trim(),
        inviteId: data.invite.id,
        validatedAt: Date.now()
      }));

      // Redirect to registration
      navigate('/register', { 
        state: { 
          fromInvite: true,
          inviteCode,
          inviteInfo: data.invite 
        }
      });

    } catch (error) {
      console.error('Error validating passcode:', error);
      setError("Failed to validate passcode");
    } finally {
      setLoading(false);
    }
  };

  const handlePasscodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (value.length <= 6) {
      setPasscode(value);
      setError("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validatePasscode();
    }
  };

  if (checkingInvite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Checking invite code...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !inviteInfo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <CardTitle>Invalid Invite</CardTitle>
            <CardDescription>
              This invite link is not valid or has expired
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/')} variant="outline">
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (validInvite) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <CardTitle>Invite Validated!</CardTitle>
            <CardDescription>
              Redirecting to registration...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Welcome to Cabana</CardTitle>
          <CardDescription>
            Enter your passcode to unlock registration
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Invite Info */}
          {inviteInfo && (
            <div className="space-y-3">
              {inviteInfo.intended_for && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span>Invited: {inviteInfo.intended_for}</span>
                </div>
              )}
              
              {inviteInfo.description && (
                <Alert>
                  <AlertDescription>
                    {inviteInfo.description}
                  </AlertDescription>
                </Alert>
              )}
              
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>{inviteInfo.remaining_uses} uses remaining</span>
                </div>
              </div>
            </div>
          )}

          {/* Passcode Input */}
          <div className="space-y-2">
            <Label htmlFor="passcode">Enter Passcode</Label>
            <Input
              id="passcode"
              type="text"
              placeholder="6-digit code"
              value={passcode}
              onChange={handlePasscodeChange}
              onKeyPress={handleKeyPress}
              className="text-center text-lg tracking-[0.3em] font-mono"
              maxLength={6}
              autoComplete="off"
              autoFocus
            />
            <p className="text-xs text-muted-foreground text-center">
              Enter the 6-character passcode provided with your invite
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            onClick={validatePasscode}
            disabled={loading || passcode.length !== 6}
            className="w-full btn-chrome"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Validating...
              </>
            ) : (
              <>
                <Key className="w-4 h-4 mr-2" />
                Validate Passcode
              </>
            )}
          </Button>

          {/* Help Text */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an invite? Contact an administrator for access.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}