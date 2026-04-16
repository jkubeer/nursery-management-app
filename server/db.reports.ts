import { getDb } from "./db";
import { children, checkInOut, invoices, payments, activityAttendance, activities } from "../drizzle/schema";
import { eq, and, gte, lte, desc, sql } from "drizzle-orm";

/**
 * Get attendance report for a date range
 */
export async function getAttendanceReport(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const records = await db
    .select()
    .from(checkInOut)
    .where(
      and(
        gte(checkInOut.checkInTime, startDate),
        lte(checkInOut.checkInTime, endDate)
      )
    )
    .orderBy(desc(checkInOut.checkInTime));

  // Group by child and calculate statistics
  const stats: Record<
    number,
    {
      childId: number;
      totalDays: number;
      presentDays: number;
      absentDays: number;
      attendanceRate: number;
    }
  > = {};

  records.forEach((record) => {
    if (!stats[record.childId]) {
      stats[record.childId] = {
        childId: record.childId,
        totalDays: 0,
        presentDays: 0,
        absentDays: 0,
        attendanceRate: 0,
      };
    }

    stats[record.childId].totalDays++;
    if (record.checkInTime) {
      stats[record.childId].presentDays++;
    } else {
      stats[record.childId].absentDays++;
    }
  });

  // Calculate attendance rates
  Object.values(stats).forEach((stat) => {
    stat.attendanceRate =
      stat.totalDays > 0 ? (stat.presentDays / stat.totalDays) * 100 : 0;
  });

  return Object.values(stats);
}

/**
 * Get financial report for a date range
 */
export async function getFinancialReport(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const invoiceRecords = await db
    .select()
    .from(invoices)
    .where(
      and(
        gte(invoices.issueDate, startDate),
        lte(invoices.issueDate, endDate)
      )
    );

  const paymentRecords = await db
    .select()
    .from(payments)
    .where(
      and(
        gte(payments.paymentDate, startDate),
        lte(payments.paymentDate, endDate)
      )
    );

  const totalInvoiced = invoiceRecords.reduce((sum, inv) => sum + Number(inv.totalAmount || 0), 0);
  const totalPaid = paymentRecords.reduce((sum, pay) => sum + Number(pay.amount || 0), 0);
  const outstanding = Math.max(0, totalInvoiced - totalPaid);

  return {
    period: {
      startDate,
      endDate,
    },
    invoices: {
      count: invoiceRecords.length,
      total: totalInvoiced,
    },
    payments: {
      count: paymentRecords.length,
      total: totalPaid,
    },
    outstanding,
    collectionRate: totalInvoiced > 0 ? (totalPaid / totalInvoiced) * 100 : 0,
  };
}

/**
 * Get activity participation report
 */
export async function getActivityParticipationReport(startDate: Date, endDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const records = await db
    .select()
    .from(activityAttendance)
    .where(
      and(
        gte(activityAttendance.createdAt, startDate),
        lte(activityAttendance.createdAt, endDate)
      )
    );

  // Group by activity
  const activityStats: Record<
    number,
    {
      activityId: number;
      totalParticipants: number;
      presentParticipants: number;
      participationRate: number;
    }
  > = {};

  records.forEach((record) => {
    if (!activityStats[record.activityId]) {
      activityStats[record.activityId] = {
        activityId: record.activityId,
        totalParticipants: 0,
        presentParticipants: 0,
        participationRate: 0,
      };
    }

    activityStats[record.activityId].totalParticipants++;
    if (record.attended) {
      activityStats[record.activityId].presentParticipants++;
    }
  });

  // Calculate participation rates
  Object.values(activityStats).forEach((stat) => {
    stat.participationRate =
      stat.totalParticipants > 0
        ? (stat.presentParticipants / stat.totalParticipants) * 100
        : 0;
  });

  return Object.values(activityStats);
}

/**
 * Get daily attendance summary
 */
export async function getDailyAttendanceSummary(date: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const records = await db
    .select()
    .from(checkInOut)
    .where(
      and(
        gte(checkInOut.checkInTime, startOfDay),
        lte(checkInOut.checkInTime, endOfDay)
      )
    );

  const presentCount = records.filter((r) => r.checkInTime).length;
  const absentCount = records.filter((r) => !r.checkInTime).length;

  return {
    date,
    present: presentCount,
    absent: absentCount,
    total: records.length,
    attendanceRate: records.length > 0 ? (presentCount / records.length) * 100 : 0,
  };
}

/**
 * Get monthly financial summary
 */
export async function getMonthlyFinancialSummary(year: number, month: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const startDate = new Date(year, month - 1, 1);
  const endDate = new Date(year, month, 0);

  return await getFinancialReport(startDate, endDate);
}

/**
 * Get child attendance history
 */
export async function getChildAttendanceHistory(childId: number, months: number = 3) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const records = await db
    .select()
    .from(checkInOut)
    .where(
      and(
        eq(checkInOut.childId, childId),
        gte(checkInOut.checkInTime, startDate),
        lte(checkInOut.checkInTime, endDate)
      )
    )
    .orderBy(desc(checkInOut.checkInTime));

  // Group by month
  const monthlyStats: Record<
    string,
    {
      month: string;
      presentDays: number;
      absentDays: number;
      totalDays: number;
      attendanceRate: number;
    }
  > = {};

  records.forEach((record) => {
    const checkInDate = record.checkInTime || new Date();
    const monthKey = new Date(checkInDate).toISOString().slice(0, 7);

    if (!monthlyStats[monthKey]) {
      monthlyStats[monthKey] = {
        month: monthKey,
        presentDays: 0,
        absentDays: 0,
        totalDays: 0,
        attendanceRate: 0,
      };
    }

    monthlyStats[monthKey].totalDays++;
    if (record.checkInTime) {
      monthlyStats[monthKey].presentDays++;
    } else {
      monthlyStats[monthKey].absentDays++;
    }
  });

  // Calculate rates
  Object.values(monthlyStats).forEach((stat) => {
    stat.attendanceRate =
      stat.totalDays > 0 ? (stat.presentDays / stat.totalDays) * 100 : 0;
  });

  return Object.values(monthlyStats).sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Get revenue trends
 */
export async function getRevenueTrends(months: number = 6) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  const paymentRecords = await db
    .select()
    .from(payments)
    .where(
      and(
        gte(payments.paymentDate, startDate),
        lte(payments.paymentDate, endDate)
      )
    );

  // Group by month
  const monthlyRevenue: Record<string, number> = {};

  paymentRecords.forEach((payment) => {
    const paymentDate = payment.paymentDate || new Date();
    const monthKey = new Date(paymentDate).toISOString().slice(0, 7);
    monthlyRevenue[monthKey] = (monthlyRevenue[monthKey] || 0) + Number(payment.amount || 0);
  });

  return Object.entries(monthlyRevenue)
    .map(([month, amount]) => ({ month, amount: Number(amount) }))
    .sort((a, b) => a.month.localeCompare(b.month));
}

/**
 * Get outstanding invoices report
 */
export async function getOutstandingInvoicesReport() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const invoiceRecords = await db
    .select()
    .from(invoices)
    .where(sql`${invoices.status} = 'pending'`);

  const totalOutstanding = invoiceRecords.reduce(
    (sum, inv) => sum + Number(inv.totalAmount || 0),
    0
  );

  return {
    count: invoiceRecords.length,
    totalAmount: totalOutstanding,
    invoices: invoiceRecords,
  };
}
