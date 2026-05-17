import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Users } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Rooms() {
  const { data: roomsList, isLoading, refetch } = trpc.rooms.list.useQuery();
  const { data: childrenList } = trpc.children.list.useQuery();
  const createMutation = trpc.rooms.create.useMutation();
  const updateMutation = trpc.rooms.update.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    capacity: "",
    ageGroupMin: "",
    ageGroupMax: "",
    resources: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          name: formData.name,
          description: formData.description,
          capacity: parseInt(formData.capacity),
          ageGroupMin: formData.ageGroupMin ? parseInt(formData.ageGroupMin) : undefined,
          ageGroupMax: formData.ageGroupMax ? parseInt(formData.ageGroupMax) : undefined,
          resources: formData.resources,
        });
        toast.success("Room updated successfully");
      } else {
        await createMutation.mutateAsync({
          name: formData.name,
          description: formData.description,
          capacity: parseInt(formData.capacity),
          ageGroupMin: formData.ageGroupMin ? parseInt(formData.ageGroupMin) : undefined,
          ageGroupMax: formData.ageGroupMax ? parseInt(formData.ageGroupMax) : undefined,
          resources: formData.resources,
        });
        toast.success("Room created successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save room");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      capacity: "",
      ageGroupMin: "",
      ageGroupMax: "",
      resources: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Rooms & Facilities</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Create Room
        </Button>
      </div>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            {editingId ? "Edit Room" : "Create New Room"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room Name *</label>
                <Input
                  placeholder="Enter room name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Capacity *</label>
                <Input
                  placeholder="Enter maximum capacity"
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Minimum Age (months)</label>
                <Input
                  placeholder="Enter minimum age"
                  type="number"
                  value={formData.ageGroupMin}
                  onChange={(e) => setFormData({ ...formData, ageGroupMin: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Maximum Age (months)</label>
                <Input
                  placeholder="Enter maximum age"
                  type="number"
                  value={formData.ageGroupMax}
                  onChange={(e) => setFormData({ ...formData, ageGroupMax: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                placeholder="Enter room description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Resources</label>
              <textarea
                placeholder="Enter available resources (e.g., toys, books, equipment)"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Create"} Room
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
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
          </>
        ) : roomsList && roomsList.length > 0 ? (
          roomsList.map((room) => (
            <Card key={room.id} className="p-6 card-elegant">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-foreground">{room.name}</h3>
                  {room.description && (
                    <p className="text-sm text-muted-foreground mt-1">{room.description}</p>
                  )}
                  {/* Children in Room Badges */}
                  {childrenList && childrenList.length > 0 && (() => {
                    const roomChildren = childrenList.filter((child: any) => child.roomId === room.id);
                    return roomChildren.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roomChildren.map((child: any) => (
                          <span key={child.id} className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                            {child.firstName}
                          </span>
                        ))}
                      </div>
                    ) : null;
                  })()}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Users size={18} className="text-primary" />
                    <span className="text-foreground font-medium">Capacity: {room.capacity} children</span>
                  </div>
                  {room.ageGroupMin !== null && room.ageGroupMax !== null && (
                    <div className="text-sm text-muted-foreground">
                      Age Group: {room.ageGroupMin} - {room.ageGroupMax} months
                    </div>
                  )}
                </div>

                {room.resources && (
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground mb-2">Resources</p>
                    <p className="text-sm text-foreground">{room.resources}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t border-border">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingId(room.id);
                      setFormData({
                        name: room.name,
                        description: room.description || "",
                        capacity: room.capacity.toString(),
                        ageGroupMin: room.ageGroupMin?.toString() || "",
                        ageGroupMax: room.ageGroupMax?.toString() || "",
                        resources: room.resources || "",
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
            <p className="text-muted-foreground text-lg">No rooms created yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
