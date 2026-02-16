import { eq, and, gte, lte, like, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  staff,
  staffSchedules,
  rooms,
  parents,
  children,
  parentChildRelationships,
  activities,
  activityAttendance,
  dailyReports,
  checkInOut,
  photos,
  fees,
  payments,
  invoices,
  recurringBillings,
  emailNotifications,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Staff queries
export async function getStaffById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(staff).where(eq(staff.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllStaff() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(staff).orderBy(asc(staff.firstName));
}

export async function getStaffSchedules(staffId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(staffSchedules).where(eq(staffSchedules.staffId, staffId));
}

// Children queries
export async function getChildrenById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(children).where(eq(children.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllChildren() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(children).orderBy(asc(children.firstName));
}

export async function getChildrenByRoom(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(children).where(eq(children.roomId, roomId));
}

// Parent queries
export async function getParentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(parents).where(eq(parents.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getParentByUserId(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(parents).where(eq(parents.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllParents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(parents).orderBy(asc(parents.firstName));
}

export async function getParentChildren(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  const relationships = await db
    .select()
    .from(parentChildRelationships)
    .where(eq(parentChildRelationships.parentId, parentId));

  const childIds = relationships.map((r) => r.childId);
  if (childIds.length === 0) return [];

  return await db.select().from(children).where(inArray(children.id, childIds));
}

// Rooms queries
export async function getRoomById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rooms).where(eq(rooms.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllRooms() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(rooms).orderBy(asc(rooms.name));
}

// Activities queries
export async function getActivityById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getActivitiesByRoom(roomId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(activities)
    .where(eq(activities.roomId, roomId))
    .orderBy(desc(activities.scheduledDate));
}

export async function getActivitiesByDate(date: Date) {
  const db = await getDb();
  if (!db) return [];
  const dateStr = date.toISOString().split("T")[0];
  return await db
    .select()
    .from(activities)
    .where(eq(activities.scheduledDate, new Date(dateStr)))
    .orderBy(asc(activities.startTime));
}

// Activity attendance queries
export async function getActivityAttendance(activityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(activityAttendance)
    .where(eq(activityAttendance.activityId, activityId));
}

// Daily reports queries
export async function getDailyReportByChildAndDate(childId: number, date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const dateStr = date.toISOString().split("T")[0];
  const result = await db
    .select()
    .from(dailyReports)
    .where(
      and(
        eq(dailyReports.childId, childId),
        eq(dailyReports.reportDate, new Date(dateStr))
      )
    )
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getChildDailyReports(childId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(dailyReports)
    .where(eq(dailyReports.childId, childId))
    .orderBy(desc(dailyReports.reportDate))
    .limit(limit);
}

// Check-in/Check-out queries
export async function getTodayCheckInOut(childId: number, date: Date) {
  const db = await getDb();
  if (!db) return undefined;
  const dateStr = date.toISOString().split("T")[0];
  const result = await db
    .select()
    .from(checkInOut)
    .where(and(eq(checkInOut.childId, childId), eq(checkInOut.date, new Date(dateStr))))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getChildAttendanceHistory(childId: number, limit: number = 30) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(checkInOut)
    .where(eq(checkInOut.childId, childId))
    .orderBy(desc(checkInOut.date))
    .limit(limit);
}

// Photos queries
export async function getActivityPhotos(activityId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(photos)
    .where(eq(photos.activityId, activityId))
    .orderBy(desc(photos.uploadedAt));
}

export async function getChildPhotos(childId: number) {
  const db = await getDb();
  if (!db) return [];
  // This requires parsing JSON array in childrenIds, so we get all and filter
  const allPhotos = await db.select().from(photos).orderBy(desc(photos.uploadedAt));
  return allPhotos.filter((photo) => {
    if (!photo.childrenIds) return false;
    try {
      const ids = JSON.parse(photo.childrenIds);
      return Array.isArray(ids) && ids.includes(childId);
    } catch {
      return false;
    }
  });
}

// Fees queries
export async function getFeesByChild(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(fees)
    .where(eq(fees.childId, childId))
    .orderBy(desc(fees.createdAt));
}

// Payments queries
export async function getPaymentsByParent(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(payments)
    .where(eq(payments.parentId, parentId))
    .orderBy(desc(payments.createdAt));
}

export async function getPaymentsByChild(childId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(payments)
    .where(eq(payments.childId, childId))
    .orderBy(desc(payments.createdAt));
}

export async function getPaymentById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(payments).where(eq(payments.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Invoices queries
export async function getInvoicesByParent(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(invoices)
    .where(eq(invoices.parentId, parentId))
    .orderBy(desc(invoices.issueDate));
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Recurring billing queries
export async function getRecurringBillingsByParent(parentId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(recurringBillings)
    .where(eq(recurringBillings.parentId, parentId));
}

export async function getRecurringBillingByStripeId(stripeSubscriptionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(recurringBillings)
    .where(eq(recurringBillings.stripeSubscriptionId, stripeSubscriptionId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// Email notifications queries
export async function getEmailNotificationsByParent(parentId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.parentId, parentId))
    .orderBy(desc(emailNotifications.createdAt))
    .limit(limit);
}

export async function getPendingEmailNotifications() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(emailNotifications)
    .where(eq(emailNotifications.status, "pending"))
    .orderBy(asc(emailNotifications.createdAt));
}

// Dashboard statistics
export async function getDashboardStats() {
  const db = await getDb();
  if (!db) {
    return {
      totalChildren: 0,
      totalStaff: 0,
      totalRooms: 0,
      totalParents: 0,
      activitiesThisWeek: 0,
      pendingPayments: 0,
    };
  }

  try {
    const childrenCount = await db.select({ count: children.id }).from(children);
    const staffCount = await db.select({ count: staff.id }).from(staff);
    const roomsCount = await db.select({ count: rooms.id }).from(rooms);
    const parentsCount = await db.select({ count: parents.id }).from(parents);

    // Get pending payments (not completed or failed)
    const pendingPaymentsData = await db
      .select({ count: payments.id })
      .from(payments)
      .where(eq(payments.status, "pending"));

    return {
      totalChildren: childrenCount[0]?.count || 0,
      totalStaff: staffCount[0]?.count || 0,
      totalRooms: roomsCount[0]?.count || 0,
      totalParents: parentsCount[0]?.count || 0,
      activitiesThisWeek: 0, // Can be calculated based on date range
      pendingPayments: pendingPaymentsData[0]?.count || 0,
    };
  } catch (error) {
    console.error("[Database] Failed to get dashboard stats:", error);
    return {
      totalChildren: 0,
      totalStaff: 0,
      totalRooms: 0,
      totalParents: 0,
      activitiesThisWeek: 0,
      pendingPayments: 0,
    };
  }
}
