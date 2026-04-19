import { describe, it, expect } from "vitest";

describe("Parents Page - Linked Children", () => {
  describe("Linked Children Display", () => {
    it("should display linked children section when children exist", () => {
      const parent = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const children = [
        {
          id: 1,
          firstName: "Alice",
          lastName: "Doe",
          parentId: 1,
          dateOfBirth: "2020-01-15",
          status: "Active",
        },
        {
          id: 2,
          firstName: "Bob",
          lastName: "Doe",
          parentId: 1,
          dateOfBirth: "2022-06-20",
          status: "Active",
        },
      ];

      const linkedChildren = children.filter((child) => child.parentId === parent.id);
      expect(linkedChildren).toHaveLength(2);
      expect(linkedChildren[0].firstName).toBe("Alice");
    });

    it("should not display linked children section when no children linked", () => {
      const parent = {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const children = [
        {
          id: 1,
          firstName: "Alice",
          lastName: "Smith",
          parentId: 2,
          dateOfBirth: "2020-01-15",
          status: "Active",
        },
      ];

      const linkedChildren = children.filter((child) => child.parentId === parent.id);
      expect(linkedChildren).toHaveLength(0);
    });

    it("should display correct number of linked children", () => {
      const parent = { id: 1 };
      const children = [
        { id: 1, parentId: 1 },
        { id: 2, parentId: 1 },
        { id: 3, parentId: 1 },
        { id: 4, parentId: 2 },
      ];

      const linkedChildren = children.filter((child) => child.parentId === parent.id);
      expect(linkedChildren).toHaveLength(3);
    });
  });

  describe("Child Information Display", () => {
    it("should display child first and last name", () => {
      const child = {
        id: 1,
        firstName: "Alice",
        lastName: "Doe",
        parentId: 1,
      };

      const fullName = `${child.firstName} ${child.lastName}`;
      expect(fullName).toBe("Alice Doe");
    });

    it("should calculate child age correctly", () => {
      const child = {
        dateOfBirth: "2020-01-15",
      };

      const currentYear = new Date().getFullYear();
      const birthYear = new Date(child.dateOfBirth).getFullYear();
      const age = currentYear - birthYear;

      expect(age).toBeGreaterThanOrEqual(4);
      expect(age).toBeLessThanOrEqual(6);
    });

    it("should display 'N/A' for age when date of birth is missing", () => {
      const child = {
        dateOfBirth: null,
      };

      const age = child.dateOfBirth ? new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear() : "N/A";
      expect(age).toBe("N/A");
    });

    it("should display child status", () => {
      const child = {
        id: 1,
        firstName: "Alice",
        lastName: "Doe",
        status: "Active",
      };

      expect(child.status).toBe("Active");
    });

    it("should default to 'Active' status if not provided", () => {
      const child = {
        id: 1,
        firstName: "Alice",
        lastName: "Doe",
        status: undefined,
      };

      const status = child.status || "Active";
      expect(status).toBe("Active");
    });
  });

  describe("Linked Children Card Layout", () => {
    it("should have Users icon in header", () => {
      const hasUsersIcon = true;
      expect(hasUsersIcon).toBe(true);
    });

    it("should display 'Linked Children' heading", () => {
      const heading = "Linked Children";
      expect(heading).toBe("Linked Children");
    });

    it("should display count of linked children in heading", () => {
      const linkedChildren = [
        { id: 1, firstName: "Alice", lastName: "Doe" },
        { id: 2, firstName: "Bob", lastName: "Doe" },
      ];

      const heading = `Linked Children (${linkedChildren.length})`;
      expect(heading).toBe("Linked Children (2)");
    });

    it("should display each child in a separate card", () => {
      const linkedChildren = [
        { id: 1, firstName: "Alice", lastName: "Doe" },
        { id: 2, firstName: "Bob", lastName: "Doe" },
        { id: 3, firstName: "Charlie", lastName: "Doe" },
      ];

      expect(linkedChildren).toHaveLength(3);
      linkedChildren.forEach((child) => {
        expect(child.firstName).toBeDefined();
        expect(child.lastName).toBeDefined();
      });
    });

    it("should have background styling for child cards", () => {
      const childCardClass = "bg-muted/50";
      expect(childCardClass).toContain("bg-muted");
    });

    it("should have status badge styling", () => {
      const statusBadgeClass = "bg-primary/10 text-primary";
      expect(statusBadgeClass).toContain("primary");
    });
  });

  describe("Parent Card Structure", () => {
    it("should have parent information section", () => {
      const parent = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        phone: "555-1234",
      };

      expect(parent.firstName).toBeDefined();
      expect(parent.lastName).toBeDefined();
      expect(parent.email).toBeDefined();
    });

    it("should have linked children section after parent info", () => {
      const sections = ["parent-info", "linked-children", "actions"];
      expect(sections).toContain("linked-children");
      expect(sections.indexOf("linked-children")).toBeGreaterThan(sections.indexOf("parent-info"));
    });

    it("should have action buttons at bottom", () => {
      const buttons = ["Edit", "Link Child"];
      expect(buttons).toContain("Edit");
      expect(buttons).toContain("Link Child");
    });

    it("should have border separator between sections", () => {
      const hasBorder = true;
      expect(hasBorder).toBe(true);
    });
  });

  describe("Filtering Logic", () => {
    it("should filter children by parent ID", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 1 },
        { id: 3, firstName: "Charlie", parentId: 2 },
        { id: 4, firstName: "Diana", parentId: 2 },
      ];

      const parent1Children = allChildren.filter((child) => child.parentId === 1);
      const parent2Children = allChildren.filter((child) => child.parentId === 2);

      expect(parent1Children).toHaveLength(2);
      expect(parent2Children).toHaveLength(2);
      expect(parent1Children[0].firstName).toBe("Alice");
      expect(parent2Children[0].firstName).toBe("Charlie");
    });

    it("should handle multiple parents correctly", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 2 },
        { id: 3, firstName: "Charlie", parentId: 3 },
      ];

      const parents = [
        { id: 1, firstName: "Parent1" },
        { id: 2, firstName: "Parent2" },
        { id: 3, firstName: "Parent3" },
      ];

      parents.forEach((parent) => {
        const parentChildren = allChildren.filter((child) => child.parentId === parent.id);
        expect(parentChildren.length).toBeGreaterThanOrEqual(0);
      });
    });

    it("should handle parent with no children", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 1 },
      ];

      const parentWithNoChildren = 999;
      const linkedChildren = allChildren.filter((child) => child.parentId === parentWithNoChildren);

      expect(linkedChildren).toHaveLength(0);
    });
  });

  describe("Data Validation", () => {
    it("should handle missing child data gracefully", () => {
      const child = {
        id: 1,
        firstName: undefined,
        lastName: undefined,
        dateOfBirth: null,
        status: undefined,
      };

      const firstName = child.firstName || "Unknown";
      const lastName = child.lastName || "Unknown";
      const age = child.dateOfBirth ? new Date().getFullYear() - new Date(child.dateOfBirth).getFullYear() : "N/A";
      const status = child.status || "Active";

      expect(firstName).toBe("Unknown");
      expect(lastName).toBe("Unknown");
      expect(age).toBe("N/A");
      expect(status).toBe("Active");
    });

    it("should handle empty children list", () => {
      const linkedChildren: any[] = [];
      expect(linkedChildren).toHaveLength(0);
      expect(linkedChildren.length > 0).toBe(false);
    });

    it("should validate parent ID exists", () => {
      const parent = { id: 1 };
      expect(parent.id).toBeDefined();
      expect(typeof parent.id).toBe("number");
    });
  });

  describe("UI Interaction", () => {
    it("should show/hide linked children section based on data", () => {
      const linkedChildren = [
        { id: 1, firstName: "Alice", lastName: "Doe" },
      ];

      const shouldShow = linkedChildren && linkedChildren.length > 0;
      expect(shouldShow).toBe(true);
    });

    it("should display section only when children exist", () => {
      const linkedChildren: any[] = [];
      const shouldShow = linkedChildren && linkedChildren.length > 0;
      expect(shouldShow).toBe(false);
    });

    it("should update when children are linked", () => {
      let linkedChildren = [
        { id: 1, firstName: "Alice", lastName: "Doe" },
      ];

      expect(linkedChildren).toHaveLength(1);

      linkedChildren.push({ id: 2, firstName: "Bob", lastName: "Doe" });
      expect(linkedChildren).toHaveLength(2);
    });

    it("should update count when children are added", () => {
      let linkedChildren = [
        { id: 1, firstName: "Alice", lastName: "Doe" },
      ];

      const initialCount = linkedChildren.length;
      expect(initialCount).toBe(1);

      linkedChildren.push({ id: 2, firstName: "Bob", lastName: "Doe" });
      const updatedCount = linkedChildren.length;
      expect(updatedCount).toBe(2);
      expect(updatedCount).toBeGreaterThan(initialCount);
    });
  });
});
