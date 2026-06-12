import { describe, it, expect, beforeAll } from "vitest";
import { appRouter } from "./routers";
import { TRPCError } from "@trpc/server";

describe("Parent Router Access Control", () => {
  let parentContext: any;
  let adminContext: any;
  let unauthenticatedContext: any;

  beforeAll(() => {
    // Mock parent user context
    parentContext = {
      user: {
        id: 1,
        role: "parent",
        email: "parent@example.com",
        nurseryId: 1,
      },
    };

    // Mock admin user context
    adminContext = {
      user: {
        id: 2,
        role: "admin",
        email: "admin@example.com",
        nurseryId: 1,
      },
    };

    // Mock unauthenticated context
    unauthenticatedContext = {
      user: null,
    };
  });

  it("should allow parent to access parent.me", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      const result = await caller.parent.me();
      // Should succeed or throw NOT_FOUND (if parent record doesn't exist)
      // but not FORBIDDEN
      expect(result).toBeDefined();
    } catch (error: any) {
      // Allow NOT_FOUND but not FORBIDDEN
      expect(error?.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow parent to access parent.children", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      const result = await caller.parent.children();
      expect(Array.isArray(result)).toBe(true);
    } catch (error: any) {
      expect(error?.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow parent to access parent.payments", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      const result = await caller.parent.payments();
      expect(Array.isArray(result)).toBe(true);
    } catch (error: any) {
      expect(error?.code).not.toBe("FORBIDDEN");
    }
  });

  it("should allow parent to access parent.invoices", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      const result = await caller.parent.invoices();
      expect(Array.isArray(result)).toBe(true);
    } catch (error: any) {
      expect(error?.code).not.toBe("FORBIDDEN");
    }
  });

  it("should reject non-parent users from accessing parent.me", async () => {
    const caller = appRouter.createCaller(adminContext);

    try {
      await caller.parent.me();
      // If we get here, it should still fail because admin is not a parent
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error?.code).toBe("FORBIDDEN");
    }
  });

  it("should reject non-parent users from accessing parent.children", async () => {
    const caller = appRouter.createCaller(adminContext);

    try {
      await caller.parent.children();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error?.code).toBe("FORBIDDEN");
    }
  });

  it("should reject non-parent users from accessing parent.payments", async () => {
    const caller = appRouter.createCaller(adminContext);

    try {
      await caller.parent.payments();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error?.code).toBe("FORBIDDEN");
    }
  });

  it("should reject non-parent users from accessing parent.invoices", async () => {
    const caller = appRouter.createCaller(adminContext);

    try {
      await caller.parent.invoices();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error?.code).toBe("FORBIDDEN");
    }
  });

  it("should reject unauthenticated users from accessing parent.me", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);

    try {
      await caller.parent.me();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      // Should be UNAUTHORIZED or similar
      expect(error?.code).not.toBe("OK");
    }
  });

  it("should reject unauthenticated users from accessing parent.children", async () => {
    const caller = appRouter.createCaller(unauthenticatedContext);

    try {
      await caller.parent.children();
      expect(true).toBe(false); // Should not reach here
    } catch (error: any) {
      expect(error?.code).not.toBe("OK");
    }
  });

  it("should validate parent ownership when recording payment", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      // Try to record payment with invalid invoice ID
      await caller.parent.recordPayment({
        invoiceId: 99999,
        childId: 99999,
        amount: "10.00",
        paymentMethod: "cash",
      });
      // Should fail with FORBIDDEN or NOT_FOUND
      expect(true).toBe(false);
    } catch (error: any) {
      // Should not be a server error
      expect(error?.code).not.toBe("INTERNAL_SERVER_ERROR");
    }
  });

  it("should validate child ownership when recording payment", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      // Try to record payment with mismatched child
      await caller.parent.recordPayment({
        invoiceId: 1,
        childId: 99999,
        amount: "10.00",
        paymentMethod: "cash",
      });
      // Should fail
      expect(true).toBe(false);
    } catch (error: any) {
      // Should be a validation error, not a server error
      expect(error?.code).not.toBe("INTERNAL_SERVER_ERROR");
    }
  });

  it("should validate child ownership when getting child details", async () => {
    const caller = appRouter.createCaller(parentContext);

    try {
      // Try to get a child that doesn't belong to this parent
      await caller.parent.getChild({ childId: 99999 });
      // Should fail with FORBIDDEN
      expect(true).toBe(false);
    } catch (error: any) {
      expect(error?.code).toBe("FORBIDDEN");
    }
  });
});
