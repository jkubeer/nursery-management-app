import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function ForgotPassword() {
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const requestReset = trpc.auth.requestPasswordReset.useMutation({
    onSuccess: (data) => {
      setSubmitted(true);
      setError("");
      if (data.token) {
        setResetToken(data.token);
      }
    },
    onError: (err) => {
      setError(err.message || "Failed to request password reset");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    requestReset.mutate({ email });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex justify-center mb-6">
              <CheckCircle2 className="w-16 h-16 text-green-500" />
            </div>

            <h1 className="text-2xl font-bold text-center mb-2">Check Your Email</h1>
            <p className="text-gray-600 text-center mb-6">
              We've sent a password reset link to <strong>{email}</strong>. Please check your email and click the link to reset your password.
            </p>

            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                The reset link will expire in 1 hour. If you don't receive the email, check your spam folder.
              </AlertDescription>
            </Alert>

            {resetToken && (
              <div className="mb-6 p-4 bg-gray-100 rounded text-sm break-all">
                <p className="text-gray-600 mb-2">Reset Token (for testing):</p>
                <code className="text-xs text-gray-700">{resetToken}</code>
              </div>
            )}

            <Button
              onClick={() => setLocation("/login")}
              variant="outline"
              className="w-full"
            >
              Back to Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <button
            onClick={() => setLocation("/login")}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </button>

          <h1 className="text-3xl font-bold mb-2">Forgot Password?</h1>
          <p className="text-gray-600 mb-6">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={requestReset.isPending}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={requestReset.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {requestReset.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {requestReset.isPending ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Remember your password?{" "}
              <button
                onClick={() => setLocation("/login")}
                className="text-blue-600 hover:text-blue-700 font-medium"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
