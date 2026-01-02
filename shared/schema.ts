import { pgTable, text, serial, integer, boolean, timestamp, varchar, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["admin", "client"] }).notNull().default("client"),
  name: text("name").notNull(),
  avatar: text("avatar"),
});

export const alerts = pgTable("alerts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  severity: text("severity", { enum: ["low", "medium", "high", "critical"] }).notNull(),
  status: text("status", { enum: ["active", "resolved"] }).notNull().default("active"),
  plantName: text("plant_name").notNull(),
  // For simplicity, we'll assign alerts to a specific user (the client)
  // In a real app, this might link to a 'plants' table which links to users
  userId: integer("user_id"), 
  createdAt: timestamp("created_at").defaultNow(),
});

export const reports = pgTable("reports", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  userId: integer("user_id"), // Owner of the report
});

// === SCHEMAS ===

export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertAlertSchema = createInsertSchema(alerts).omit({ id: true, createdAt: true });
export const insertReportSchema = createInsertSchema(reports).omit({ id: true });

// === TYPES ===

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = z.infer<typeof insertAlertSchema>;

export type Report = typeof reports.$inferSelect;
export type InsertReport = z.infer<typeof insertReportSchema>;

// === API CONTRACT TYPES ===

export type AuthResponse = User;
export type LoginRequest = Pick<InsertUser, "username" | "password">;

export type AlertResponse = Alert;
export type AlertListResponse = Alert[];
export type UpdateAlertRequest = { status: "resolved" }; // Only allowing status update for now

export type ReportResponse = Report;
export type ReportListResponse = Report[];
