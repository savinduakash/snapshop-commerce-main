import { useSearchParams } from 'react-router-dom';
import { useProducts, useCategories, useSiteSettings } from '@/hooks/use-products';
import { ProductCard } from '@/components/store/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Search } from 'lucide-react';
import { useState, useMemo } from 'react';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryId = searchParams.get('category') ?? undefined;
  const { data: products, isLoading } = useProducts(categoryId);
  const { data: categories } = useCategories();
  const { data: settings } = useSiteSettings();
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!products) return [];
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q)
    );
  }, [products, search]);

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold">Products</h1>

      {/* Filters */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={!categoryId ? 'default' : 'outline'}
            size="sm"
            onClick={() => { searchParams.delete('category'); setSearchParams(searchParams); }}
          >
            All
          </Button>
          {categories?.map((c) => (
            <Button
              key={c.id}
              variant={categoryId === c.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => { searchParams.set('category', c.id); setSearchParams(searchParams); }}
            >
              {c.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="aspect-square w-full rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))
          : filtered.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                name={p.name}
                price={p.price}
                imageUrl={p.image_url}
                categoryName={(p.categories as any)?.name}
              />
            ))}
      </div>
      {!isLoading && filtered.length === 0 && (
        <p className="py-16 text-center text-muted-foreground">No products found.</p>
      )}
    </div>
  );
};

export default ProductsPage;
