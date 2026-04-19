import { trpc } from "@/lib/trpc";

interface ChildData {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth?: string | null;
  status?: string;
  parentId?: number;
}
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Mail, Phone, MapPin, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Parents() {
  const { data: parentsList, isLoading, refetch } = trpc.parents.list.useQuery();
  const { data: childrenList } = trpc.children.list.useQuery();
  const createMutation = trpc.parents.create.useMutation();
  const updateMutation = trpc.parents.update.useMutation();
  const linkChildMutation = trpc.parents.linkChild.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [showLinkForm, setShowLinkForm] = useState(false);
  const [linkData, setLinkData] = useState({
    childId: "",
    relationship: "",
  });

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
          ...formData,
        });
        toast.success("Parent profile updated successfully");
      } else {
        await createMutation.mutateAsync(formData);
        toast.success("Parent added successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save parent");
    }
  };

  const handleLinkChild = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId) {
      toast.error("Please select a parent");
      return;
    }

    try {
      await linkChildMutation.mutateAsync({
        parentId: selectedParentId,
        childId: parseInt(linkData.childId),
        relationship: linkData.relationship,
      });
      toast.success("Child linked successfully");
      setLinkData({ childId: "", relationship: "" });
      setShowLinkForm(false);
    } catch (error) {
      toast.error("Failed to link child");
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
        <h1 className="text-3xl font-bold text-foreground">Parents & Guardians</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Add Parent
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            {editingId ? "Edit Parent Profile" : "Add New Parent"}
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
                placeholder="Relationship (Mother, Father, Guardian, etc.)"
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
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Add"} Parent
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {showLinkForm && selectedParentId && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Link Child to Parent</h2>
          <form onSubmit={handleLinkChild} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={linkData.childId}
                onChange={(e) => setLinkData({ ...linkData, childId: e.target.value })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select Child</option>
                {childrenList?.map((child) => (
                  <option key={child.id} value={child.id}>
                    {child.firstName} {child.lastName}
                  </option>
                ))}
              </select>
              <Input
                placeholder="Relationship (Mother, Father, Guardian, etc.)"
                value={linkData.relationship}
                onChange={(e) => setLinkData({ ...linkData, relationship: e.target.value })}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={linkChildMutation.isPending}>
                Link Child
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowLinkForm(false)}>
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
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {parent.firstName} {parent.lastName}
                  </h3>
                  {parent.relationship && (
                    <p className="text-sm text-muted-foreground">{parent.relationship}</p>
                  )}
                </div>

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

                {/* Linked Children Section */}
                {childrenList && childrenList.length > 0 && (() => {
                  const linkedChildren = childrenList.filter((child: any) => 
                    child.parentId === parent.id
                  );
                  return linkedChildren.length > 0 ? (
                    <div className="pt-4 border-t border-border">
                      <div className="flex items-center gap-2 mb-3">
                        <Users size={16} className="text-primary" />
                        <span className="text-sm font-semibold text-foreground">Linked Children ({linkedChildren.length})</span>
                      </div>
                      <div className="space-y-2">
                        {linkedChildren.map((child: any) => (
                          <div key={child.id} className="flex items-center justify-between bg-muted/50 rounded p-2">
                            <div>
                              <p className="text-sm font-medium text-foreground">
                                {child.firstName} {child.lastName}
                              </p>
                              <p className="text-xs text-muted-foreground">Age {child.dateOfBirth ? new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear() : 'N/A'}</p>
                            </div>
                            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                              {child.status || 'Active'}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null;
                })()}

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
                        relationship: parent.relationship || "",
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
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedParentId(parent.id);
                      setShowLinkForm(true);
                    }}
                    className="gap-1"
                  >
                    <Plus size={16} />
                    Link Child
                  </Button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">No parents added yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
