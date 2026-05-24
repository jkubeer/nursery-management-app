import { publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { hashPassword, verifyPassword, validatePassword, validateEmail } from "../passwordAuth";
import * as db from "../db";
import { sdk } from "../_core/sdk";

export const authRouter = router({
  me: publicProcedure.query((opts) => opts.ctx.user),

  logout: publicProcedure.mutation(({ ctx }) => {
    const cookieOptions = getSessionCookieOptions(ctx.req);
    ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
    return {
      success: true,
    } as const;
  }),

  // Password-based authentication
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        name: z.string().min(2, "Name must be at least 2 characters"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Validate email format
      if (!validateEmail(input.email)) {
        throw new Error("Invalid email address");
      }

      // Validate passwords match
      if (input.password !== input.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      // Validate password requirements
      const passwordValidation = validatePassword(input.password);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      // Check if user already exists
      const existingUser = await db.getUserByEmail(input.email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Hash password
      const passwordHash = await hashPassword(input.password);

      // Create user
      await db.createPasswordUser(input.email, input.name, passwordHash, "parent");

      return {
        success: true,
        message: "User registered successfully",
      };
    }),

  login: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Find user by email
      const user = await db.getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new Error("Invalid email or password");
      }

      // Verify password
      const passwordMatch = await verifyPassword(input.password, user.passwordHash);
      if (!passwordMatch) {
        throw new Error("Invalid email or password");
      }

      // Update last signed in
      await db.updateUserLastSignedIn(user.id);

      // Create session token using SDK
      const sessionToken = await sdk.createSessionToken(user.id.toString(), {
        name: user.name || "",
        expiresInMs: ONE_YEAR_MS,
      });

      // Set session cookie
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return {
        success: true,
        message: "Logged in successfully",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      };
    }),

  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email("Invalid email address"),
      })
    )
    .mutation(async ({ input }) => {
      const user = await db.getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        return {
          success: true,
          message: "If an account exists with this email, a password reset link has been sent.",
        };
      }

      const token = await db.createPasswordResetToken(input.email);
      if (!token) {
        throw new Error("Failed to generate password reset token");
      }

      return {
        success: true,
        message: "Password reset link has been sent to your email",
        token: token,
      };
    }),

  verifyResetToken: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .query(async ({ input }) => {
      const user = await db.verifyPasswordResetToken(input.token);
      if (!user) {
        return {
          valid: false,
          message: "Password reset link is invalid or has expired",
        };
      }

      return {
        valid: true,
        email: user.email,
      };
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        newPassword: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      if (input.newPassword !== input.confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const passwordValidation = validatePassword(input.newPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.errors.join(", "));
      }

      const user = await db.verifyPasswordResetToken(input.token);
      if (!user) {
        throw new Error("Password reset link is invalid or has expired");
      }

      const passwordHash = await hashPassword(input.newPassword);
      const success = await db.resetPasswordWithToken(input.token, passwordHash);
      if (!success) {
        throw new Error("Failed to reset password");
      }

      return {
        success: true,
        message: "Password has been reset successfully",
      };
    }),
});
