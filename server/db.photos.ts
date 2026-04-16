import { getDb } from "./db";
import { photos, activities, children, staff } from "../drizzle/schema";
import { eq, and, desc, inArray } from "drizzle-orm";

/**
 * Get all photos with optional filtering
 */
export async function getAllPhotos(filters?: {
  activityId?: number;
  childId?: number;
  isPublic?: boolean;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const conditions = [];

  if (filters?.activityId) {
    conditions.push(eq(photos.activityId, filters.activityId));
  }

  if (filters?.isPublic !== undefined) {
    conditions.push(eq(photos.isPublic, filters.isPublic));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  return db
    .select()
    .from(photos)
    .where(whereClause)
    .orderBy(desc(photos.uploadedAt));
}

/**
 * Get photos for a specific child
 */
export async function getChildPhotos(childId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all photos and filter in memory since childrenIds is JSON
  const allPhotos = await db
    .select()
    .from(photos)
    .orderBy(desc(photos.uploadedAt));

  return allPhotos.filter((photo) => {
    if (!photo.childrenIds) return false;
    try {
      const childIds = JSON.parse(photo.childrenIds);
      return childIds.includes(childId);
    } catch {
      return false;
    }
  });
}

/**
 * Get photos for an activity
 */
export async function getActivityPhotos(activityId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(photos)
    .where(eq(photos.activityId, activityId))
    .orderBy(desc(photos.uploadedAt));
}

/**
 * Create a new photo record
 */
export async function createPhoto(data: {
  activityId?: number;
  childrenIds?: number[];
  photoUrl: string;
  photoKey: string;
  caption?: string;
  uploadedBy: number;
  isPublic?: boolean;
  tags?: string[];
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(photos).values({
    activityId: data.activityId,
    childrenIds: data.childrenIds ? JSON.stringify(data.childrenIds) : null,
    photoUrl: data.photoUrl,
    photoKey: data.photoKey,
    caption: data.caption,
    uploadedBy: data.uploadedBy,
    isPublic: data.isPublic ?? false,
    tags: data.tags ? JSON.stringify(data.tags) : null,
  });

  return result;
}

/**
 * Update photo metadata
 */
export async function updatePhoto(
  photoId: number,
  data: {
    caption?: string;
    isPublic?: boolean;
    tags?: string[];
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(photos)
    .set({
      caption: data.caption,
      isPublic: data.isPublic,
      tags: data.tags ? JSON.stringify(data.tags) : undefined,
    })
    .where(eq(photos.id, photoId));
}

/**
 * Delete a photo
 */
export async function deletePhoto(photoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.delete(photos).where(eq(photos.id, photoId));
}

/**
 * Get photos shared with a specific parent
 */
export async function getParentSharedPhotos(parentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get all children associated with this parent
  // Then get photos that include those children

  return db
    .select()
    .from(photos)
    .where(eq(photos.isPublic, true))
    .orderBy(desc(photos.uploadedAt));
}

/**
 * Get photo statistics
 */
export async function getPhotoStats() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const allPhotos = await db.select().from(photos);

  return {
    totalPhotos: allPhotos.length,
    publicPhotos: allPhotos.filter((p) => p.isPublic === true).length,
    privatePhotos: allPhotos.filter((p) => p.isPublic === false).length,
    photosByActivity: allPhotos.reduce(
      (acc, p) => {
        if (p.activityId) {
          acc[p.activityId] = (acc[p.activityId] || 0) + 1;
        }
        return acc;
      },
      {} as Record<number, number>
    ),
  };
}

/**
 * Get recent photos
 */
export async function getRecentPhotos(limit: number = 10) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .select()
    .from(photos)
    .orderBy(desc(photos.uploadedAt))
    .limit(limit);
}
