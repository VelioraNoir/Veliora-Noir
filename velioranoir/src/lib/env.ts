// src/lib/env.ts
const requiredEnvVars = {
  NEXT_PUBLIC_SHOP_DOMAIN: process.env.NEXT_PUBLIC_SHOP_DOMAIN,
  NEXT_PUBLIC_STOREFRONT_TOKEN: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN,
} as const;

function validateEnv() {
  const missing: string[] = [];
  
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      missing.push(key);
    }
  });

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}\n` +
      'Please check your .env.local file and ensure all required variables are set.'
    );
  }
}

// Validate on import
validateEnv();

export const env = {
  SHOP_DOMAIN: requiredEnvVars.NEXT_PUBLIC_SHOP_DOMAIN!,
  STOREFRONT_TOKEN: requiredEnvVars.NEXT_PUBLIC_STOREFRONT_TOKEN!,
} as const;