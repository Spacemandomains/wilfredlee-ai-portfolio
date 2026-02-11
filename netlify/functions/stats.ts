import type { Handler } from '@netlify/functions';
import Stripe from 'stripe';

interface Project {
  stripeProductId: string | null;
  productHuntUrl: string | null;
}

const projects: Project[] = [
  {
    stripeProductId: "prod_TtUZxA8pNmQQRN",
    productHuntUrl: "https://www.producthunt.com/products/write-startup-copy-in-minutes?launch=write-startup-copy-in-minutes",
  }
];

function getStripeClient(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;
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

async function getTotalRevenueForProduct(stripe: Stripe, productId: string): Promise<number> {
  const priceIds = await getProductPriceIds(stripe, productId);
  let total = 0;
  let hasMore = true;
  let startingAfter: string | undefined;
  
  while (hasMore) {
    const response = await stripe.charges.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.invoice.lines'],
    });
    
    for (const charge of response.data) {
      if (checkChargeForProduct(charge, productId, priceIds) && charge.status === 'succeeded') {
        total += Math.round(charge.amount / 100);
      }
    }
    
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  
  return total;
}

async function getCustomerCountForProduct(stripe: Stripe, productId: string): Promise<number> {
  const priceIds = await getProductPriceIds(stripe, productId);
  const customerIds = new Set<string>();
  let hasMore = true;
  let startingAfter: string | undefined;
  
  while (hasMore) {
    const response = await stripe.charges.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.invoice.lines'],
    });
    
    for (const charge of response.data) {
      if (checkChargeForProduct(charge, productId, priceIds) && charge.status === 'succeeded') {
        if (charge.customer) {
          const customerId = typeof charge.customer === 'string' 
            ? charge.customer 
            : charge.customer.id;
          customerIds.add(customerId);
        }
      }
    }
    
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  
  return customerIds.size;
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
    const stripe = getStripeClient();
    
    let totalRevenue = 0;
    let customerCount = 0;
    
    if (stripe) {
      const productIds = projects
        .map(p => p.stripeProductId)
        .filter((id): id is string => id !== null);
      
      for (const productId of productIds) {
        totalRevenue += await getTotalRevenueForProduct(stripe, productId);
        customerCount += await getCustomerCountForProduct(stripe, productId);
      }
    }
    
    const launchCount = projects.filter(p => p.productHuntUrl).length;
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        totalRevenue,
        projectCount: projects.length,
        launchCount,
        customerCount,
      }),
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to fetch stats" }),
    };
  }
};
