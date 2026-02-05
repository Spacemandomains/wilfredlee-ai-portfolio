import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { getStripeChargesForProduct, getTotalRevenueForProduct, getCustomerCountForProduct } from "./stripeClient";
import type { RevenueData } from "@shared/schema";

async function getStripeRevenueData(productId: string | null, days: number = 14): Promise<RevenueData[]> {
  if (!productId) {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return { date: date.toISOString().split('T')[0], amount: 0 };
    });
  }

  try {
    const charges = await getStripeChargesForProduct(productId, days);
    
    const dailyRevenue: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      dailyRevenue[dateStr] = 0;
    }
    
    for (const charge of charges) {
      if (charge.status === 'succeeded') {
        const chargeDate = new Date(charge.created * 1000);
        const dateStr = chargeDate.toISOString().split('T')[0];
        if (dailyRevenue[dateStr] !== undefined) {
          dailyRevenue[dateStr] += Math.round(charge.amount / 100);
        }
      }
    }
    
    return Object.entries(dailyRevenue).map(([date, amount]) => ({
      date,
      amount,
    }));
  } catch (error) {
    console.log("Revenue query failed:", error);
    return [];
  }
}

async function getTotalStats() {
  const projectList = await storage.getProjects();
  
  let totalRevenue = 0;
  let customerCount = 0;
  
  try {
    const productIds = projectList
      .map(p => p.stripeProductId)
      .filter((id): id is string => id !== null);
    
    for (const productId of productIds) {
      totalRevenue += await getTotalRevenueForProduct(productId);
      customerCount += await getCustomerCountForProduct(productId);
    }
  } catch (error) {
    console.log("Stats query failed:", error);
  }
  
  const launchCount = projectList.filter(p => p.productHuntUrl).length;
  
  return {
    totalRevenue,
    projectCount: projectList.length,
    launchCount,
    customerCount,
  };
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get("/api/projects", async (req, res) => {
    try {
      const projectList = await storage.getProjects();
      
      const projectsWithRevenue = await Promise.all(
        projectList.map(async (project) => {
          const revenueData = await getStripeRevenueData(project.stripeProductId);
          return {
            ...project,
            revenueData,
          };
        })
      );
      
      res.json({ projects: projectsWithRevenue });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/projects/:id", async (req, res) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ error: "Project not found" });
      }
      
      const revenueData = await getStripeRevenueData(project.stripeProductId);
      res.json({ project: { ...project, revenueData } });
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ error: "Failed to fetch project" });
    }
  });

  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await getTotalStats();
      res.json(stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  app.get("/api/revenue", async (req, res) => {
    try {
      const days = parseInt(req.query.days as string) || 14;
      const productId = req.query.productId as string || null;
      const revenueData = await getStripeRevenueData(productId, days);
      res.json({ revenueData });
    } catch (error) {
      console.error("Error fetching revenue:", error);
      res.status(500).json({ error: "Failed to fetch revenue data" });
    }
  });

  return httpServer;
}
