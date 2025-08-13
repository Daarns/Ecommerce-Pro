# Mini Ecommerce

Mini Ecommerce is a modern web application simulating an online store, built with [Next.js](https://nextjs.org/) and [Tailwind CSS](https://tailwindcss.com/).  
This project demonstrates core e-commerce features such as product search, filtering, wishlist, cart, and an admin dashboard.  
All product data is based on static dummy data.

---

## Features

- **Product Search** with autocomplete and search history
- **Product Filtering** (category, price, brand, rating, size, variant)
- **Responsive Design**: optimized for both desktop and mobile
- **Wishlist & Cart** (simulation)
- **Admin Dashboard**: manage products, orders, and customers (dummy)
- **Sidebar & Mobile Filter**: sidebar filter for desktop, modal filter for mobile
- **Modern UI** powered by Tailwind CSS

---

## Tech Stack

- [Next.js 14+](https://nextjs.org/)
- [React](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Lucide React Icons](https://lucide.dev/icons/)
- Dummy data (no backend)

---

## Getting Started

1. **Clone this repository:**
   ```sh
   git clone https://github.com/USERNAME/mini-ecommerce.git
   cd mini-ecommerce
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open in your browser:**  
   [http://localhost:3000](http://localhost:3000)

---

## Folder Structure

```
app/
  account/
    components/
      AddressBook.jsx
      ProfileForm.jsx
      UserDashboard.jsx
  admin/
    components/
      Header.jsx
      RevenueCart.jsx
    dashboard/
      customers/
        CustomerList.jsx
      orders/
        OrderList.jsx
      products/
        ProductList.jsx
      page.jsx
    sidebar.jsx
    layout.jsx
  components/
    cart/
      CartSidebar.jsx
    navigation/
      Header.jsx
      Footer.jsx
    ui/
      Breadcrumb.jsx
      Button.jsx
  data/
    dummy-data.js
  orders/
    [id]/
      components/
        OrderDetail.jsx
  products/
    components/
      FilterSidebar.jsx
      MobilefilterModal.jsx
      ProductGrid.jsx
      SearchBar.jsx
    page.jsx
  globals.css
public/
...
```

---

## Notes

- All product, category, and user data is **dummy/static**.
- Checkout, login, and payment features are for simulation only (no backend integration).
- Admin dashboard is for UI demonstration (no real CRUD operations).

---

## License

MIT License

---

© 2025 Daarns. All rights reserved.