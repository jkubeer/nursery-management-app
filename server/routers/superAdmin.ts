import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { nurseries, users } from "../../drizzle/schema";
import { eq, count, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcryptjs";

// Middleware to check super_admin role
const superAdminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "super_admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Only Super Admin can access this resource",
    });
  }
  return next({ ctx });
});

export const superAdminRouter = router({
  // Get dashboard stats for super admin
  stats: superAdminProcedure.query(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    const totalNurseries = await database.select({ count: count() }).from(nurseries);
    const activeNurseries = await database
      .select({ count: count() })
      .from(nurseries)
      .where(eq(nurseries.status, "active"));
    const totalUsers = await database.select({ count: count() }).from(users);

    return {
      totalNurseries: Number(totalNurseries[0]?.count) || 0,
      activeNurseries: Number(activeNurseries[0]?.count) || 0,
      totalUsers: Number(totalUsers[0]?.count) || 0,
    };
  }),

  // List all nurseries
  listNurseries: superAdminProcedure.query(async () => {
    const database = await getDb();
    if (!database) throw new Error("Database not available");

    const result = await database
      .select()
      .from(nurseries)
      .orderBy(desc(nurseries.createdAt));

    return result;
  }),

  // Get nursery by ID
  getNursery: superAdminProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const result = await database
        .select()
        .from(nurseries)
        .where(eq(nurseries.id, input.id));

      if (!result[0]) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Nursery not found" });
      }

      return result[0];
    }),

  // Create a new nursery with admin user
  createNursery: superAdminProcedure
    .input(
      z.object({
        name: z.string().min(2, "Nursery name is required"),
        contactName: z.string().min(2, "Contact name is required"),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        logo: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        adminEmail: z.string().email("Admin email is required"),
        adminName: z.string().min(2, "Admin name is required"),
        adminPassword: z.string().min(6, "Password must be at least 6 characters"),
      })
    )
    .mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      // Check if admin email already exists
      const existingUser = await database
        .select()
        .from(users)
        .where(eq(users.email, input.adminEmail));

      if (existingUser.length > 0) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "A user with this email already exists",
        });
      }

      // Create the admin user first
      const passwordHash = await bcrypt.hash(input.adminPassword, 10);
      const adminResult = await database.insert(users).values({
        email: input.adminEmail,
        name: input.adminName,
        passwordHash,
        loginMethod: "password",
        role: "admin",
      });

      const adminId = (adminResult as any)[0]?.insertId;

      // Create the nursery
      const nurseryResult = await database.insert(nurseries).values({
        name: input.name,
        contactName: input.contactName,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        logo: input.logo,
        address: input.address,
        city: input.city,
        country: input.country,
        latitude: input.latitude,
        longitude: input.longitude,
        adminId: adminId,
      });

      const nurseryId = (nurseryResult as any)[0]?.insertId;

      // Update the admin user with nurseryId
      if (adminId && nurseryId) {
        await database
          .update(users)
          .set({ nurseryId })
          .where(eq(users.id, adminId));
      }

      return { nurseryId, adminId };
    }),

  // Update nursery
  updateNursery: superAdminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        contactName: z.string().optional(),
        contactEmail: z.string().email().optional(),
        contactPhone: z.string().optional(),
        logo: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        country: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        status: z.enum(["active", "inactive", "suspended"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      const { id, ...updateData } = input;
      await database.update(nurseries).set(updateData).where(eq(nurseries.id, id));

      const result = await database
        .select()
        .from(nurseries)
        .where(eq(nurseries.id, id));

      return result[0];
    }),

  // Delete nursery (soft delete by setting status to inactive)
  deleteNursery: superAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database
        .update(nurseries)
        .set({ status: "suspended" })
        .where(eq(nurseries.id, input.id));

      return { success: true };
    }),
});
