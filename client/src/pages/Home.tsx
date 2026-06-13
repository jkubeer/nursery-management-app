import { useLocation } from "wouter";
import { useEffect, useState } from "react";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [userType, setUserType] = useState<"staff" | "parent">("parent");
  
  const loginMutation = trpc.auth.login.useMutation();
  const registerMutation = trpc.auth.register.useMutation();
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
      
      if (isRegister) {
        if (!name || !confirmPassword) {
          setError("Please fill in all fields");
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords do not match");
          setIsLoading(false);
          return;
        }
        await registerMutation.mutateAsync({
          email,
          name,
          password,
          confirmPassword,
          userType,
        });
      } else {
        await loginMutation.mutateAsync({
          email,
          password,
        });
      }
      
      // Invalidate auth cache to refetch user info
      await utils.auth.me.invalidate();
      
      // Wait a moment for session to be established
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Redirect based on userType
      const meData = await utils.auth.me.fetch();
      if (meData?.role === "super_admin") {
        setLocation("/super-admin");
      } else if (meData?.userType === "parent") {
        setLocation("/parent-dashboard");
      } else if (meData?.userType === "staff") {
        setLocation("/dashboard");
      } else {
        setLocation("/dashboard");
      }
      
      // Reset form
      setEmail("");
      setPassword("");
      setName("");
      setConfirmPassword("");
      setIsRegister(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : (isRegister ? "Registration failed. Please try again." : "Login failed. Please try again.");
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Redirect authenticated users based on userType
  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === "super_admin") {
        setLocation("/super-admin");
      } else if (user.userType === "parent") {
        setLocation("/parent-dashboard");
      } else if (user.userType === "staff") {
        setLocation("/dashboard");
      } else {
        setLocation("/dashboard");
      }
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img src="/logo.png" alt="NurseCare" className="w-14 h-14 object-contain" />
          <span className="font-bold text-2xl text-foreground">NurseCare</span>
        </div>

        {/* Card */}
        <div className="bg-card rounded-2xl border border-border p-8 shadow-lg">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-foreground">{isRegister ? "Create Account" : "Welcome Back"}</h1>
            <p className="text-muted-foreground">{isRegister ? "Register as Staff or Parent" : "Sign in to your account to continue"}</p>
          </div>
          
          {/* User Type Selection for Registration */}
          {isRegister && (
            <div className="mb-6 p-4 bg-muted rounded-lg">
              <label className="text-sm font-medium text-foreground mb-3 block">Account Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="parent"
                    checked={userType === "parent"}
                    onChange={(e) => setUserType(e.target.value as "parent" | "staff")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Parent</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="userType"
                    value="staff"
                    checked={userType === "staff"}
                    onChange={(e) => setUserType(e.target.value as "parent" | "staff")}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Staff</span>
                </label>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-2">
              <AlertCircle size={18} className="text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Name Field for Registration */}
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                disabled={isLoading}
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            {/* Confirm Password Field for Registration */}
            {isRegister && (
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-primary-foreground font-medium py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 size={18} className="animate-spin" />}
              {isRegister ? "Create Account" : "Sign In"}
            </button>
            
            {/* Toggle Register/Login */}
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setError("");
                setEmail("");
                setPassword("");
                setName("");
                setConfirmPassword("");
              }}
              className="w-full text-sm text-primary hover:underline mt-4"
            >
              {isRegister ? "Already have an account? Sign In" : "Don't have an account? Register"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
