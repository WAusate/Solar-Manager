import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Authentication
  setupAuth(app);

  // --- API Routes ---

  // 1. Alerts
  app.get(api.alerts.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;

    let alerts;
    if (user.role === 'client') {
      // Client sees only their alerts
      alerts = await storage.getAlerts(user.id);
    } else {
      // Admin sees all alerts
      alerts = await storage.getAllAlerts();
    }
    res.json(alerts);
  });

  app.patch(api.alerts.resolve.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Only admins can resolve alerts" });
    }

    const id = parseInt(req.params.id);
    const updated = await storage.resolveAlert(id);
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  });

  // 2. Reports
  app.get(api.reports.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    // For simplicity, admins see all, clients see theirs. 
    // If Admin needs to see all, we might need a separate getAllReports or filter logic in storage.
    // For now, let's assume reports are shared or specific.
    // Implementing same logic as alerts for safety:
    const reports = await storage.getReports(user.role === 'client' ? user.id : undefined);
    res.json(reports);
  });

  // 3. Dashboard Stats
  app.get(api.dashboard.stats.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Mock stats
    res.json({
      totalGeneration: "1,234 kWh",
      activeAlerts: 3,
      efficiency: "98%",
      savings: "R$ 450,00",
    });
  });

  // Seed Data (Check and create if missing)
  await seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const admin = await storage.getUserByUsername("admin@teste.com");
  if (!admin) {
    await storage.createUser({
      username: "admin@teste.com",
      password: "admin123", // In a real app, hash this!
      role: "admin",
      name: "Administrador Sistema",
      avatar: "https://github.com/shadcn.png"
    });
    console.log("Seeded admin user");
  }

  const client = await storage.getUserByUsername("cliente@teste.com");
  if (!client) {
    const newClient = await storage.createUser({
      username: "cliente@teste.com",
      password: "client123",
      role: "client",
      name: "João Silva",
      avatar: "https://github.com/shadcn.png"
    });
    console.log("Seeded client user");

    // Create some alerts for the client
    await storage.createAlert({
      title: "Baixa eficiência detectada",
      message: "O Inversor 01 está apresentando rendimento abaixo do esperado.",
      severity: "high",
      status: "active",
      plantName: "Usina Solar João Silva",
      userId: newClient.id,
    });
    await storage.createAlert({
      title: "Conexão instável",
      message: "Perda momentânea de conexão com o módulo de comunicação.",
      severity: "medium",
      status: "resolved",
      plantName: "Usina Solar João Silva",
      userId: newClient.id,
    });
    
    // Create an alert for another user (simulated) to test Admin view
    await storage.createAlert({
      title: "Falha na rede elétrica",
      message: "Queda de tensão detectada na rede da concessionária.",
      severity: "critical",
      status: "active",
      plantName: "Usina Industrial Norte",
      userId: 999, // Some other user
    });
  }
}
