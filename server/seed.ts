import { db } from "./db";
import { projects } from "@shared/schema";
import { sql } from "drizzle-orm";

const realProjects = [
  {
    name: "The Copy Agency",
    tagline: "AI-powered copywriting for startups and founders",
    description: "Professional AI copywriting that helps you create compelling marketing content, landing pages, and sales copy in minutes.",
    imageUrl: null,
    productHuntUrl: "https://www.producthunt.com/products/write-startup-copy-in-minutes?launch=write-startup-copy-in-minutes",
    websiteUrl: "https://thecopyagency.replit.app/",
    stripeProductId: "prod_TtUZxA8pNmQQRN",
    category: "AI Writing",
    featured: true,
    order: 0,
  },
];

export async function seedDatabase() {
  try {
    console.log("Clearing existing projects and seeding with real data...");
    
    await db.delete(projects);
    
    for (const project of realProjects) {
      await db.insert(projects).values(project);
    }
    
    console.log(`Seeded ${realProjects.length} project(s) successfully`);
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}
