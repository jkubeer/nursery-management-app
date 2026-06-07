import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SuperAdminNav from "@/components/SuperAdminNav";
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
    <div className="flex h-screen bg-gray-50">
      <SuperAdminNav />
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="h-8 w-8 text-indigo-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Manage all nurseries</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto px-6 py-8">
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
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">All Nurseries</h2>
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
                  <p className="text-gray-500">No nurseries yet. Create your first nursery to get started.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {nurseries.data?.map((nursery: any) => (
                  <Card key={nursery.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <Building2 className="h-8 w-8 text-indigo-600" />
                          <div>
                            <h3 className="font-semibold text-gray-900">{nursery.name}</h3>
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
                              active
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4 text-sm">
                        {nursery.contactName && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Users className="h-4 w-4" />
                            {nursery.contactName}
                          </div>
                        )}
                        {nursery.contactEmail && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="h-4 w-4" />
                            {nursery.contactEmail}
                          </div>
                        )}
                        {nursery.contactPhone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Phone className="h-4 w-4" />
                            {nursery.contactPhone}
                          </div>
                        )}
                        {nursery.address && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="h-4 w-4" />
                            {nursery.address}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Link href={`/super-admin/nursery/${nursery.id}`}>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </Link>
                        <Link href={`/super-admin/edit-nursery/${nursery.id}`}>
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
