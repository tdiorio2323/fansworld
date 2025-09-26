import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Crown, Star, TrendingUp, Shield, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function Agency() {
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const navigate = useNavigate();

  const servicePackages = [
    {
      id: "starter",
      name: "Starter Package",
      price: "$2,500",
      period: "per month",
      description: "Perfect for emerging creators ready to scale",
      features: [
        "Account management & optimization",
        "Content planning & strategy",
        "Basic promotion & marketing",
        "Weekly performance reports",
        "Email support",
        "Platform compliance guidance"
      ],
      badge: "Most Popular",
      commission: "30%"
    },
    {
      id: "premium",
      name: "Premium Package",
      price: "$5,000",
      period: "per month",
      description: "For established creators seeking growth",
      features: [
        "Full content creation & management",
        "Cross-platform management",
        "Brand partnership coordination",
        "Social media management",
        "24/7 priority support",
        "Legal consultation",
        "Custom branding assets",
        "Advanced analytics"
      ],
      badge: "Best Value",
      commission: "25%"
    },
    {
      id: "elite",
      name: "Elite Package",
      price: "$10,000",
      period: "per month",
      description: "Complete business management for top creators",
      features: [
        "Complete business management",
        "Personal brand development",
        "Legal & contract support",
        "PR & media relations",
        "Investment advisory",
        "Tax planning assistance",
        "Personal assistant services",
        "Executive coaching",
        "Merchandise development"
      ],
      badge: "Premium",
      commission: "20%"
    }
  ];

  const stats = [
    { icon: Users, label: "Creators Managed", value: "250+" },
    { icon: DollarSign, label: "Revenue Generated", value: "$50M+" },
    { icon: TrendingUp, label: "Average Growth", value: "400%" },
    { icon: Star, label: "Satisfaction Rate", value: "98%" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-pink-900/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex items-center justify-center mb-8">
              <Crown className="h-16 w-16 text-yellow-400 mr-4" />
              <h1 className="text-5xl font-bold text-white font-['Playfair_Display']">
                TD Studios
              </h1>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 font-['Playfair_Display']">
              Premier Creator Management Agency
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto font-['Cormorant_Garamond']">
              Exclusively representing female content creators, influencers, and streamers. 
              We transform talent into thriving businesses through strategic management and proven growth systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 text-lg"
                onClick={() => document.getElementById('packages')?.scrollIntoView({ behavior: 'smooth' })}
              >
                View Packages
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 text-lg"
                onClick={() => navigate('/creator-application')}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Service Packages */}
      <div id="packages" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-['Playfair_Display']">
              Service Packages
            </h2>
            <p className="text-xl text-gray-300 font-['Cormorant_Garamond']">
              Choose the perfect package for your creator journey
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {servicePackages.map((pkg) => (
              <Card 
                key={pkg.id}
                className={`relative backdrop-blur-xl bg-black/20 border border-white/10 hover:border-purple-500/50 transition-all duration-300 ${
                  selectedPackage === pkg.id ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {pkg.badge && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                    {pkg.badge}
                  </Badge>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-white font-['Playfair_Display']">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="text-gray-300 font-['Cormorant_Garamond']">
                    {pkg.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-white">{pkg.price}</span>
                    <span className="text-gray-400 ml-2">{pkg.period}</span>
                  </div>
                  <div className="text-sm text-purple-400">
                    {pkg.commission} commission rate
                  </div>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-5 w-5 text-purple-400 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() => setSelectedPackage(pkg.id)}
                  >
                    Choose {pkg.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Why Choose TD Studios */}
      <div className="py-24 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4 font-['Playfair_Display']">
              Why Choose TD Studios?
            </h2>
            <p className="text-xl text-gray-300 font-['Cormorant_Garamond']">
              We're not just another agency. We're your partners in success.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white font-['Playfair_Display']">
                  Exclusive Focus
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-['Cormorant_Garamond']">
                  We exclusively represent female creators, understanding the unique challenges and opportunities in your space.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white font-['Playfair_Display']">
                  Proven Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-['Cormorant_Garamond']">
                  Our creators see an average 400% increase in earnings within 6 months of joining our program.
                </p>
              </CardContent>
            </Card>
            
            <Card className="backdrop-blur-xl bg-black/20 border border-white/10">
              <CardHeader>
                <Users className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle className="text-white font-['Playfair_Display']">
                  Personal Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 font-['Cormorant_Garamond']">
                  Every creator gets a dedicated account manager and personalized strategy tailored to their unique brand.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Application CTA */}
      <div id="apply" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6 font-['Playfair_Display']">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-300 mb-8 font-['Cormorant_Garamond']">
            Join the elite creators who trust TD Studios to manage and grow their business.
          </p>
          <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-xl border border-white/10 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-white mb-4 font-['Playfair_Display']">
              Application Requirements
            </h3>
            <ul className="text-left text-gray-300 space-y-2 max-w-2xl mx-auto mb-6">
              <li>• Minimum 5K followers across platforms</li>
              <li>• Consistent content creation history</li>
              <li>• Professional presentation and branding</li>
              <li>• Proven engagement rates and growth potential</li>
              <li>• 18+ years old with valid identification</li>
            </ul>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-12 py-4 text-lg"
              onClick={() => navigate('/creator-application')}
            >
              Start Your Application
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-black/40 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Crown className="h-8 w-8 text-yellow-400 mr-2" />
              <span className="text-2xl font-bold text-white font-['Playfair_Display']">
                TD Studios
              </span>
            </div>
            <p className="text-gray-400 mb-4">
              Premier Creator Management Agency - New York, NY
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}