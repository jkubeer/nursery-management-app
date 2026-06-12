import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, FileText, CreditCard, AlertCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ParentDashboard() {
  const { user } = useAuth();
  const [parentId, setParentId] = useState<number | null>(null);

  // Get current parent's profile
  const { data: parentData, isLoading: parentLoading } = trpc.parent.me.useQuery();

  // Get parent's children
  const { data: children = [], isLoading: childrenLoading } = trpc.parent.children.useQuery();

  // Get parent's payments
  const { data: payments = [], isLoading: paymentsLoading } = trpc.parent.payments.useQuery();

  // Get parent's invoices
  const { data: invoices = [], isLoading: invoicesLoading } = trpc.parent.invoices.useQuery();

  useEffect(() => {
    if (parentData?.id) {
      setParentId(parentData.id);
    }
  }, [parentData]);

  if (parentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-foreground font-medium">Loading dashboard...</p>
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
              No Parent Profile Found
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Your account is not linked to a parent profile. Please contact the nursery administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate pending payments
  const pendingPayments = payments.filter((p) => p.status === "pending");
  const totalPending = pendingPayments.reduce((sum, p) => sum + parseFloat(p.amount.toString()), 0);

  // Calculate overdue invoices
  const today = new Date();
  const overdueInvoices = invoices.filter((inv) => {
    const dueDate = new Date(inv.dueDate);
    return dueDate < today && inv.status !== "paid" && inv.status !== "cancelled";
  });

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {parentData.firstName}!</h1>
        <p className="text-gray-600">
          Manage your children's information, view payments, and stay updated with the nursery.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Children */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Users className="text-blue-500" size={18} />
              My Children
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{children.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Registered children</p>
          </CardContent>
        </Card>

        {/* Pending Payments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CreditCard className="text-orange-500" size={18} />
              Pending Payments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{pendingPayments.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalPending > 0 ? `KD ${totalPending.toFixed(2)}` : "No pending"}
            </p>
          </CardContent>
        </Card>

        {/* Overdue Invoices */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <AlertCircle className="text-red-500" size={18} />
              Overdue Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{overdueInvoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Invoices past due date</p>
          </CardContent>
        </Card>

        {/* Total Invoices */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <FileText className="text-green-500" size={18} />
              Total Invoices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-800">{invoices.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All invoices</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Children</CardTitle>
            <CardDescription>View and manage your children's information</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/parent-children">View Children</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Payments & Invoices</CardTitle>
            <CardDescription>View payment history and make payments</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/parent-payments">View Payments</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from the nursery</CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      {payments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
            <CardDescription>Your latest payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {payments.slice(0, 5).map((payment) => (
                <div
                  key={payment.id}
                  className="flex items-center justify-between p-4 border border-border rounded-lg"
                >
                  <div>
                    <p className="font-medium">Payment #{payment.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg">KD {parseFloat(payment.amount.toString()).toFixed(2)}</p>
                    <p
                      className={`text-sm font-medium ${
                        payment.status === "completed"
                          ? "text-green-600"
                          : payment.status === "pending"
                            ? "text-orange-600"
                            : "text-red-600"
                      }`}
                    >
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
