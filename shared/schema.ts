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
  cpfCnpj: text("cpf_cnpj"),
  phone: text("phone"),
  plantAddress: text("plant_address"),
  plantCapacity: text("plant_capacity"), // kWp
  ucCode: text("uc_code"),
  status: text("status", { enum: ["active", "inactive"] }).notNull().default("active"),
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

export const billingReports = pgTable("billing_reports", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  energiaInjetada: text("energia_injetada").notNull(), // text to keep it simple as before or numeric if needed
  energiaConsumida: text("energia_consumida").notNull(),
  saldoCredito: text("saldo_credito").notNull(),
  pdfUrl: text("pdf_url"),
  monthYear: text("month_year").notNull(), // keeping for compatibility with existing UI
  createdAt: timestamp("created_at").defaultNow(),
});

export const billingUnits = pgTable("billing_units", {
  id: serial("id").primaryKey(),
  billingReportId: integer("billing_report_id").notNull(),
  codigoCliente: text("codigo_cliente").notNull(),
  creditosRecebidos: text("creditos_recebidos").notNull().default("0"),
  consumoMes: text("consumo_mes").notNull().default("0"),
  saldoAcumulado: text("saldo_acumulado").notNull().default("0"),
  ehGeradora: boolean("eh_geradora").notNull().default(false),
});

export const unitNicknames = pgTable("unit_nicknames", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  unitCode: text("unit_code").notNull(),
  nickname: text("nickname").notNull(),
});

export const insertUnitNicknameSchema = createInsertSchema(unitNicknames).omit({ id: true });
export type UnitNickname = typeof unitNicknames.$inferSelect;
export type InsertUnitNickname = z.infer<typeof insertUnitNicknameSchema>;

export const billingHistory = pgTable("billing_history", {
  id: serial("id").primaryKey(),
  billingReportId: integer("billing_report_id").notNull(),
  mes: integer("mes").notNull(),
  ano: integer("ano").notNull(),
  energiaConsumida: text("energia_consumida").notNull(),
  energiaInjetada: text("energia_injetada").notNull(),
  kwhCompensado: text("kwh_compensado").notNull(),
  creditoGerado: text("credito_gerado").notNull(),
});

export const insertBillingReportSchema = createInsertSchema(billingReports).omit({ id: true, createdAt: true });
export const insertBillingUnitSchema = createInsertSchema(billingUnits).omit({ id: true });
export const insertBillingHistorySchema = createInsertSchema(billingHistory).omit({ id: true });

export type BillingReport = typeof billingReports.$inferSelect;
export type InsertBillingReport = z.infer<typeof insertBillingReportSchema>;
export type BillingUnit = typeof billingUnits.$inferSelect;
export type InsertBillingUnit = z.infer<typeof insertBillingUnitSchema>;
export type BillingHistory = typeof billingHistory.$inferSelect;
export type InsertBillingHistory = z.infer<typeof insertBillingHistorySchema>;

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
