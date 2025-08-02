import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, ArrowRight, Loader2, Chrome, Smartphone } from 'lucide-react';
import { motion } from 'framer-motion';
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
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
    setIsLoading(true);
    setError('');

    try {
      if (isSignUp) {
        // Sign up flow
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        const { error } = await signUp(
          formData.email, 
          formData.password, 
          {
            username: formData.username,
            display_name: formData.displayName,
            role: formData.role
          }
        );

        if (error) {
          setError(error.message || 'Sign up failed');
        } else {
          // Success - redirect will happen via auth state change
          navigate('/home');
        }
      } else {
        // Sign in flow
        const { error } = await signIn(formData.email, formData.password);
        
        if (error) {
          setError(error.message || 'Sign in failed');
        } else {
          // Success - redirect will happen via auth state change
          navigate('/home');
        }
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Auth error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex">
      
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gray-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-amber-400/20 to-amber-600/20"></div>
          <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-amber-400/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center px-16 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center mb-6">
                <div className="w-8 h-8 bg-gray-900 rounded-lg"></div>
              </div>
              <h1 className="text-5xl font-bold text-white mb-4">CABANA</h1>
              <p className="text-xl text-gray-300 leading-relaxed">
                The premium creator management platform trusted by top-tier creators and agencies worldwide.
              </p>
            </div>
            
            <div className="space-y-6 text-gray-300">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Advanced analytics and insights</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Integrated payment processing</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
                <span>Professional creator tools</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-gray-900 to-gray-700 rounded-xl flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-amber-600 rounded-md"></div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">CABANA</h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="bg-white shadow-xl border border-gray-200 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <CardTitle className="text-2xl font-semibold text-gray-900 mb-2">
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-gray-600">
                  Sign in to your CABANA account
                </CardDescription>
              </CardHeader>
              
              <CardContent className="px-8 pb-8">
                <Tabs value={isSignUp ? "signup" : "signin"} onValueChange={(value) => setIsSignUp(value === "signup")} className="w-full">
                  <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-100">
                    <TabsTrigger value="signin" className="data-[state=active]:bg-white text-black" onClick={() => setIsSignUp(false)}>Sign In</TabsTrigger>
                    <TabsTrigger value="signup" className="data-[state=active]:bg-white text-black" onClick={() => setIsSignUp(true)}>Sign Up</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="signin" className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-black"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={formData.password}
                            onChange={(e) => updateFormData('password', e.target.value)}
                            placeholder="Enter your password"
                            className="h-12 pr-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-black"
                            required
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>

                      {error && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          {error}
                        </motion.p>
                      )}

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Signing In...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Sign In
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                  
                  <TabsContent value="signup" className="space-y-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                        {error}
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName" className="text-gray-700 font-medium">Display Name</Label>
                          <Input
                            id="displayName"
                            type="text"
                            value={formData.displayName}
                            onChange={(e) => updateFormData('displayName', e.target.value)}
                            placeholder="Your name"
                            className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-black"
                            required
                          />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="username" className="text-gray-700 font-medium">Username</Label>
                          <Input
                            id="username"
                            type="text"
                            value={formData.username}
                            onChange={(e) => updateFormData('username', e.target.value)}
                            placeholder="@username"
                            className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500 text-black"
                            required
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="role" className="text-gray-700 font-medium">Account Type</Label>
                        <Select value={formData.role} onValueChange={(value) => updateFormData('role', value)}>
                          <SelectTrigger className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500">
                            <SelectValue placeholder="Select account type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fan">Fan</SelectItem>
                            <SelectItem value="creator">Creator</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-email" className="text-gray-700 font-medium">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => updateFormData('email', e.target.value)}
                          placeholder="Enter your email"
                          className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="signup-password" className="text-gray-700 font-medium">Password</Label>
                        <Input
                          id="signup-password"
                          type="password"
                          value={formData.password}
                          onChange={(e) => updateFormData('password', e.target.value)}
                          placeholder="Create a password"
                          className="h-12 border-gray-300 focus:border-amber-500 focus:ring-amber-500"
                          required
                        />
                      </div>

                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="w-full h-12 bg-gray-900 hover:bg-gray-800 text-white rounded-xl font-semibold transition-all duration-200 disabled:opacity-50"
                      >
                        {isLoading ? (
                          <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating Account...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            Create Account
                            <ArrowRight className="w-5 h-5" />
                          </div>
                        )}
                      </Button>
                    </form>
                  </TabsContent>
                </Tabs>

                {/* Social Auth */}
                <div className="mt-8">
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white text-gray-500">Or continue with</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-black"
                    >
                      <Chrome className="w-5 h-5 mr-2" />
                      Google
                    </Button>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="h-12 border-gray-300 hover:border-gray-400 hover:bg-gray-50 text-black"
                    >
                      <Smartphone className="w-5 h-5 mr-2" />
                      Apple
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                By continuing, you agree to our{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-amber-600 hover:text-amber-700">Privacy Policy</a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}