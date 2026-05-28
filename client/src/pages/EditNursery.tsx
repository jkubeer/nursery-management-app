import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { useLocation, useParams } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Building2, MapPin, Save, Loader2, Shield, Mail } from "lucide-react";
import { toast } from "sonner";

export default function EditNursery() {
  const [, setLocation] = useLocation();
  const params = useParams<{ id: string }>();
  const nurseryId = parseInt(params.id || "0", 10);
  const utils = trpc.useUtils();

  const nursery = trpc.superAdmin.getNursery.useQuery(
    { id: nurseryId },
    { enabled: nurseryId > 0 }
  );

  const [formData, setFormData] = useState({
    name: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    logo: "",
    address: "",
    city: "",
    country: "",
    latitude: "",
    longitude: "",
    status: "active" as "active" | "inactive" | "suspended",
  });

  // Populate form when data loads
  useEffect(() => {
    if (nursery.data) {
      setFormData({
        name: nursery.data.name || "",
        contactName: nursery.data.contactName || "",
        contactEmail: nursery.data.contactEmail || "",
        contactPhone: nursery.data.contactPhone || "",
        logo: nursery.data.logo || "",
        address: nursery.data.address || "",
        city: nursery.data.city || "",
        country: nursery.data.country || "",
        latitude: nursery.data.latitude ? String(nursery.data.latitude) : "",
        longitude: nursery.data.longitude ? String(nursery.data.longitude) : "",
        status: nursery.data.status || "active",
      });
    }
  }, [nursery.data]);

  const updateNursery = trpc.superAdmin.updateNursery.useMutation({
    onSuccess: () => {
      toast.success("Nursery updated successfully");
      utils.superAdmin.listNurseries.invalidate();
      utils.superAdmin.getNursery.invalidate({ id: nurseryId });
      setLocation("/super-admin");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNursery.mutate({
      id: nurseryId,
      ...formData,
    });
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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

  if (nursery.error) {
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => setLocation("/super-admin")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Nursery</h1>
            <p className="text-sm text-gray-500">Update nursery details</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nursery Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-indigo-600" />
                Nursery Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nursery Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    placeholder="Enter nursery name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="contactName">Contact Name *</Label>
                  <Input
                    id="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleChange("contactName", e.target.value)}
                    placeholder="Primary contact person"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => handleChange("contactEmail", e.target.value)}
                    placeholder="contact@nursery.com"
                  />
                </div>
                <div>
                  <Label htmlFor="contactPhone">Contact Phone</Label>
                  <Input
                    id="contactPhone"
                    value={formData.contactPhone}
                    onChange={(e) => handleChange("contactPhone", e.target.value)}
                    placeholder="+965 1234 5678"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="logo">Logo URL</Label>
                  <Input
                    id="logo"
                    value={formData.logo}
                    onChange={(e) => handleChange("logo", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Information */}
          {(nursery.data as any)?.admin && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-indigo-600" />
                  Nursery Administrator
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Admin Name</p>
                      <p className="font-medium text-gray-900">{(nursery.data as any).admin.name || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Admin Email</p>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="font-medium text-gray-900">{(nursery.data as any).admin.email || "—"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <p className="font-medium text-gray-900 capitalize">{(nursery.data as any).admin.role || "—"}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Created At</p>
                      <p className="font-medium text-gray-900">
                        {(nursery.data as any).admin.createdAt ? new Date((nursery.data as any).admin.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        }) : "—"}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Location
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Full street address"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div>
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={formData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="latitude">Latitude</Label>
                  <Input
                    id="latitude"
                    value={formData.latitude}
                    onChange={(e) => handleChange("latitude", e.target.value)}
                    placeholder="e.g., 29.3759"
                  />
                </div>
                <div>
                  <Label htmlFor="longitude">Longitude</Label>
                  <Input
                    id="longitude"
                    value={formData.longitude}
                    onChange={(e) => handleChange("longitude", e.target.value)}
                    placeholder="e.g., 47.9774"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submit */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setLocation("/super-admin")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700"
              disabled={updateNursery.isPending}
            >
              {updateNursery.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
