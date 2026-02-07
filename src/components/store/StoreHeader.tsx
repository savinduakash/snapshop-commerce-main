import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCartStore } from '@/stores/cart-store';
import { useSiteSettings } from '@/hooks/use-products';
import { useState } from 'react';

export function StoreHeader() {
  const totalItems = useCartStore((s) => s.totalItems());
  const { data: settings } = useSiteSettings();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="font-display text-xl font-bold tracking-tight">
          {settings?.store_name ?? 'Store'}
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Home</Link>
          <Link to="/products" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">Products</Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-whatsapp text-xs text-whatsapp-foreground">
                  {totalItems}
                </span>
              )}
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t p-4 md:hidden">
          <nav className="flex flex-col gap-3">
            <Link to="/" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/products" className="text-sm font-medium" onClick={() => setMenuOpen(false)}>Products</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
