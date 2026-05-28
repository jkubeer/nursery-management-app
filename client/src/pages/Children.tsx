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
  const { data: parentsList } = trpc.parents.list.useQuery();
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
    parentId: "",
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
    if (!formData.parentId) {
      toast.error("Please select a parent for this child");
      return;
    }
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
          parentId: parseInt(formData.parentId),
        });
        toast.success("Child registered successfully");
      }
      resetForm();
      refetch();
    } catch (error: any) {
      toast.error(error?.message || "Failed to save child information");
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
      parentId: "",
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
      parentId: child.parentId ? child.parentId.toString() : "",
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">First Name *</label>
                <Input
                  placeholder="Enter first name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Last Name *</label>
                <Input
                  placeholder="Enter last name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Birth *</label>
                <Input
                  placeholder="Select date of birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  value={formData.gender || "male"}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Enrollment Date *</label>
                <Input
                  placeholder="Select enrollment date"
                  type="date"
                  value={formData.enrollmentDate}
                  onChange={(e) => setFormData({ ...formData, enrollmentDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Parent/Guardian *</label>
                <select
                  value={formData.parentId || ""}
                  onChange={(e) => setFormData({ ...formData, parentId: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                  required
                >
                  <option value="">Select Parent/Guardian</option>
                  {parentsList?.map((parent) => (
                    <option key={parent.id} value={parent.id}>
                      {parent.firstName} {parent.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room</label>
                <select
                  value={formData.roomId || ""}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                >
                  <option value="">Select Room</option>
                  {roomsList?.map((room) => (
                    <option key={room.id} value={room.id}>
                      {room.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Allergies</label>
                <Input
                  placeholder="Enter allergies if any"
                  value={formData.allergies}
                  onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Medical Conditions</label>
                <Input
                  placeholder="Enter medical conditions"
                  value={formData.medicalConditions}
                  onChange={(e) => setFormData({ ...formData, medicalConditions: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Medications</label>
                <Input
                  placeholder="Enter medications"
                  value={formData.medications}
                  onChange={(e) => setFormData({ ...formData, medications: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Dietary Restrictions</label>
                <Input
                  placeholder="Enter dietary restrictions"
                  value={formData.dietaryRestrictions}
                  onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Contact 1</label>
                <Input
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContact1}
                  onChange={(e) => setFormData({ ...formData, emergencyContact1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Phone 1</label>
                <Input
                  placeholder="Enter emergency phone number"
                  value={formData.emergencyPhone1}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone1: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Contact 2</label>
                <Input
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContact2}
                  onChange={(e) => setFormData({ ...formData, emergencyContact2: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Phone 2</label>
                <Input
                  placeholder="Enter emergency phone number"
                  value={formData.emergencyPhone2}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone2: e.target.value })}
                />
              </div>
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
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '10%' }} />
          </colgroup>
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Age</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Room</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Gender</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Allergies</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Medical Info</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {childrenList && childrenList.length > 0 ? (
              childrenList.map((child: any) => {
                const age = new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear();
                return (
                  <tr key={child.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-2 text-xs text-foreground font-medium truncate">
                      {child.firstName} {child.lastName}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground">{age} years</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground truncate">{child.room?.name || "-"}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground capitalize">{child.gender}</td>
                    <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                      {child.allergies ? (
                        <span className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="w-3 h-3" />
                          {child.allergies}
                        </span>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                      {child.medicalConditions || "-"}
                    </td>
                    <td className="px-4 py-2 text-xs">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(child)}
                        className="h-7 px-2 w-7 p-0"
                        title="Edit child"
                      >
                        <Edit2 className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No children registered. Register one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
