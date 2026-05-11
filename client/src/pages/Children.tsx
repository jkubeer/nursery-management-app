import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, AlertCircle } from "lucide-react";
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

  const handleEdit = (child: any) => {
    setFormData({
      firstName: child.firstName,
      lastName: child.lastName,
      dateOfBirth: child.dateOfBirth,
      gender: child.gender,
      enrollmentDate: child.enrollmentDate,
      roomId: child.roomId ? child.roomId.toString() : "",
      allergies: child.allergies || "",
      medicalConditions: child.medicalConditions || "",
      medications: child.medications || "",
      dietaryRestrictions: child.dietaryRestrictions || "",
      emergencyContact1: child.emergencyContact1 || "",
      emergencyPhone1: child.emergencyPhone1 || "",
      emergencyContact2: child.emergencyContact2 || "",
      emergencyPhone2: child.emergencyPhone2 || "",
    });
    setEditingId(child.id);
    setShowForm(true);
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

  const getRoomName = (roomId: number | null) => {
    if (!roomId) return "Not assigned";
    return roomsList?.find((r) => r.id === roomId)?.name || "Unknown";
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Children Registry</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Register Child
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {editingId ? "Edit Child Profile" : "Register New Child"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
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
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update" : "Register"} Child
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Age</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Gender</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Room</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Allergies</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Medical</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {childrenList && childrenList.length > 0 ? (
              childrenList.map((child: any) => (
                <tr key={child.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 text-sm text-foreground font-medium">
                    {child.firstName} {child.lastName}
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {calculateAge(child.dateOfBirth)} years
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">
                    {child.gender === "male" ? "👦 Male" : child.gender === "female" ? "👧 Female" : "Other"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getRoomName(child.roomId)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {child.allergies ? (
                      <span className="flex items-center gap-1 text-orange-600">
                        <AlertCircle className="w-4 h-4" />
                        {child.allergies}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {child.medicalConditions ? (
                      <span className="flex items-center gap-1 text-red-600">
                        <AlertCircle className="w-4 h-4" />
                        {child.medicalConditions}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(child)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  No children registered. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
