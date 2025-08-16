import {Inter} from "next/font/google";
import "./globals.css";
import {CartProvider} from "@/app/contexts/CartContext";
import {CheckoutProvider} from "./contexts/CheckoutContext";
import {OrderProvider} from "./contexts/OrderContext";
import {Toaster} from "react-hot-toast";

const inter = Inter({subsets: ["latin"]});

export const metadata = {
  title: "EcommercePro - Premium Online Shopping",
  description: "Discover premium products across all categories",
};

export default function RootLayout({children}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <CheckoutProvider>
            <OrderProvider>
              {children}
              <div id="modal-root" />
              <Toaster position="top-center" />
            </OrderProvider>
          </CheckoutProvider>
        </CartProvider>
      </body>
    </html>
  );
}
