import { trpc } from "@/lib/trpc";
import { Card } from "@/components/ui/card";
import { Users, Baby, Home, CreditCard, Calendar, Clock, TrendingUp, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  href: string;
}

export default function Dashboard() {
  const { data: stats, isLoading } = trpc.dashboard.stats.useQuery();

  const statCards: StatCard[] = [
    {
      label: "Total Children",
      value: stats?.totalChildren || 0,
      icon: <Baby size={28} />,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
      href: "/children",
    },
    {
      label: "Total Staff",
      value: stats?.totalStaff || 0,
      icon: <Users size={28} />,
      color: "text-rose-600",
      bgColor: "bg-rose-50",
      href: "/staff",
    },
    {
      label: "Total Rooms",
      value: stats?.totalRooms || 0,
      icon: <Home size={28} />,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      href: "/rooms",
    },
    {
      label: "Total Parents",
      value: stats?.totalParents || 0,
      icon: <Users size={28} />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      href: "/parents",
    },
    {
      label: "Pending Payments",
      value: stats?.pendingPayments || 0,
      icon: <CreditCard size={28} />,
      color: "text-red-600",
      bgColor: "bg-red-50",
      href: "/payments",
    },
    {
      label: "Activities This Week",
      value: stats?.activitiesThisWeek || 0,
      icon: <Calendar size={28} />,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      href: "/activities",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Enhanced Welcome Header with Gradient Background */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-sky-50 via-rose-50 to-emerald-50 border border-sky-100 p-8 md:p-12">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-sky-200/30 to-transparent rounded-full -mr-48 -mt-48 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-gradient-to-tr from-rose-200/30 to-transparent rounded-full -ml-36 -mb-36 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-gradient-to-br from-sky-500 to-sky-600 rounded-lg text-white">
              <Baby size={32} />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-foreground">Welcome to NurseCare</h1>
              <p className="text-lg text-muted-foreground mt-1">
                Manage your daycare operations efficiently with our comprehensive management system.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock size={18} className="text-sky-600" />
              <span>Operating Hours: 7:00 AM - 6:00 PM</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <TrendingUp size={18} className="text-emerald-600" />
              <span>System Status: <span className="text-emerald-600 font-semibold">All Systems Operational</span></span>
            </div>
          </div>
        </div>
      </div>

      {/* Statistics Grid with Enhanced Design */}
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-6">Quick Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <Link key={index} href={stat.href} className="block">
              <div className="group relative overflow-hidden rounded-xl border border-border bg-card hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer">
                {/* Gradient background overlay */}
                <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                {/* Content */}
                <div className="relative p-6 z-10">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                    <div className={`p-2.5 rounded-lg ${stat.bgColor}`}>
                      <div className={stat.color}>{stat.icon}</div>
                    </div>
                  </div>
                  {isLoading ? (
                    <Skeleton className="h-10 w-20" />
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <p className="text-4xl font-bold text-foreground">{stat.value}</p>
                      <span className="text-xs text-muted-foreground">total</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Quick Actions and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="/children/new"
              className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-sky-300 hover:bg-sky-50 transition-all duration-300"
            >
              <div className="p-3 bg-sky-100 rounded-lg group-hover:bg-sky-200 transition-colors">
                <Baby size={24} className="text-sky-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Add New Child</p>
                <p className="text-sm text-muted-foreground">Register a new child</p>
              </div>
            </a>

            <a
              href="/staff/new"
              className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-rose-300 hover:bg-rose-50 transition-all duration-300"
            >
              <div className="p-3 bg-rose-100 rounded-lg group-hover:bg-rose-200 transition-colors">
                <Users size={24} className="text-rose-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Add Staff Member</p>
                <p className="text-sm text-muted-foreground">Hire new staff</p>
              </div>
            </a>

            <a
              href="/activities/new"
              className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-300"
            >
              <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors">
                <Calendar size={24} className="text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Schedule Activity</p>
                <p className="text-sm text-muted-foreground">Plan new activity</p>
              </div>
            </a>

            <a
              href="/checkin"
              className="group flex items-center gap-4 p-4 rounded-lg border border-border hover:border-emerald-300 hover:bg-emerald-50 transition-all duration-300"
            >
              <div className="p-3 bg-emerald-100 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Clock size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Check-in/Out</p>
                <p className="text-sm text-muted-foreground">Manage attendance</p>
              </div>
            </a>
          </div>
        </div>

        {/* System Status */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-900">Database</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Connected</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-900">Authentication</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Active</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-900">Email Service</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Configured</span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-600 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-emerald-900">Payment Processing</span>
              </div>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-1 rounded">Ready</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts Section */}
      {stats?.pendingPayments && stats.pendingPayments > 0 && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertCircle size={24} className="text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-900">Pending Payments</h3>
              <p className="text-sm text-amber-800 mt-1">
                You have <span className="font-bold">{stats.pendingPayments}</span> pending payment(s) awaiting collection.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
