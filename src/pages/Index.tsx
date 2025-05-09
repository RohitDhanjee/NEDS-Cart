
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Hero from '@/components/ui/hero';
import Featured from '@/components/ui/featured';
import Categories from '@/components/ui/categories';
import Footer from '@/components/ui/footer';
import { Toaster } from "sonner";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Featured />
        <Categories />
      </main>
      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
};

export default Index;
