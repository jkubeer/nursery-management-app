import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Staff() {
  const { data: staffList, isLoading, refetch } = trpc.staff.list.useQuery();
  const createMutation = trpc.staff.create.useMutation();
  const updateMutation = trpc.staff.update.useMutation();
  const deleteMutation = trpc.staff.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
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
      refetch();
    } catch (error) {
      toast.error("Failed to save staff member");
    }
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Staff Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Add Staff Member
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
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
                value={formData.staffRole}
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
                placeholder="Emergency Contact"
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Add"} Staff Member
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <>
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </>
        ) : staffList && staffList.length > 0 ? (
          staffList.map((member) => (
            <Card key={member.id} className="p-6 card-elegant">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {member.firstName} {member.lastName}
                  </h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mt-2 ${getRoleColor(member.staffRole)}`}>
                    {member.staffRole.charAt(0).toUpperCase() + member.staffRole.slice(1)}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail size={16} />
                    <span>{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={16} />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>

                {member.qualifications && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Qualifications</p>
                    <p className="text-sm text-foreground">{member.qualifications}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(member.id);
                      setFormData({
                        firstName: member.firstName,
                        lastName: member.lastName,
                        email: member.email,
                        phone: member.phone || "",
                        staffRole: member.staffRole as any,
                        qualifications: member.qualifications || "",
                        emergencyContact: member.emergencyContact || "",
                        emergencyPhone: member.emergencyPhone || "",
                      });
                      setShowForm(true);
                    }}
                    className="gap-1"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(member.id)}
                    className="gap-1"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No staff members yet. Add your first staff member!</p>
          </div>
        )}
      </div>
    </div>
  );
}
