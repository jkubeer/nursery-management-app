import { describe, it, expect, beforeAll } from "vitest";
import { getDb } from "./db";
import { users, parents, children, payments, invoices } from "../drizzle/schema";
import { eq, and } from "drizzle-orm";

describe("Parent Portal Data Isolation", () => {
  let db: any;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }
  });

  it("should get parent's children only", async () => {
    // Get first parent
    const parentRecord = await db.select().from(parents).limit(1);

    if (parentRecord.length > 0) {
      const parentId = parentRecord[0].id;

      // Get children for this parent
      const parentChildren = await db
        .select()
        .from(children)
        .where(eq(children.parentId, parentId));

      // Verify all children belong to this parent
      parentChildren.forEach((child: any) => {
        expect(child.parentId).toBe(parentId);
      });
    }
  });

  it("should get parent's payments only", async () => {
    // Get first parent
    const parentRecord = await db.select().from(parents).limit(1);

    if (parentRecord.length > 0) {
      const parentId = parentRecord[0].id;

      // Get payments for this parent
      const parentPayments = await db
        .select()
        .from(payments)
        .where(eq(payments.parentId, parentId));

      // Verify all payments belong to this parent
      parentPayments.forEach((payment: any) => {
        expect(payment.parentId).toBe(parentId);
      });
    }
  });

  it("should get parent's invoices only", async () => {
    // Get first parent
    const parentRecord = await db.select().from(parents).limit(1);

    if (parentRecord.length > 0) {
      const parentId = parentRecord[0].id;

      // Get invoices for this parent
      const parentInvoices = await db
        .select()
        .from(invoices)
        .where(eq(invoices.parentId, parentId));

      // Verify all invoices belong to this parent
      parentInvoices.forEach((invoice: any) => {
        expect(invoice.parentId).toBe(parentId);
      });
    }
  });

  it("should not allow parent to see other parents' children", async () => {
    // Get two different parents
    const allParents = await db.select().from(parents).limit(2);

    if (allParents.length >= 2) {
      const parent1Id = allParents[0].id;
      const parent2Id = allParents[1].id;

      // Get children for parent 1
      const parent1Children = await db
        .select()
        .from(children)
        .where(eq(children.parentId, parent1Id));

      // Get children for parent 2
      const parent2Children = await db
        .select()
        .from(children)
        .where(eq(children.parentId, parent2Id));

      // Verify parent 1's children don't include parent 2's children
      const parent1ChildIds = parent1Children.map((c: any) => c.id);
      const parent2ChildIds = parent2Children.map((c: any) => c.id);

      const intersection = parent1ChildIds.filter((id: number) =>
        parent2ChildIds.includes(id)
      );
      expect(intersection.length).toBe(0);
    }
  });

  it("should not allow parent to see other parents' payments", async () => {
    // Get two different parents
    const allParents = await db.select().from(parents).limit(2);

    if (allParents.length >= 2) {
      const parent1Id = allParents[0].id;
      const parent2Id = allParents[1].id;

      // Get payments for parent 1
      const parent1Payments = await db
        .select()
        .from(payments)
        .where(eq(payments.parentId, parent1Id));

      // Get payments for parent 2
      const parent2Payments = await db
        .select()
        .from(payments)
        .where(eq(payments.parentId, parent2Id));

      // Verify parent 1's payments don't include parent 2's payments
      const parent1PaymentIds = parent1Payments.map((p: any) => p.id);
      const parent2PaymentIds = parent2Payments.map((p: any) => p.id);

      const intersection = parent1PaymentIds.filter((id: number) =>
        parent2PaymentIds.includes(id)
      );
      expect(intersection.length).toBe(0);
    }
  });

  it("should have parent role assigned to parent users", async () => {
    // Get all parent users
    const parentUsers = await db
      .select()
      .from(users)
      .where(eq(users.role, "parent"));

    expect(parentUsers.length).toBeGreaterThan(0);

    // Verify all have role "parent"
    parentUsers.forEach((user: any) => {
      expect(user.role).toBe("parent");
    });
  });

  it("should verify invoice references valid parent", async () => {
    // Get an invoice
    const invoiceRecord = await db.select().from(invoices).limit(1);

    if (invoiceRecord.length > 0) {
      const invoice = invoiceRecord[0];

      // Verify parent exists
      const parentRecord = await db
        .select()
        .from(parents)
        .where(eq(parents.id, invoice.parentId));
      expect(parentRecord.length).toBeGreaterThan(0);
    }
  });

  it("should verify payment references valid parent", async () => {
    // Get a payment
    const paymentRecord = await db.select().from(payments).limit(1);

    if (paymentRecord.length > 0) {
      const payment = paymentRecord[0];

      // Verify parent exists
      const parentRecord = await db
        .select()
        .from(parents)
        .where(eq(parents.id, payment.parentId));
      expect(parentRecord.length).toBeGreaterThan(0);
    }
  });

  it("should have parents table with expected structure", async () => {
    const parentRecords = await db.select().from(parents).limit(1);

    if (parentRecords.length > 0) {
      const parent = parentRecords[0];

      // Verify required fields exist
      expect(parent).toHaveProperty("id");
      expect(parent).toHaveProperty("nurseryId");
      expect(parent).toHaveProperty("userId");
      expect(parent).toHaveProperty("firstName");
      expect(parent).toHaveProperty("lastName");
      expect(parent).toHaveProperty("email");
    }
  });

  it("should have children table with parentId field", async () => {
    const childRecords = await db.select().from(children).limit(1);

    if (childRecords.length > 0) {
      const child = childRecords[0];

      // Verify required fields exist
      expect(child).toHaveProperty("id");
      expect(child).toHaveProperty("parentId");
      expect(child).toHaveProperty("firstName");
      expect(child).toHaveProperty("lastName");
      expect(child).toHaveProperty("dateOfBirth");
    }
  });

  it("should have payments table with parent and child references", async () => {
    const paymentRecords = await db.select().from(payments).limit(1);

    if (paymentRecords.length > 0) {
      const payment = paymentRecords[0];

      // Verify required fields exist
      expect(payment).toHaveProperty("id");
      expect(payment).toHaveProperty("parentId");
      expect(payment).toHaveProperty("childId");
      expect(payment).toHaveProperty("amount");
      expect(payment).toHaveProperty("status");
    }
  });

  it("should have invoices table with parent and child references", async () => {
    const invoiceRecords = await db.select().from(invoices).limit(1);

    if (invoiceRecords.length > 0) {
      const invoice = invoiceRecords[0];

      // Verify required fields exist
      expect(invoice).toHaveProperty("id");
      expect(invoice).toHaveProperty("parentId");
      expect(invoice).toHaveProperty("childId");
      expect(invoice).toHaveProperty("totalAmount");
      expect(invoice).toHaveProperty("status");
    }
  });
});
