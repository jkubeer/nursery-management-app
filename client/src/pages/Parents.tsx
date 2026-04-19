import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Mail, Phone, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

function ParentCardHeader({ parent }: { parent: any }) {
  const { data: parentChildren } = trpc.parents.getChildren.useQuery({ parentId: parent.id });

  return (
    <div>
      <h3 className="text-lg font-bold text-foreground">
        {parent.firstName} {parent.lastName}
      </h3>

      {/* Linked Children Badges */}
      {parentChildren && parentChildren.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {parentChildren.map((child: any) => (
            <span key={child.id} className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
              {child.firstName}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Parents() {
  const { data: parentsList, isLoading, refetch } = trpc.parents.list.useQuery();
  const createMutation = trpc.parents.create.useMutation();
  const updateMutation = trpc.parents.update.useMutation();
  const utils = trpc.useUtils();

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
        await utils.parents.getChildren.invalidate();
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
        await utils.parents.getChildren.invalidate();
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Parents</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Add Parent
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
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
              <Button type="submit">
                {editingId ? "Update" : "Create"}
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
        ) : parentsList && parentsList.length > 0 ? (
          parentsList.map((parent) => (
            <Card key={parent.id} className="p-6 card-elegant">
              <div className="space-y-4">
                <ParentCardHeader parent={parent} />

                <div className="space-y-2 text-sm">
                  {parent.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail size={16} />
                      <span>{parent.email}</span>
                    </div>
                  )}
                  {parent.phone && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone size={16} />
                      <span>{parent.phone}</span>
                    </div>
                  )}
                  {parent.address && (
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin size={16} className="mt-0.5" />
                      <span>
                        {parent.address}
                        {parent.city && `, ${parent.city}`}
                        {parent.state && `, ${parent.state}`}
                        {parent.zipCode && ` ${parent.zipCode}`}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(parent.id);
                      setFormData({
                        firstName: parent.firstName,
                        lastName: parent.lastName,
                        email: parent.email,
                        phone: parent.phone || "",
                        relationship: "",
                        address: parent.address || "",
                        city: parent.city || "",
                        state: parent.state || "",
                        zipCode: parent.zipCode || "",
                        workPhone: parent.workPhone || "",
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
            <p className="text-muted-foreground">No parents found</p>
          </div>
        )}
      </div>
    </div>
  );
}
