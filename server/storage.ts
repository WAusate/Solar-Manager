import { db } from "./db";
import { users, alerts, reports, billingReports, billingUnits, billingHistory, unitNicknames, type User, type InsertUser, type Alert, type InsertAlert, type Report, type BillingReport, type InsertBillingReport, type BillingUnit, type InsertBillingUnit, type BillingHistory, type InsertBillingHistory, type UnitNickname, type InsertUnitNickname } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";

const PostgresSessionStore = connectPg(session);

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  getAlerts(userId?: number): Promise<Alert[]>; // If userId is provided, filter by it (for clients)
  getAllAlerts(): Promise<Alert[]>; // For admins
  createAlert(alert: InsertAlert): Promise<Alert>;
  resolveAlert(id: number): Promise<Alert | undefined>;

  getReports(userId?: number): Promise<Report[]>;
  
  // Clients CRUD
  getClients(): Promise<User[]>;
  updateClient(id: number, client: Partial<InsertUser>): Promise<User | undefined>;
  deleteClient(id: number): Promise<boolean>;
  
  // Billing Reports
  getBillingReports(userId?: number): Promise<BillingReport[]>;
  createBillingReport(report: InsertBillingReport): Promise<BillingReport>;
  
  // New billing data methods
  getBillingUnits(reportId: number): Promise<BillingUnit[]>;
  createBillingUnit(unit: InsertBillingUnit): Promise<BillingUnit>;
  getBillingHistory(reportId: number): Promise<BillingHistory[]>;
  createBillingHistory(history: InsertBillingHistory): Promise<BillingHistory>;

  // Unit Nicknames
  getUnitNicknames(userId: number): Promise<UnitNickname[]>;
  upsertUnitNickname(nickname: InsertUnitNickname): Promise<UnitNickname>;

  sessionStore: session.Store;
}

export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({
      pool,
      createTableIfMissing: true,
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAlerts(userId?: number): Promise<Alert[]> {
    if (userId) {
      return db.select().from(alerts).where(eq(alerts.userId, userId)).orderBy(desc(alerts.createdAt));
    }
    // If no userId, return all? Or maybe just return empty if stricter. 
    // But for this specific method signature, let's assume it's for specific user fetching.
    return db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async getAllAlerts(): Promise<Alert[]> {
    return db.select().from(alerts).orderBy(desc(alerts.createdAt));
  }

  async createAlert(alert: InsertAlert): Promise<Alert> {
    const [newAlert] = await db.insert(alerts).values(alert).returning();
    return newAlert;
  }

  async resolveAlert(id: number): Promise<Alert | undefined> {
    const [updated] = await db.update(alerts)
      .set({ status: 'resolved' })
      .where(eq(alerts.id, id))
      .returning();
    return updated;
  }

  async getReports(userId?: number): Promise<Report[]> {
    if (userId) {
      return db.select().from(reports).where(eq(reports.userId, userId)).orderBy(desc(reports.date));
    }
    return db.select().from(reports).orderBy(desc(reports.date));
  }

  async getClients(): Promise<User[]> {
    return db.select().from(users).where(eq(users.role, 'client'));
  }

  async updateClient(id: number, client: Partial<InsertUser>): Promise<User | undefined> {
    const [updated] = await db.update(users)
      .set(client)
      .where(eq(users.id, id))
      .returning();
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    const [deleted] = await db.delete(users).where(eq(users.id, id)).returning();
    return !!deleted;
  }

  async getBillingReports(userId?: number): Promise<BillingReport[]> {
    if (userId) {
      return db.select().from(billingReports).where(eq(billingReports.userId, userId)).orderBy(desc(billingReports.createdAt));
    }
    return db.select().from(billingReports).orderBy(desc(billingReports.createdAt));
  }

  async createBillingReport(report: InsertBillingReport): Promise<BillingReport> {
    const [newReport] = await db.insert(billingReports).values(report).returning();
    return newReport;
  }

  async getBillingUnits(reportId: number): Promise<BillingUnit[]> {
    return db.select().from(billingUnits).where(eq(billingUnits.billingReportId, reportId));
  }

  async createBillingUnit(unit: InsertBillingUnit): Promise<BillingUnit> {
    const [newUnit] = await db.insert(billingUnits).values(unit).returning();
    return newUnit;
  }

  async getBillingHistory(reportId: number): Promise<BillingHistory[]> {
    return db.select().from(billingHistory).where(eq(billingHistory.billingReportId, reportId));
  }

  async createBillingHistory(history: InsertBillingHistory): Promise<BillingHistory> {
    const [newHistory] = await db.insert(billingHistory).values(history).returning();
    return newHistory;
  }

  async getUnitNicknames(userId: number): Promise<UnitNickname[]> {
    return db.select().from(unitNicknames).where(eq(unitNicknames.userId, userId));
  }

  async upsertUnitNickname(nickname: InsertUnitNickname): Promise<UnitNickname> {
    const [existing] = await db.select().from(unitNicknames).where(
      and(
        eq(unitNicknames.userId, nickname.userId),
        eq(unitNicknames.unitCode, nickname.unitCode)
      )
    );

    if (existing) {
      const [updated] = await db.update(unitNicknames)
        .set({ nickname: nickname.nickname })
        .where(eq(unitNicknames.id, existing.id))
        .returning();
      return updated;
    }

    const [newNickname] = await db.insert(unitNicknames).values(nickname).returning();
    return newNickname;
  }
}

export const storage = new DatabaseStorage();
