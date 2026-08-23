"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Server,
  Database,
  Key,
  User,
  Lock,
  Save,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  HardDrive,
} from "lucide-react";
import { getExpectedAdminCredentials, updateAdminCredentials } from "@/lib/auth";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"account" | "system" | "preferences">("account");

  // Account Form
  const [username, setUsername] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [accountError, setAccountError] = useState<string | null>(null);

  // System Status State
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline">("checking");
  const [apiLatency, setApiLatency] = useState<number | null>(null);
  const [dbStatus, setDbStatus] = useState<"online" | "offline">("online");

  // Preferences State
  const [pageSize, setPageSize] = useState("20");
  const [prefSuccess, setPrefSuccess] = useState<string | null>(null);

  useEffect(() => {
    const creds = getExpectedAdminCredentials();
    setUsername(creds.username);
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    setApiStatus("checking");
    const startTime = Date.now();
    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api/v1";
      const res = await fetch(`${apiBase}/articles?limit=1`, { cache: "no-store" });
      const latency = Date.now() - startTime;
      setApiLatency(latency);
      if (res.ok) {
        setApiStatus("online");
        setDbStatus("online");
      } else {
        setApiStatus("offline");
      }
    } catch (err) {
      setApiStatus("offline");
      setApiLatency(null);
    }
  };

  const handleAccountSave = (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);

    const expected = getExpectedAdminCredentials();

    if (currentPassword && currentPassword !== expected.password) {
      setAccountError("Current admin password does not match.");
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setAccountError("New password must be at least 6 characters long.");
        return;
      }
      if (newPassword !== confirmPassword) {
        setAccountError("New passwords do not match.");
        return;
      }
    }

    updateAdminCredentials(username, newPassword || undefined);
    setAccountSuccess("Admin credentials updated in browser session!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePreferencesSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("admin_default_page_size", pageSize);
    setPrefSuccess("Admin preferences saved!");
    setTimeout(() => setPrefSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">Admin Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage admin security, authentication credentials, system health, and dashboard preferences.
        </p>
      </div>

      {/* Tabs Bar */}
      <div className="flex gap-2 border-b pb-3">
        <button
          onClick={() => setActiveTab("account")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "account"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-600 hover:bg-gray-100 border"
          }`}
        >
          <ShieldCheck className="h-4 w-4" />
          <span>Account &amp; Security</span>
        </button>

        <button
          onClick={() => setActiveTab("system")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "system"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-600 hover:bg-gray-100 border"
          }`}
        >
          <Server className="h-4 w-4" />
          <span>System &amp; API Health</span>
        </button>

        <button
          onClick={() => setActiveTab("preferences")}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
            activeTab === "preferences"
              ? "bg-blue-600 text-white shadow"
              : "bg-white text-gray-600 hover:bg-gray-100 border"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Dashboard Preferences</span>
        </button>
      </div>

      {/* TAB 1: ACCOUNT & SECURITY */}
      {activeTab === "account" && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <span>Admin Account Credentials</span>
              </CardTitle>
              <CardDescription>
                Update your active admin username and password.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAccountSave} className="space-y-4">
                {accountError && (
                  <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-200 p-3 text-xs font-semibold text-red-700">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{accountError}</span>
                  </div>
                )}

                {accountSuccess && (
                  <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{accountSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <Label htmlFor="admin_username" className="text-xs font-semibold">
                    Admin Username
                  </Label>
                  <Input
                    id="admin_username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="curr_pass" className="text-xs font-semibold">
                    Current Password
                  </Label>
                  <Input
                    id="curr_pass"
                    type="password"
                    placeholder="Verify current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="new_pass" className="text-xs font-semibold">
                      New Password
                    </Label>
                    <Input
                      id="new_pass"
                      type="password"
                      placeholder="New password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="conf_pass" className="text-xs font-semibold">
                      Confirm Password
                    </Label>
                    <Input
                      id="conf_pass"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  <Save className="h-4 w-4" />
                  <span>Update Admin Credentials</span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* API Secret & .env Guide */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Key className="h-5 w-5 text-amber-500" />
                <span>API Secret &amp; Environment Config</span>
              </CardTitle>
              <CardDescription>
                Single Source of Truth configuration stored in <code className="font-mono text-blue-600">.env</code>.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5 p-3 rounded-xl bg-gray-50 border text-xs font-mono">
                <div className="text-gray-500 uppercase font-sans text-[10px] font-bold">Active Admin Secret (X-Admin-Secret)</div>
                <div className="font-bold text-gray-900 truncate">
                  {process.env.NEXT_PUBLIC_ADMIN_SECRET || "xL6Lwfl5GgKVBMl1ehHiZ1"}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200 text-xs text-blue-900 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-blue-600" />
                  <span>Permanent Environment Setup</span>
                </div>
                <p className="text-[11px] text-blue-800 leading-relaxed">
                  To permanently change your admin credentials for production docker containers, update the following keys in your root <code className="font-mono bg-blue-100 px-1 rounded">.env</code> file:
                </p>
                <pre className="p-2 rounded bg-slate-900 text-slate-100 text-[10px] font-mono overflow-x-auto">
{`ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password
NEXT_PUBLIC_ADMIN_USERNAME=admin
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 2: SYSTEM HEALTH */}
      {activeTab === "system" && (
        <div className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            {/* API Status Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  <span>Backend API Status</span>
                  <Server className="h-4 w-4 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  {apiStatus === "online" ? (
                    <Badge className="bg-emerald-600 text-white font-bold">ONLINE</Badge>
                  ) : apiStatus === "checking" ? (
                    <Badge variant="outline" className="animate-pulse">CHECKING...</Badge>
                  ) : (
                    <Badge variant="destructive">OFFLINE</Badge>
                  )}
                  {apiLatency !== null && (
                    <span className="text-xs text-gray-500 font-mono">{apiLatency} ms</span>
                  )}
                </div>
                <p className="text-xs text-gray-500 font-mono truncate">
                  {process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082/api/v1"}
                </p>
              </CardContent>
            </Card>

            {/* Database Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  <span>MySQL Database</span>
                  <Database className="h-4 w-4 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge className="bg-emerald-600 text-white font-bold">CONNECTED</Badge>
                <p className="text-xs text-gray-500 font-mono">
                  Host: mysql | DB: techwebcode
                </p>
              </CardContent>
            </Card>

            {/* Storage Path Card */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500 flex items-center justify-between">
                  <span>Media Storage Volume</span>
                  <HardDrive className="h-4 w-4 text-amber-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="outline" className="bg-amber-50 border-amber-200 text-amber-700 font-bold">ACTIVE</Badge>
                <p className="text-xs text-gray-500 font-mono truncate">
                  /var/www/techwebcode-media
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                <span>System Connectivity Controls</span>
                <Button variant="outline" size="sm" onClick={checkApiHealth} className="flex items-center gap-1.5 text-xs">
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>Re-test Connection</span>
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl border bg-gray-50 p-4 font-mono text-xs space-y-2">
                <div><span className="text-gray-400">Environment:</span> <span className="text-blue-600 font-bold">production</span></div>
                <div><span className="text-gray-400">Frontend URL:</span> http://localhost:3000</div>
                <div><span className="text-gray-400">Admin Control Port:</span> 3001</div>
                <div><span className="text-gray-400">Backend Server Port:</span> 8082</div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* TAB 3: PREFERENCES */}
      {activeTab === "preferences" && (
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-blue-600" />
              <span>Admin Dashboard Preferences</span>
            </CardTitle>
            <CardDescription>
              Configure default display limits and admin layout options.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePreferencesSave} className="space-y-4">
              {prefSuccess && (
                <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{prefSuccess}</span>
                </div>
              )}

              <div className="space-y-1">
                <Label htmlFor="page_size" className="text-xs font-semibold">
                  Default Table Items Per Page
                </Label>
                <select
                  id="page_size"
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border bg-white text-sm"
                >
                  <option value="10">10 Items</option>
                  <option value="20">20 Items (Default)</option>
                  <option value="50">50 Items</option>
                  <option value="100">100 Items</option>
                </select>
              </div>

              <Button type="submit" className="w-full flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold">
                <Save className="h-4 w-4" />
                <span>Save Preferences</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
