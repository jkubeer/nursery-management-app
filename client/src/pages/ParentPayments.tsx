import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, AlertCircle, CreditCard, FileText, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ParentPayments() {
  const { user } = useAuth();
  const [parentId, setParentId] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("stripe");
  const [paymentAmount, setPaymentAmount] = useState<string>("");
  const [selectedInvoice, setSelectedInvoice] = useState<number | null>(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  // Get parent info by user ID
  const { data: parentData, isLoading: parentLoading } = trpc.parents.getByUserId.useQuery(
    { userId: user?.id || 0 },
    { enabled: !!user?.id }
  );

  // Get parent's payments
  const { data: payments = [], isLoading: paymentsLoading, refetch: refetchPayments } = trpc.payments.byParent.useQuery(
    { parentId: parentId || 0 },
    { enabled: !!parentId }
  );

  // Get parent's invoices
  const { data: invoices = [], isLoading: invoicesLoading, refetch: refetchInvoices } = trpc.invoices.byParent.useQuery(
    { parentId: parentId || 0 },
    { enabled: !!parentId }
  );

  // Create payment mutation
  const createPaymentMutation = trpc.payments.create.useMutation({
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      setPaymentAmount("");
      setSelectedInvoice(null);
      setIsPaymentDialogOpen(false);
      refetchPayments();
      refetchInvoices();
    },
    onError: (error) => {
      toast.error(error.message || "Failed to record payment");
    },
  });

  useEffect(() => {
    if (parentData?.id) {
      setParentId(parentData.id);
    }
  }, [parentData]);

  const isLoading = parentLoading || paymentsLoading || invoicesLoading;

  const handleMakePayment = async () => {
    if (!parentId || !paymentAmount || !selectedInvoice) {
      toast.error("Please fill in all fields");
      return;
    }

    await createPaymentMutation.mutateAsync({
      parentId,
      childId: invoices.find((inv) => inv.id === selectedInvoice)?.childId || 0,
      feeId: undefined,
      amount: paymentAmount,
      paymentMethod: selectedPaymentMethod as "stripe" | "bank_transfer" | "cash" | "check",
      notes: `Payment for invoice #${selectedInvoice}`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-foreground font-medium">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (!parentData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle size={24} />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Unable to load parent information. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate totals
  const totalPaid = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const totalPending = payments
    .filter((p) => p.status === "pending")
    .reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  const totalInvoiced = invoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount.toString()), 0);

  const today = new Date();
  const overdueInvoices = invoices.filter((inv) => {
    const dueDate = new Date(inv.dueDate);
    return dueDate < today && inv.status !== "paid" && inv.status !== "cancelled";
  });

  const statusColor = (status: string) => {
    switch (status) {
      case "completed":
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      case "failed":
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Payments & Invoices</h1>
        <p className="text-gray-600">Manage your payments and view invoices</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="text-green-500" size={18} />
              Total Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">KD {totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="text-orange-500" size={18} />
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">KD {totalPending.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="text-blue-500" size={18} />
              Total Invoiced
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">KD {totalInvoiced.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">All invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="text-red-500" size={18} />
              Overdue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{overdueInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Past due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Payments and Invoices */}
      <Tabs defaultValue="invoices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="invoices">Invoices ({invoices.length})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments.length})</TabsTrigger>
        </TabsList>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          {invoices.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                <FileText size={48} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">No Invoices</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {invoices.map((invoice) => {
                const dueDate = new Date(invoice.dueDate);
                const isOverdue = dueDate < today && invoice.status !== "paid" && invoice.status !== "cancelled";

                return (
                  <Card key={invoice.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <p className="font-bold text-lg">{invoice.invoiceNumber}</p>
                            <Badge className={statusColor(isOverdue ? "overdue" : invoice.status)}>
                              {isOverdue ? "Overdue" : invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            Issued: {new Date(invoice.issueDate).toLocaleDateString()} • Due:{" "}
                            {dueDate.toLocaleDateString()}
                          </p>
                          {invoice.notes && (
                            <p className="text-sm text-gray-700 mb-3 p-2 bg-gray-50 rounded">
                              {invoice.notes}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-3xl font-bold text-gray-800">
                            KD {parseFloat(invoice.totalAmount.toString()).toFixed(2)}
                          </p>
                          {invoice.status !== "paid" && invoice.status !== "cancelled" && (
                            <Dialog open={isPaymentDialogOpen && selectedInvoice === invoice.id} onOpenChange={setIsPaymentDialogOpen}>
                              <DialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="mt-3"
                                  onClick={() => {
                                    setSelectedInvoice(invoice.id);
                                    setPaymentAmount(invoice.totalAmount.toString());
                                  }}
                                >
                                  Pay Now
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Make Payment</DialogTitle>
                                  <DialogDescription>
                                    Invoice {invoice.invoiceNumber} - KD{" "}
                                    {parseFloat(invoice.totalAmount.toString()).toFixed(2)}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div>
                                    <Label htmlFor="amount">Amount (KD)</Label>
                                    <Input
                                      id="amount"
                                      type="number"
                                      step="0.01"
                                      value={paymentAmount}
                                      onChange={(e) => setPaymentAmount(e.target.value)}
                                      placeholder="0.00"
                                    />
                                  </div>
                                  <div>
                                    <Label htmlFor="method">Payment Method</Label>
                                    <select
                                      id="method"
                                      value={selectedPaymentMethod}
                                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                                      className="w-full px-3 py-2 border border-border rounded-md"
                                    >
                                      <option value="stripe">Credit Card (Stripe)</option>
                                      <option value="bank_transfer">Bank Transfer</option>
                                      <option value="cash">Cash</option>
                                      <option value="check">Check</option>
                                    </select>
                                  </div>
                                  <Button
                                    onClick={handleMakePayment}
                                    disabled={createPaymentMutation.isPending}
                                    className="w-full"
                                  >
                                    {createPaymentMutation.isPending ? "Processing..." : "Confirm Payment"}
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>

        {/* Payments Tab */}
        <TabsContent value="payments" className="space-y-4">
          {payments.length === 0 ? (
            <Card>
              <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center">
                <CreditCard size={48} className="text-gray-300 mb-4" />
                <p className="text-lg font-medium text-gray-600">No Payments</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <Card key={payment.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold">Payment #{payment.id}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(payment.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        {payment.notes && (
                          <p className="text-sm text-gray-700 mt-2">{payment.notes}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-800">
                          KD {parseFloat(payment.amount.toString()).toFixed(2)}
                        </p>
                        <Badge className={statusColor(payment.status)}>
                          {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                        </Badge>
                        <p className="text-xs text-gray-600 mt-2">
                          Method: {payment.paymentMethod.replace("_", " ").toUpperCase()}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
