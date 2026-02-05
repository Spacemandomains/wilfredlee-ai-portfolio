import Stripe from 'stripe';

let stripeClient: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (!stripeClient) {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      throw new Error('STRIPE_SECRET_KEY environment variable is required');
    }
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

async function getProductPriceIds(productId: string): Promise<Set<string>> {
  const stripe = getStripeClient();
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
        if (price.product === productId) {
          return true;
        }
        if (price.id && priceIds.has(price.id)) {
          return true;
        }
      }
    }
  }
  
  if (charge.metadata?.product_id === productId) {
    return true;
  }
  
  return false;
}

export async function getStripeChargesForProduct(productId: string, days: number = 14): Promise<Stripe.Charge[]> {
  const stripe = getStripeClient();
  const startDate = Math.floor(Date.now() / 1000) - (days * 24 * 60 * 60);
  const priceIds = await getProductPriceIds(productId);
  
  const charges: Stripe.Charge[] = [];
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
      if (checkChargeForProduct(charge, productId, priceIds)) {
        charges.push(charge);
      }
    }
    
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  
  return charges;
}

export async function getAllChargesForProduct(productId: string): Promise<Stripe.Charge[]> {
  const stripe = getStripeClient();
  const priceIds = await getProductPriceIds(productId);
  
  const charges: Stripe.Charge[] = [];
  let hasMore = true;
  let startingAfter: string | undefined;
  
  while (hasMore) {
    const response = await stripe.charges.list({
      limit: 100,
      starting_after: startingAfter,
      expand: ['data.invoice.lines'],
    });
    
    for (const charge of response.data) {
      if (checkChargeForProduct(charge, productId, priceIds)) {
        charges.push(charge);
      }
    }
    
    hasMore = response.has_more;
    if (response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }
  
  return charges;
}

export async function getCustomerCountForProduct(productId: string): Promise<number> {
  const charges = await getAllChargesForProduct(productId);
  const customerIds = new Set<string>();
  
  for (const charge of charges) {
    if (charge.customer && charge.status === 'succeeded') {
      const customerId = typeof charge.customer === 'string' 
        ? charge.customer 
        : charge.customer.id;
      customerIds.add(customerId);
    }
  }
  
  return customerIds.size;
}

export async function getTotalRevenueForProduct(productId: string): Promise<number> {
  const charges = await getAllChargesForProduct(productId);
  let total = 0;
  
  for (const charge of charges) {
    if (charge.status === 'succeeded') {
      total += Math.round(charge.amount / 100);
    }
  }
  
  return total;
}
