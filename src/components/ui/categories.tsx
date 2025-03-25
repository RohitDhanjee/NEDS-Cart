
import React from 'react';
import { Link } from 'react-router-dom';
import { categories } from '@/lib/data';
import { ArrowRight, Gamepad2, Clapperboard, ClipboardList, BarChart } from 'lucide-react';

const getIcon = (iconName: string) => {
  switch (iconName) {
    case 'Game':
    case 'Gamepad2':
      return <Gamepad2 className="w-10 h-10" />;
    case 'Clapperboard':
      return <Clapperboard className="w-10 h-10" />;
    case 'ClipboardList':
      return <ClipboardList className="w-10 h-10" />;
    case 'BarChart':
      return <BarChart className="w-10 h-10" />;
    default:
      return <Gamepad2 className="w-10 h-10" />;
  }
};

const Categories = () => {
  return (
    <section id="categories" className="py-20 bg-secondary/50">
      <div className="container-tight">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="section-title">Cloud App Categories</h2>
          <p className="section-subtitle">
            Explore our specialized cloud applications tailored to meet your specific needs
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {categories.map((category, index) => (
            <Link 
              key={category.id}
              to={`/products/${category.id}`}
              className="group relative overflow-hidden bg-white rounded-2xl shadow-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-8">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  {getIcon(category.icon)}
                </div>
                
                <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                
                <p className="text-muted-foreground mb-6">
                  {category.description}
                </p>
                
                <div className="flex items-center text-sm font-medium text-primary">
                  <span>Explore {category.name}</span>
                  <ArrowRight size={16} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full h-1 bg-primary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
