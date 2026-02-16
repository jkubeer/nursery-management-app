import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Users, Baby, Home, CreditCard, Calendar, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const statCards: StatCard[] = [
    {
      label: "Total Children",
      value: stats?.totalChildren || 0,
      icon: <Baby size={24} />,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Staff",
      value: stats?.totalStaff || 0,
      icon: <Users size={24} />,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Total Rooms",
      value: stats?.totalRooms || 0,
      icon: <Home size={24} />,
      color: "from-green-500 to-green-600",
    },
    {
      label: "Total Parents",
      value: stats?.totalParents || 0,
      icon: <Users size={24} />,
      color: "from-orange-500 to-orange-600",
    },
    {
      label: "Pending Payments",
      value: stats?.pendingPayments || 0,
      icon: <CreditCard size={24} />,
      color: "from-red-500 to-red-600",
    },
    {
      label: "Activities This Week",
      value: stats?.activitiesThisWeek || 0,
      icon: <Calendar size={24} />,
      color: "from-indigo-500 to-indigo-600",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Welcome to NurseCare</h1>
        <p className="text-lg text-muted-foreground">
          Manage your daycare operations efficiently with our comprehensive management system.
        </p>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="card-elegant">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground mb-2">{stat.label}</p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                )}
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <a
              href="/children/new"
              className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium"
            >
              + Add New Child
            </a>
            <a
              href="/staff/new"
              className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium"
            >
              + Add New Staff Member
            </a>
            <a
              href="/activities/new"
              className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium"
            >
              + Schedule Activity
            </a>
            <a
              href="/payments"
              className="block p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors text-foreground font-medium"
            >
              View Pending Payments
            </a>
          </div>
        </div>

        <div className="card-elegant">
          <h2 className="text-xl font-bold text-foreground mb-4">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Database</span>
              <span className="badge-primary">Connected</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Authentication</span>
              <span className="badge-primary">Active</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Email Service</span>
              <span className="badge-primary">Configured</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-foreground font-medium">Payment Processing</span>
              <span className="badge-primary">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card-elegant">
        <h2 className="text-xl font-bold text-foreground mb-4">Getting Started</h2>
        <div className="space-y-3 text-foreground">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              1
            </div>
            <div>
              <p className="font-medium">Set up your facility information</p>
              <p className="text-sm text-muted-foreground">Configure rooms and facilities</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              2
            </div>
            <div>
              <p className="font-medium">Add staff members</p>
              <p className="text-sm text-muted-foreground">Create profiles and assign roles</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              3
            </div>
            <div>
              <p className="font-medium">Register children and parents</p>
              <p className="text-sm text-muted-foreground">Set up family profiles and relationships</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0 text-sm font-bold">
              4
            </div>
            <div>
              <p className="font-medium">Configure payment settings</p>
              <p className="text-sm text-muted-foreground">Set up fees and payment methods</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
