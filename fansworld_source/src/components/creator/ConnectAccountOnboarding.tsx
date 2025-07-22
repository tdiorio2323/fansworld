import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { 
  CreditCard, 
  User, 
  Building, 
  MapPin, 
  Shield, 
  ExternalLink,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { useStripeConnect } from '@/hooks/useStripeConnect';
import { useAuth } from '@/hooks/useAuth';

interface ConnectAccountOnboardingProps {
  onComplete: () => void;
  onCancel: () => void;
}

interface FormData {
  email: string;
  country: string;
  business_type: string;
  individual: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    dob: {
      day: number;
      month: number;
      year: number;
    };
    ssn_last_4: string;
    address: {
      line1: string;
      line2: string;
      city: string;
      state: string;
      postal_code: string;
      country: string;
    };
  };
  business_profile: {
    name: string;
    url: string;
    mcc: string;
    product_description: string;
  };
  terms_accepted: boolean;
}

export const ConnectAccountOnboarding: React.FC<ConnectAccountOnboardingProps> = ({
  onComplete,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    country: 'US',
    business_type: 'individual',
    individual: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      dob: {
        day: 1,
        month: 1,
        year: 1990
      },
      ssn_last_4: '',
      address: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'US'
      }
    },
    business_profile: {
      name: '',
      url: '',
      mcc: '5815', // Digital content/entertainment
      product_description: 'Digital content creation and entertainment services'
    },
    terms_accepted: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const { createConnectAccount, createOnboardingSession } = useStripeConnect();

  const steps = [
    { id: 1, title: 'Basic Information', icon: User },
    { id: 2, title: 'Personal Details', icon: Shield },
    { id: 3, title: 'Address & Contact', icon: MapPin },
    { id: 4, title: 'Business Profile', icon: Building },
    { id: 5, title: 'Terms & Verification', icon: CheckCircle }
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.business_type) newErrors.business_type = 'Business type is required';
        break;
      
      case 2:
        if (!formData.individual.first_name) newErrors.first_name = 'First name is required';
        if (!formData.individual.last_name) newErrors.last_name = 'Last name is required';
        if (!formData.individual.email) newErrors.individual_email = 'Email is required';
        if (!formData.individual.phone) newErrors.phone = 'Phone is required';
        if (!formData.individual.ssn_last_4) newErrors.ssn_last_4 = 'Last 4 digits of SSN are required';
        break;
      
      case 3:
        if (!formData.individual.address.line1) newErrors.address_line1 = 'Address is required';
        if (!formData.individual.address.city) newErrors.city = 'City is required';
        if (!formData.individual.address.state) newErrors.state = 'State is required';
        if (!formData.individual.address.postal_code) newErrors.postal_code = 'Postal code is required';
        break;
      
      case 4:
        if (!formData.business_profile.name) newErrors.business_name = 'Business name is required';
        if (!formData.business_profile.product_description) newErrors.product_description = 'Product description is required';
        break;
      
      case 5:
        if (!formData.terms_accepted) newErrors.terms_accepted = 'You must accept the terms';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsLoading(true);
    try {
      // Create Connect account
      const account = await createConnectAccount.mutateAsync(formData);
      
      // Create onboarding session
      const returnUrl = `${window.location.origin}/creator/payouts?onboarding=complete`;
      const refreshUrl = `${window.location.origin}/creator/payouts?onboarding=refresh`;
      
      const session = await createOnboardingSession.mutateAsync({
        stripeAccountId: account.stripe_account_id,
        returnUrl,
        refreshUrl
      });

      // Redirect to Stripe onboarding
      window.location.href = session.session_url;
    } catch (error) {
      console.error('Error creating account:', error);
      toast({
        title: 'Error',
        description: 'Failed to create payout account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (path: string, value: unknown) => {
    setFormData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: Record<string, any> = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!(keys[i] in current)) {
          current[keys[i]] = {};
        }
        current = current[keys[i]] as Record<string, any>;
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateFormData('email', e.target.value)}
                placeholder="your@email.com"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Select value={formData.country} onValueChange={(value) => updateFormData('country', value)}>
                <SelectTrigger className={errors.country ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="US">United States</SelectItem>
                  <SelectItem value="CA">Canada</SelectItem>
                  <SelectItem value="GB">United Kingdom</SelectItem>
                  <SelectItem value="AU">Australia</SelectItem>
                </SelectContent>
              </Select>
              {errors.country && <p className="text-sm text-red-500">{errors.country}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_type">Account Type</Label>
              <Select value={formData.business_type} onValueChange={(value) => updateFormData('business_type', value)}>
                <SelectTrigger className={errors.business_type ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                </SelectContent>
              </Select>
              {errors.business_type && <p className="text-sm text-red-500">{errors.business_type}</p>}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="first_name">First Name</Label>
                <Input
                  id="first_name"
                  value={formData.individual.first_name}
                  onChange={(e) => updateFormData('individual.first_name', e.target.value)}
                  className={errors.first_name ? 'border-red-500' : ''}
                />
                {errors.first_name && <p className="text-sm text-red-500">{errors.first_name}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="last_name">Last Name</Label>
                <Input
                  id="last_name"
                  value={formData.individual.last_name}
                  onChange={(e) => updateFormData('individual.last_name', e.target.value)}
                  className={errors.last_name ? 'border-red-500' : ''}
                />
                {errors.last_name && <p className="text-sm text-red-500">{errors.last_name}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="individual_email">Email Address</Label>
              <Input
                id="individual_email"
                type="email"
                value={formData.individual.email}
                onChange={(e) => updateFormData('individual.email', e.target.value)}
                className={errors.individual_email ? 'border-red-500' : ''}
              />
              {errors.individual_email && <p className="text-sm text-red-500">{errors.individual_email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.individual.phone}
                onChange={(e) => updateFormData('individual.phone', e.target.value)}
                placeholder="+1 (555) 123-4567"
                className={errors.phone ? 'border-red-500' : ''}
              />
              {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <Label>Date of Birth</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select
                  value={formData.individual.dob.month.toString()}
                  onValueChange={(value) => updateFormData('individual.dob.month', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.individual.dob.day.toString()}
                  onValueChange={(value) => updateFormData('individual.dob.day', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Day" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 31 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={formData.individual.dob.year.toString()}
                  onValueChange={(value) => updateFormData('individual.dob.year', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = new Date().getFullYear() - 18 - i;
                      return (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ssn_last_4">Last 4 digits of SSN</Label>
              <Input
                id="ssn_last_4"
                type="text"
                maxLength={4}
                value={formData.individual.ssn_last_4}
                onChange={(e) => updateFormData('individual.ssn_last_4', e.target.value)}
                placeholder="1234"
                className={errors.ssn_last_4 ? 'border-red-500' : ''}
              />
              {errors.ssn_last_4 && <p className="text-sm text-red-500">{errors.ssn_last_4}</p>}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address_line1">Address Line 1</Label>
              <Input
                id="address_line1"
                value={formData.individual.address.line1}
                onChange={(e) => updateFormData('individual.address.line1', e.target.value)}
                placeholder="123 Main Street"
                className={errors.address_line1 ? 'border-red-500' : ''}
              />
              {errors.address_line1 && <p className="text-sm text-red-500">{errors.address_line1}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address_line2">Address Line 2 (Optional)</Label>
              <Input
                id="address_line2"
                value={formData.individual.address.line2}
                onChange={(e) => updateFormData('individual.address.line2', e.target.value)}
                placeholder="Apartment, suite, etc."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.individual.address.city}
                  onChange={(e) => updateFormData('individual.address.city', e.target.value)}
                  className={errors.city ? 'border-red-500' : ''}
                />
                {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  value={formData.individual.address.state}
                  onChange={(e) => updateFormData('individual.address.state', e.target.value)}
                  placeholder="NY"
                  className={errors.state ? 'border-red-500' : ''}
                />
                {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="postal_code">Postal Code</Label>
              <Input
                id="postal_code"
                value={formData.individual.address.postal_code}
                onChange={(e) => updateFormData('individual.address.postal_code', e.target.value)}
                placeholder="10001"
                className={errors.postal_code ? 'border-red-500' : ''}
              />
              {errors.postal_code && <p className="text-sm text-red-500">{errors.postal_code}</p>}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business_name">Business/Creator Name</Label>
              <Input
                id="business_name"
                value={formData.business_profile.name}
                onChange={(e) => updateFormData('business_profile.name', e.target.value)}
                placeholder="Your creator name or business name"
                className={errors.business_name ? 'border-red-500' : ''}
              />
              {errors.business_name && <p className="text-sm text-red-500">{errors.business_name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_url">Website/Social Media URL (Optional)</Label>
              <Input
                id="business_url"
                type="url"
                value={formData.business_profile.url}
                onChange={(e) => updateFormData('business_profile.url', e.target.value)}
                placeholder="https://your-website.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="product_description">Product/Service Description</Label>
              <textarea
                id="product_description"
                className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${errors.product_description ? 'border-red-500' : ''}`}
                value={formData.business_profile.product_description}
                onChange={(e) => updateFormData('business_profile.product_description', e.target.value)}
                placeholder="Describe what you create or offer to your audience"
              />
              {errors.product_description && <p className="text-sm text-red-500">{errors.product_description}</p>}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By completing this setup, you'll be redirected to Stripe to securely verify your identity and connect your bank account for payouts.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.terms_accepted}
                  onCheckedChange={(checked) => updateFormData('terms_accepted', checked)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I accept the{' '}
                  <a href="/legal/terms" target="_blank" className="text-primary hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/legal/privacy" target="_blank" className="text-primary hover:underline">
                    Privacy Policy
                  </a>
                </Label>
              </div>
              {errors.terms_accepted && <p className="text-sm text-red-500">{errors.terms_accepted}</p>}
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  You'll be redirected to Stripe for identity verification
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Connect your bank account for payouts
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Complete any additional verification steps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Start receiving payouts once approved
                </li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const progressPercentage = (currentStep / steps.length) * 100;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Set Up Your Payout Account
          </CardTitle>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>Step {currentStep} of {steps.length}</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1]?.icon, { className: "h-5 w-5" })}
            {steps[currentStep - 1]?.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={currentStep === 1 ? onCancel : handleBack}
          disabled={isLoading}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {currentStep === 1 ? 'Cancel' : 'Back'}
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={handleNext} disabled={isLoading}>
            Next
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? 'Setting up...' : 'Complete Setup'}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};