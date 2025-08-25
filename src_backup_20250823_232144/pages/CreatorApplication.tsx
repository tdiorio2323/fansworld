import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Crown, Upload, User, Mail, Phone, Instagram, Users, DollarSign, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useCreatorApplication, CreatorApplicationForm } from "@/hooks/useCreatorApplication";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const applicationSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  age: z.string().min(1, "Age is required"),
  location: z.string().min(2, "Location is required"),
  
  // Platform Information
  primaryPlatform: z.string().min(1, "Primary platform is required"),
  instagramHandle: z.string().optional(),
  tiktokHandle: z.string().optional(),
  onlyfansHandle: z.string().optional(),
  twitchHandle: z.string().optional(),
  youtubeHandle: z.string().optional(),
  
  // Statistics
  totalFollowers: z.string().min(1, "Total followers is required"),
  monthlyEarnings: z.string().min(1, "Monthly earnings is required"),
  contentNiche: z.string().min(1, "Content niche is required"),
  
  // Goals and Experience
  careerGoals: z.string().min(50, "Please provide detailed career goals (minimum 50 characters)"),
  currentChallenges: z.string().min(50, "Please describe your current challenges (minimum 50 characters)"),
  previousManagement: z.string().min(1, "Please specify previous management experience"),
  
  // Package Selection
  interestedPackage: z.string().min(1, "Please select a package"),
  
  // Legal
  over18: z.boolean().refine(val => val === true, "You must be over 18"),
  agreesToTerms: z.boolean().refine(val => val === true, "You must agree to terms"),
  agreesToBackground: z.boolean().refine(val => val === true, "You must agree to background check"),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

export function CreatorApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const { application, submitApplication } = useCreatorApplication();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    trigger
  } = useForm<CreatorApplicationForm>({
    resolver: zodResolver(applicationSchema),
    mode: "onChange"
  });

  const totalSteps = 4;

  const onSubmit = async (data: CreatorApplicationForm) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to submit an application.",
        variant: "destructive"
      });
      return;
    }

    try {
      await submitApplication.mutateAsync(data);
      setSubmitted(true);
      toast({
        title: "Application Submitted!",
        description: "Your application has been submitted successfully. We'll review it and get back to you soon.",
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Submission Error",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive"
      });
    }
  };

  const nextStep = async () => {
    const isValid = await trigger();
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full backdrop-blur-xl bg-black/20 border border-white/10 text-center">
          <CardContent className="p-12">
            <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-4 font-['Playfair_Display']">
              Application Submitted!
            </h2>
            <p className="text-gray-300 mb-6 font-['Cormorant_Garamond']">
              Thank you for your application. Our team will review your submission and get back to you within 2-3 business days.
            </p>
            <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-lg p-6">
              <h3 className="text-xl font-bold text-white mb-3">What's Next?</h3>
              <ul className="text-left text-gray-300 space-y-2">
                <li>• Application review by our team</li>
                <li>• Initial screening call (if selected)</li>
                <li>• Portfolio and content review</li>
                <li>• Final interview with account manager</li>
                <li>• Onboarding and contract signing</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Crown className="h-12 w-12 text-yellow-400 mr-3" />
            <h1 className="text-3xl font-bold text-white font-['Playfair_Display']">
              TD Studios
            </h1>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
            Creator Application
          </h2>
          <p className="text-gray-300 font-['Cormorant_Garamond']">
            Join the elite creators who trust TD Studios to manage and grow their business
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div
                key={i}
                className={`flex items-center ${i < totalSteps - 1 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                    i + 1 <= currentStep
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                      : 'bg-gray-600 text-gray-300'
                  }`}
                >
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      i + 1 < currentStep ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gray-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-center">
            <span className="text-gray-300">
              Step {currentStep} of {totalSteps}
            </span>
          </div>
        </div>

        {/* Form */}
        <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white font-['Playfair_Display']">
              {currentStep === 1 && "Personal Information"}
              {currentStep === 2 && "Platform & Statistics"}
              {currentStep === 3 && "Goals & Experience"}
              {currentStep === 4 && "Package Selection & Legal"}
            </CardTitle>
            <CardDescription className="text-gray-300">
              {currentStep === 1 && "Tell us about yourself"}
              {currentStep === 2 && "Your social media presence and performance"}
              {currentStep === 3 && "Your career goals and challenges"}
              {currentStep === 4 && "Choose your package and agree to terms"}
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Personal Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="firstName" className="text-white">First Name *</Label>
                      <Input
                        id="firstName"
                        {...register("firstName")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter your first name"
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="lastName" className="text-white">Last Name *</Label>
                      <Input
                        id="lastName"
                        {...register("lastName")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter your last name"
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-white">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Enter your email address"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="phone" className="text-white">Phone Number *</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter your phone number"
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-sm mt-1">{errors.phone.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="age" className="text-white">Age *</Label>
                      <Input
                        id="age"
                        type="number"
                        {...register("age")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter your age"
                      />
                      {errors.age && (
                        <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="location" className="text-white">Location *</Label>
                    <Input
                      id="location"
                      {...register("location")}
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="City, State/Country"
                    />
                    {errors.location && (
                      <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Platform & Statistics */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="primaryPlatform" className="text-white">Primary Platform *</Label>
                    <Select onValueChange={(value) => setValue("primaryPlatform", value)}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select your primary platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="onlyfans">OnlyFans</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                        <SelectItem value="twitch">Twitch</SelectItem>
                        <SelectItem value="youtube">YouTube</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.primaryPlatform && (
                      <p className="text-red-400 text-sm mt-1">{errors.primaryPlatform.message}</p>
                    )}
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="instagramHandle" className="text-white">Instagram Handle</Label>
                      <Input
                        id="instagramHandle"
                        {...register("instagramHandle")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="@username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="tiktokHandle" className="text-white">TikTok Handle</Label>
                      <Input
                        id="tiktokHandle"
                        {...register("tiktokHandle")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="@username"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="onlyfansHandle" className="text-white">OnlyFans Handle</Label>
                      <Input
                        id="onlyfansHandle"
                        {...register("onlyfansHandle")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="username"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="twitchHandle" className="text-white">Twitch Handle</Label>
                      <Input
                        id="twitchHandle"
                        {...register("twitchHandle")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="username"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="youtubeHandle" className="text-white">YouTube Channel</Label>
                    <Input
                      id="youtubeHandle"
                      {...register("youtubeHandle")}
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="Channel name or URL"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="totalFollowers" className="text-white">Total Followers Across All Platforms *</Label>
                      <Input
                        id="totalFollowers"
                        type="number"
                        {...register("totalFollowers")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter total followers"
                      />
                      {errors.totalFollowers && (
                        <p className="text-red-400 text-sm mt-1">{errors.totalFollowers.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="monthlyEarnings" className="text-white">Current Monthly Earnings (USD) *</Label>
                      <Input
                        id="monthlyEarnings"
                        type="number"
                        {...register("monthlyEarnings")}
                        className="bg-black/20 border-white/10 text-white"
                        placeholder="Enter monthly earnings"
                      />
                      {errors.monthlyEarnings && (
                        <p className="text-red-400 text-sm mt-1">{errors.monthlyEarnings.message}</p>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="contentNiche" className="text-white">Content Niche *</Label>
                    <Input
                      id="contentNiche"
                      {...register("contentNiche")}
                      className="bg-black/20 border-white/10 text-white"
                      placeholder="e.g., Fashion, Gaming, Lifestyle, Adult Content"
                    />
                    {errors.contentNiche && (
                      <p className="text-red-400 text-sm mt-1">{errors.contentNiche.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 3: Goals & Experience */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="careerGoals" className="text-white">Career Goals *</Label>
                    <Textarea
                      id="careerGoals"
                      {...register("careerGoals")}
                      className="bg-black/20 border-white/10 text-white min-h-[120px]"
                      placeholder="Describe your career goals and what you hope to achieve with TD Studios..."
                    />
                    {errors.careerGoals && (
                      <p className="text-red-400 text-sm mt-1">{errors.careerGoals.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="currentChallenges" className="text-white">Current Challenges *</Label>
                    <Textarea
                      id="currentChallenges"
                      {...register("currentChallenges")}
                      className="bg-black/20 border-white/10 text-white min-h-[120px]"
                      placeholder="What challenges are you currently facing in your creator journey?"
                    />
                    {errors.currentChallenges && (
                      <p className="text-red-400 text-sm mt-1">{errors.currentChallenges.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <Label htmlFor="previousManagement" className="text-white">Previous Management Experience *</Label>
                    <Select onValueChange={(value) => setValue("previousManagement", value)}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select your previous management experience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No previous management</SelectItem>
                        <SelectItem value="self">Self-managed</SelectItem>
                        <SelectItem value="agency">Previously with another agency</SelectItem>
                        <SelectItem value="manager">Had a personal manager</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.previousManagement && (
                      <p className="text-red-400 text-sm mt-1">{errors.previousManagement.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Package Selection & Legal */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="interestedPackage" className="text-white">Interested Package *</Label>
                    <Select onValueChange={(value) => setValue("interestedPackage", value)}>
                      <SelectTrigger className="bg-black/20 border-white/10 text-white">
                        <SelectValue placeholder="Select your preferred package" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="starter">Starter Package - $2,500/month</SelectItem>
                        <SelectItem value="premium">Premium Package - $5,000/month</SelectItem>
                        <SelectItem value="elite">Elite Package - $10,000/month</SelectItem>
                        <SelectItem value="custom">Custom Package - Let's discuss</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.interestedPackage && (
                      <p className="text-red-400 text-sm mt-1">{errors.interestedPackage.message}</p>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="over18"
                        checked={watch("over18")}
                        onCheckedChange={(checked) => setValue("over18", checked as boolean)}
                      />
                      <Label htmlFor="over18" className="text-white">
                        I confirm that I am over 18 years old *
                      </Label>
                    </div>
                    {errors.over18 && (
                      <p className="text-red-400 text-sm">{errors.over18.message}</p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreesToTerms"
                        checked={watch("agreesToTerms")}
                        onCheckedChange={(checked) => setValue("agreesToTerms", checked as boolean)}
                      />
                      <Label htmlFor="agreesToTerms" className="text-white">
                        I agree to the Terms of Service and Privacy Policy *
                      </Label>
                    </div>
                    {errors.agreesToTerms && (
                      <p className="text-red-400 text-sm">{errors.agreesToTerms.message}</p>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="agreesToBackground"
                        checked={watch("agreesToBackground")}
                        onCheckedChange={(checked) => setValue("agreesToBackground", checked as boolean)}
                      />
                      <Label htmlFor="agreesToBackground" className="text-white">
                        I agree to background check and verification process *
                      </Label>
                    </div>
                    {errors.agreesToBackground && (
                      <p className="text-red-400 text-sm">{errors.agreesToBackground.message}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button
                    type="button"
                    onClick={nextStep}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={submitApplication.isPending}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white ml-auto"
                  >
                    {submitApplication.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}