import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { useSiteSettings } from '@/hooks/use-products';
import { buildProductMessage, openWhatsApp } from '@/lib/whatsapp';
import { toast } from '@/hooks/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  categoryName?: string | null;
}

export function ProductCard({ id, name, price, imageUrl, categoryName }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { data: settings } = useSiteSettings();
  const symbol = settings?.currency_symbol ?? '$';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: id,
      productName: name,
      price,
      quantity: 1,
      imageUrl,
    });
    toast({ title: 'Added to cart', description: `${name} added to your cart.` });
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!settings?.whatsapp_number) {
      toast({ title: 'WhatsApp not configured', description: 'Store has not set up WhatsApp yet.', variant: 'destructive' });
      return;
    }
    openWhatsApp(settings.whatsapp_number, buildProductMessage(name, price, symbol));
  };

  return (
    <Link to={`/products/${id}`}>
      <Card className="group overflow-hidden transition-shadow hover:shadow-lg">
        <div className="aspect-square overflow-hidden bg-muted">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>
        <CardContent className="p-4">
          {categoryName && <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{categoryName}</p>}
          <h3 className="mt-1 font-display text-lg font-semibold leading-tight">{name}</h3>
          <p className="mt-1 text-lg font-bold">{symbol}{price.toFixed(2)}</p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-1 h-4 w-4" /> Add
            </Button>
            <Button size="sm" className="flex-1 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90" onClick={handleWhatsApp}>
              <MessageCircle className="mr-1 h-4 w-4" /> Order
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
