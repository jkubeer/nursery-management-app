import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Plus, DollarSign, CheckCircle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";

export default function Payments() {
  const { data: parentsList } = trpc.parents.list.useQuery();
  const { data: childrenList } = trpc.children.list.useQuery();
  const [selectedParentId, setSelectedParentId] = useState<number | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const { data: paymentsList, isLoading: paymentsLoading, refetch: refetchPayments } = trpc.payments.byParent.useQuery(
    { parentId: selectedParentId || 0 },
    { enabled: !!selectedParentId }
  );

  const createPaymentMutation = trpc.payments.create.useMutation();
  const createInvoiceMutation = trpc.invoices.create.useMutation();
  const createFeeMutation = trpc.fees.create.useMutation();

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: "",
    paymentMethod: "stripe" as const,
    notes: "",
  });

  const [showFeeForm, setShowFeeForm] = useState(false);
  const [feeData, setFeeData] = useState({
    feeType: "tuition" as const,
    amount: "",
    frequency: "monthly" as const,
    description: "",
  });

  const handleCreatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParentId || !selectedChildId) {
      toast.error("Please select parent and child");
      return;
    }

    try {
      await createPaymentMutation.mutateAsync({
        parentId: selectedParentId,
        childId: selectedChildId,
        amount: paymentData.amount,
        paymentMethod: paymentData.paymentMethod,
        notes: paymentData.notes,
      });
      toast.success("Payment recorded successfully");
      setPaymentData({ amount: "", paymentMethod: "stripe", notes: "" });
      setShowPaymentForm(false);
      refetchPayments();
    } catch (error) {
      toast.error("Failed to record payment");
    }
  };

  const handleCreateFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChildId) {
      toast.error("Please select a child");
      return;
    }

    try {
      await createFeeMutation.mutateAsync({
        childId: selectedChildId,
        feeType: feeData.feeType,
        amount: feeData.amount,
        frequency: feeData.frequency,
        description: feeData.description,
      });
      toast.success("Fee created successfully");
      setFeeData({ feeType: "tuition", amount: "", frequency: "monthly", description: "" });
      setShowFeeForm(false);
    } catch (error) {
      toast.error("Failed to create fee");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      failed: "bg-red-100 text-red-800",
      refunded: "bg-blue-100 text-blue-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getStatusIcon = (status: string) => {
    if (status === "completed") return <CheckCircle size={16} />;
    return <AlertCircle size={16} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Payment Management</h1>
        <div className="flex gap-2">
          <Button onClick={() => setShowFeeForm(!showFeeForm)} variant="outline" className="gap-2">
            <Plus size={20} />
            Create Fee
          </Button>
          <Button onClick={() => setShowPaymentForm(!showPaymentForm)} className="gap-2">
            <Plus size={20} />
            Record Payment
          </Button>
        </div>
      </div>

      {/* Parent and Child Selection */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedParentId || ""}
            onChange={(e) => setSelectedParentId(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="">Select Parent</option>
            {parentsList?.map((parent) => (
              <option key={parent.id} value={parent.id}>
                {parent.firstName} {parent.lastName}
              </option>
            ))}
          </select>
          <select
            value={selectedChildId || ""}
            onChange={(e) => setSelectedChildId(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
          >
            <option value="">Select Child</option>
            {childrenList?.map((child) => (
              <option key={child.id} value={child.id}>
                {child.firstName} {child.lastName}
              </option>
            ))}
          </select>
        </div>
      </Card>

      {/* Fee Form */}
      {showFeeForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Create Fee</h2>
          <form onSubmit={handleCreateFee} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select
                value={feeData.feeType}
                onChange={(e) => setFeeData({ ...feeData, feeType: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="tuition">Tuition</option>
                <option value="registration">Registration</option>
                <option value="activity">Activity</option>
                <option value="other">Other</option>
              </select>
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={feeData.amount}
                onChange={(e) => setFeeData({ ...feeData, amount: e.target.value })}
                required
              />
              <select
                value={feeData.frequency}
                onChange={(e) => setFeeData({ ...feeData, frequency: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="one_time">One Time</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <Input
                placeholder="Description"
                value={feeData.description}
                onChange={(e) => setFeeData({ ...feeData, description: e.target.value })}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={createFeeMutation.isPending}>
                Create Fee
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowFeeForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Payment Form */}
      {showPaymentForm && (
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 text-foreground">Record Payment</h2>
          <form onSubmit={handleCreatePayment} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Amount"
                type="number"
                step="0.01"
                value={paymentData.amount}
                onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
                required
              />
              <select
                value={paymentData.paymentMethod}
                onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value as any })}
                className="px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              >
                <option value="stripe">Stripe</option>
                <option value="bank_transfer">Bank Transfer</option>
                <option value="cash">Cash</option>
                <option value="check">Check</option>
              </select>
            </div>
            <textarea
              placeholder="Notes"
              value={paymentData.notes}
              onChange={(e) => setPaymentData({ ...paymentData, notes: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              rows={2}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={createPaymentMutation.isPending}>
                Record Payment
              </Button>
              <Button type="button" variant="outline" onClick={() => setShowPaymentForm(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Payments List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-foreground">Payment History</h2>
        {!selectedParentId ? (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">Select a parent to view payment history</p>
          </Card>
        ) : paymentsLoading ? (
          <>
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </>
        ) : paymentsList && paymentsList.length > 0 ? (
          paymentsList.map((payment) => (
            <Card key={payment.id} className="p-6 card-elegant">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <DollarSign size={20} className="text-primary" />
                    <span className="text-lg font-bold text-foreground">
                      ${parseFloat(payment.amount.toString()).toFixed(2)}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      {payment.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Method: {payment.paymentMethod.replace("_", " ").toUpperCase()}</p>
                    {payment.paymentDate && (
                      <p>
                        Date:{" "}
                        {new Date(payment.paymentDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <Card className="p-6 text-center">
            <p className="text-muted-foreground">No payments recorded yet</p>
          </Card>
        )}
      </div>
    </div>
  );
}
