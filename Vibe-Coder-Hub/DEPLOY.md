# Deploying to Netlify via GitHub

This guide explains how to deploy your Vibe Coder portfolio to Netlify.

## Setup Steps

### 1. Push to GitHub

Create a new repository on GitHub and push this code:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

### 2. Connect to Netlify

1. Go to [Netlify](https://netlify.com) and sign in
2. Click "Add new site" > "Import an existing project"
3. Select GitHub and choose your repository
4. Build settings will be auto-detected from `netlify.toml`:
   - **Build command**: `npm install && npx vite build --outDir dist/public`
   - **Publish directory**: `dist/public`
   - **Functions directory**: `netlify/functions`

### 3. Configure Environment Variables

In Netlify dashboard, go to **Site settings** > **Environment variables** and add:

| Key | Value |
|-----|-------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key (starts with `sk_live_...`) |

**Important**: Use your Live mode key for production, not the test key.

### 4. Deploy

Click "Deploy site" - Netlify will build and deploy your site automatically.

## How It Works

- The frontend is built as a static site using Vite
- API calls go to Netlify Functions (serverless)
- Your Stripe key stays secure in Netlify's environment variables
- Revenue data updates live on each page load

## Updating Your Site

Just push changes to GitHub - Netlify auto-deploys on every push.

## Adding New Products

Edit `netlify/functions/projects.ts` and add to the `projects` array:

```typescript
{
  id: "2",
  name: "Your New Product",
  tagline: "Product tagline",
  description: "Product description",
  imageUrl: null,
  productHuntUrl: "https://www.producthunt.com/products/...",
  websiteUrl: "https://yoursite.com",
  stripeProductId: "prod_XXXXXX",  // Your Stripe product ID
  category: "Category",
  featured: true,
  order: 1,
}
```

Also add the product's `stripeProductId` to `netlify/functions/stats.ts` in the `projects` array.

## Troubleshooting

**Revenue not showing**: Check that your `STRIPE_SECRET_KEY` environment variable is set correctly in Netlify.

**Build fails**: Make sure all dependencies are listed in `package.json`.
