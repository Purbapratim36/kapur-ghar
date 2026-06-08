import type { Metadata } from "next";
import Link from "next/link";
import HeroCarousel from "@/components/home/HeroCarousel";
import CategoryGrid from "@/components/home/CategoryGrid";
import ProductCarousel from "@/components/home/ProductCarousel";
import PromoBanner from "@/components/home/PromoBanner";
import Testimonials from "@/components/home/Testimonials";
import Newsletter from "@/components/home/Newsletter";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Kapur Ghar | Traditional Assamese Mekhela Sador & Ethnic Fashion",
  description:
    "Shop authentic Assamese Mekhela Sador, Muga Silk, Pat Silk, Eri Silk & handloom ethnic wear. Premium traditional fashion handcrafted in Assam.",
};

// Server component — fetches real DB data
export default async function HomePage() {
  const [newArrivals, bestSellers, festivalCollection] = await Promise.all([
    getProducts({ limit: 8, isNew: true }),
    getProducts({ limit: 8, featured: true }),
    getProducts({ limit: 8 }),
  ]);

  const noProducts =
    newArrivals.length === 0 &&
    bestSellers.length === 0 &&
    festivalCollection.length === 0;

  return (
    <>
      <HeroCarousel />

      <CategoryGrid />

      {noProducts && (
        <section className="py-16 bg-white">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="font-heading text-2xl font-bold mb-3 text-foreground">
              Your store is ready — add your first products
            </h2>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              No products in the database yet. Head to the admin panel to add your
              first Mekhela Sador, Muga Silk, or Pat Silk piece. You can also bulk
              load them with the seed script (see README).
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/admin/products"
                className="bg-brand-red hover:bg-brand-deep-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors"
              >
                Go to Admin
              </Link>
              <Link
                href="/register"
                className="border border-border px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted transition-colors"
              >
                Create an account
              </Link>
            </div>
          </div>
        </section>
      )}

      {newArrivals.length > 0 && (
        <ProductCarousel
          title="New Arrivals"
          subtitle="Fresh from the loom"
          products={newArrivals}
          bgClass="bg-white"
        />
      )}

      <PromoBanner
        title="Wedding Season"
        subtitle="OFFER"
        discount="40%"
        href="/categories/wedding-collection"
        image="/images/banners/wedding-banner.jpg"
        ctaText="Shop Wedding Collection"
      />

      {bestSellers.length > 0 && (
        <ProductCarousel
          title="Best Sellers"
          subtitle="Most loved by our customers"
          products={bestSellers}
          bgClass="bg-brand-cream bg-assamese-pattern"
        />
      )}

      <section className="py-16 lg:py-20 bg-brand-maroon">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl sm:text-4xl font-bold text-white mb-2">
              The Heritage of Assamese Silk
            </h2>
            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-[1px] w-12 bg-brand-gold" />
              <div className="w-2 h-2 rounded-full bg-brand-gold" />
              <div className="h-[1px] w-12 bg-brand-gold" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Muga Silk",
                desc: "The golden silk exclusive to Assam, known for its natural luster and durability. A heritage fabric that grows more beautiful with each wash.",
              },
              {
                title: "Pat Silk",
                desc: "Woven from mulberry silk, Pat is known for its glossy finish and luxurious drape. Perfect for weddings and special occasions.",
              },
              {
                title: "Eri Silk",
                desc: "The peace silk of Assam, harvested without harming the silkworm. Warm, breathable, and with a unique texture that's truly one of a kind.",
              },
            ].map((silk) => (
              <div
                key={silk.title}
                className="text-center p-8 rounded-2xl border border-brand-gold/20 bg-white/5"
              >
                <h3 className="font-heading text-xl font-bold text-brand-gold mb-3">
                  {silk.title}
                </h3>
                <p className="text-white/70 text-sm leading-relaxed">{silk.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {festivalCollection.length > 0 && (
        <ProductCarousel
          title="Festival Collection"
          subtitle="Celebrate in style"
          products={festivalCollection}
          bgClass="bg-white"
        />
      )}

      <Testimonials />

      <Newsletter />
    </>
  );
}
