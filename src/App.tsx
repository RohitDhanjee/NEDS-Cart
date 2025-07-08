
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import { SettingsProvider } from "@/contexts/SettingsContext";
import Index from "./pages/Index";
import Products from "./pages/Products";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/Admin/Dashboard";
import AdminLogin from "./pages/Admin/Login";
import AdminProducts from "./pages/Admin/Products";
import AdminOrders from "./pages/Admin/Orders";
import AdminCustomers from "./pages/Admin/Customers";
import AdminSettings from "./pages/Admin/Settings";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

// Renders errors or successfull transactions on the screen.
function Message({ content }) {
  return <p>{content}</p>;
}
const App = () => {
  // Create a new QueryClient instance inside the component
  const [queryClient] = useState(() => new QueryClient());
  const initialOptions = {
    "clientId": "AbsxsXpbKWNRZLzuhjyuiHBto_Wsf6XuNbvavP87f9lumL54kJ4KUlAWwBC0WwBhE6SmnqImKa_iW6f2",
    "enable-funding": "venmo",
    "disable-funding": "",
    "buyer-country": "US",
    "currency": "USD",
    "data-page-type": "product-details",
    "components": "buttons",
    "data-sdk-integration-source": "developer-studio",
  };

  const [message, setMessage] = useState("");


  return (
    <QueryClientProvider client={queryClient}>
       <PayPalScriptProvider
        options={
         initialOptions
        }
      >

      <TooltipProvider>
      <SettingsProvider>
        <Toaster />
        <Sonner richColors closeButton />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/products/:categoryId" element={<Products />} />
            <Route path="/product/:productId" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/products" element={<AdminProducts />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/customers" element={<AdminCustomers />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        </SettingsProvider>
      </TooltipProvider>
      </PayPalScriptProvider>
    </QueryClientProvider>
  );
};

export default App;
