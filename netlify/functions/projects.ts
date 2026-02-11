import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  imageUrl: string | null;
  productHuntUrl: string | null;
  websiteUrl: string | null;
  stripeProductId: string | null;
  category: string;
  featured: boolean;
  order: number;
}

interface RevenueData {
  date: string;
  amount: number;
}

const projects: Project[] = [
  {
    id: "1",
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
  }
];

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  return new Stripe(secretKey);
}

async function getProductPriceIds(stripe: Stripe, productId: string): Promise<Set<string>> {
  const priceIds = new Set<string>();
  
  let hasMore = true;
  let startingAfter: string | undefined;
  
  while (hasMore) {
    const response = await stripe.prices.list({
      product: productId,
      limit: 100,
      starting_after: startingAfter,
    });
    
    for (const price of response.data) {
      priceIds.add(price.id);
    }
    
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  
  return priceIds;
}

function checkChargeForProduct(charge: any, productId: string, priceIds: Set<string>): boolean {
  const invoice = charge.invoice;
  if (invoice && typeof invoice === 'object') {
    const lineItems = invoice.lines?.data || [];
    for (const item of lineItems) {
      const price = item.price;
      if (price) {
        if (price.product === productId) return true;
        if (price.id && priceIds.has(price.id)) return true;
      }
    }
  }
  if (charge.metadata?.product_id === productId) return true;
  return false;
}

async function getStripeRevenueData(productId: string | null, days: number = 14): Promise<RevenueData[]> {
  if (!productId) {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return { date: date.toISOString().split('T')[0], amount: 0 };
    });
  }

  const stripe = getStripeClient();
  if (!stripe) {
    return Array.from({ length: days }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      return { date: date.toISOString().split('T')[0], amount: 0 };
    });
  }

  try {
    const startDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
    const priceIds = await getProductPriceIds(stripe, productId);
    
    const dailyRevenue: Record<string, number> = {};
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - 1 - i));
      const dateStr = date.toISOString().split('T')[0];
      dailyRevenue[dateStr] = 0;
    }
    
    let hasMore = true;
    let startingAfter: string | undefined;
    
    while (hasMore) {
      const response = await stripe.charges.list({
        created: { gte: startDate },
        limit: 100,
        starting_after: startingAfter,
        expand: ['data.invoice.lines'],
      });
      
      for (const charge of response.data) {
        if (checkChargeForProduct(charge, productId, priceIds) && charge.status === 'succeeded') {
          const chargeDate = new Date(charge.created * 1000);
          const dateStr = chargeDate.toISOString().split('T')[0];
          if (dailyRevenue[dateStr] !== undefined) {
            dailyRevenue[dateStr] += Math.round(charge.amount / 100);
          }
        }
      }
      
      hasMore = response.has_more;
      if (response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
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

export const handler: Handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const projectsWithRevenue = await Promise.all(
      projects.map(async (project) => {
        const revenueData = await getStripeRevenueData(project.stripeProductId);
        return { ...project, revenueData };
      })
    );
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ projects: projectsWithRevenue }),
    };
  } catch (error) {
    console.error("Error fetching projects:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch projects" }),
    };
  }
};
