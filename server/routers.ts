import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { getDb } from "./db";
import {
  staff,
  children,
  parents,
  rooms,
  activities,
  fees,
  payments,
  invoices,
  parentChildRelationships,
  staffSchedules,
  activityAttendance,
  dailyReports,
  checkInOut,
  photos,
  recurringBillings,
  emailNotifications,
} from "../drizzle/schema";
import * as db from "./db";
import { eq, and, desc } from "drizzle-orm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Dashboard
  dashboard: router({
    stats: protectedProcedure.query(async () => {
      return await db.getDashboardStats();
    }),
  }),

  // Staff Management
  staff: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllStaff();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getStaffById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          staffRole: z.enum(["director", "teacher", "assistant", "nurse", "admin"]),
          qualifications: z.string().optional(),
          emergencyContact: z.string().optional(),
          emergencyPhone: z.string().optional(),
          hireDate: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const result = await database.insert(staff).values({
          userId: ctx.user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          staffRole: input.staffRole,
          qualifications: input.qualifications,
          emergencyContact: input.emergencyContact,
          emergencyPhone: input.emergencyPhone,
          hireDate: input.hireDate ? new Date(input.hireDate) : undefined,
        });

        return result;
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          staffRole: z.enum(["director", "teacher", "assistant", "nurse", "admin"]).optional(),
          qualifications: z.string().optional(),
          emergencyContact: z.string().optional(),
          emergencyPhone: z.string().optional(),
          status: z.enum(["active", "inactive", "on_leave"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await database.update(staff).set(updateData).where(eq(staff.id, id));

        return await db.getStaffById(id);
      }),

    delete: protectedProcedure.input(z.object({ id: z.number() })).mutation(async ({ input }) => {
      const database = await getDb();
      if (!database) throw new Error("Database not available");

      await database.delete(staff).where(eq(staff.id, input.id));
      return { success: true };
    }),

    schedules: protectedProcedure.input(z.object({ staffId: z.number() })).query(async ({ input }) => {
      return await db.getStaffSchedules(input.staffId);
    }),

    addSchedule: protectedProcedure
      .input(
        z.object({
          staffId: z.number(),
          dayOfWeek: z.enum(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]),
          startTime: z.string(),
          endTime: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(staffSchedules).values({
          staffId: input.staffId,
          dayOfWeek: input.dayOfWeek,
          startTime: input.startTime as any,
          endTime: input.endTime as any,
        });
      }),
  }),

  // Children Management
  children: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllChildren();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getChildrenById(input.id);
    }),

    byRoom: protectedProcedure.input(z.object({ roomId: z.number() })).query(async ({ input }) => {
      return await db.getChildrenByRoom(input.roomId);
    }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          dateOfBirth: z.string(),
          gender: z.enum(["male", "female", "other"]).optional(),
          enrollmentDate: z.string(),
          roomId: z.number().optional(),
          allergies: z.string().optional(),
          medicalConditions: z.string().optional(),
          medications: z.string().optional(),
          dietaryRestrictions: z.string().optional(),
          emergencyContact1: z.string().optional(),
          emergencyPhone1: z.string().optional(),
          emergencyContact2: z.string().optional(),
          emergencyPhone2: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(children).values({
          firstName: input.firstName,
          lastName: input.lastName,
          dateOfBirth: new Date(input.dateOfBirth),
          gender: input.gender,
          enrollmentDate: new Date(input.enrollmentDate),
          roomId: input.roomId,
          allergies: input.allergies,
          medicalConditions: input.medicalConditions,
          medications: input.medications,
          dietaryRestrictions: input.dietaryRestrictions,
          emergencyContact1: input.emergencyContact1,
          emergencyPhone1: input.emergencyPhone1,
          emergencyContact2: input.emergencyContact2,
          emergencyPhone2: input.emergencyPhone2,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          roomId: z.number().optional(),
          allergies: z.string().optional(),
          medicalConditions: z.string().optional(),
          medications: z.string().optional(),
          dietaryRestrictions: z.string().optional(),
          status: z.enum(["active", "inactive", "graduated"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await database.update(children).set(updateData).where(eq(children.id, id));

        return await db.getChildrenById(id);
      }),
  }),

  // Parents Management
  parents: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllParents();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getParentById(input.id);
    }),

    getByUserId: protectedProcedure.input(z.object({ userId: z.number() })).query(async ({ input }) => {
      return await db.getParentByUserId(input.userId);
    }),

    create: protectedProcedure
      .input(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string().email(),
          phone: z.string().optional(),
          relationship: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          workPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(parents).values({
          userId: ctx.user.id,
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          phone: input.phone,
          relationship: input.relationship,
          address: input.address,
          city: input.city,
          state: input.state,
          zipCode: input.zipCode,
          workPhone: input.workPhone,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          address: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          workPhone: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await database.update(parents).set(updateData).where(eq(parents.id, id));

        return await db.getParentById(id);
      }),

    getChildren: protectedProcedure.input(z.object({ parentId: z.number() })).query(async ({ input }) => {
      return await db.getParentChildren(input.parentId);
    }),

    linkChild: protectedProcedure
      .input(
        z.object({
          parentId: z.number(),
          childId: z.number(),
          relationship: z.string(),
          isPrimaryContact: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(parentChildRelationships).values({
          parentId: input.parentId,
          childId: input.childId,
          relationship: input.relationship,
          isPrimaryContact: input.isPrimaryContact,
        });
      }),
  }),

  // Rooms Management
  rooms: router({
    list: protectedProcedure.query(async () => {
      return await db.getAllRooms();
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getRoomById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          description: z.string().optional(),
          capacity: z.number(),
          ageGroupMin: z.number().optional(),
          ageGroupMax: z.number().optional(),
          resources: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(rooms).values({
          name: input.name,
          description: input.description,
          capacity: input.capacity,
          ageGroupMin: input.ageGroupMin,
          ageGroupMax: input.ageGroupMax,
          resources: input.resources,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          description: z.string().optional(),
          capacity: z.number().optional(),
          ageGroupMin: z.number().optional(),
          ageGroupMax: z.number().optional(),
          resources: z.string().optional(),
          status: z.enum(["active", "inactive", "maintenance"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await database.update(rooms).set(updateData).where(eq(rooms.id, id));

        return await db.getRoomById(id);
      }),
  }),

  // Activities Management
  activities: router({
    byRoom: protectedProcedure.input(z.object({ roomId: z.number() })).query(async ({ input }) => {
      return await db.getActivitiesByRoom(input.roomId);
    }),

    byDate: protectedProcedure.input(z.object({ date: z.string() })).query(async ({ input }) => {
      return await db.getActivitiesByDate(new Date(input.date));
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getActivityById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          roomId: z.number(),
          scheduledDate: z.string(),
          startTime: z.string().optional(),
          endTime: z.string().optional(),
          staffId: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(activities).values({
          title: input.title,
          description: input.description,
          roomId: input.roomId,
          scheduledDate: new Date(input.scheduledDate),
          startTime: input.startTime as any,
          endTime: input.endTime as any,
          staffId: input.staffId,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          description: z.string().optional(),
          status: z.enum(["planned", "in_progress", "completed", "cancelled"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const { id, ...updateData } = input;
        await database.update(activities).set(updateData).where(eq(activities.id, id));

        return await db.getActivityById(id);
      }),

    recordAttendance: protectedProcedure
      .input(
        z.object({
          activityId: z.number(),
          childId: z.number(),
          attended: z.boolean(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(activityAttendance).values({
          activityId: input.activityId,
          childId: input.childId,
          attended: input.attended,
          notes: input.notes,
        });
      }),

    getAttendance: protectedProcedure
      .input(z.object({ activityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getActivityAttendance(input.activityId);
      }),
  }),

  // Daily Reports
  dailyReports: router({
    getByChildAndDate: protectedProcedure
      .input(z.object({ childId: z.number(), date: z.string() }))
      .query(async ({ input }) => {
        return await db.getDailyReportByChildAndDate(input.childId, new Date(input.date));
      }),

    getChildReports: protectedProcedure
      .input(z.object({ childId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getChildDailyReports(input.childId, input.limit);
      }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          reportDate: z.string(),
          mood: z.string().optional(),
          activities: z.string().optional(),
          meals: z.string().optional(),
          naps: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(dailyReports).values({
          childId: input.childId,
          reportDate: new Date(input.reportDate),
          mood: input.mood,
          activities: input.activities,
          meals: input.meals,
          naps: input.naps,
          notes: input.notes,
          staffId: ctx.user.id,
        });
      }),
  }),

  // Check-in/Check-out
  checkInOut: router({
    today: protectedProcedure
      .input(z.object({ childId: z.number(), date: z.string() }))
      .query(async ({ input }) => {
        return await db.getTodayCheckInOut(input.childId, new Date(input.date));
      }),

    history: protectedProcedure
      .input(z.object({ childId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getChildAttendanceHistory(input.childId, input.limit);
      }),

    checkIn: protectedProcedure
      .input(z.object({ childId: z.number(), date: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const dateStr = new Date(input.date).toISOString().split("T")[0];
        const existing = await db.getTodayCheckInOut(input.childId, new Date(input.date));

        if (existing) {
          await database
            .update(checkInOut)
            .set({ checkInTime: new Date(), checkedInBy: ctx.user.id })
            .where(eq(checkInOut.id, existing.id));
          return existing;
        }

        return await database.insert(checkInOut).values({
          childId: input.childId,
          checkInTime: new Date(),
          checkedInBy: ctx.user.id,
          date: new Date(dateStr),
        });
      }),

    checkOut: protectedProcedure
      .input(z.object({ childId: z.number(), date: z.string() }))
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const existing = await db.getTodayCheckInOut(input.childId, new Date(input.date));

        if (!existing) {
          throw new Error("No check-in record found for this child today");
        }

        await database
          .update(checkInOut)
          .set({ checkOutTime: new Date(), checkedOutBy: ctx.user.id })
          .where(eq(checkInOut.id, existing.id));

        return await db.getTodayCheckInOut(input.childId, new Date(input.date));
      }),
  }),

  // Photos
  photos: router({
    byActivity: protectedProcedure
      .input(z.object({ activityId: z.number() }))
      .query(async ({ input }) => {
        return await db.getActivityPhotos(input.activityId);
      }),

    byChild: protectedProcedure.input(z.object({ childId: z.number() })).query(async ({ input }) => {
      return await db.getChildPhotos(input.childId);
    }),

    create: protectedProcedure
      .input(
        z.object({
          activityId: z.number().optional(),
          childrenIds: z.array(z.number()),
          photoUrl: z.string(),
          photoKey: z.string(),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(photos).values({
          activityId: input.activityId,
          childrenIds: JSON.stringify(input.childrenIds),
          photoUrl: input.photoUrl,
          photoKey: input.photoKey,
          caption: input.caption,
          uploadedBy: ctx.user.id,
        });
      }),
  }),

  // Fees Management
  fees: router({
    byChild: protectedProcedure.input(z.object({ childId: z.number() })).query(async ({ input }) => {
      return await db.getFeesByChild(input.childId);
    }),

    create: protectedProcedure
      .input(
        z.object({
          childId: z.number(),
          feeType: z.enum(["tuition", "registration", "activity", "other"]),
          amount: z.string(),
          dueDate: z.string().optional(),
          frequency: z.enum(["one_time", "weekly", "monthly", "yearly"]),
          description: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(fees).values({
          childId: input.childId,
          feeType: input.feeType,
          amount: input.amount as any,
          dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
          frequency: input.frequency,
          description: input.description,
        });
      }),
  }),

  // Payments Management
  payments: router({
    byParent: protectedProcedure.input(z.object({ parentId: z.number() })).query(async ({ input }) => {
      return await db.getPaymentsByParent(input.parentId);
    }),

    byChild: protectedProcedure.input(z.object({ childId: z.number() })).query(async ({ input }) => {
      return await db.getPaymentsByChild(input.childId);
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getPaymentById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          parentId: z.number(),
          childId: z.number(),
          feeId: z.number().optional(),
          amount: z.string(),
          paymentMethod: z.enum(["stripe", "bank_transfer", "cash", "check"]),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(payments).values({
          parentId: input.parentId,
          childId: input.childId,
          feeId: input.feeId,
          amount: input.amount as any,
          paymentMethod: input.paymentMethod,
          status: "pending",
          notes: input.notes,
        });
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["pending", "completed", "failed", "refunded"]),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        await database.update(payments).set({ status: input.status }).where(eq(payments.id, input.id));

        return await db.getPaymentById(input.id);
      }),
  }),

  // Invoices Management
  invoices: router({
    byParent: protectedProcedure.input(z.object({ parentId: z.number() })).query(async ({ input }) => {
      return await db.getInvoicesByParent(input.parentId);
    }),

    getById: protectedProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return await db.getInvoiceById(input.id);
    }),

    create: protectedProcedure
      .input(
        z.object({
          parentId: z.number(),
          childId: z.number(),
          totalAmount: z.string(),
          dueDate: z.string(),
          items: z.array(z.any()).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const invoiceNumber = `INV-${Date.now()}`;

        return await database.insert(invoices).values({
          invoiceNumber,
          parentId: input.parentId,
          childId: input.childId,
          totalAmount: input.totalAmount as any,
          dueDate: new Date(input.dueDate),
          issueDate: new Date(),
          status: "draft",
          items: input.items ? JSON.stringify(input.items) : undefined,
          notes: input.notes,
        });
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        await database.update(invoices).set({ status: input.status }).where(eq(invoices.id, input.id));

        return await db.getInvoiceById(input.id);
      }),
  }),

  // Recurring Billing
  recurringBillings: router({
    byParent: protectedProcedure
      .input(z.object({ parentId: z.number() }))
      .query(async ({ input }) => {
        return await db.getRecurringBillingsByParent(input.parentId);
      }),

    create: protectedProcedure
      .input(
        z.object({
          parentId: z.number(),
          childId: z.number(),
          feeId: z.number(),
          stripeSubscriptionId: z.string(),
          amount: z.string(),
          frequency: z.enum(["weekly", "monthly", "yearly"]),
          nextBillingDate: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(recurringBillings).values({
          parentId: input.parentId,
          childId: input.childId,
          feeId: input.feeId,
          stripeSubscriptionId: input.stripeSubscriptionId,
          amount: input.amount as any,
          frequency: input.frequency,
          nextBillingDate: input.nextBillingDate ? new Date(input.nextBillingDate) : undefined,
        });
      }),
  }),

  // Email Notifications
  emailNotifications: router({
    byParent: protectedProcedure
      .input(z.object({ parentId: z.number(), limit: z.number().optional() }))
      .query(async ({ input }) => {
        return await db.getEmailNotificationsByParent(input.parentId, input.limit);
      }),

    pending: protectedProcedure.query(async () => {
      return await db.getPendingEmailNotifications();
    }),

    create: protectedProcedure
      .input(
        z.object({
          parentId: z.number(),
          notificationType: z.enum(["daily_report", "event", "payment_reminder", "emergency_alert", "other"]),
          recipientEmail: z.string().email(),
          subject: z.string(),
          content: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        return await database.insert(emailNotifications).values({
          parentId: input.parentId,
          notificationType: input.notificationType,
          recipientEmail: input.recipientEmail,
          subject: input.subject,
          content: input.content,
          status: "pending",
        });
      }),

    updateStatus: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          status: z.enum(["sent", "failed", "pending"]),
        })
      )
      .mutation(async ({ input }) => {
        const database = await getDb();
        if (!database) throw new Error("Database not available");

        const updateData: any = { status: input.status };
        if (input.status === "sent") {
          updateData.sentAt = new Date();
        }

        await database.update(emailNotifications).set(updateData).where(eq(emailNotifications.id, input.id));

        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
