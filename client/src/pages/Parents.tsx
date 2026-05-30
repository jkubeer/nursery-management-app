import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Mail, Phone } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function ParentChildrenBadges({ parentId }: { parentId: number }) {
  const { data: parentChildren } = trpc.parents.getChildren.useQuery({ parentId });

  if (!parentChildren || parentChildren.length === 0) {
    return <span className="text-muted-foreground">-</span>;
  }

  return (
    <div className="flex flex-wrap gap-1">
      {parentChildren.map((child: any) => (
        <span
          key={child.id}
          className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium"
        >
          {child.firstName}
        </span>
      ))}
    </div>
  );
}

export default function Parents() {
  const { data: parentsList, isLoading, refetch } = trpc.parents.list.useQuery();
  const createMutation = trpc.parents.create.useMutation();
  const updateMutation = trpc.parents.update.useMutation();
  const deleteMutation = trpc.parents.delete.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    relationship: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    workPhone: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          workPhone: formData.workPhone,
        });
        toast.success("Parent updated successfully");
      } else {
        await createMutation.mutateAsync({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          workPhone: formData.workPhone,
        });
        toast.success("Parent created successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save parent");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      relationship: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      workPhone: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (parent: any) => {
    setFormData({
      firstName: parent.firstName,
      lastName: parent.lastName,
      email: parent.email,
      phone: parent.phone || "",
      relationship: parent.relationship || "",
      address: parent.address || "",
      city: parent.city || "",
      state: parent.state || "",
      zipCode: parent.zipCode || "",
      workPhone: parent.workPhone || "",
    });
    setEditingId(parent.id);
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
        <h1 className="text-3xl font-bold text-foreground">Parents Management</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          Add Parent
        </Button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold text-foreground">
            {editingId ? "Edit Parent" : "Add New Parent"}
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
                <label className="text-sm font-medium text-foreground">Relationship</label>
                <Input
                  placeholder="e.g., Mother, Father, Guardian"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Work Phone</label>
                <Input
                  placeholder="Enter work phone number"
                  value={formData.workPhone}
                  onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Address</label>
                <Input
                  placeholder="Enter street address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">City</label>
                <Input
                  placeholder="Enter city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">State</label>
                <Input
                  placeholder="Enter state"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Zip Code</label>
                <Input
                  placeholder="Enter zip code"
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update" : "Create"} Parent
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
            <col style={{ width: '14%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '14%' }} />
          </colgroup>
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Name</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Relationship</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Email</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Phone</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Children</th>
              <th className="px-4 py-2 text-left text-xs font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {parentsList && parentsList.length > 0 ? (
              parentsList.map((parent: any) => (
                <tr key={parent.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-2 text-xs text-foreground font-medium truncate">
                    {parent.firstName} {parent.lastName}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    {parent.relationship ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 whitespace-nowrap">
                        {parent.relationship}
                      </span>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                    {parent.email}
                  </td>
                  <td className="px-4 py-2 text-xs text-muted-foreground truncate">
                    {parent.phone || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <ParentChildrenBadges parentId={parent.id} />
                  </td>
                  <td className="px-4 py-2 text-xs flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(parent)}
                      className="h-7 px-2 w-7 p-0"
                      title="Edit parent"
                    >
                      <Edit2 className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        if (confirm(`Delete ${parent.firstName} ${parent.lastName}?`)) {
                          deleteMutation.mutateAsync({ id: parent.id }).then(() => {
                            toast.success("Parent deleted successfully");
                            refetch();
                          }).catch((error: any) => {
                            toast.error(error?.message || "Failed to delete parent");
                          });
                        }
                      }}
                      className="h-7 px-2 w-7 p-0 text-red-600 hover:text-red-700"
                      title="Delete parent"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-xs text-muted-foreground">
                  No parents found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
