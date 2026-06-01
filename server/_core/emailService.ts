import nodemailer from "nodemailer";
import { getDb } from "../db";
import { emailSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

let cachedTransporter: nodemailer.Transporter | null = null;

export async function getEmailTransporter() {
  // Check if we have cached transporter
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Get email settings from database
  const settings = await db.select().from(emailSettings).limit(1);
  
  if (!settings || settings.length === 0) {
    throw new Error("Email settings not configured. Please configure SMTP settings in Settings > Email.");
  }

  const config = settings[0];

  // Create transporter with SMTP settings
  cachedTransporter = nodemailer.createTransport({
    host: config.smtpHost,
    port: config.smtpPort,
    secure: config.smtpPort === 465, // true for 465, false for other ports
    auth: {
      user: config.smtpUser,
      pass: config.smtpPassword,
    },
  });

  return cachedTransporter;
}

export async function sendPasswordResetEmail(email: string, resetToken: string, resetUrl: string) {
  try {
    const transporter = await getEmailTransporter();
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const settings = await db.select().from(emailSettings).limit(1);
    if (!settings || settings.length === 0) {
      throw new Error("Email settings not configured");
    }

    const fromEmail = settings[0].fromEmail;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Password Reset Request",
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password:</p>
        <p><a href="${resetUrl}?token=${resetToken}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Password reset email sent:", result.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send password reset email:", error);
    return false;
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  try {
    const transporter = await getEmailTransporter();
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const settings = await db.select().from(emailSettings).limit(1);
    if (!settings || settings.length === 0) {
      throw new Error("Email settings not configured");
    }

    const fromEmail = settings[0].fromEmail;

    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: "Welcome to NurseCare",
      html: `
        <h2>Welcome, ${name}!</h2>
        <p>Your account has been created successfully.</p>
        <p>You can now log in to the NurseCare system with your email and password.</p>
        <p>If you have any questions, please contact support.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Welcome email sent:", result.messageId);
    return true;
  } catch (error) {
    console.error("Failed to send welcome email:", error);
    return false;
  }
}

export function resetTransporter() {
  cachedTransporter = null;
}
