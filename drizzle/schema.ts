import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
  date,
  time,
  json,
  index,
} from "drizzle-orm/mysql-core";

/**
 * Nurseries table - each nursery is a separate tenant
 */
export const nurseries = mysqlTable(
  "nurseries",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 200 }).notNull(),
    contactName: varchar("contactName", { length: 200 }).notNull(),
    contactEmail: varchar("contactEmail", { length: 320 }),
    contactPhone: varchar("contactPhone", { length: 20 }),
    logo: text("logo"), // URL to logo image
    address: text("address"),
    city: varchar("city", { length: 100 }),
    country: varchar("country", { length: 100 }),
    latitude: decimal("latitude", { precision: 10, scale: 7 }),
    longitude: decimal("longitude", { precision: 10, scale: 7 }),
    adminId: int("adminId"), // The nursery admin user ID
    status: mysqlEnum("status", ["active", "inactive", "suspended"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type Nursery = typeof nurseries.$inferSelect;
export type InsertNursery = typeof nurseries.$inferInsert;

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).unique(),
  email: varchar("email", { length: 320 }).unique(),
  name: text("name"),
  passwordHash: varchar("passwordHash", { length: 255 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["super_admin", "admin", "staff", "parent"]).default("parent").notNull(),
  nurseryId: int("nurseryId"), // null for super_admin
  passwordResetToken: varchar("passwordResetToken", { length: 255 }),
  passwordResetExpiry: timestamp("passwordResetExpiry"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Staff management table
 */
export const staff = mysqlTable(
  "staff",
  {
    id: int("id").autoincrement().primaryKey(),
    nurseryId: int("nurseryId").notNull(),
    userId: int("userId").notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    staffRole: mysqlEnum("staffRole", ["director", "teacher", "assistant", "nurse", "admin"]).notNull(),
    qualifications: text("qualifications"),
    emergencyContact: varchar("emergencyContact", { length: 100 }),
    emergencyPhone: varchar("emergencyPhone", { length: 20 }),
    hireDate: date("hireDate"),
    status: mysqlEnum("status", ["active", "inactive", "on_leave"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("staff_userId_idx").on(table.userId),
  })
);

export type Staff = typeof staff.$inferSelect;
export type InsertStaff = typeof staff.$inferInsert;

/**
 * Staff schedule table
 */
export const staffSchedules = mysqlTable(
  "staff_schedules",
  {
    id: int("id").autoincrement().primaryKey(),
    staffId: int("staffId").notNull(),
    dayOfWeek: mysqlEnum("dayOfWeek", ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]).notNull(),
    startTime: time("startTime").notNull(),
    endTime: time("endTime").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    staffIdIdx: index("staff_schedules_staffId_idx").on(table.staffId),
  })
);

export type StaffSchedule = typeof staffSchedules.$inferSelect;
export type InsertStaffSchedule = typeof staffSchedules.$inferInsert;

/**
 * Rooms and facilities table
 */
export const rooms = mysqlTable(
  "rooms",
  {
    id: int("id").autoincrement().primaryKey(),
    nurseryId: int("nurseryId").notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    description: text("description"),
    capacity: int("capacity").notNull(),
    ageGroupMin: int("ageGroupMin"),
    ageGroupMax: int("ageGroupMax"),
    resources: text("resources"), // JSON array of resources
    status: mysqlEnum("status", ["active", "inactive", "maintenance"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type Room = typeof rooms.$inferSelect;
export type InsertRoom = typeof rooms.$inferInsert;

/**
 * Parents/Guardians table
 */
export const parents = mysqlTable(
  "parents",
  {
    id: int("id").autoincrement().primaryKey(),
    nurseryId: int("nurseryId").notNull(),
    userId: int("userId").notNull(),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    email: varchar("email", { length: 320 }).notNull(),
    phone: varchar("phone", { length: 20 }),
    relationship: varchar("relationship", { length: 50 }), // mother, father, guardian, etc.
    address: text("address"),
    city: varchar("city", { length: 100 }),
    state: varchar("state", { length: 50 }),
    zipCode: varchar("zipCode", { length: 20 }),
    workPhone: varchar("workPhone", { length: 20 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("parents_userId_idx").on(table.userId),
  })
);

export type Parent = typeof parents.$inferSelect;
export type InsertParent = typeof parents.$inferInsert;

/**
 * Children registry table
 */
export const children = mysqlTable(
  "children",
  {
    id: int("id").autoincrement().primaryKey(),
    nurseryId: int("nurseryId").notNull(),
    parentId: int("parentId"),
    firstName: varchar("firstName", { length: 100 }).notNull(),
    lastName: varchar("lastName", { length: 100 }).notNull(),
    dateOfBirth: date("dateOfBirth").notNull(),
    gender: mysqlEnum("gender", ["male", "female", "other"]),
    enrollmentDate: date("enrollmentDate").notNull(),
    roomId: int("roomId"),
    allergies: text("allergies"),
    medicalConditions: text("medicalConditions"),
    medications: text("medications"),
    dietaryRestrictions: text("dietaryRestrictions"),
    emergencyContact1: varchar("emergencyContact1", { length: 100 }),
    emergencyPhone1: varchar("emergencyPhone1", { length: 20 }),
    emergencyContact2: varchar("emergencyContact2", { length: 100 }),
    emergencyPhone2: varchar("emergencyPhone2", { length: 20 }),
    status: mysqlEnum("status", ["active", "inactive", "graduated"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    roomIdIdx: index("children_roomId_idx").on(table.roomId),
  })
);

export type Child = typeof children.$inferSelect;
export type InsertChild = typeof children.$inferInsert;

/**
 * Parent-Child relationship table
 */
export const parentChildRelationships = mysqlTable(
  "parent_child_relationships",
  {
    id: int("id").autoincrement().primaryKey(),
    parentId: int("parentId").notNull(),
    childId: int("childId").notNull(),
    relationship: varchar("relationship", { length: 50 }).notNull(), // mother, father, guardian, etc.
    isPrimaryContact: boolean("isPrimaryContact").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("parent_child_relationships_parentId_idx").on(table.parentId),
    childIdIdx: index("parent_child_relationships_childId_idx").on(table.childId),
  })
);

export type ParentChildRelationship = typeof parentChildRelationships.$inferSelect;
export type InsertParentChildRelationship = typeof parentChildRelationships.$inferInsert;

/**
 * Activities table
 */
export const activities = mysqlTable(
  "activities",
  {
    id: int("id").autoincrement().primaryKey(),
    nurseryId: int("nurseryId").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description"),
    roomId: int("roomId").notNull(),
    scheduledDate: date("scheduledDate").notNull(),
    startTime: time("startTime"),
    endTime: time("endTime"),
    staffId: int("staffId"),
    status: mysqlEnum("status", ["planned", "in_progress", "completed", "cancelled"]).default("planned").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    roomIdIdx: index("activities_roomId_idx").on(table.roomId),
    staffIdIdx: index("activities_staffId_idx").on(table.staffId),
  })
);

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

/**
 * Activity attendance table
 */
export const activityAttendance = mysqlTable(
  "activity_attendance",
  {
    id: int("id").autoincrement().primaryKey(),
    activityId: int("activityId").notNull(),
    childId: int("childId").notNull(),
    attended: boolean("attended").default(true),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    activityIdIdx: index("activity_attendance_activityId_idx").on(table.activityId),
    childIdIdx: index("activity_attendance_childId_idx").on(table.childId),
  })
);

export type ActivityAttendance = typeof activityAttendance.$inferSelect;
export type InsertActivityAttendance = typeof activityAttendance.$inferInsert;

/**
 * Daily reports table
 */
export const dailyReports = mysqlTable(
  "daily_reports",
  {
    id: int("id").autoincrement().primaryKey(),
    childId: int("childId").notNull(),
    reportDate: date("reportDate").notNull(),
    mood: varchar("mood", { length: 50 }),
    activities: text("activities"),
    meals: text("meals"),
    naps: text("naps"),
    notes: text("notes"),
    staffId: int("staffId"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    childIdIdx: index("daily_reports_childId_idx").on(table.childId),
    reportDateIdx: index("daily_reports_reportDate_idx").on(table.reportDate),
  })
);

export type DailyReport = typeof dailyReports.$inferSelect;
export type InsertDailyReport = typeof dailyReports.$inferInsert;

/**
 * Check-in/Check-out table
 */
export const checkInOut = mysqlTable(
  "check_in_out",
  {
    id: int("id").autoincrement().primaryKey(),
    childId: int("childId").notNull(),
    checkInTime: timestamp("checkInTime"),
    checkOutTime: timestamp("checkOutTime"),
    checkedInBy: int("checkedInBy"),
    checkedOutBy: int("checkedOutBy"),
    date: date("date").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    childIdIdx: index("check_in_out_childId_idx").on(table.childId),
    dateIdx: index("check_in_out_date_idx").on(table.date),
  })
);

export type CheckInOut = typeof checkInOut.$inferSelect;
export type InsertCheckInOut = typeof checkInOut.$inferInsert;

/**
 * Photos table
 */
export const photos = mysqlTable(
  "photos",
  {
    id: int("id").autoincrement().primaryKey(),
    activityId: int("activityId"),
    childrenIds: text("childrenIds"), // JSON array of child IDs
    photoUrl: text("photoUrl").notNull(),
    photoKey: varchar("photoKey", { length: 255 }).notNull(), // S3 key
    caption: text("caption"),
    uploadedBy: int("uploadedBy"),
    isPublic: boolean("isPublic").default(false).notNull(),
    tags: text("tags"), // JSON array of tags
    uploadedAt: timestamp("uploadedAt").defaultNow().notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    activityIdIdx: index("photos_activityId_idx").on(table.activityId),
    isPublicIdx: index("photos_isPublic_idx").on(table.isPublic),
  })
);

export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = typeof photos.$inferInsert;

/**
 * Fees table
 */
export const fees = mysqlTable(
  "fees",
  {
    id: int("id").autoincrement().primaryKey(),
    childId: int("childId").notNull(),
    feeType: mysqlEnum("feeType", ["tuition", "registration", "activity", "other"]).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    dueDate: date("dueDate"),
    frequency: mysqlEnum("frequency", ["one_time", "weekly", "monthly", "yearly"]).default("one_time").notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    childIdIdx: index("fees_childId_idx").on(table.childId),
  })
);

export type Fee = typeof fees.$inferSelect;
export type InsertFee = typeof fees.$inferInsert;

/**
 * Payments table
 */
export const payments = mysqlTable(
  "payments",
  {
    id: int("id").autoincrement().primaryKey(),
    parentId: int("parentId").notNull(),
    childId: int("childId").notNull(),
    feeId: int("feeId"),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentMethod: mysqlEnum("paymentMethod", ["stripe", "bank_transfer", "cash", "check"]).notNull(),
    stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
    status: mysqlEnum("status", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
    paymentDate: timestamp("paymentDate"),
    invoiceNumber: varchar("invoiceNumber", { length: 50 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("payments_parentId_idx").on(table.parentId),
    childIdIdx: index("payments_childId_idx").on(table.childId),
    statusIdx: index("payments_status_idx").on(table.status),
  })
);

export type Payment = typeof payments.$inferSelect;
export type InsertPayment = typeof payments.$inferInsert;

/**
 * Invoices table
 */
export const invoices = mysqlTable(
  "invoices",
  {
    id: int("id").autoincrement().primaryKey(),
    invoiceNumber: varchar("invoiceNumber", { length: 50 }).notNull().unique(),
    parentId: int("parentId").notNull(),
    childId: int("childId").notNull(),
    totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
    dueDate: date("dueDate").notNull(),
    issueDate: date("issueDate").notNull(),
    status: mysqlEnum("status", ["draft", "sent", "paid", "overdue", "cancelled"]).default("draft").notNull(),
    items: text("items"), // JSON array of invoice items
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("invoices_parentId_idx").on(table.parentId),
    statusIdx: index("invoices_status_idx").on(table.status),
  })
);

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

/**
 * Recurring billing table for Stripe subscriptions
 */
export const recurringBillings = mysqlTable(
  "recurring_billings",
  {
    id: int("id").autoincrement().primaryKey(),
    parentId: int("parentId").notNull(),
    childId: int("childId").notNull(),
    feeId: int("feeId").notNull(),
    stripeSubscriptionId: varchar("stripeSubscriptionId", { length: 255 }).notNull().unique(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    frequency: mysqlEnum("frequency", ["weekly", "monthly", "yearly"]).notNull(),
    status: mysqlEnum("status", ["active", "paused", "cancelled"]).default("active").notNull(),
    nextBillingDate: date("nextBillingDate"),
    cancelledAt: timestamp("cancelledAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("recurring_billings_parentId_idx").on(table.parentId),
    stripeSubscriptionIdIdx: index("recurring_billings_stripeSubscriptionId_idx").on(table.stripeSubscriptionId),
  })
);

export type RecurringBilling = typeof recurringBillings.$inferSelect;
export type InsertRecurringBilling = typeof recurringBillings.$inferInsert;

/**
 * Email notifications log table
 */
export const emailNotifications = mysqlTable(
  "email_notifications",
  {
    id: int("id").autoincrement().primaryKey(),
    parentId: int("parentId").notNull(),
    notificationType: mysqlEnum("notificationType", ["daily_report", "event", "payment_reminder", "emergency_alert", "other"]).notNull(),
    recipientEmail: varchar("recipientEmail", { length: 320 }).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    content: text("content"),
    status: mysqlEnum("status", ["sent", "failed", "pending"]).default("pending").notNull(),
    sentAt: timestamp("sentAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index("email_notifications_parentId_idx").on(table.parentId),
    statusIdx: index("email_notifications_status_idx").on(table.status),
  })
);

export type EmailNotification = typeof emailNotifications.$inferSelect;
export type InsertEmailNotification = typeof emailNotifications.$inferInsert;


/**
 * Roles table for role-based access control
 */
export const roles = mysqlTable(
  "roles",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    isSystem: boolean("isSystem").default(false).notNull(), // System roles cannot be deleted
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  }
);

export type Role = typeof roles.$inferSelect;
export type InsertRole = typeof roles.$inferInsert;

/**
 * Permissions table
 */
export const permissions = mysqlTable(
  "permissions",
  {
    id: int("id").autoincrement().primaryKey(),
    name: varchar("name", { length: 100 }).notNull().unique(),
    description: text("description"),
    category: varchar("category", { length: 50 }).notNull(), // e.g., "staff", "children", "payments"
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type Permission = typeof permissions.$inferSelect;
export type InsertPermission = typeof permissions.$inferInsert;

/**
 * Role-Permission mapping table
 */
export const rolePermissions = mysqlTable(
  "role_permissions",
  {
    id: int("id").autoincrement().primaryKey(),
    roleId: int("roleId").notNull(),
    permissionId: int("permissionId").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    roleIdIdx: index("role_permissions_roleId_idx").on(table.roleId),
    permissionIdIdx: index("role_permissions_permissionId_idx").on(table.permissionId),
  })
);

export type RolePermission = typeof rolePermissions.$inferSelect;
export type InsertRolePermission = typeof rolePermissions.$inferInsert;

/**
 * User-Role mapping table (many-to-many)
 */
export const userRoles = mysqlTable(
  "user_roles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    roleId: int("roleId").notNull(),
    assignedAt: timestamp("assignedAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_roles_userId_idx").on(table.userId),
    roleIdIdx: index("user_roles_roleId_idx").on(table.roleId),
  })
);

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

/**
 * User activity log table for audit trail
 */
export const userActivityLogs = mysqlTable(
  "user_activity_logs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    action: varchar("action", { length: 100 }).notNull(), // e.g., "created_child", "updated_payment"
    entityType: varchar("entityType", { length: 50 }).notNull(), // e.g., "child", "payment", "staff"
    entityId: int("entityId"),
    details: json("details"), // Additional details about the action
    ipAddress: varchar("ipAddress", { length: 45 }),
    userAgent: text("userAgent"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_activity_logs_userId_idx").on(table.userId),
    createdAtIdx: index("user_activity_logs_createdAt_idx").on(table.createdAt),
  })
);

export type UserActivityLog = typeof userActivityLogs.$inferSelect;
export type InsertUserActivityLog = typeof userActivityLogs.$inferInsert;

/**
 * User privileges table (direct privileges assigned to users)
 */
export const userPrivileges = mysqlTable(
  "user_privileges",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    permissionId: int("permissionId").notNull(),
    grantedBy: int("grantedBy"), // User ID who granted this privilege
    grantedAt: timestamp("grantedAt").defaultNow().notNull(),
    expiresAt: timestamp("expiresAt"), // Optional expiration date
  },
  (table) => ({
    userIdIdx: index("user_privileges_userId_idx").on(table.userId),
    permissionIdIdx: index("user_privileges_permissionId_idx").on(table.permissionId),
  })
);

export type UserPrivilege = typeof userPrivileges.$inferSelect;
export type InsertUserPrivilege = typeof userPrivileges.$inferInsert;
