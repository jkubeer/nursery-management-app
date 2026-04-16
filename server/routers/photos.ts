import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import * as db from "../db.photos";
import { storagePut } from "../storage";
import { getDb } from "../db";
import { photos } from "../../drizzle/schema";

export const photosRouter = router({
  /**
   * Get all photos with optional filtering
   */
  list: protectedProcedure
    .input(
      z.object({
        activityId: z.number().optional(),
        isPublic: z.boolean().optional(),
      })
    )
    .query(async ({ input }) => {
      return await db.getAllPhotos(input);
    }),

  /**
   * Get photos for a specific child
   */
  getByChild: protectedProcedure
    .input(z.object({ childId: z.number() }))
    .query(async ({ input }) => {
      return await db.getChildPhotos(input.childId);
    }),

  /**
   * Get photos for an activity
   */
  getByActivity: protectedProcedure
    .input(z.object({ activityId: z.number() }))
    .query(async ({ input }) => {
      return await db.getActivityPhotos(input.activityId);
    }),

  /**
   * Get recent photos
   */
  getRecent: protectedProcedure
    .input(z.object({ limit: z.number().default(10) }))
    .query(async ({ input }) => {
      return await db.getRecentPhotos(input.limit);
    }),

  /**
   * Get photo statistics
   */
  getStats: protectedProcedure
    .input(z.void())
    .query(async () => {
      return await db.getPhotoStats();
    }),

  /**
   * Upload a photo
   */
  upload: protectedProcedure
    .input(
      z.object({
        file: z.instanceof(Buffer),
        fileName: z.string(),
        contentType: z.string().default("image/jpeg"),
        activityId: z.number().optional(),
        childrenIds: z.array(z.number()).optional(),
        caption: z.string().optional(),
        isPublic: z.boolean().default(false),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        // Upload to S3
        const photoKey = `photos/${Date.now()}-${input.fileName}`;
        const { url } = await storagePut(photoKey, input.file, input.contentType);

        // Save metadata to database
        const result = await db.createPhoto({
          activityId: input.activityId,
          childrenIds: input.childrenIds,
          photoUrl: url,
          photoKey,
          caption: input.caption,
          uploadedBy: ctx.user.id,
          isPublic: input.isPublic,
          tags: input.tags,
        });

        return {
          success: true,
          photoUrl: url,
          photoKey,
          message: "Photo uploaded successfully",
        };
      } catch (error) {
        console.error("Photo upload error:", error);
        throw new Error("Failed to upload photo");
      }
    }),

  /**
   * Update photo metadata
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        caption: z.string().optional(),
        isPublic: z.boolean().optional(),
        tags: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      await db.updatePhoto(id, updateData);
      return { success: true, message: "Photo updated successfully" };
    }),

  /**
   * Delete a photo
   */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db.deletePhoto(input.id);
      return { success: true, message: "Photo deleted successfully" };
    }),

  /**
   * Get photos shared with parents
   */
  getPublicPhotos: protectedProcedure
    .input(z.void())
    .query(async () => {
      return await db.getAllPhotos({ isPublic: true });
    }),

  /**
   * Toggle photo public/private status
   */
  togglePublic: protectedProcedure
    .input(z.object({ id: z.number(), isPublic: z.boolean() }))
    .mutation(async ({ input }) => {
      await db.updatePhoto(input.id, { isPublic: input.isPublic });
      return {
        success: true,
        message: `Photo is now ${input.isPublic ? "public" : "private"}`,
      };
    }),
});
