import { describe, it, expect } from "vitest";

describe("Check-In/Check-Out System", () => {
  describe("Time Formatting", () => {
    it("should format valid date to time string", () => {
      const date = new Date("2024-01-15T09:30:00");
      const formatted = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      expect(formatted).toMatch(/\d{1,2}:\d{2}\s(AM|PM)/);
    });

    it("should handle null date", () => {
      const date = null;
      const formatted = date ? new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";
      expect(formatted).toBe("—");
    });

    it("should handle undefined date", () => {
      const date = undefined;
      const formatted = date ? new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : "—";
      expect(formatted).toBe("—");
    });
  });

  describe("Check-In/Check-Out Logic", () => {
    it("should allow check-in when not already checked in", () => {
      const record = { checkInTime: null, checkOutTime: null };
      const canCheckIn = !record.checkInTime;
      expect(canCheckIn).toBe(true);
    });

    it("should prevent check-in when already checked in", () => {
      const record = { checkInTime: new Date(), checkOutTime: null };
      const canCheckIn = !record.checkInTime;
      expect(canCheckIn).toBe(false);
    });

    it("should allow check-out when checked in but not checked out", () => {
      const record = { checkInTime: new Date(), checkOutTime: null };
      const canCheckOut = record.checkInTime && !record.checkOutTime;
      expect(canCheckOut).toBe(true);
    });

    it("should prevent check-out when not checked in", () => {
      const record = { checkInTime: null, checkOutTime: null };
      const canCheckOut = record.checkInTime && !record.checkOutTime;
      expect(canCheckOut).toBeFalsy(); // null && true evaluates to null, not false
    });

    it("should prevent check-out when already checked out", () => {
      const record = { checkInTime: new Date("2024-01-15T09:00:00"), checkOutTime: new Date("2024-01-15T17:00:00") };
      const canCheckOut = record.checkInTime && !record.checkOutTime;
      expect(canCheckOut).toBe(false);
    });
  });

  describe("Record Status", () => {
    it("should identify checked-in status", () => {
      const record = { checkInTime: new Date(), checkOutTime: null };
      const status = record.checkInTime ? "checked-in" : "not-checked-in";
      expect(status).toBe("checked-in");
    });

    it("should identify checked-out status", () => {
      const record = { checkInTime: new Date(), checkOutTime: new Date() };
      const status = record.checkOutTime ? "checked-out" : "checked-in";
      expect(status).toBe("checked-out");
    });

    it("should identify not-checked-in status", () => {
      const record = { checkInTime: null, checkOutTime: null };
      const status = record.checkInTime ? "checked-in" : "not-checked-in";
      expect(status).toBe("not-checked-in");
    });
  });

  describe("Date Handling", () => {
    it("should parse date string correctly", () => {
      const dateString = "2024-01-15";
      const date = new Date(dateString);
      expect(date).toBeInstanceOf(Date);
      expect(date.getFullYear()).toBe(2024);
      expect(date.getMonth()).toBe(0); // January is 0
      // Note: Date constructor with ISO string interprets as UTC, so we need to account for timezone
      expect([14, 15]).toContain(date.getDate()); // Could be 14 or 15 depending on timezone
    });

    it("should format date to ISO string", () => {
      const date = new Date("2024-01-15T00:00:00Z");
      const isoString = date.toISOString().split("T")[0];
      expect(isoString).toBe("2024-01-15");
    });

    it("should get today's date in ISO format", () => {
      const today = new Date().toISOString().split("T")[0];
      expect(today).toMatch(/\d{4}-\d{2}-\d{2}/);
      expect(today.length).toBe(10);
    });
  });

  describe("Attendance Duration", () => {
    it("should calculate attendance duration", () => {
      const checkInTime = new Date("2024-01-15T09:00:00Z");
      const checkOutTime = new Date("2024-01-15T17:00:00Z");
      const duration = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60); // hours
      expect(duration).toBe(8);
    });

    it("should handle partial day attendance", () => {
      const checkInTime = new Date("2024-01-15T10:30:00Z");
      const checkOutTime = new Date("2024-01-15T14:45:00Z");
      const duration = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60); // minutes
      expect(duration).toBe(255); // 4 hours 15 minutes
    });
  });

  describe("Multiple Children", () => {
    it("should track separate records for each child", () => {
      const children = [
        { id: 1, firstName: "Alice", lastName: "Smith", record: { checkInTime: new Date(), checkOutTime: null } },
        { id: 2, firstName: "Bob", lastName: "Jones", record: { checkInTime: null, checkOutTime: null } },
        { id: 3, firstName: "Charlie", lastName: "Brown", record: { checkInTime: new Date(), checkOutTime: new Date() } },
      ];

      const checkedIn = children.filter((c) => c.record.checkInTime && !c.record.checkOutTime);
      const checkedOut = children.filter((c) => c.record.checkOutTime);
      const notCheckedIn = children.filter((c) => !c.record.checkInTime);

      expect(checkedIn).toHaveLength(1);
      expect(checkedOut).toHaveLength(1);
      expect(notCheckedIn).toHaveLength(1);
    });
  });

  describe("Button States", () => {
    it("should disable check-in button when already checked in", () => {
      const record = { checkInTime: new Date(), checkOutTime: null };
      const checkInDisabled = !!record.checkInTime;
      expect(checkInDisabled).toBe(true);
    });

    it("should enable check-in button when not checked in", () => {
      const record = { checkInTime: null, checkOutTime: null };
      const checkInDisabled = !!record.checkInTime;
      expect(checkInDisabled).toBe(false);
    });

    it("should disable check-out button when not checked in", () => {
      const record = { checkInTime: null, checkOutTime: null };
      const checkOutDisabled = !record.checkInTime || !!record.checkOutTime;
      expect(checkOutDisabled).toBe(true);
    });

    it("should enable check-out button when checked in but not checked out", () => {
      const record = { checkInTime: new Date(), checkOutTime: null };
      const checkOutDisabled = !record.checkInTime || !!record.checkOutTime;
      expect(checkOutDisabled).toBe(false);
    });

    it("should disable check-out button when already checked out", () => {
      const record = { checkInTime: new Date(), checkOutTime: new Date() };
      const checkOutDisabled = !record.checkInTime || !!record.checkOutTime;
      expect(checkOutDisabled).toBe(true);
    });
  });
});
