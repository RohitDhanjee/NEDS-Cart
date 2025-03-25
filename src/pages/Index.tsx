
import React from 'react';
import Navbar from '@/components/ui/navbar';
import Hero from '@/components/ui/hero';
import Featured from '@/components/ui/featured';
import Categories from '@/components/ui/categories';
import Footer from '@/components/ui/footer';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-16">
        <Hero />
        <Featured />
        <Categories />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
