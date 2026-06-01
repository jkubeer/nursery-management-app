import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Settings as SettingsIcon, Bell, Lock, User, Database, Mail } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Settings() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "security" | "account" | "email">("general");
  const [formData, setFormData] = useState({
    nurseryName: "NurseCare Daycare",
    email: user?.email || "",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, City, State 12345",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences updated");
  };

  const handleChangePassword = () => {
    toast.success("Password change email sent to your inbox");
  };

  const handleSaveAccount = () => {
    toast.success("Account settings updated");
  };

  const tabs = [
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Lock },
    { id: "account", label: "Account", icon: User },
    { id: "email", label: "Email", icon: Mail },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-border">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* General Settings */}
      {activeTab === "general" && (
        <Card className="p-6 card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-6">General Settings</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="nurseryName" className="text-foreground font-medium">
                Nursery Name
              </Label>
              <Input
                id="nurseryName"
                name="nurseryName"
                value={formData.nurseryName}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="phone" className="text-foreground font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-foreground font-medium">
                Address
              </Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="mt-2"
              />
            </div>

            <Button onClick={handleSaveGeneral} className="w-full">
              Save Changes
            </Button>
          </div>
        </Card>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <Card className="p-6 card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-6">Notification Preferences</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Daily Reports</p>
                <p className="text-sm text-muted-foreground">Receive daily activity reports</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Payment Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified about pending payments</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Attendance Alerts</p>
                <p className="text-sm text-muted-foreground">Alerts for check-in/check-out events</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
              <div>
                <p className="font-medium text-foreground">Emergency Notifications</p>
                <p className="text-sm text-muted-foreground">Critical system alerts</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>

            <Button onClick={handleSaveNotifications} className="w-full">
              Save Preferences
            </Button>
          </div>
        </Card>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <Card className="p-6 card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-6">Security Settings</h2>
          <div className="space-y-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Your account is protected with OAuth authentication via Manus.
              </p>
            </div>

            <div>
              <h3 className="font-medium text-foreground mb-3">Change Password</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We'll send you a password reset link to your email address.
              </p>
              <Button onClick={handleChangePassword} variant="outline" className="w-full">
                Send Password Reset Email
              </Button>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-medium text-foreground mb-3">Active Sessions</h3>
              <div className="p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Current Session</p>
                    <p className="text-sm text-muted-foreground">Last active: Just now</p>
                  </div>
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-100 text-xs font-medium rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Account Settings */}
      {activeTab === "account" && (
        <Card className="p-6 card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-6">Account Information</h2>
          <div className="space-y-6">
            <div>
              <Label className="text-foreground font-medium">Name</Label>
              <p className="mt-2 text-foreground">{user?.name || "Not set"}</p>
            </div>

            <div>
              <Label className="text-foreground font-medium">Email</Label>
              <p className="mt-2 text-foreground">{user?.email || "Not set"}</p>
            </div>

            <div>
              <Label className="text-foreground font-medium">Role</Label>
              <p className="mt-2 text-foreground capitalize">{user?.role || "Not set"}</p>
            </div>

            <div>
              <Label className="text-foreground font-medium">Account Created</Label>
              <p className="mt-2 text-foreground">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Not set"}
              </p>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-medium text-foreground mb-4">Danger Zone</h3>
              <Button variant="destructive" className="w-full">
                Delete Account
              </Button>
            </div>

            <Button onClick={handleSaveAccount} className="w-full">
              Save Account Settings
            </Button>
          </div>
        </Card>
      )}

      {/* Email Settings */}
      {activeTab === "email" && (
        <Card className="p-6 card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-6">Email Configuration</h2>
          <div className="space-y-6">
            <div>
              <Label htmlFor="smtpHost" className="text-foreground font-medium">SMTP Host</Label>
              <Input
                id="smtpHost"
                type="text"
                placeholder="smtp.gmail.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPort" className="text-foreground font-medium">SMTP Port</Label>
              <Input
                id="smtpPort"
                type="number"
                placeholder="587"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpUser" className="text-foreground font-medium">SMTP Username</Label>
              <Input
                id="smtpUser"
                type="text"
                placeholder="your-email@gmail.com"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="smtpPassword" className="text-foreground font-medium">SMTP Password</Label>
              <Input
                id="smtpPassword"
                type="password"
                placeholder="••••••••"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="fromEmail" className="text-foreground font-medium">From Email Address</Label>
              <Input
                id="fromEmail"
                type="email"
                placeholder="noreply@nursery.com"
                className="mt-2"
              />
            </div>

            <div className="border-t border-border pt-6">
              <Button onClick={handleSaveNotifications} className="w-full">
                Save Email Settings
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
