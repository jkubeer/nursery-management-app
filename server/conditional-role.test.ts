import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createPasswordUser } from "./db";
import { getDb } from "./db";

describe("Conditional Role Selection", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
  });

  afterAll(async () => {
    // Cleanup is handled by the test database
  });

  it("should create parent user without a role", async () => {
    const email = `parent-test-${Date.now()}@test.com`;
    const result = await createPasswordUser(
      email,
      "Parent User",
      "hashedPassword123",
      undefined, // No role for parents
      "parent" // userType is parent
    );

    expect(result).toBeDefined();
    
    // Verify user was created
    const user = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, email)
    ).limit(1);

    expect(user.length).toBe(1);
    expect(user[0].userType).toBe("parent");
    expect(user[0].role).toBe("staff"); // Default role in schema
  });

  it("should create staff user with a role", async () => {
    const email = `staff-test-${Date.now()}@test.com`;
    const result = await createPasswordUser(
      email,
      "Staff User",
      "hashedPassword123",
      "staff", // Role for staff
      "staff" // userType is staff
    );

    expect(result).toBeDefined();

    // Verify user was created
    const user = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, email)
    ).limit(1);

    expect(user.length).toBe(1);
    expect(user[0].userType).toBe("staff");
    expect(user[0].role).toBe("staff");
  });

  it("should create admin user with admin role", async () => {
    const email = `admin-test-${Date.now()}@test.com`;
    const result = await createPasswordUser(
      email,
      "Admin User",
      "hashedPassword123",
      "admin", // Admin role
      "staff" // userType is staff
    );

    expect(result).toBeDefined();

    // Verify user was created
    const user = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, email)
    ).limit(1);

    expect(user.length).toBe(1);
    expect(user[0].userType).toBe("staff");
    expect(user[0].role).toBe("admin");
  });

  it("should create teacher user with teacher role", async () => {
    const email = `teacher-test-${Date.now()}@test.com`;
    const result = await createPasswordUser(
      email,
      "Teacher User",
      "hashedPassword123",
      "teacher", // Teacher role
      "staff" // userType is staff
    );

    expect(result).toBeDefined();

    // Verify user was created
    const user = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, email)
    ).limit(1);

    expect(user.length).toBe(1);
    expect(user[0].userType).toBe("staff");
    expect(user[0].role).toBe("teacher");
  });

  it("should distinguish between userType and role", async () => {
    const parentEmail = `parent-dist-${Date.now()}@test.com`;
    const staffEmail = `staff-dist-${Date.now()}@test.com`;

    // Create parent
    await createPasswordUser(
      parentEmail,
      "Parent",
      "hashedPassword123",
      undefined,
      "parent"
    );

    // Create staff
    await createPasswordUser(
      staffEmail,
      "Staff",
      "hashedPassword123",
      "staff",
      "staff"
    );

    // Verify both users exist with correct userType
    const parentUser = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, parentEmail)
    ).limit(1);

    const staffUser = await db.select().from(require("../drizzle/schema").users).where(
      require("drizzle-orm").eq(require("../drizzle/schema").users.email, staffEmail)
    ).limit(1);

    expect(parentUser[0].userType).toBe("parent");
    expect(staffUser[0].userType).toBe("staff");
    
    // Parent should have default role, staff should have staff role
    expect(parentUser[0].role).toBe("staff"); // Default
    expect(staffUser[0].role).toBe("staff");
  });
});
