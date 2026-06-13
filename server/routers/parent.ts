import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { parents, children, payments, invoices } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";

/**
 * Parent-specific router with strict ownership checks
 * All procedures verify that the parent belongs to the current user
 */
export const parentRouter = router({
  // Get current parent's profile
  me: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.userType !== "parent") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only parent users can access this endpoint",
      });
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const parentRecord = await db
      .select()
      .from(parents)
      .where(eq(parents.userId, ctx.user.id))
      .limit(1);

    if (parentRecord.length === 0) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Parent profile not found",
      });
    }

    return parentRecord[0];
  }),

  // Get current parent's children only
  children: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.userType !== "parent") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only parent users can access this endpoint",
      });
    }

    const db = await getDb();
    if (!db) return [];

    // Get parent record for this user
    const parentRecord = await db
      .select()
      .from(parents)
      .where(eq(parents.userId, ctx.user.id))
      .limit(1);

    if (parentRecord.length === 0) {
      return [];
    }

    const parentId = parentRecord[0].id;

    // Get all children for this parent
    return await db
      .select()
      .from(children)
      .where(eq(children.parentId, parentId));
  }),

  // Get current parent's payments only
  payments: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.userType !== "parent") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only parent users can access this endpoint",
      });
    }

    const db = await getDb();
    if (!db) return [];

    // Get parent record for this user
    const parentRecord = await db
      .select()
      .from(parents)
      .where(eq(parents.userId, ctx.user.id))
      .limit(1);

    if (parentRecord.length === 0) {
      return [];
    }

    const parentId = parentRecord[0].id;

    // Get all payments for this parent
    return await db
      .select()
      .from(payments)
      .where(eq(payments.parentId, parentId))
      .orderBy(payments.createdAt);
  }),

  // Get current parent's invoices only
  invoices: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.user?.userType !== "parent") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "Only parent users can access this endpoint",
      });
    }

    const db = await getDb();
    if (!db) return [];

    // Get parent record for this user
    const parentRecord = await db
      .select()
      .from(parents)
      .where(eq(parents.userId, ctx.user.id))
      .limit(1);

    if (parentRecord.length === 0) {
      return [];
    }

    const parentId = parentRecord[0].id;

    // Get all invoices for this parent
    return await db
      .select()
      .from(invoices)
      .where(eq(invoices.parentId, parentId))
      .orderBy(invoices.issueDate);
  }),

  // Record a payment for one of parent's invoices
  recordPayment: protectedProcedure
    .input(
      z.object({
        invoiceId: z.number(),
        childId: z.number(),
        amount: z.string(),
        paymentMethod: z.enum(["stripe", "bank_transfer", "cash", "check"]),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.user?.userType !== "parent") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only parent users can access this endpoint",
        });
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Get parent record for this user
      const parentRecord = await db
        .select()
        .from(parents)
        .where(eq(parents.userId, ctx.user.id))
        .limit(1);

      if (parentRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent profile not found",
        });
      }

      const parentId = parentRecord[0].id;

      // Verify invoice belongs to this parent
      const invoiceRecord = await db
        .select()
        .from(invoices)
        .where(
          and(
            eq(invoices.id, input.invoiceId),
            eq(invoices.parentId, parentId)
          )
        )
        .limit(1);

      if (invoiceRecord.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to pay this invoice",
        });
      }

      // Verify child belongs to this parent
      const childRecord = await db
        .select()
        .from(children)
        .where(
          and(
            eq(children.id, input.childId),
            eq(children.parentId, parentId)
          )
        )
        .limit(1);

      if (childRecord.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to make payments for this child",
        });
      }

      // Record the payment
      const payment = await db.insert(payments).values({
        parentId,
        childId: input.childId,
        feeId: undefined,
        amount: input.amount as any,
        paymentMethod: input.paymentMethod,
        status: "pending",
        notes: input.notes || `Payment for invoice #${input.invoiceId}`,
      });

      return payment;
    }),

  // Get a specific child's details (verify ownership)
  getChild: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user?.userType !== "parent") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only parent users can access this endpoint",
        });
      }

      const db = await getDb();
      if (!db) return null;

      // Get parent record for this user
      const parentRecord = await db
        .select()
        .from(parents)
        .where(eq(parents.userId, ctx.user.id))
        .limit(1);

      if (parentRecord.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Parent profile not found",
        });
      }

      const parentId = parentRecord[0].id;

      // Get child and verify it belongs to this parent
      const childRecord = await db
        .select()
        .from(children)
        .where(
          and(
            eq(children.id, input.childId),
            eq(children.parentId, parentId)
          )
        )
        .limit(1);

      if (childRecord.length === 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You do not have permission to view this child",
        });
      }

      return childRecord[0];
    }),
});
