import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Children() {
  const { data: childrenList, isLoading, refetch } = trpc.children.list.useQuery();
  const { data: roomsList } = trpc.rooms.list.useQuery();
  const createMutation = trpc.children.create.useMutation();
  const updateMutation = trpc.children.update.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "male" as const,
    enrollmentDate: new Date().toISOString().split("T")[0],
    roomId: "",
    allergies: "",
    medicalConditions: "",
    medications: "",
    dietaryRestrictions: "",
    emergencyContact1: "",
    emergencyPhone1: "",
    emergencyContact2: "",
    emergencyPhone2: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          roomId: formData.roomId ? parseInt(formData.roomId) : undefined,
          allergies: formData.allergies,
          medicalConditions: formData.medicalConditions,
          medications: formData.medications,
          dietaryRestrictions: formData.dietaryRestrictions,
        });
        toast.success("Child profile updated successfully");
      } else {
        await createMutation.mutateAsync({
          ...formData,
          roomId: formData.roomId ? parseInt(formData.roomId) : undefined,
        });
        toast.success("Child registered successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save child information");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "male",
      enrollmentDate: new Date().toISOString().split("T")[0],
      roomId: "",
      allergies: "",
      medicalConditions: "",
      medications: "",
      dietaryRestrictions: "",
      emergencyContact1: "",
      emergencyPhone1: "",
      emergencyContact2: "",
      emergencyPhone2: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const calculateAge = (dateOfBirth: string | Date) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Children Registry</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Register Child
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            {editingId ? "Edit Child Profile" : "Register New Child"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-3">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
                <Input
                  placeholder="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
                <select
                  value={formData.gender || "male"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <Input
                  placeholder="Enrollment Date"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  required
                />
                <select
                  value={formData.roomId || ""}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                >
                  <option value="">Select Room</option>
                  {roomsList?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Medical Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Allergies"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
                <Input
                  placeholder="Medical Conditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                />
                <Input
                  placeholder="Medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                />
                <Input
                  placeholder="Dietary Restrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                />
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-foreground mb-3">Emergency Contacts</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Emergency Contact 1"
                  value={formData.emergencyContact1}
                  onChange={(e) => setFormData({ ...formData, emergencyContact1: e.target.value })}
                />
                <Input
                  placeholder="Emergency Phone 1"
                  value={formData.emergencyPhone1}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone1: e.target.value })}
                />
                <Input
                  placeholder="Emergency Contact 2"
                  value={formData.emergencyContact2}
                  onChange={(e) => setFormData({ ...formData, emergencyContact2: e.target.value })}
                />
                <Input
                  placeholder="Emergency Phone 2"
                  value={formData.emergencyPhone2}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone2: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Register"} Child
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
            <Skeleton className="h-80" />
          </>
        ) : childrenList && childrenList.length > 0 ? (
          childrenList.map((child) => (
            <Card key={child.id} className="p-6 card-elegant">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {child.firstName} {child.lastName}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Age: {calculateAge(child.dateOfBirth)} years old
                  </p>
                </div>

                {(child.allergies || child.medicalConditions) && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 space-y-2">
                    <div className="flex items-center gap-2 text-orange-800 font-semibold">
                      <AlertCircle size={16} />
                      Medical Info
                    </div>
                    {child.allergies && (
                      <p className="text-sm text-orange-700">
                        <strong>Allergies:</strong> {child.allergies}
                      </p>
                    )}
                    {child.medicalConditions && (
                      <p className="text-sm text-orange-700">
                        <strong>Conditions:</strong> {child.medicalConditions}
                      </p>
                    )}
                  </div>
                )}

                {child.dietaryRestrictions && (
                  <div className="text-sm">
                    <p className="font-semibold text-foreground">Dietary Restrictions</p>
                    <p className="text-muted-foreground">{child.dietaryRestrictions}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(child.id);
                      setFormData({
                        firstName: child.firstName,
                        lastName: child.lastName,
                        dateOfBirth: child.dateOfBirth.toISOString().split("T")[0],
                        gender: child.gender as any,
                        enrollmentDate: child.enrollmentDate.toISOString().split("T")[0],
                        roomId: child.roomId?.toString() || "",
                        allergies: child.allergies || "",
                        medicalConditions: child.medicalConditions || "",
                        medications: child.medications || "",
                        dietaryRestrictions: child.dietaryRestrictions || "",
                        emergencyContact1: child.emergencyContact1 || "",
                        emergencyPhone1: child.emergencyPhone1 || "",
                        emergencyContact2: child.emergencyContact2 || "",
                        emergencyPhone2: child.emergencyPhone2 || "",
                      });
                      setShowForm(true);
                    }}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No children registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
