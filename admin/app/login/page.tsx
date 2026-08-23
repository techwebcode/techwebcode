"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Eye, EyeOff, Lock, User, AlertCircle, CheckCircle2 } from "lucide-react";
import { loginAdmin, isAuthenticated, getExpectedAdminCredentials } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [expectedCreds, setExpectedCreds] = useState<{ username: string; password: string } | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/dashboard");
      return;
    }
    setExpectedCreds(getExpectedAdminCredentials());
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    setTimeout(() => {
      const result = loginAdmin(username, password);
      if (result.success) {
        router.push("/dashboard");
      } else {
        setError(result.message);
        setLoading(false);
      }
    }, 400);
  };

  const handleQuickFill = () => {
    if (expectedCreds) {
      setUsername(expectedCreds.username);
      setPassword(expectedCreds.password);
      setError(null);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4 font-sans text-slate-100">
      <div className="w-full max-w-md space-y-6">
        {/* Branding Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-500 shadow-lg shadow-blue-500/10">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            <span className="text-blue-500">Tech</span>WebCode
          </h1>
          <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">
            Admin Control Center
          </p>
        </div>

        {/* Login Card */}
        <Card className="border-slate-800 bg-slate-900/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl text-white">Sign In</CardTitle>
            <CardDescription className="text-slate-400 text-xs">
              Enter your admin credentials configured in <code className="text-blue-400 font-mono">.env</code>.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/20 p-3 text-xs font-semibold text-rose-400">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Username */}
              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-xs text-slate-300 font-semibold">
                  Admin Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    required
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-9 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 text-sm h-10"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs text-slate-300 font-semibold">
                    Admin Password
                  </Label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9 pr-10 bg-slate-950 border-slate-800 text-white placeholder:text-slate-600 focus-visible:ring-blue-500 text-sm h-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold h-10 rounded-xl transition-all shadow-md shadow-blue-600/20 mt-2"
              >
                {loading ? "Authenticating..." : "Sign In to Dashboard"}
              </Button>
            </form>

            {/* Configured .env credentials quick notice */}
            {expectedCreds && (
              <div className="mt-6 border-t border-slate-800 pt-4 text-center">
                <div className="inline-flex items-center justify-between w-full p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs">
                  <div className="text-left font-mono text-[11px] text-slate-400">
                    <div>User: <span className="text-blue-400 font-semibold">{expectedCreds.username}</span></div>
                    <div>Pass: <span className="text-blue-400 font-semibold">{expectedCreds.password}</span></div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleQuickFill}
                    className="h-7 text-[10px] font-bold border-slate-700 hover:bg-slate-800 text-slate-200"
                  >
                    Auto-Fill
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Security Footer Note */}
        <p className="text-center text-[11px] text-slate-500">
          Protected by TechWebCode Admin Auth &amp; Session Middleware
        </p>
      </div>
    </div>
  );
}
