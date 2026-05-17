import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, ArrowRight, Shield, Users, BarChart3, Zap, Eye, EyeOff } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const loginMutation = trpc.auth.login.useMutation();
  const utils = trpc.useUtils();
  
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    
    try {
      if (!email || !password) {
        setError("Please fill in all fields");
        setIsLoading(false);
        return;
      }
      
      await loginMutation.mutateAsync({
        email,
        password,
      });
      
      // Invalidate auth cache to refetch user info
      await utils.auth.me.invalidate();
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect to dashboard
      setLocation("/dashboard");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed. Please try again.";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      setLocation("/dashboard");
    }
  }, [isAuthenticated, user, setLocation]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
              NC
            </div>
            <span className="font-bold text-lg text-foreground">NurseCare</span>
          </div>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline">
              <a href="/login">Sign In</a>
            </Button>
            <Button asChild>
              <a href="/register">Sign Up</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl font-bold text-foreground leading-tight">
                Elegant Daycare Management
              </h1>
              <p className="text-xl text-muted-foreground">
                Streamline your nursery operations with our comprehensive, elegant management system. From staff scheduling to parent communication, we've got you covered.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="text-base">
                <a href="/register">
                  Get Started <ArrowRight size={20} />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-base">
                <a href="#features">Learn More</a>
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Shield size={16} />
              <span>Enterprise-grade security with role-based access control</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
            <div className="relative bg-card rounded-2xl border border-border p-8 shadow-xl">
              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">Sign In</h3>
                  <p className="text-sm text-muted-foreground">Login to your account</p>
                </div>
                
                {error && (
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                    <p className="text-sm text-destructive">{error}</p>
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-foreground">Password</label>
                    <button
                      type="button"
                      onClick={() => setLocation("/forgot-password")}
                      className="text-sm text-primary hover:text-primary/80 font-medium"
                    >
                      Forgot?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
                
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-card text-muted-foreground">Or</span>
                  </div>
                </div>
                
                <Button 
                  type="button"
                  variant="outline" 
                  className="w-full"
                  onClick={() => setLocation("/register")}
                >
                  Create Account
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-card border-t border-border py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Comprehensive Features
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage your daycare efficiently and elegantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Staff Management",
                description: "Manage staff profiles, roles, schedules, and qualifications",
                icon: "👥",
              },
              {
                title: "Children Registry",
                description: "Complete child profiles with medical info and emergency contacts",
                icon: "👶",
              },
              {
                title: "Parent Portal",
                description: "Secure parent access to child information and daily reports",
                icon: "👨‍👩‍👧",
              },
              {
                title: "Activity Management",
                description: "Schedule activities, track attendance, and share photos",
                icon: "🎨",
              },
              {
                title: "Payment Processing",
                description: "Stripe integration for tuition and automated recurring billing",
                icon: "💳",
              },
              {
                title: "Check-in/Check-out",
                description: "Real-time attendance tracking for daily operations",
                icon: "⏰",
              },
              {
                title: "Photo Gallery",
                description: "Secure storage with parent access controls",
                icon: "📸",
              },
              {
                title: "Email Notifications",
                description: "Automated alerts for reports, events, and payments",
                icon: "📧",
              },
              {
                title: "Analytics Dashboard",
                description: "Comprehensive insights into daycare operations",
                icon: "📊",
              },
            ].map((feature, index) => (
              <div key={index} className="card-elegant">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-12 md:p-16 text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground">
              Ready to Transform Your Daycare?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join daycare centers using NurseCare to streamline operations and improve parent communication.
            </p>
          </div>

          <Button size="lg" asChild className="text-base">
            <a href="/register">
              Get Started Now <ArrowRight size={20} />
            </a>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold">
                NC
              </div>
              <span className="font-bold text-foreground">NurseCare</span>
            </div>
            <p className="text-muted-foreground text-sm">
              © 2026 NurseCare. All rights reserved. Elegant daycare management.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
