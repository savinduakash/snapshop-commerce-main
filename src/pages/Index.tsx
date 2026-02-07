import { Link } from 'react-router-dom';
import { useFeaturedProducts, useCategories, useSiteSettings } from '@/hooks/use-products';
import { ProductCard } from '@/components/store/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

const Index = () => {
  const { data: featured, isLoading: loadingFeatured } = useFeaturedProducts();
  const { data: categories, isLoading: loadingCats } = useCategories();
  const { data: settings } = useSiteSettings();

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="container relative z-10 py-20 md:py-32">
          <h1 className="font-display text-4xl font-bold leading-tight md:text-6xl md:leading-tight">
            {settings?.store_name ?? 'Welcome to Our Store'}
          </h1>
          <p className="mt-4 max-w-lg text-lg text-primary-foreground/80">
            {settings?.store_description ?? 'Browse our curated collection and order instantly via WhatsApp.'}
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/products">
              <Button size="lg" variant="secondary">
                <ShoppingBag className="mr-2 h-5 w-5" /> Shop Now
              </Button>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
      </section>

      {/* Categories */}
      {!loadingCats && categories && categories.length > 0 && (
        <section className="container py-16">
          <h2 className="font-display text-2xl font-bold">Shop by Category</h2>
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/products?category=${cat.id}`}
                className="group relative flex h-32 items-end overflow-hidden rounded-lg bg-muted p-4 transition-shadow hover:shadow-md"
              >
                {cat.image_url && (
                  <img src={cat.image_url} alt={cat.name} className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-primary/70 to-transparent" />
                <span className="relative z-10 font-display text-sm font-semibold text-white md:text-base">{cat.name}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="container py-16">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Featured Products</h2>
          <Link to="/products">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
          {loadingFeatured
            ? Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            : featured?.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  price={p.price}
                  imageUrl={p.image_url}
                  categoryName={(p.categories as any)?.name}
                />
              ))}
          {!loadingFeatured && (!featured || featured.length === 0) && (
            <p className="col-span-full py-12 text-center text-muted-foreground">No featured products yet.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default Index;
