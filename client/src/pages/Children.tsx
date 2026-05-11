import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, AlertCircle, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Children() {
  const { data: childrenList, isLoading, refetch } = trpc.children.list.useQuery();
  const { data: roomsList } = trpc.rooms.list.useQuery();
  const createMutation = trpc.children.create.useMutation();
  const updateMutation = trpc.children.update.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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

  const handleDelete = async (id: number) => {
    toast.info("Delete functionality coming soon");
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
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
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

      <div className="space-y-2">
        {childrenList && childrenList.length > 0 ? (
          childrenList.map((child: any) => (
            <div
              key={child.id}
              className="border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === child.id ? null : child.id)}
              >
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {child.firstName[0]}{child.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {child.firstName} {child.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span>{calculateAge(child.dateOfBirth)} years old</span>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {getRoomName(child.roomId)}
                      </span>
                      {(child.allergies || child.medicalConditions) && (
                        <span className="flex items-center gap-1 text-amber-600">
                          <AlertCircle className="w-3 h-3" />
                          Medical Info
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedId === child.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedId === child.id && (
                <div className="border-t border-border px-4 py-4 bg-muted/30 space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Date of Birth</div>
                      <div className="text-foreground">{new Date(child.dateOfBirth).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Gender</div>
                      <div className="text-foreground capitalize">{child.gender}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Enrollment Date</div>
                      <div className="text-foreground">{new Date(child.enrollmentDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Room</div>
                      <div className="text-foreground">{getRoomName(child.roomId)}</div>
                    </div>
                  </div>

                  {(child.allergies || child.medicalConditions || child.medications || child.dietaryRestrictions) && (
                    <div className="border-t border-border pt-3">
                      <div className="font-medium text-foreground mb-2">Medical Information</div>
                      {child.allergies && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Allergies</div>
                          <div className="text-foreground">{child.allergies}</div>
                        </div>
                      )}
                      {child.medicalConditions && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Medical Conditions</div>
                          <div className="text-foreground">{child.medicalConditions}</div>
                        </div>
                      )}
                      {child.medications && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Medications</div>
                          <div className="text-foreground">{child.medications}</div>
                        </div>
                      )}
                      {child.dietaryRestrictions && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Dietary Restrictions</div>
                          <div className="text-foreground">{child.dietaryRestrictions}</div>
                        </div>
                      )}
                    </div>
                  )}

                  {(child.emergencyContact1 || child.emergencyContact2) && (
                    <div className="border-t border-border pt-3">
                      <div className="font-medium text-foreground mb-2">Emergency Contacts</div>
                      {child.emergencyContact1 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Contact 1</div>
                          <div className="text-foreground">
                            {child.emergencyContact1}
                            {child.emergencyPhone1 && ` - ${child.emergencyPhone1}`}
                          </div>
                        </div>
                      )}
                      {child.emergencyContact2 && (
                        <div>
                          <div className="text-sm font-medium text-muted-foreground">Contact 2</div>
                          <div className="text-foreground">
                            {child.emergencyContact2}
                            {child.emergencyPhone2 && ` - ${child.emergencyPhone2}`}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(child)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(child.id)}
                      className="gap-2"
                      disabled
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No children registered. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
