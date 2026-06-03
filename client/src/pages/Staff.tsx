import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Phone, Mail } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePrivileges } from '@/hooks/usePrivileges';

export default function Staff() {
  const privileges = usePrivileges();
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
          <Skeleton key={i} className="h-12 w-full rounded-lg" />
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
                <label className="text-sm font-medium text-foreground">Email *</label>
                <Input
                  placeholder="Enter email address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Staff Role</label>
                <select
                  value={formData.staffRole || "teacher"}
                  onChange={(e) => setFormData({ ...formData, staffRole: e.target.value as any })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                >
                  <option value="director">Director</option>
                  <option value="teacher">Teacher</option>
                  <option value="assistant">Assistant</option>
                  <option value="nurse">Nurse</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Qualifications</label>
                <Input
                  placeholder="Enter qualifications"
                  value={formData.qualifications}
                  onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Contact Name</label>
                <Input
                  placeholder="Enter emergency contact name"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Emergency Phone</label>
                <Input
                  placeholder="Enter emergency phone number"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                />
              </div>
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

      <div className="overflow-x-auto border border-border rounded-lg">
        <table className="w-full table-fixed">
          <colgroup>
            <col style={{ width: '20%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '15%' }} />
          </colgroup>
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Role</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Qualifications</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList && staffList.length > 0 ? (
              staffList.map((staff: any) => (
                <tr key={staff.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2 text-xs text-foreground font-medium truncate">
                    {staff.firstName} {staff.lastName}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getRoleColor(staff.staffRole)}`}>
                      {staff.staffRole}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                    {staff.email}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                    {staff.phone || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                    {staff.qualifications || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(staff)}
                      className="h-7 px-2 w-7 p-0"
                      title="Edit staff"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(staff.id)}
                      className="h-7 px-2 w-7 p-0"
                      title="Delete staff"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No staff members found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
