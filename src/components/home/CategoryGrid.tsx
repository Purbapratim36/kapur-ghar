import { getHomeCategories } from "@/lib/categories";
import CategoryCard from "@/components/home/CategoryCard";

// Server component — fetches real categories + sample product images
export default async function CategoryGrid() {
  const categories = await getHomeCategories(6);

  if (categories.length === 0) return null;

  return (
    <section className="py-16 lg:py-20 bg-brand-cream bg-assamese-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading text-3xl sm:text-4xl font-bold text-foreground">
            Shop by Category
          </h2>
          <div className="flex items-center justify-center gap-3 mt-3">
            <div className="h-[1px] w-12 bg-brand-gold" />
            <div className="w-2 h-2 rounded-full bg-brand-gold" />
            <div className="h-[1px] w-12 bg-brand-gold" />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
          {categories.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
