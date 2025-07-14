import { useState } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff, Crown, Heart, ArrowLeft, CheckCircle, Sparkles, Users, DollarSign, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type Step = 'role' | 'details' | 'verification';

export default function Register() {
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
            <h1 className="text-4xl font-bold text-gradient mb-4">Join Champagne Room</h1>
            <p className="text-muted-foreground text-lg">
              Choose how you want to experience our premium platform
            </p>
          </div>

          <div className="space-y-4">
            {/* Creator Interactive Element */}
            <div className="card-luxury group hover:shadow-glow transition-all duration-500 overflow-hidden">
              <div className="text-center p-4">
                <div className="bg-gradient-primary p-3 rounded-full w-16 h-16 mx-auto mb-3 group-hover:rotate-12 transition-transform duration-300">
                  <Sparkles className="w-10 h-10 text-white mx-auto" />
                </div>
                <h4 className="font-bold text-gradient mb-2">Creator Earnings Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Average Monthly</span>
                    <span className="text-primary font-bold">$5,200</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Top Earners</span>
                    <span className="text-primary font-bold">$50K+</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2 group-hover:bg-gradient-primary transition-all duration-500">
                    <div className="bg-gradient-primary h-2 rounded-full w-3/4 group-hover:w-full transition-all duration-1000"></div>
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
              <div className="text-center p-4">
                <div className="bg-gradient-to-r from-accent to-primary p-3 rounded-full w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-10 h-10 text-white mx-auto" />
                </div>
                <h4 className="font-bold text-gradient mb-2">Community Highlights</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Active Creators</span>
                    <span className="text-accent font-bold">2,400+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Content Daily</span>
                    <span className="text-accent font-bold">1,000+</span>
                  </div>
                  <div className="flex justify-center space-x-1">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-3 h-3 fill-accent text-accent group-hover:animate-pulse" style={{animationDelay: `${star * 100}ms`}} />
                    ))}
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
            Welcome to Champagne Room!
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