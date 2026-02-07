import { useCartStore } from '@/stores/cart-store';
import { useSiteSettings } from '@/hooks/use-products';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus, Minus, MessageCircle } from 'lucide-react';
import { buildCartMessage, openWhatsApp } from '@/lib/whatsapp';
import { toast } from '@/hooks/use-toast';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalPrice = useCartStore((s) => s.totalPrice());
  const { data: settings } = useSiteSettings();
  const symbol = settings?.currency_symbol ?? '$';

  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  const handleCheckout = () => {
    if (!settings?.whatsapp_number) {
      toast({ title: 'WhatsApp not configured', variant: 'destructive' });
      return;
    }
    if (!name.trim() || !address.trim()) {
      toast({ title: 'Please fill in your details', variant: 'destructive' });
      return;
    }
    openWhatsApp(settings.whatsapp_number, buildCartMessage(items, symbol, totalPrice, name, address));
  };

  if (items.length === 0) {
    return (
      <div className="container py-16 text-center">
        <p className="text-lg text-muted-foreground">Your cart is empty.</p>
        <Link to="/products">
          <Button className="mt-4">Browse Products</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <h1 className="font-display text-3xl font-bold">Your Cart</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        {/* Items */}
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const itemPrice = item.price + (item.variant?.priceAdjustment ?? 0);
            return (
              <div
                key={`${item.productId}-${item.variant?.value ?? 'default'}`}
                className="flex gap-4 rounded-lg border p-4"
              >
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                  {item.imageUrl ? (
                    <img src={item.imageUrl} alt={item.productName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-muted-foreground">No img</div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-medium">{item.productName}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">{item.variant.name}: {item.variant.value}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center rounded-md border">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variant?.value)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variant?.value)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="font-semibold">{symbol}{(itemPrice * item.quantity).toFixed(2)}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeItem(item.productId, item.variant?.value)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          <Button variant="outline" size="sm" onClick={clearCart}>Clear Cart</Button>
        </div>

        {/* Checkout */}
        <div className="rounded-lg border p-6">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <div className="mt-4 flex justify-between border-b pb-4">
            <span className="text-muted-foreground">Total</span>
            <span className="text-xl font-bold">{symbol}{totalPrice.toFixed(2)}</span>
          </div>

          <div className="mt-4 space-y-3">
            <div>
              <label className="text-sm font-medium">Your Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your name" />
            </div>
            <div>
              <label className="text-sm font-medium">Delivery Address</label>
              <Textarea value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Enter your address" />
            </div>
          </div>

          <Button
            size="lg"
            className="mt-6 w-full bg-whatsapp text-whatsapp-foreground hover:bg-whatsapp/90"
            onClick={handleCheckout}
          >
            <MessageCircle className="mr-2 h-5 w-5" /> Place Order via WhatsApp
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
