import React from 'react'
import { notFound } from 'next/navigation'
import { fetchProductBySlug } from '@/lib/products-store'
import { ProductDetailClient } from '@/components/product/ProductDetailClient'

interface ProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)
  if (!product) {
    return { title: 'Product Not Found | Apsarah' }
  }
  return {
    title: `${product.name} | Apsarah Luxury Ethnic Wear`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params
  const product = await fetchProductBySlug(slug)

  if (!product) {
    notFound()
  }

  return <ProductDetailClient product={product!} />
}
