import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, Edit2, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { usePrivileges } from '@/hooks/usePrivileges';

export default function Activities() {
  const privileges = usePrivileges();
  const { data: roomsList } = trpc.rooms.list.useQuery();
  const { data: staffList } = trpc.staff.list.useQuery();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const { data: activitiesList, isLoading, refetch } = trpc.activities.byDate.useQuery({
    date: selectedDate,
  });

  const createMutation = trpc.activities.create.useMutation();
  const updateMutation = trpc.activities.update.useMutation();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    roomId: "",
    scheduledDate: selectedDate,
    startTime: "",
    endTime: "",
    staffId: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await updateMutation.mutateAsync({
          id: editingId,
          title: formData.title,
          description: formData.description,
          status: "planned",
        });
        toast.success("Activity updated successfully");
      } else {
        await createMutation.mutateAsync({
          title: formData.title,
          description: formData.description,
          roomId: parseInt(formData.roomId),
          scheduledDate: formData.scheduledDate,
          startTime: formData.startTime,
          endTime: formData.endTime,
          staffId: formData.staffId ? parseInt(formData.staffId) : undefined,
        });
        toast.success("Activity created successfully");
      }
      resetForm();
      refetch();
    } catch (error) {
      toast.error("Failed to save activity");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      roomId: "",
      scheduledDate: selectedDate,
      startTime: "",
      endTime: "",
      staffId: "",
    });
    setShowForm(false);
    setEditingId(null);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      planned: "bg-blue-100 text-blue-800",
      in_progress: "bg-yellow-100 text-yellow-800",
      completed: "bg-green-100 text-green-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Activities</h1>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus size={20} />
          Schedule Activity
        </Button>
      </div>

      {/* Date Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Calendar size={20} className="text-primary" />
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setFormData({ ...formData, scheduledDate: e.target.value });
            }}
            className="max-w-xs"
          />
        </div>
      </Card>

      {showForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">
            {editingId ? "Edit Activity" : "Schedule New Activity"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Activity Title *</label>
                <Input
                  placeholder="Enter activity title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Room *</label>
                <select
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                  required
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
                <label className="text-sm font-medium text-foreground">Start Time</label>
                <Input
                  placeholder="Select start time"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">End Time</label>
                <Input
                  placeholder="Select end time"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Assign Staff</label>
                <select
                  value={formData.staffId}
                  onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                  className="px-3 py-2 border border-border rounded-lg bg-background text-foreground w-full"
                >
                  <option value="">Select staff member (Optional)</option>
                  {staffList?.map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.firstName} {staff.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <textarea
                placeholder="Enter activity description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {editingId ? "Update" : "Schedule"} Activity
              </Button>
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </>
        ) : activitiesList && activitiesList.length > 0 ? (
          activitiesList.map((activity) => (
            <Card key={activity.id} className="p-6 card-elegant">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-foreground">{activity.title}</h3>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(activity.status)}`}>
                      {activity.status.replace("_", " ").toUpperCase()}
                    </span>
                  </div>

                  {activity.description && (
                    <p className="text-muted-foreground">{activity.description}</p>
                  )}

                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    {activity.startTime && (
                      <div>
                        <span className="font-semibold">Time:</span> {activity.startTime}
                        {activity.endTime && ` - ${activity.endTime}`}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditingId(activity.id);
                    setFormData({
                      title: activity.title,
                      description: activity.description || "",
                      roomId: activity.roomId.toString(),
                      scheduledDate: new Date(activity.scheduledDate).toISOString().split("T")[0],
                      startTime: activity.startTime || "",
                      endTime: activity.endTime || "",
                      staffId: activity.staffId?.toString() || "",
                    });
                    setShowForm(true);
                  }}
                  className="gap-1"
                >
                  <Edit2 size={16} />
                  Edit
                </Button>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No activities scheduled for this date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
