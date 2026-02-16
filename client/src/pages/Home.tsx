import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Loader2, ArrowRight, Shield, Users, BarChart3, Zap } from "lucide-react";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();

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
          <Button asChild>
            <a href={getLoginUrl()}>Sign In</a>
          </Button>
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
                <a href={getLoginUrl()}>
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
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Staff Management</p>
                    <p className="text-sm text-muted-foreground">Schedules & profiles</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <BarChart3 className="text-secondary" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Analytics & Reports</p>
                    <p className="text-sm text-muted-foreground">Insights at a glance</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                    <Zap className="text-accent" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Automated Workflows</p>
                    <p className="text-sm text-muted-foreground">Notifications & billing</p>
                  </div>
                </div>
              </div>
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
            <a href={getLoginUrl()}>
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
