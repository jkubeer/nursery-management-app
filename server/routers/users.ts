import { router, publicProcedure, protectedProcedure, adminProcedure } from "../_core/trpc";
import { z } from "zod";
import { getAllUsers, createUser, updateUser, deleteUser, getAllRoles, assignRoleToUser } from "../db.users";

export const usersRouter = router({
  list: protectedProcedure.query(async () => {
    try {
      return await getAllUsers();
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      try {
        const { getUserById } = await import("../db.users");
        return await getUserById(input.id);
      } catch (error) {
        console.error("Error fetching user:", error);
        return null;
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        openId: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        loginMethod: z.string().optional(),
        role: z.enum(["admin", "staff", "parent"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await createUser(input);
        return { success: true };
      } catch (error) {
        console.error("Error creating user:", error);
        throw new Error("Failed to create user");
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["admin", "staff", "parent"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...data } = input;
        await updateUser(id, data);
        return { success: true };
      } catch (error) {
        console.error("Error updating user:", error);
        throw new Error("Failed to update user");
      }
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      try {
        await deleteUser(input.id);
        return { success: true };
      } catch (error) {
        console.error("Error deleting user:", error);
        throw new Error("Failed to delete user");
      }
    }),

  getRoles: protectedProcedure.query(async () => {
    try {
      return await getAllRoles();
    } catch (error) {
      console.error("Error fetching roles:", error);
      return [];
    }
  }),

  assignRole: adminProcedure
    .input(
      z.object({
        userId: z.number(),
        roleId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        await assignRoleToUser(input.userId, input.roleId);
        return { success: true };
      } catch (error) {
        console.error("Error assigning role:", error);
        throw new Error("Failed to assign role");
      }
    }),
});
