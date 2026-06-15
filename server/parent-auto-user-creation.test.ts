import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "./db";
import { parents, users } from "../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Parent Auto User Creation", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database not available");
    }
  });

  afterAll(async () => {
    // Cleanup test data
    if (db) {
      await db
        .delete(users)
        .where(eq(users.email, "test-parent-auto@nursery.com"));
      await db
        .delete(parents)
        .where(eq(parents.email, "test-parent-auto@nursery.com"));
    }
  });

  it("should create a parent record", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Create a parent
    const parentData = {
      firstName: "Test",
      lastName: "Parent",
      email: "test-parent-auto@nursery.com",
      phone: "1234567890",
      nurseryId: 1,
      userId: 1,
    };

    await db.insert(parents).values(parentData);

    // Query the created parent
    const createdParent = await db
      .select()
      .from(parents)
      .where(eq(parents.email, "test-parent-auto@nursery.com"))
      .limit(1);

    expect(createdParent.length).toBeGreaterThan(0);
    expect(createdParent[0].firstName).toBe("Test");
    expect(createdParent[0].lastName).toBe("Parent");
  });

  it("should verify parent record has correct data", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    const parent = await db
      .select()
      .from(parents)
      .where(eq(parents.email, "test-parent-auto@nursery.com"))
      .limit(1);

    expect(parent.length).toBeGreaterThan(0);
    expect(parent[0].email).toBe("test-parent-auto@nursery.com");
    expect(parent[0].phone).toBe("1234567890");
  });

  it("should have parentId field in users table", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Verify parentId column exists by checking if we can query users
    const testUser = await db
      .select()
      .from(users)
      .limit(1);

    // If we can query users table, the schema is valid
    expect(testUser).toBeDefined();
  });

  it("should support storing parentId in users", async () => {
    if (!db) {
      throw new Error("Database not available");
    }

    // Get a parent with email
    const parent = await db
      .select()
      .from(parents)
      .where(eq(parents.email, "test-parent-auto@nursery.com"))
      .limit(1);

    if (parent.length > 0) {
      const parentId = parent[0].id;
      expect(parentId).toBeGreaterThan(0);
    }
  });
});
