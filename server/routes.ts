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

  // 4. Clients CRUD (Admin only)
  app.get("/api/clients", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const clients = await storage.getClients();
    res.json(clients);
  });

  app.post("/api/clients", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    try {
      const existing = await storage.getUserByUsername(req.body.username);
      if (existing) {
        return res.status(400).json({ message: "Email já cadastrado" });
      }
      const client = await storage.createUser({
        ...req.body,
        role: 'client',
        avatar: req.body.avatar || `https://avatar.iran.liara.run/username?username=${encodeURIComponent(req.body.name)}`
      });
      res.status(201).json(client);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
  });

  app.put("/api/clients/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const id = parseInt(req.params.id);
    const updated = await storage.updateClient(id, req.body);
    if (!updated) return res.sendStatus(404);
    res.json(updated);
  });

  app.delete("/api/clients/:id", async (req, res) => {
    if (!req.isAuthenticated() || (req.user as any).role !== 'admin') {
      return res.sendStatus(403);
    }
    const id = parseInt(req.params.id);
    const success = await storage.deleteClient(id);
    if (!success) return res.sendStatus(404);
    res.sendStatus(204);
  });

  // 5. Billing Reports
  app.get("/api/billing-reports", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    
    let userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
    
    if (user.role === 'client') {
      userId = user.id;
    }
    
    const reports = await storage.getBillingReports(userId);
    
    // Get nicknames for all users involved if admin, or just current user
    const userNicknamesMap = new Map<number, any>();

    // Enrich reports with units and history if requested
    const enrichedReports = await Promise.all(reports.map(async (report) => {
      const units = await storage.getBillingUnits(report.id);
      const history = await storage.getBillingHistory(report.id);
      
      // Get nicknames for this report's user
      if (!userNicknamesMap.has(report.userId)) {
        const nicknames = await storage.getUnitNicknames(report.userId);
        userNicknamesMap.set(report.userId, nicknames);
      }
      const nicknames = userNicknamesMap.get(report.userId);

      const unitsWithNicknames = units.map(unit => {
        const nicknameObj = nicknames.find((n: any) => n.unitCode === unit.codigoCliente);
        return { ...unit, nickname: nicknameObj?.nickname };
      });
      
      // Calculate energiaConsumida as the sum of consumoMes from all units
      let calculatedConsumida = report.energiaConsumida;
      if (units.length > 0) {
        const sum = units.reduce((acc, unit) => acc + parseFloat(unit.consumoMes || "0"), 0);
        calculatedConsumida = sum.toString();
      }

      // Format monthYear dynamically in PT-BR (e.g., Dezembro/2025)
      const months = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      const monthName = months[report.mes - 1] || "Janeiro";
      const formattedMonthYear = `${monthName}/${report.ano}`;

      return { 
        ...report, 
        units: unitsWithNicknames, 
        history,
        energiaConsumida: calculatedConsumida,
        monthYear: formattedMonthYear
      };
    }));
    
    res.json(enrichedReports);
  });

  app.post("/api/unit-nicknames", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const user = req.user as any;
    
    // Admins can set nicknames for any user, clients only for themselves
    let userId = user.id;
    if (user.role === 'admin' && req.body.userId) {
      userId = parseInt(req.body.userId);
    }

    try {
      const nickname = await storage.upsertUnitNickname({
        userId,
        unitCode: req.body.unitCode,
        nickname: req.body.nickname
      });
      res.json(nickname);
    } catch (e: any) {
      res.status(400).json({ message: e.message });
    }
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
    
    // Seed Billing Reports for client
    const existingBilling = await storage.getBillingReports(newClient.id);
    if (existingBilling.length === 0) {
      // Create December 2025 Report (Orlando Andre Avelino)
      const decReport = await storage.createBillingReport({
        userId: newClient.id,
        mes: 12,
        ano: 2025,
        energiaInjetada: "641",
        energiaConsumida: "591",
        saldoCredito: "1526.51",
        monthYear: "Dezembro/2025",
        pdfUrl: "/reports/dec-2025.pdf"
      });

      // Add units for Dec 2025
      await storage.createBillingUnit({
        billingReportId: decReport.id,
        codigoCliente: "98097023",
        creditosRecebidos: "0",
        consumoMes: "112",
        saldoAcumulado: "0",
        ehGeradora: true
      });
      await storage.createBillingUnit({
        billingReportId: decReport.id,
        codigoCliente: "7051574928",
        creditosRecebidos: "272.17",
        consumoMes: "211",
        saldoAcumulado: "1019.85",
        ehGeradora: false
      });
      await storage.createBillingUnit({
        billingReportId: decReport.id,
        codigoCliente: "7051590516",
        creditosRecebidos: "272.17",
        consumoMes: "268",
        saldoAcumulado: "506.66",
        ehGeradora: false
      });

      // Add 13 months history
      const historyMonths = [
        {m: 12, y: 2024}, {m: 1, y: 2025}, {m: 2, y: 2025}, {m: 3, y: 2025},
        {m: 4, y: 2025}, {m: 5, y: 2025}, {m: 6, y: 2025}, {m: 7, y: 2025},
        {m: 8, y: 2025}, {m: 9, y: 2025}, {m: 10, y: 2025}, {m: 11, y: 2025}, {m: 12, y: 2025}
      ];

      for (const h of historyMonths) {
        await storage.createBillingHistory({
          billingReportId: decReport.id,
          mes: h.m,
          ano: h.y,
          energiaConsumida: (Math.floor(Math.random() * 200) + 400).toString(),
          energiaInjetada: (Math.floor(Math.random() * 300) + 400).toString(),
          kwhCompensado: "400",
          creditoGerado: "150"
        });
      }
    }
    
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
