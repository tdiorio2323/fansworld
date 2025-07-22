import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

// Add holographic animation styles
const holographicStyles = `
  @keyframes holographic {
    0% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 50% 50%, center; }
    25% { background-position: 100% 50%, 0% 50%, 50% 100%, 50% 0%, 75% 25%, center; }
    50% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 25% 75%, center; }
    75% { background-position: 100% 50%, 0% 50%, 50% 100%, 50% 0%, 75% 25%, center; }
    100% { background-position: 0% 50%, 100% 50%, 50% 0%, 50% 100%, 50% 50%, center; }
  }
  .holographic-bg {
    animation: holographic 8s ease-in-out infinite;
  }
`;
import { GoogleSignIn } from '@/components/auth/GoogleSignIn';
import { AppleSignIn } from '@/components/auth/AppleSignIn';

interface LocationState {
  from?: {
    pathname: string;
  };
}

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const from = state?.from?.pathname || '/home';

  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    displayName: '',
    role: 'fan' as 'creator' | 'fan'
  });

  // Bypass: Don't redirect automatically, let users see the auth page first
  // if (user && !loading) {
  //   return <Navigate to={from} replace />;
  // }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bypass authentication - just redirect to home
    navigate('/home');
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <>
      <style>{holographicStyles}</style>
      <div className="min-h-screen relative flex items-center justify-center px-4" style={{
        backgroundImage: 'url(/cabana-crystal-bg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
      {/* Prismatic glass overlay */}
      <div className="absolute inset-0" style={{
        background: `
          radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 25% 75%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 75% 25%, rgba(255, 255, 0, 0.1) 0%, transparent 50%)
        `,
        backdropFilter: 'blur(1px)'
      }}></div>
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="w-full max-w-lg relative z-10">
        <div className="text-center mb-16">
          {/* Large Cabana Script Title */}
          <h1 className="mb-8" style={{
            fontSize: '7rem',
            fontFamily: '"Dancing Script", cursive',
            fontWeight: '600',
            color: 'white',
            textShadow: '0 8px 32px rgba(0, 0, 0, 0.9), 0 4px 16px rgba(255, 255, 255, 0.4), 0 2px 8px rgba(0, 0, 0, 0.6)',
            letterSpacing: '1px',
            lineHeight: '0.9'
          }}>
            Cabana
          </h1>
          <p className="text-xl text-white/90 font-light">
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </p>
        </div>

        <Card className="p-6 border border-white/20 shadow-2xl" style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '24px'
        }}>
          <CardHeader className="pb-6">
            <Tabs value={isSignUp ? 'signup' : 'signin'} onValueChange={(value) => setIsSignUp(value === 'signup')}>
              <TabsList className="grid w-full grid-cols-2 h-12" style={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)'
              }}>
                <TabsTrigger value="signin" className="text-base text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign In</TabsTrigger>
                <TabsTrigger value="signup" className="text-base text-white data-[state=active]:bg-white/20 data-[state=active]:text-white">Sign Up</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              {isSignUp && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <Select value={formData.role} onValueChange={(value: 'creator' | 'fan') => updateFormData('role', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose your role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fan">Fan - Discover amazing creators</SelectItem>
                        <SelectItem value="creator">Creator - Share your content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => updateFormData('username', e.target.value)}
                        placeholder="@username"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        type="text"
                        value={formData.displayName}
                        onChange={(e) => updateFormData('displayName', e.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="Enter your email"
                  className="h-12 text-base text-white placeholder:text-white/60"
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px'
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    placeholder="Enter your password"
                    className="h-12 text-base text-white placeholder:text-white/60"
                    style={{
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '12px'
                    }}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-sm text-destructive">Passwords do not match</p>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full hover:scale-105 transition-all h-12 text-base font-medium text-white"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px'
                }}
              >
                {isSignUp ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 text-white/80" style={{ background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', borderRadius: '8px' }}>Or continue with</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <GoogleSignIn />
                <AppleSignIn />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
    </>
  );
}