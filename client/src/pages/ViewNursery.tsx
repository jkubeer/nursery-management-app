import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Phone,
  Mail,
  Users,
  Edit,
  Loader2,
  Globe,
  Clock,
} from "lucide-react";

export default function ViewNursery() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const nurseryId = parseInt(params.id || "0", 10);

  const nursery = trpc.superAdmin.getNursery.useQuery(
    { id: nurseryId },
    { enabled: nurseryId > 0 }
  );

  if (nursery.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-gray-600 font-medium">Loading nursery...</p>
        </div>
      </div>
    );
  }

  if (nursery.error || !nursery.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Nursery Not Found</h2>
          <p className="text-gray-500 mb-4">The nursery you're looking for doesn't exist.</p>
          <Button onClick={() => setLocation("/super-admin")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const data = nursery.data;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setLocation("/super-admin")}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              {data.logo ? (
                <img src={data.logo} alt={data.name} className="h-10 w-10 rounded-lg object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-indigo-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-indigo-600" />
                </div>
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">{data.name}</h1>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    data.status === "active"
                      ? "bg-green-100 text-green-700"
                      : data.status === "suspended"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {data.status}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation(`/super-admin/edit-nursery/${nurseryId}`)}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="font-medium text-gray-900">{data.contactName || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{data.contactEmail || "—"}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{data.contactPhone || "—"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operating Hours</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{(data as any).operatingHours || "—"}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-indigo-600" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{data.address || "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">City</p>
                  <p className="font-medium text-gray-900">{data.city || "—"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Country</p>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-gray-400" />
                    <p className="font-medium text-gray-900">{data.country || "—"}</p>
                  </div>
                </div>
                {(data.latitude || data.longitude) && (
                  <div>
                    <p className="text-sm text-gray-500">Coordinates</p>
                    <p className="font-medium text-gray-900">
                      {data.latitude}, {data.longitude}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metadata */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-indigo-600" />
              System Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500">Nursery ID</p>
                <p className="font-medium text-gray-900">{data.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Created At</p>
                <p className="font-medium text-gray-900">
                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }) : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
