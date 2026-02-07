

# E-Commerce Website with WhatsApp Ordering

## Overview
A modern e-commerce storefront where customers browse products and place orders via WhatsApp. Includes an admin panel for product management. Built with React + Vite + Supabase.

---

## 1. Storefront — Product Browsing
- **Home page** with hero banner, featured products, and product categories
- **Product listing page** with grid layout, category filtering, and search
- **Product detail page** with image gallery, description, price, size/variant selection
- **"Order via WhatsApp" button** on each product — opens WhatsApp with a pre-filled message including product name, variant, and price

## 2. Shopping Cart & WhatsApp Checkout
- Add-to-cart functionality with quantity and variant selection
- **Cart page** showing all items, quantities, and total price
- **"Place Order via WhatsApp" button** — generates a formatted WhatsApp message with all cart items, quantities, sizes, total price, and customer details (name, address)
- Customer fills in delivery details before sending the WhatsApp message

## 3. Admin Panel (Protected)
- **Admin login** with email/password authentication
- **Product management**: Add, edit, delete products with images, descriptions, prices, categories, and variants (sizes, colors)
- **Category management**: Create and organize product categories
- **Dashboard** with overview of total products and categories
- Product images stored in Supabase Storage

## 4. Database (Supabase)
- Tables for products, categories, product variants, and admin users
- Supabase Storage for product images
- Row-level security policies for admin-only write access

## 5. Design & UX
- Clean, modern storefront design optimized for mobile (most WhatsApp users are on mobile)
- Responsive layout across all screen sizes
- WhatsApp green accent color for order buttons
- Fast loading with optimized images

## 6. WhatsApp Integration Details
- Configurable WhatsApp phone number (set by admin)
- Pre-formatted messages with product details and order summary
- Uses WhatsApp's `wa.me` deep link — no API key needed

