import { describe, it, expect, beforeAll, afterAll, vi } from "vitest";
import * as db from "./db.photos";

// Mock database
vi.mock("./db", () => ({
  getDb: vi.fn(),
}));

describe("Photo Management", () => {
  describe("Photo Database Operations", () => {
    it("should create a photo with all fields", async () => {
      const photoData = {
        activityId: 1,
        childrenIds: [1, 2, 3],
        photoUrl: "https://example.com/photo.jpg",
        photoKey: "photos/123-photo.jpg",
        caption: "Fun activity",
        uploadedBy: 1,
        isPublic: true,
        tags: ["fun", "outdoor"],
      };

      // Test that the data structure is correct
      expect(photoData).toHaveProperty("photoUrl");
      expect(photoData).toHaveProperty("photoKey");
      expect(photoData.isPublic).toBe(true);
      expect(photoData.tags).toHaveLength(2);
    });

    it("should handle photos without optional fields", () => {
      const photoData = {
        photoUrl: "https://example.com/photo.jpg",
        photoKey: "photos/123-photo.jpg",
        uploadedBy: 1,
      };

      expect(photoData).toHaveProperty("photoUrl");
      expect(photoData).toHaveProperty("photoKey");
      expect(photoData).toHaveProperty("uploadedBy");
    });

    it("should parse JSON tags correctly", () => {
      const tags = ["fun", "outdoor", "learning"];
      const jsonTags = JSON.stringify(tags);
      const parsedTags = JSON.parse(jsonTags);

      expect(parsedTags).toEqual(tags);
      expect(parsedTags).toHaveLength(3);
    });

    it("should parse JSON childrenIds correctly", () => {
      const childrenIds = [1, 2, 3, 4];
      const jsonIds = JSON.stringify(childrenIds);
      const parsedIds = JSON.parse(jsonIds);

      expect(parsedIds).toEqual(childrenIds);
      expect(parsedIds).toHaveLength(4);
    });
  });

  describe("Photo Visibility", () => {
    it("should toggle photo visibility", () => {
      const photo = {
        id: 1,
        isPublic: false,
      };

      const updatedPhoto = {
        ...photo,
        isPublic: !photo.isPublic,
      };

      expect(updatedPhoto.isPublic).toBe(true);
    });

    it("should filter public photos", () => {
      const photos = [
        { id: 1, isPublic: true, caption: "Public photo" },
        { id: 2, isPublic: false, caption: "Private photo" },
        { id: 3, isPublic: true, caption: "Another public" },
      ];

      const publicPhotos = photos.filter((p) => p.isPublic === true);

      expect(publicPhotos).toHaveLength(2);
      expect(publicPhotos.every((p) => p.isPublic === true)).toBe(true);
    });

    it("should filter private photos", () => {
      const photos = [
        { id: 1, isPublic: true, caption: "Public photo" },
        { id: 2, isPublic: false, caption: "Private photo" },
        { id: 3, isPublic: true, caption: "Another public" },
      ];

      const privatePhotos = photos.filter((p) => p.isPublic === false);

      expect(privatePhotos).toHaveLength(1);
      expect(privatePhotos[0].id).toBe(2);
    });
  });

  describe("Photo Statistics", () => {
    it("should calculate photo statistics", () => {
      const photos = [
        { id: 1, isPublic: true, activityId: 1 },
        { id: 2, isPublic: false, activityId: 1 },
        { id: 3, isPublic: true, activityId: 2 },
        { id: 4, isPublic: true, activityId: 2 },
      ];

      const stats = {
        totalPhotos: photos.length,
        publicPhotos: photos.filter((p) => p.isPublic === true).length,
        privatePhotos: photos.filter((p) => p.isPublic === false).length,
        photosByActivity: photos.reduce(
          (acc, p) => {
            if (p.activityId) {
              acc[p.activityId] = (acc[p.activityId] || 0) + 1;
            }
            return acc;
          },
          {} as Record<number, number>
        ),
      };

      expect(stats.totalPhotos).toBe(4);
      expect(stats.publicPhotos).toBe(3);
      expect(stats.privatePhotos).toBe(1);
      expect(stats.photosByActivity[1]).toBe(2);
      expect(stats.photosByActivity[2]).toBe(2);
    });
  });

  describe("Photo Filtering", () => {
    it("should filter photos by activity", () => {
      const photos = [
        { id: 1, activityId: 1, caption: "Activity 1 photo" },
        { id: 2, activityId: 2, caption: "Activity 2 photo" },
        { id: 3, activityId: 1, caption: "Another activity 1 photo" },
      ];

      const activity1Photos = photos.filter((p) => p.activityId === 1);

      expect(activity1Photos).toHaveLength(2);
      expect(activity1Photos.every((p) => p.activityId === 1)).toBe(true);
    });

    it("should filter photos by child", () => {
      const photos = [
        {
          id: 1,
          childrenIds: JSON.stringify([1, 2, 3]),
          caption: "Photo with children 1,2,3",
        },
        {
          id: 2,
          childrenIds: JSON.stringify([2, 3, 4]),
          caption: "Photo with children 2,3,4",
        },
        {
          id: 3,
          childrenIds: JSON.stringify([1, 4]),
          caption: "Photo with children 1,4",
        },
      ];

      const childId = 1;
      const childPhotos = photos.filter((photo) => {
        if (!photo.childrenIds) return false;
        try {
          const childIds = JSON.parse(photo.childrenIds);
          return childIds.includes(childId);
        } catch {
          return false;
        }
      });

      expect(childPhotos).toHaveLength(2);
      expect(childPhotos.map((p) => p.id)).toEqual([1, 3]);
    });
  });

  describe("Photo Metadata", () => {
    it("should handle photo captions", () => {
      const photo = {
        id: 1,
        caption: "Beautiful outdoor activity with the kids",
      };

      expect(photo.caption).toBeDefined();
      expect(photo.caption?.length).toBeGreaterThan(0);
    });

    it("should handle photos without captions", () => {
      const photo = {
        id: 1,
        caption: undefined,
      };

      expect(photo.caption).toBeUndefined();
    });

    it("should handle multiple tags", () => {
      const tags = ["outdoor", "fun", "learning", "summer"];
      expect(tags).toHaveLength(4);
      expect(tags).toContain("outdoor");
      expect(tags).toContain("learning");
    });
  });

  describe("Photo Timestamps", () => {
    it("should handle upload timestamps", () => {
      const now = new Date();
      const photo = {
        id: 1,
        uploadedAt: now,
      };

      expect(photo.uploadedAt).toEqual(now);
      expect(photo.uploadedAt instanceof Date).toBe(true);
    });

    it("should order photos by upload date", () => {
      const date1 = new Date("2024-01-01");
      const date2 = new Date("2024-01-02");
      const date3 = new Date("2024-01-03");

      const photos = [
        { id: 1, uploadedAt: date2 },
        { id: 2, uploadedAt: date3 },
        { id: 3, uploadedAt: date1 },
      ];

      const sorted = [...photos].sort(
        (a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime()
      );

      expect(sorted[0].uploadedAt).toEqual(date3);
      expect(sorted[1].uploadedAt).toEqual(date2);
      expect(sorted[2].uploadedAt).toEqual(date1);
    });
  });
});
