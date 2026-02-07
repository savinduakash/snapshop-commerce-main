import { Link } from 'react-router-dom';
import { useSiteSettings } from '@/hooks/use-products';

export function StoreFooter() {
  const { data: settings } = useSiteSettings();

  return (
    <footer className="border-t bg-secondary/50">
      <div className="container py-8 text-center">
        <p className="font-display text-lg font-semibold">{settings?.store_name ?? 'Store'}</p>
        {settings?.store_description && (
          <p className="mt-1 text-sm text-muted-foreground">{settings.store_description}</p>
        )}
        <div className="mt-4 flex justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/products" className="hover:text-foreground">Products</Link>
          <Link to="/cart" className="hover:text-foreground">Cart</Link>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          © {new Date().getFullYear()} {settings?.store_name ?? 'Store'}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
