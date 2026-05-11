import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Phone, Mail, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Staff() {
  const { data: staffList, isLoading, refetch } = trpc.staff.list.useQuery();
  const createMutation = trpc.staff.create.useMutation();
  const updateMutation = trpc.staff.update.useMutation();
  const deleteMutation = trpc.staff.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    staffRole: "teacher" as const,
    qualifications: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          ...formData,
        });
        toast.success("Staff member updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Staff member added successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save staff member");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      staffRole: "teacher",
      qualifications: "",
      emergencyContact: "",
      emergencyPhone: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (staff: any) => {
    setFormData({
      firstName: staff.firstName,
      lastName: staff.lastName,
      email: staff.email,
      phone: staff.phone,
      staffRole: staff.staffRole,
      qualifications: staff.qualifications || "",
      emergencyContact: staff.emergencyContact || "",
      emergencyPhone: staff.emergencyPhone || "",
    });
    setEditingId(staff.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      try {
        await deleteMutation.mutateAsync({ id });
        toast.success("Staff member deleted");
        refetch();
      } catch (error) {
        toast.error("Failed to delete staff member");
      }
    }
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      director: "bg-red-100 text-red-800",
      teacher: "bg-blue-100 text-blue-800",
      assistant: "bg-green-100 text-green-800",
      nurse: "bg-purple-100 text-purple-800",
      admin: "bg-orange-100 text-orange-800",
    };
    return colors[role] || "bg-gray-100 text-gray-800";
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
        <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Staff Member
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {editingId ? "Edit Staff Member" : "Add New Staff Member"}
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
                placeholder="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <Input
                placeholder="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
              <select
                value={formData.staffRole || "teacher"}
                onChange={(e) => setFormData({ ...formData, staffRole: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="director">Director</option>
                <option value="teacher">Teacher</option>
                <option value="assistant">Assistant</option>
                <option value="nurse">Nurse</option>
                <option value="admin">Admin</option>
              </select>
              <Input
                placeholder="Qualifications"
                value={formData.qualifications}
                onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
              />
              <Input
                placeholder="Emergency Contact Name"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
              <Input
                placeholder="Emergency Phone"
                value={formData.emergencyPhone}
                onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update" : "Add"} Staff Member
              </Button>
              <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-2">
        {staffList && staffList.length > 0 ? (
          staffList.map((staff: any) => (
            <div
              key={staff.id}
              className="border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === staff.id ? null : staff.id)}
              >
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {staff.firstName[0]}{staff.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {staff.firstName} {staff.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(staff.staffRole)}`}>
                        {staff.staffRole}
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {staff.email}
                      </span>
                      {staff.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {staff.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedId === staff.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedId === staff.id && (
                <div className="border-t border-border px-4 py-4 bg-muted/30 space-y-3">
                  {staff.qualifications && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Qualifications</div>
                      <div className="text-foreground">{staff.qualifications}</div>
                    </div>
                  )}
                  {staff.emergencyContact && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Emergency Contact</div>
                      <div className="text-foreground">
                        {staff.emergencyContact}
                        {staff.emergencyPhone && ` - ${staff.emergencyPhone}`}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(staff)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(staff.id)}
                      className="gap-2"
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
            No staff members found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
