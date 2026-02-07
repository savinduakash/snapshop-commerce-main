import type { CartItem } from '@/stores/cart-store';

export function buildProductMessage(
  productName: string,
  price: number,
  currencySymbol: string,
  variant?: { name: string; value: string }
) {
  let msg = `Hi! I'm interested in *${productName}*`;
  if (variant) msg += ` (${variant.name}: ${variant.value})`;
  msg += ` — ${currencySymbol}${price.toFixed(2)}`;
  msg += `\n\nCould you please help me place an order?`;
  return msg;
}

export function buildCartMessage(
  items: CartItem[],
  currencySymbol: string,
  totalPrice: number,
  customerName: string,
  customerAddress: string
) {
  let msg = `🛒 *New Order*\n\n`;
  items.forEach((item, i) => {
    const itemPrice = item.price + (item.variant?.priceAdjustment ?? 0);
    msg += `${i + 1}. *${item.productName}*`;
    if (item.variant) msg += ` (${item.variant.name}: ${item.variant.value})`;
    msg += `\n   Qty: ${item.quantity} × ${currencySymbol}${itemPrice.toFixed(2)} = ${currencySymbol}${(itemPrice * item.quantity).toFixed(2)}\n`;
  });
  msg += `\n*Total: ${currencySymbol}${totalPrice.toFixed(2)}*\n`;
  msg += `\n📋 *Customer Details*\nName: ${customerName}\nAddress: ${customerAddress}`;
  return msg;
}

export function openWhatsApp(phone: string, message: string) {
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}
