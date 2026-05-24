import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Building2,
  Plus,
  Users,
  MapPin,
  Phone,
  Mail,
  Edit,
  Trash2,
  Eye,
  LogOut,
} from "lucide-react";

export default function SuperAdminDashboard() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();

  const stats = trpc.superAdmin.stats.useQuery();
  const nurseries = trpc.superAdmin.listNurseries.useQuery();

  const handleLogout = () => {
    logout();
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Building2 className="h-8 w-8 text-indigo-600" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">Super Admin Panel</h1>
              <p className="text-sm text-gray-500">Manage all nurseries</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Nurseries</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.data?.totalNurseries || 0}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-indigo-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Nurseries</p>
                  <p className="text-3xl font-bold text-green-600">
                    {stats.data?.activeNurseries || 0}
                  </p>
                </div>
                <Building2 className="h-10 w-10 text-green-500 opacity-80" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {stats.data?.totalUsers || 0}
                  </p>
                </div>
                <Users className="h-10 w-10 text-blue-500 opacity-80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Nurseries List */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">All Nurseries</h2>
          <Link href="/super-admin/create-nursery">
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              <Plus className="h-4 w-4 mr-2" />
              Create Nursery
            </Button>
          </Link>
        </div>

        {nurseries.isLoading ? (
          <div className="text-center py-12 text-gray-500">Loading nurseries...</div>
        ) : nurseries.data?.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No nurseries yet</h3>
              <p className="text-gray-500 mb-4">
                Create your first nursery to get started.
              </p>
              <Link href="/super-admin/create-nursery">
                <Button className="bg-indigo-600 hover:bg-indigo-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Nursery
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nurseries.data?.map((nursery) => (
              <Card key={nursery.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {nursery.logo ? (
                        <img
                          src={nursery.logo}
                          alt={nursery.name}
                          className="h-10 w-10 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                      <div>
                        <CardTitle className="text-base">{nursery.name}</CardTitle>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            nursery.status === "active"
                              ? "bg-green-100 text-green-700"
                              : nursery.status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {nursery.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span>{nursery.contactName}</span>
                    </div>
                    {nursery.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span>{nursery.contactEmail}</span>
                      </div>
                    )}
                    {nursery.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{nursery.contactPhone}</span>
                      </div>
                    )}
                    {nursery.address && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="truncate">{nursery.address}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mt-4 pt-3 border-t">
                    <Link href={`/super-admin/nursery/${nursery.id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/super-admin/edit-nursery/${nursery.id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
