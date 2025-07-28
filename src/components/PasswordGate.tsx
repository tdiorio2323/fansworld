import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, Sparkles, Crown, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SITE_PASSWORD = 'td'; // VIP code password

interface PasswordGateProps {
  children: React.ReactNode;
}

export const PasswordGate: React.FC<PasswordGateProps> = ({ children }) => {
  const [email, setEmail] = useState('');
  const [vipCode, setVipCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showVipInput, setShowVipInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user has already entered the code in this session
    const sessionAuth = sessionStorage.getItem('site_authenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('instagram.com') || email.includes('@')) {
      // Redirect to the Instagram link or email
      window.location.href = email.startsWith('http') ? email : `https://${email}`;
    } else {
      setError('Please enter a valid Instagram link.');
    }
  };

  const handleVipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (vipCode === SITE_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('site_authenticated', 'true');
      setError('');
    } else {
      setError('Incorrect VIP code. Please try again.');
      setVipCode('');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-morphism border-border/60">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center">
            <Sparkles className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-3xl font-luxury font-bold text-gradient">Cabana</h1>
          </div>
          <div className="mx-auto p-3 bg-gradient-primary rounded-xl w-fit">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">Access Required</CardTitle>
          <CardDescription>
            This is a private preview. Please enter your Instagram link to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showVipInput ? (
            // Email form
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Instagram link"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={!email.trim()}>
                Continue
              </Button>
              
              <div className="mt-4 text-center">
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => setShowVipInput(true)}
                  className="w-full flex items-center gap-2"
                >
                  <Crown className="h-4 w-4" />
                  VIP Code Access
                </Button>
              </div>
            </form>
          ) : (
            // VIP Code form
            <form onSubmit={handleVipSubmit} className="space-y-4">
              <div className="relative">
                <Crown className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter VIP code"
                  value={vipCode}
                  onChange={(e) => setVipCode(e.target.value)}
                  className="pl-10 pr-10"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              
              {error && (
                <p className="text-sm text-destructive text-center">{error}</p>
              )}
              
              <Button type="submit" className="w-full" disabled={!vipCode.trim()}>
                Access VIP
              </Button>
              
              <div className="mt-4 text-center">
                <Button 
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setShowVipInput(false);
                    setError('');
                    setVipCode('');
                  }}
                  className="text-sm text-muted-foreground"
                >
                  ← Back to Instagram link
                </Button>
              </div>
            </form>
          )}
          
          <div className="mt-6 pt-4 border-t border-border/60 text-center">
            <p className="text-xs text-muted-foreground">
              🔒 This preview site is password protected
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};