import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useState } from "react";
import { Clock, LogIn, LogOut } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function CheckInOut() {
  const { data: childrenList, isLoading: childrenLoading } = trpc.children.list.useQuery();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  const checkInMutation = trpc.checkInOut.checkIn.useMutation();
  const checkOutMutation = trpc.checkInOut.checkOut.useMutation();

  const handleCheckIn = async (childId: number) => {
    try {
      await checkInMutation.mutateAsync({
        childId,
        date: selectedDate,
      });
      toast.success("Child checked in successfully");
    } catch (error) {
      toast.error("Failed to check in child");
    }
  };

  const handleCheckOut = async (childId: number) => {
    try {
      await checkOutMutation.mutateAsync({
        childId,
        date: selectedDate,
      });
      toast.success("Child checked out successfully");
    } catch (error) {
      toast.error("Failed to check out child");
    }
  };

  const formatTime = (date: Date | null | undefined) => {
    if (!date) return "—";
    const d = new Date(date);
    return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Check-in / Check-out</h1>
      </div>

      {/* Date Selector */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Clock size={20} className="text-primary" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground max-w-xs"
          />
          <span className="text-sm text-muted-foreground">
            {new Date(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </Card>

      {/* Children List */}
      <div className="space-y-3">
        {childrenLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : childrenList && childrenList.length > 0 ? (
          childrenList.map((child) => {
            // Get today's check-in/out record
            const [todayRecord, setTodayRecord] = useState<any>(null);

            // Fetch today's record
            const { data: record } = trpc.checkInOut.today.useQuery({
              childId: child.id,
              date: selectedDate,
            });

            return (
              <Card key={child.id} className="p-6 card-elegant">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-foreground">
                      {child.firstName} {child.lastName}
                    </h3>
                    <div className="mt-3 space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Check-in:</span>
                        <span className="font-semibold text-foreground">
                          {formatTime(record?.checkInTime)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Check-out:</span>
                        <span className="font-semibold text-foreground">
                          {formatTime(record?.checkOutTime)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleCheckIn(child.id)}
                      disabled={checkInMutation.isPending || !!record?.checkInTime}
                      className="gap-2"
                    >
                      <LogIn size={16} />
                      Check In
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleCheckOut(child.id)}
                      disabled={checkOutMutation.isPending || !record?.checkInTime || !!record?.checkOutTime}
                      className="gap-2"
                    >
                      <LogOut size={16} />
                      Check Out
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No children registered yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
