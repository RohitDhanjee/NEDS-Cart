
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Hero = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary pointer-events-none"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 right-[15%] w-[25rem] h-[25rem] rounded-full bg-primary/5 blur-[8rem] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-[10%] w-[20rem] h-[20rem] rounded-full bg-primary/10 blur-[6rem] pointer-events-none"></div>
      
      <div className="container-tight relative z-10 grid md:grid-cols-2 gap-12 md:gap-8 items-center py-12">
        {/* Content */}
        <div className="flex flex-col animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Cloud Apps,<br />
            <span className="text-primary">Simplified</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground max-w-md">
            Discover premium cloud applications for gaming, animation, surveys, and simulation. Everything you need, without the complexity.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-10">
            <Button asChild size="lg" className="rounded-full px-8 py-6 text-base font-medium">
              <Link to="/products/gaming">
                Explore Products
                <ArrowRight size={18} className="ml-2" />
              </Link>
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              asChild 
              className="rounded-full px-8 py-6 text-base font-medium border-gray-300"
            >
              <a href="#categories">
                Learn More
              </a>
            </Button>
          </div>
          
          <div className="mt-12 flex items-center space-x-6">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="w-10 h-10 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-medium"
                >
                  {i}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">2,000+</span> satisfied customers
            </p>
          </div>
        </div>
        
        {/* Hero Image */}
        <div className="relative">
          <div className="aspect-square max-w-[500px] mx-auto animate-scale-in">
            <div className="relative z-20 glass-card aspect-square rounded-3xl shadow-2xl shadow-primary/10 overflow-hidden p-6 flex items-center justify-center">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/50 to-white/20"></div>
              <div className="absolute inset-[1px] bg-white/40 rounded-3xl backdrop-blur-sm"></div>
              <div className="relative z-10 text-center">
                <div className="bg-primary/10 rounded-xl p-4 inline-flex mb-6">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16.25 11.9999L14.1 9.84991" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.75 11.9999H16.25" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7.75 12L9.9 14.15" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Cloud Processing</h3>
                <p className="text-muted-foreground">Powerful applications without hardware limitations</p>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-[15%] right-[15%] w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-[10%] left-[20%] w-32 h-32 bg-primary/5 rounded-full blur-xl"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
