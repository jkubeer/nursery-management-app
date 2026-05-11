import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Trash2, Mail, Phone, ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function ParentChildrenBadges({ parentId }: { parentId: number }) {
  const { data: parentChildren } = trpc.parents.getChildren.useQuery({ parentId });

  if (!parentChildren || parentChildren.length === 0) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2">
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

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
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

  const handleDelete = async (id: number) => {
    toast.info("Delete functionality coming soon");
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
              <Input
                placeholder="Relationship"
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
              />
              <Input
                placeholder="Work Phone"
                value={formData.workPhone}
                onChange={(e) => setFormData({ ...formData, workPhone: e.target.value })}
              />
              <Input
                placeholder="Address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
              <Input
                placeholder="City"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
              <Input
                placeholder="State"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              />
              <Input
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
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

      <div className="space-y-2">
        {parentsList && parentsList.length > 0 ? (
          parentsList.map((parent: any) => (
            <div
              key={parent.id}
              className="border border-border rounded-lg bg-card hover:bg-accent/50 transition-colors"
            >
              <div
                className="p-4 flex items-center justify-between cursor-pointer"
                onClick={() => setExpandedId(expandedId === parent.id ? null : parent.id)}
              >
                <div className="flex-1 flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">
                      {parent.firstName[0]}{parent.lastName[0]}
                    </span>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-foreground">
                      {parent.firstName} {parent.lastName}
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-4">
                      {parent.relationship && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                          {parent.relationship}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3" />
                        {parent.email}
                      </span>
                      {parent.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {parent.phone}
                        </span>
                      )}
                    </div>
                    {/* Linked Children Badges */}
                    <div className="mt-2">
                      <ParentChildrenBadges parentId={parent.id} />
                    </div>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-muted-foreground transition-transform ${
                    expandedId === parent.id ? "rotate-180" : ""
                  }`}
                />
              </div>

              {expandedId === parent.id && (
                <div className="border-t border-border px-4 py-4 bg-muted/30 space-y-3">
                  {parent.workPhone && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Work Phone</div>
                      <div className="text-foreground">{parent.workPhone}</div>
                    </div>
                  )}
                  {(parent.address || parent.city || parent.state || parent.zipCode) && (
                    <div>
                      <div className="text-sm font-medium text-muted-foreground">Address</div>
                      <div className="text-foreground">
                        {parent.address}
                        {parent.city && `, ${parent.city}`}
                        {parent.state && `, ${parent.state}`}
                        {parent.zipCode && ` ${parent.zipCode}`}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(parent)}
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(parent.id)}
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
            No parents found. Add one to get started.
          </div>
        )}
      </div>
    </div>
  );
}
