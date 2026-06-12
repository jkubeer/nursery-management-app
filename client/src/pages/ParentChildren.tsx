import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, Baby } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function ParentChildren() {
  const { user } = useAuth();
  const [parentId, setParentId] = useState<number | null>(null);

  // Get current parent's profile
  const { data: parentData, isLoading: parentLoading } = trpc.parent.me.useQuery();

  // Get parent's children
  const { data: children = [], isLoading: childrenLoading } = trpc.parent.children.useQuery();

  useEffect(() => {
    if (parentData?.id) {
      setParentId(parentData.id);
    }
  }, [parentData]);

  const isLoading = parentLoading || childrenLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-foreground font-medium">Loading children...</p>
        </div>
      </div>
    );
  }

  if (!parentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={24} />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load parent information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Children</h1>
        <p className="text-gray-600">View and manage information about your registered children</p>
      </div>

      {/* Children List */}
      {children.length === 0 ? (
        <Card>
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
            <Baby size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium text-gray-600 mb-2">No Children Registered</p>
            <p className="text-sm text-gray-500">
              Contact the nursery to register your children
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {children.map((child) => {
            const birthDate = new Date(child.dateOfBirth);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
              age--;
            }

            return (
              <Card key={child.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">
                        {child.firstName} {child.lastName}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {age} years old • {child.gender ? child.gender.charAt(0).toUpperCase() + child.gender.slice(1) : "Not specified"}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={child.status === "active" ? "default" : "secondary"}
                      className={
                        child.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {child.status.charAt(0).toUpperCase() + child.status.slice(1)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Basic Info */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Date of Birth</p>
                    <p className="text-sm text-gray-800">
                      {new Date(child.dateOfBirth).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Enrollment Date */}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Enrollment Date</p>
                    <p className="text-sm text-gray-800">
                      {new Date(child.enrollmentDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>

                  {/* Medical Info */}
                  {(child.allergies || child.medicalConditions || child.medications) && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Medical Information</p>
                      {child.allergies && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-500">Allergies</p>
                          <p className="text-sm text-gray-800">{child.allergies}</p>
                        </div>
                      )}
                      {child.medicalConditions && (
                        <div className="mb-2">
                          <p className="text-xs font-medium text-gray-500">Medical Conditions</p>
                          <p className="text-sm text-gray-800">{child.medicalConditions}</p>
                        </div>
                      )}
                      {child.medications && (
                        <div>
                          <p className="text-xs font-medium text-gray-500">Medications</p>
                          <p className="text-sm text-gray-800">{child.medications}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Dietary Restrictions */}
                  {child.dietaryRestrictions && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-1">Dietary Restrictions</p>
                      <p className="text-sm text-gray-800">{child.dietaryRestrictions}</p>
                    </div>
                  )}

                  {/* Emergency Contacts */}
                  {(child.emergencyContact1 || child.emergencyContact2) && (
                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">Emergency Contacts</p>
                      {child.emergencyContact1 && (
                        <div className="mb-2">
                          <p className="text-xs text-gray-500">{child.emergencyContact1}</p>
                          <p className="text-sm text-gray-800">{child.emergencyPhone1}</p>
                        </div>
                      )}
                      {child.emergencyContact2 && (
                        <div>
                          <p className="text-xs text-gray-500">{child.emergencyContact2}</p>
                          <p className="text-sm text-gray-800">{child.emergencyPhone2}</p>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
