import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Crown, Heart, ArrowLeft, CheckCircle, Sparkles, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/hooks/useAuth";

type Step = 'role' | 'details' | 'verification';

export default function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signUp } = useAuth();
  
  // Check for invite validation
  const validatedInvite = sessionStorage.getItem('validatedInvite');
  const inviteData = validatedInvite ? JSON.parse(validatedInvite) : null;
  
  // Redirect if no valid invite
  useEffect(() => {
    if (!inviteData || !location.state?.fromInvite) {
      navigate('/');
      return;
    }
  }, [inviteData, location.state, navigate]);

  const [step, setStep] = useState<Step>('role');
  const [userRole, setUserRole] = useState<'creator' | 'fan' | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    agreeToTerms: false,
    marketingEmails: false
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRoleSelect = (role: 'creator' | 'fan') => {
    setUserRole(role);
    setStep('details');
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('verification');
  };

  const isDetailsValid = () => {
    return formData.email && 
           formData.username && 
           formData.password && 
           formData.confirmPassword && 
           formData.firstName && 
           formData.lastName &&
           formData.dateOfBirth &&
           formData.agreeToTerms &&
           formData.password === formData.confirmPassword;
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gradient mb-4">Join Cabana</h1>
            <p className="text-muted-foreground text-lg">
              Choose how you want to experience our premium platform
            </p>
          </div>

          <div className="space-y-4">
            {/* Creator Interactive Element */}
            <div className="card-luxury group hover:shadow-glow transition-all duration-500 overflow-hidden">
              <div className="text-center p-6 flex flex-col items-center">
                {/* Circular Progress Ring */}
                <div className="relative w-14 h-14 mb-4">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#creator-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.75)}`}
                      className="transition-all duration-1000 group-hover:stroke-dashoffset-0"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="creator-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" />
                        <stop offset="100%" stopColor="hsl(var(--primary-glow))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-primary p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-gradient mb-3">Creator Earnings</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">$5.2K</div>
                    <div className="text-muted-foreground">Avg/Month</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">75%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Creator Option */}
            <div 
              onClick={() => handleRoleSelect('creator')}
              className="card-luxury cursor-pointer hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-primary p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <Crown className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gradient">Creator</h3>
                  <p className="text-muted-foreground mb-3">
                    Monetize your content and build a loyal fanbase. Earn from subscriptions, tips, and exclusive content.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span>Unlimited uploads</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span>Advanced analytics</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <CheckCircle className="w-4 h-4" />
                    <span>Direct messaging</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Interactive Element */}
            <div className="card-luxury group hover:shadow-glow transition-all duration-500 overflow-hidden">
              <div className="text-center p-6 flex flex-col items-center">
                {/* Circular Community Ring */}
                <div className="relative w-14 h-14 mb-4">
                  <svg className="w-14 h-14 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-muted/20"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      stroke="url(#fan-gradient)"
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.9)}`}
                      className="transition-all duration-1000 group-hover:stroke-dashoffset-0"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient id="fan-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--accent))" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-gradient-to-r from-accent to-primary p-2 rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                <h4 className="font-bold text-gradient mb-3">Community</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">2.4K+</div>
                    <div className="text-muted-foreground">Creators</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">90%</div>
                    <div className="text-muted-foreground">Active Daily</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fan Option */}
            <div 
              onClick={() => handleRoleSelect('fan')}
              className="card-luxury cursor-pointer hover:shadow-glow transition-all duration-300 group"
            >
              <div className="flex items-start gap-4">
                <div className="bg-gradient-to-r from-accent to-primary p-3 rounded-2xl group-hover:scale-110 transition-transform">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold mb-2 text-gradient">Fan</h3>
                  <p className="text-muted-foreground mb-3">
                    Discover and support your favorite creators. Access exclusive content and connect directly.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span>Unlimited browsing</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span>Premium subscriptions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-accent">
                    <CheckCircle className="w-4 h-4" />
                    <span>Direct messaging</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'details') {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-4 mb-8">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setStep('role')}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gradient">
                {userRole === 'creator' ? 'Creator' : 'Fan'} Registration
              </h1>
              <p className="text-muted-foreground">
                Create your {userRole} account
              </p>
            </div>
          </div>

          <form onSubmit={handleDetailsSubmit} className="space-y-6">
            <div className="card-luxury">
              <div className="space-y-4">
                {/* Email */}
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                {/* Username */}
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => handleInputChange('username', e.target.value)}
                    className="mt-1"
                    placeholder="@username"
                    required
                  />
                </div>

                {/* Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="mt-1"
                      required
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="mt-1"
                    required
                  />
                </div>

                {/* Password */}
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative mt-1">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                    <p className="text-sm text-destructive mt-1">Passwords do not match</p>
                  )}
                </div>
              </div>
            </div>

            {/* Checkboxes */}
            <div className="space-y-4">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => handleInputChange('agreeToTerms', checked as boolean)}
                />
                <Label htmlFor="terms" className="text-sm leading-5">
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="marketing"
                  checked={formData.marketingEmails}
                  onCheckedChange={(checked) => handleInputChange('marketingEmails', checked as boolean)}
                />
                <Label htmlFor="marketing" className="text-sm">
                  I'd like to receive marketing emails and updates
                </Label>
              </div>
            </div>

            <Button 
              type="submit" 
              className="btn-luxury w-full py-6 text-lg"
              disabled={!isDetailsValid()}
            >
              Create Account
            </Button>
          </form>
        </div>
      </div>
    );
  }

  // Verification step
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="card-luxury">
          <div className="bg-gradient-primary p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-gradient mb-4">
            Welcome to Cabana!
          </h1>
          
          <p className="text-muted-foreground mb-8">
            Your {userRole} account has been created successfully. 
            We've sent a verification email to <strong>{formData.email}</strong>
          </p>

          <div className="space-y-4">
            <Button className="btn-luxury w-full py-6 text-lg">
              Continue to Dashboard
            </Button>
            
            <Button variant="outline" className="w-full">
              Resend Verification Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}