import { useParams } from 'react-router-dom';
import { useProduct, useSiteSettings } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { ShoppingCart, MessageCircle, Minus, Plus } from 'lucide-react';
import { useCartStore } from '@/stores/cart-store';
import { buildProductMessage, openWhatsApp } from '@/lib/whatsapp';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading } = useProduct(id!);
  const { data: settings } = useSiteSettings();
  const addItem = useCartStore((s) => s.addItem);
  const symbol = settings?.currency_symbol ?? '$';

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <Skeleton className="aspect-square w-full rounded-lg" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return <div className="container py-16 text-center text-muted-foreground">Product not found.</div>;
  }

  const variants = product.product_variants ?? [];
  const chosenVariant = variants.find((v) => v.id === selectedVariant);
  const finalPrice = product.price + (chosenVariant?.price_adjustment ?? 0);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity,
      imageUrl: product.image_url,
      variant: chosenVariant
        ? { name: chosenVariant.name, value: chosenVariant.value, priceAdjustment: chosenVariant.price_adjustment }
        : undefined,
    });
    toast({ title: 'Added to cart', description: `${product.name} × ${quantity}` });
  };

  const handleWhatsApp = () => {
    if (!settings?.whatsapp_number) {
      toast({ title: 'WhatsApp not configured', variant: 'destructive' });
      return;
    }
    openWhatsApp(
      settings.whatsapp_number,
      buildProductMessage(product.name, finalPrice, symbol, chosenVariant ? { name: chosenVariant.name, value: chosenVariant.value } : undefined)
    );
  };

  return (
    <div className="container py-8">
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-lg bg-muted">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">No image</div>
          )}
        </div>

        {/* Info */}
        <div>
          {(product.categories as any)?.name && (
            <p className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              {(product.categories as any).name}
            </p>
          )}
          <h1 className="mt-1 font-display text-3xl font-bold">{product.name}</h1>
          <p className="mt-2 text-2xl font-bold">{symbol}{finalPrice.toFixed(2)}</p>

          {product.description && (
            <p className="mt-4 leading-relaxed text-muted-foreground">{product.description}</p>
          )}

          {/* Variants */}
          {variants.length > 0 && (
            <div className="mt-6">
              <p className="text-sm font-medium">Options</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {variants.map((v) => (
                  <Button
                    key={v.id}
                    variant={selectedVariant === v.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVariant(selectedVariant === v.id ? null : v.id)}
                  >
                    {v.name}: {v.value}
                    {v.price_adjustment > 0 && ` (+${symbol}${v.price_adjustment.toFixed(2)})`}
                    {v.price_adjustment < 0 && ` (-${symbol}${Math.abs(v.price_adjustment).toFixed(2)})`}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mt-6 flex items-center gap-3">
            <p className="text-sm font-medium">Qty</p>
            <div className="flex items-center rounded-md border">
              <Button variant="ghost" size="icon" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm font-medium">{quantity}</span>
              <Button variant="ghost" size="icon" onClick={() => setQuantity(quantity + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" variant="outline" className="flex-1" onClick={handleAddToCart}>
              <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
            </Button>
            <Button
              size="lg"
              className="flex-1 bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
              onClick={handleWhatsApp}
            >
              <MessageCircle className="mr-2 h-5 w-5" /> Order via WhatsApp
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
