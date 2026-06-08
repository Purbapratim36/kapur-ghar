import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ProductGallery from "@/components/product/ProductGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ReviewSection from "@/components/product/ReviewSection";
import ProductCarousel from "@/components/home/ProductCarousel";
import { db } from "@/lib/db";
import { getProducts } from "@/lib/products";
import type { Product } from "@/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
    select: { name: true, shortDesc: true, description: true },
  });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.shortDesc || product.description.slice(0, 160),
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const dbProduct = await db.product.findUnique({
    where: { slug, isActive: true },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      variants: true,
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 20,
        include: { user: { select: { name: true, image: true } } },
      },
      _count: { select: { reviews: true } },
    },
  });

  if (!dbProduct) notFound();

  const ratings = dbProduct.reviews.map((r) => r.rating);
  const avgRating = ratings.length
    ? Number((ratings.reduce((s, n) => s + n, 0) / ratings.length).toFixed(1))
    : 0;

  const product: Product = {
    id: dbProduct.id,
    name: dbProduct.name,
    slug: dbProduct.slug,
    description: dbProduct.description,
    shortDesc: dbProduct.shortDesc,
    price: dbProduct.price,
    comparePrice: dbProduct.comparePrice,
    sku: dbProduct.sku,
    stock: dbProduct.stock,
    isActive: dbProduct.isActive,
    isFeatured: dbProduct.isFeatured,
    isNew: dbProduct.isNew,
    fabric: dbProduct.fabric,
    color: dbProduct.color,
    occasion: dbProduct.occasion,
    silkType: dbProduct.silkType,
    weight: dbProduct.weight,
    dimensions: dbProduct.dimensions,
    careInstructions: dbProduct.careInstructions,
    categoryId: dbProduct.categoryId,
    createdAt: dbProduct.createdAt.toISOString(),
    updatedAt: dbProduct.updatedAt.toISOString(),
    images: dbProduct.images.map((i) => ({
      id: i.id,
      url: i.url,
      alt: i.alt,
      sortOrder: i.sortOrder,
      isVideo: i.isVideo,
    })),
    category: {
      id: dbProduct.category.id,
      name: dbProduct.category.name,
      slug: dbProduct.category.slug,
      description: dbProduct.category.description,
      image: dbProduct.category.image,
      parentId: dbProduct.category.parentId,
      sortOrder: dbProduct.category.sortOrder,
      isActive: dbProduct.category.isActive,
    },
    variants: dbProduct.variants.map((v) => ({
      id: v.id,
      name: v.name,
      value: v.value,
      price: v.price,
      stock: v.stock,
    })),
    reviews: dbProduct.reviews.map((r) => ({
      id: r.id,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      images: r.images ? JSON.parse(r.images) : [],
      isVerified: r.isVerified,
      createdAt: r.createdAt.toISOString(),
      user: { name: r.user.name, image: r.user.image },
    })),
    _count: { reviews: dbProduct._count.reviews },
    avgRating,
  };

  const relatedProducts = await getProducts({
    limit: 8,
    categorySlug: dbProduct.category.slug,
    excludeId: dbProduct.id,
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDesc || product.description,
    image: product.images.map((img) => img.url),
    sku: product.sku,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "INR",
      availability: product.stock > 0
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    ...(avgRating && product._count?.reviews
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: avgRating,
            reviewCount: product._count.reviews,
          },
        }
      : {}),
  };

  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductGallery images={product.images} productName={product.name} />
            <ProductInfo product={product} />
          </div>

          <ReviewSection
            reviews={product.reviews}
            avgRating={avgRating}
            totalReviews={product._count?.reviews || 0}
          />
        </div>

        {relatedProducts.length > 0 && (
          <ProductCarousel
            title="You May Also Like"
            subtitle="Similar products"
            products={relatedProducts}
            bgClass="bg-brand-cream bg-assamese-pattern"
          />
        )}
      </main>
      <Footer />
    </>
  );
}
