import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createMockContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("Dashboard Procedures", () => {
  it("should return dashboard statistics", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const stats = await caller.dashboard.stats();

    expect(stats).toBeDefined();
    expect(stats).toHaveProperty("totalChildren");
    expect(stats).toHaveProperty("totalStaff");
    expect(stats).toHaveProperty("totalRooms");
    expect(stats).toHaveProperty("totalParents");
    expect(typeof stats.totalChildren).toBe("number");
    expect(typeof stats.totalStaff).toBe("number");
  });
});

describe("Staff Procedures", () => {
  it("should list all staff members", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const staff = await caller.staff.list();

    expect(Array.isArray(staff)).toBe(true);
  });

  it("should create a new staff member", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.staff.create({
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      phone: "1234567890",
      staffRole: "teacher",
      qualifications: "Bachelor in Early Childhood Education",
    });

    expect(result).toBeDefined();
  });
});

describe("Children Procedures", () => {
  it("should list all children", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const children = await caller.children.list();

    expect(Array.isArray(children)).toBe(true);
  });

  it("should create a new child", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.children.create({
      firstName: "Emma",
      lastName: "Smith",
      dateOfBirth: "2022-01-15",
      enrollmentDate: "2024-01-01",
      gender: "female",
      allergies: "Peanuts",
      medicalConditions: "None",
    });

    expect(result).toBeDefined();
  });
});

describe("Rooms Procedures", () => {
  it("should list all rooms", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const rooms = await caller.rooms.list();

    expect(Array.isArray(rooms)).toBe(true);
  });

  it("should create a new room", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.rooms.create({
      name: "Toddlers Room",
      description: "For children aged 1-2 years",
      capacity: 10,
      ageGroupMin: 12,
      ageGroupMax: 24,
      resources: "Toys, Books, Play Mat",
    });

    expect(result).toBeDefined();
  });
});

describe("Parents Procedures", () => {
  it("should list all parents", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const parents = await caller.parents.list();

    expect(Array.isArray(parents)).toBe(true);
  });

  it("should create a new parent", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.parents.create({
      firstName: "Jane",
      lastName: "Smith",
      email: "jane@example.com",
      phone: "9876543210",
      relationship: "Mother",
      address: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
    });

    expect(result).toBeDefined();
  });
});

describe("Activities Procedures", () => {
  it("should get activities by date", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const activities = await caller.activities.byDate({
      date: new Date().toISOString().split("T")[0],
    });

    expect(Array.isArray(activities)).toBe(true);
  });
});

describe("Email Notifications Procedures", () => {
  it("should get pending email notifications", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const pending = await caller.emailNotifications.pending();

    expect(Array.isArray(pending)).toBe(true);
  });
});

describe("Auth Procedures", () => {
  it("should get current user", async () => {
    const ctx = createMockContext();
    const caller = appRouter.createCaller(ctx);

    const user = await caller.auth.me();

    expect(user).toBeDefined();
    expect(user?.id).toBe(1);
    expect(user?.role).toBe("admin");
  });
});
