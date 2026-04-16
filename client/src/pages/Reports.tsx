import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Calendar, Download, TrendingUp, DollarSign, Users, Activity } from "lucide-react";
import { format } from "date-fns";

export default function Reports() {
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  // Queries
  const { data: attendanceData } = trpc.reports.attendance.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const { data: financialData } = trpc.reports.financial.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const { data: activityData } = trpc.reports.activityParticipation.useQuery({
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  });

  const { data: revenueTrends } = trpc.reports.revenueTrends.useQuery({
    months: 6,
  });

  const { data: outstandingInvoices } = trpc.reports.outstandingInvoices.useQuery();

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleExportPDF = () => {
    // TODO: Implement PDF export
    console.log("Exporting to PDF...");
  };

  const handleExportExcel = () => {
    // TODO: Implement Excel export
    console.log("Exporting to Excel...");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-2">View detailed insights about your nursery operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportPDF}>
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel}>
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Date Range Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Select Date Range</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-4">
          <div className="flex-1">
            <label className="text-sm font-medium">Start Date</label>
            <input
              type="date"
              value={format(startDate, "yyyy-MM-dd")}
              onChange={(e) => setStartDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg mt-1"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium">End Date</label>
            <input
              type="date"
              value={format(endDate, "yyyy-MM-dd")}
              onChange={(e) => setEndDate(new Date(e.target.value))}
              className="w-full px-3 py-2 border border-border rounded-lg mt-1"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="financial" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
        </TabsList>

        {/* Financial Report */}
        <TabsContent value="financial" className="space-y-6">
          {financialData && (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Invoiced</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">${financialData.invoices.total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">{financialData.invoices.count} invoices</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">${financialData.payments.total.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">{financialData.payments.count} payments</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">${financialData.outstanding.toFixed(2)}</div>
                    <p className="text-xs text-muted-foreground mt-1">Pending payment</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Collection Rate</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{financialData.collectionRate.toFixed(1)}%</div>
                    <p className="text-xs text-muted-foreground mt-1">Of invoiced amount</p>
                  </CardContent>
                </Card>
              </div>

              {/* Outstanding Invoices */}
              {outstandingInvoices && outstandingInvoices.count > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Outstanding Invoices</CardTitle>
                    <CardDescription>{outstandingInvoices.count} invoices pending payment</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {outstandingInvoices.invoices.slice(0, 5).map((invoice) => (
                        <div key={invoice.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <div>
                            <p className="font-medium">{invoice.invoiceNumber}</p>
                            <p className="text-sm text-muted-foreground">Due: {format(new Date(invoice.dueDate), "MMM dd, yyyy")}</p>
                          </div>
                          <p className="font-semibold">${invoice.totalAmount}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Attendance Report */}
        <TabsContent value="attendance" className="space-y-6">
          {attendanceData && attendanceData.length > 0 ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Average Attendance Rate</p>
                      <p className="text-2xl font-bold mt-2">
                        {(
                          attendanceData.reduce((sum, d) => sum + d.attendanceRate, 0) /
                          attendanceData.length
                        ).toFixed(1)}
                        %
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Present Days</p>
                      <p className="text-2xl font-bold mt-2 text-green-600">
                        {attendanceData.reduce((sum, d) => sum + d.presentDays, 0)}
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm text-muted-foreground">Total Absent Days</p>
                      <p className="text-2xl font-bold mt-2 text-red-600">
                        {attendanceData.reduce((sum, d) => sum + d.absentDays, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Attendance by Child</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {attendanceData.map((child) => (
                      <div key={child.childId} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">Child #{child.childId}</p>
                          <div className="w-full bg-background rounded-full h-2 mt-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{ width: `${child.attendanceRate}%` }}
                            />
                          </div>
                        </div>
                        <p className="font-semibold ml-4">{child.attendanceRate.toFixed(1)}%</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No attendance data available for the selected period</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Activities Report */}
        <TabsContent value="activities" className="space-y-6">
          {activityData && activityData.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Activity Participation</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="activityId" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="presentParticipants" fill="#10b981" name="Present" />
                    <Bar dataKey="totalParticipants" fill="#3b82f6" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No activity data available for the selected period</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Trends */}
        <TabsContent value="trends" className="space-y-6">
          {revenueTrends && revenueTrends.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends (Last 6 Months)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={revenueTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => `$${Number(value).toFixed(2)}`} />
                    <Legend />
                    <Line type="monotone" dataKey="amount" stroke="#3b82f6" name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center py-12">
                <p className="text-muted-foreground">No trend data available</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
