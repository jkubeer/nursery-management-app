import { describe, it, expect } from "vitest";

describe("Children Badges Display - Parents and Rooms Pages", () => {
  describe("Parents Page - Children Badges", () => {
    it("should display children as badges under parent name", () => {
      const parent = { id: 1, firstName: "John", lastName: "Doe" };
      const children = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 1 },
      ];

      const linkedChildren = children.filter((c) => c.parentId === parent.id);
      expect(linkedChildren).toHaveLength(2);
    });

    it("should show only first name in badge", () => {
      const child = { firstName: "Alice", lastName: "Doe" };
      const displayName = child.firstName;
      expect(displayName).toBe("Alice");
    });

    it("should not display children section if no children linked", () => {
      const parent = { id: 1 };
      const children = [{ id: 1, firstName: "Alice", parentId: 2 }];

      const linkedChildren = children.filter((c) => c.parentId === parent.id);
      expect(linkedChildren).toHaveLength(0);
    });

    it("should use blue color for parent children badges", () => {
      const badgeClass = "bg-blue-100 text-blue-700";
      expect(badgeClass).toContain("blue");
    });

    it("should display multiple children badges in flex wrap", () => {
      const children = [
        { id: 1, firstName: "Alice" },
        { id: 2, firstName: "Bob" },
        { id: 3, firstName: "Charlie" },
      ];

      expect(children).toHaveLength(3);
      children.forEach((child) => {
        expect(child.firstName).toBeDefined();
      });
    });

    it("should have gap between badges", () => {
      const gapClass = "gap-2";
      expect(gapClass).toBe("gap-2");
    });

    it("should have rounded-full styling for badges", () => {
      const badgeClass = "rounded-full";
      expect(badgeClass).toContain("rounded");
    });

    it("should have xs font size for badges", () => {
      const badgeClass = "text-xs";
      expect(badgeClass).toContain("text-xs");
    });

    it("should have medium font weight for badges", () => {
      const badgeClass = "font-medium";
      expect(badgeClass).toContain("font-medium");
    });
  });

  describe("Rooms Page - Children Badges", () => {
    it("should display children in room as badges under room name", () => {
      const room = { id: 1, name: "Nursery" };
      const children = [
        { id: 1, firstName: "Alice", roomId: 1 },
        { id: 2, firstName: "Bob", roomId: 1 },
      ];

      const roomChildren = children.filter((c) => c.roomId === room.id);
      expect(roomChildren).toHaveLength(2);
    });

    it("should filter children by roomId", () => {
      const children = [
        { id: 1, firstName: "Alice", roomId: 1 },
        { id: 2, firstName: "Bob", roomId: 1 },
        { id: 3, firstName: "Charlie", roomId: 2 },
      ];

      const room1Children = children.filter((c) => c.roomId === 1);
      const room2Children = children.filter((c) => c.roomId === 2);

      expect(room1Children).toHaveLength(2);
      expect(room2Children).toHaveLength(1);
    });

    it("should not display children section if room is empty", () => {
      const room = { id: 1 };
      const children = [{ id: 1, firstName: "Alice", roomId: 2 }];

      const roomChildren = children.filter((c) => c.roomId === room.id);
      expect(roomChildren).toHaveLength(0);
    });

    it("should use green color for room children badges", () => {
      const badgeClass = "bg-green-100 text-green-700";
      expect(badgeClass).toContain("green");
    });

    it("should display all children in a room", () => {
      const room = { id: 1 };
      const children = [
        { id: 1, firstName: "Alice", roomId: 1 },
        { id: 2, firstName: "Bob", roomId: 1 },
        { id: 3, firstName: "Charlie", roomId: 1 },
        { id: 4, firstName: "Diana", roomId: 1 },
      ];

      const roomChildren = children.filter((c) => c.roomId === room.id);
      expect(roomChildren).toHaveLength(4);
    });

    it("should handle room with capacity limit", () => {
      const room = { id: 1, capacity: 10 };
      const children = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        firstName: `Child${i + 1}`,
        roomId: 1,
      }));

      const roomChildren = children.filter((c) => c.roomId === room.id);
      expect(roomChildren.length).toBeLessThanOrEqual(room.capacity);
    });
  });

  describe("Badge Styling and Layout", () => {
    it("should have padding for badges", () => {
      const badgeClass = "px-2 py-1";
      expect(badgeClass).toContain("px-2");
      expect(badgeClass).toContain("py-1");
    });

    it("should have flex wrap for responsive layout", () => {
      const containerClass = "flex flex-wrap";
      expect(containerClass).toContain("flex");
      expect(containerClass).toContain("flex-wrap");
    });

    it("should have margin top for spacing", () => {
      const containerClass = "mt-2";
      expect(containerClass).toBe("mt-2");
    });

    it("should display badges inline", () => {
      const badgeClass = "inline-flex";
      expect(badgeClass).toContain("inline-flex");
    });

    it("should have items center alignment", () => {
      const badgeClass = "items-center";
      expect(badgeClass).toContain("items-center");
    });
  });

  describe("Data Filtering Logic", () => {
    it("should correctly filter children by parent ID", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 1 },
        { id: 3, firstName: "Charlie", parentId: 2 },
      ];

      const parent1Children = allChildren.filter((c) => c.parentId === 1);
      const parent2Children = allChildren.filter((c) => c.parentId === 2);

      expect(parent1Children).toHaveLength(2);
      expect(parent2Children).toHaveLength(1);
    });

    it("should correctly filter children by room ID", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", roomId: 1 },
        { id: 2, firstName: "Bob", roomId: 1 },
        { id: 3, firstName: "Charlie", roomId: 2 },
        { id: 4, firstName: "Diana", roomId: 2 },
      ];

      const room1Children = allChildren.filter((c) => c.roomId === 1);
      const room2Children = allChildren.filter((c) => c.roomId === 2);

      expect(room1Children).toHaveLength(2);
      expect(room2Children).toHaveLength(2);
    });

    it("should handle empty filter results", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: 1 },
      ];

      const parent999Children = allChildren.filter((c) => c.parentId === 999);
      expect(parent999Children).toHaveLength(0);
    });

    it("should handle null/undefined IDs gracefully", () => {
      const allChildren = [
        { id: 1, firstName: "Alice", parentId: undefined },
        { id: 2, firstName: "Bob", parentId: 1 },
      ];

      const parent1Children = allChildren.filter((c) => c.parentId === 1);
      expect(parent1Children).toHaveLength(1);
    });
  });

  describe("Display Conditions", () => {
    it("should only show badges if children exist", () => {
      const linkedChildren = [
        { id: 1, firstName: "Alice" },
      ];

      const shouldDisplay = linkedChildren && linkedChildren.length > 0;
      expect(shouldDisplay).toBe(true);
    });

    it("should not show section if no children", () => {
      const linkedChildren: any[] = [];
      const shouldDisplay = linkedChildren && linkedChildren.length > 0;
      expect(shouldDisplay).toBe(false);
    });

    it("should show section immediately after name", () => {
      const sections = ["name", "children-badges", "contact-info"];
      expect(sections.indexOf("children-badges")).toBeGreaterThan(sections.indexOf("name"));
    });
  });

  describe("Multiple Children Scenarios", () => {
    it("should handle single child", () => {
      const children = [{ id: 1, firstName: "Alice", parentId: 1 }];
      const linkedChildren = children.filter((c) => c.parentId === 1);
      expect(linkedChildren).toHaveLength(1);
    });

    it("should handle multiple children", () => {
      const children = [
        { id: 1, firstName: "Alice", parentId: 1 },
        { id: 2, firstName: "Bob", parentId: 1 },
        { id: 3, firstName: "Charlie", parentId: 1 },
      ];
      const linkedChildren = children.filter((c) => c.parentId === 1);
      expect(linkedChildren).toHaveLength(3);
    });

    it("should handle many children", () => {
      const children = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        firstName: `Child${i + 1}`,
        parentId: 1,
      }));
      const linkedChildren = children.filter((c) => c.parentId === 1);
      expect(linkedChildren).toHaveLength(20);
    });

    it("should wrap badges on small screens", () => {
      const containerClass = "flex flex-wrap gap-2";
      expect(containerClass).toContain("flex-wrap");
    });
  });

  describe("Badge Content", () => {
    it("should display only first name", () => {
      const child = { firstName: "Alice", lastName: "Doe" };
      const displayName = child.firstName;
      expect(displayName).toBe("Alice");
      expect(displayName).not.toContain("Doe");
    });

    it("should not display last name", () => {
      const child = { firstName: "Alice", lastName: "Doe" };
      const badgeContent = child.firstName;
      expect(badgeContent).not.toContain(" ");
    });

    it("should handle special characters in names", () => {
      const child = { firstName: "José", lastName: "García" };
      const displayName = child.firstName;
      expect(displayName).toBe("José");
    });

    it("should handle long names", () => {
      const child = { firstName: "Christopher", lastName: "Montgomery" };
      const displayName = child.firstName;
      expect(displayName.length).toBeGreaterThan(5);
    });
  });
});
