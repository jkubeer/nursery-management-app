import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db.reports";

export const reportsRouter = router({
  /**
   * Get attendance report for a date range
   */
  attendance: protectedProcedure
    .input(
      z.object({
        startDate: z.string().transform((s) => new Date(s)),
        endDate: z.string().transform((s) => new Date(s)),
      })
    )
    .query(async ({ input }) => {
      return await db.getAttendanceReport(input.startDate, input.endDate);
    }),

  /**
   * Get financial report for a date range
   */
  financial: protectedProcedure
    .input(
      z.object({
        startDate: z.string().transform((s) => new Date(s)),
        endDate: z.string().transform((s) => new Date(s)),
      })
    )
    .query(async ({ input }) => {
      return await db.getFinancialReport(input.startDate, input.endDate);
    }),

  /**
   * Get activity participation report
   */
  activityParticipation: protectedProcedure
    .input(
      z.object({
        startDate: z.string().transform((s) => new Date(s)),
        endDate: z.string().transform((s) => new Date(s)),
      })
    )
    .query(async ({ input }) => {
      return await db.getActivityParticipationReport(input.startDate, input.endDate);
    }),

  /**
   * Get daily attendance summary
   */
  dailyAttendance: protectedProcedure
    .input(z.object({ date: z.string().transform((s) => new Date(s)) }))
    .query(async ({ input }) => {
      return await db.getDailyAttendanceSummary(input.date);
    }),

  /**
   * Get monthly financial summary
   */
  monthlyFinancial: protectedProcedure
    .input(z.object({ year: z.number(), month: z.number().min(1).max(12) }))
    .query(async ({ input }) => {
      return await db.getMonthlyFinancialSummary(input.year, input.month);
    }),

  /**
   * Get child attendance history
   */
  childAttendanceHistory: protectedProcedure
    .input(
      z.object({
        childId: z.number(),
        months: z.number().default(3),
      })
    )
    .query(async ({ input }) => {
      return await db.getChildAttendanceHistory(input.childId, input.months);
    }),

  /**
   * Get revenue trends
   */
  revenueTrends: protectedProcedure
    .input(z.object({ months: z.number().default(6) }))
    .query(async ({ input }) => {
      return await db.getRevenueTrends(input.months);
    }),

  /**
   * Get outstanding invoices report
   */
  outstandingInvoices: protectedProcedure.query(async () => {
    return await db.getOutstandingInvoicesReport();
  }),
});
