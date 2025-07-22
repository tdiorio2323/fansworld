import { ArrowRight, Sparkles, Users, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: Users,
      title: "Connect with Creators",
      description: "Discover amazing content creators and support their work directly."
    },
    {
      icon: Shield,
      title: "Secure Platform",
      description: "Your privacy and security are our top priorities with end-to-end protection."
    },
    {
      icon: Zap,
      title: "Premium Content",
      description: "Access exclusive content and get closer to your favorite creators."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/80 to-background">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 space-y-8">
          <div className="flex items-center justify-center mb-8">
            <Sparkles className="h-12 w-12 text-primary mr-4" />
            <h1 className="text-6xl font-luxury font-bold text-gradient">Cabana</h1>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Where Creators and Fans Connect
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the premium platform where content creators share exclusive content and build meaningful connections with their community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                <Button asChild size="lg" className="h-14 px-8 text-lg">
                  <Link to="/home">
                    Enter Cabana
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <>
                  <Button asChild size="lg" className="h-14 px-8 text-lg">
                    <Link to="/home">
                      Enter Cabana
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="h-14 px-8 text-lg">
                    <Link to="/search">
                      Explore Creators
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="glass-morphism border-border/60 hover:border-primary/20 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-xl w-fit">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-6">
          <h3 className="text-3xl font-bold text-foreground">Ready to get started?</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Join thousands of creators and fans who are already part of the Cabana community.
          </p>
          <Button asChild size="lg" className="h-12 px-8">
            <Link to="/home">
              Join Cabana Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default Index;
