// src/lib/shopify.ts
import Client from 'shopify-buy'

// Define your own interfaces based on the Shopify SDK structure
interface ShopifyImage {
  src: string
  [key: string]: any
}

interface ShopifyVariant {
  id: string
  price: {
    amount: string
    [key: string]: any
  }
  [key: string]: any
}

interface ShopifyProduct {
  id: string
  title: string
  images: ShopifyImage[]
  variants: ShopifyVariant[]
  [key: string]: any
}

export interface Product {
  id: string
  title: string
  images: string[]
  variants: { id: string; price: string }[]
}

export const client = Client.buildClient({
  domain: process.env.NEXT_PUBLIC_SHOP_DOMAIN || '',
  storefrontAccessToken: process.env.NEXT_PUBLIC_STOREFRONT_TOKEN || ''
})

export async function getAllProducts(): Promise<Product[]> {
  const raw = await client.product.fetchAll() as ShopifyProduct[]

  return raw.map((p: ShopifyProduct) => ({
    id: p.id,
    title: p.title,
    images: p.images.map((img: ShopifyImage) => img.src),
    variants: p.variants.map((v: ShopifyVariant) => ({
      id: v.id,
      price: v.price.amount
    }))
  }))
}