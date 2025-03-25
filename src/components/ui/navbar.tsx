
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShoppingCart, 
  ChevronDown, 
  Menu, 
  X,
} from 'lucide-react';
import { categories } from '@/lib/data';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    )}>
      <nav className="container-tight flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-xl font-bold tracking-tight relative z-10"
        >
          CloudApp
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={cn(
              'font-medium',
              location.pathname === '/' ? 'text-primary' : 'text-foreground'
            )}
          >
            Home
          </Link>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center font-medium space-x-1">
                <span>Products</span>
                <ChevronDown size={16} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 bg-white/95 backdrop-blur-lg">
              {categories.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link 
                    to={`/products/${category.id}`}
                    className="flex flex-col py-3 px-4"
                  >
                    <span className="font-medium">{category.name}</span>
                    <span className="text-sm text-muted-foreground mt-1">{category.description}</span>
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            to="/about" 
            className={cn(
              'font-medium',
              location.pathname === '/about' ? 'text-primary' : 'text-foreground'
            )}
          >
            About
          </Link>
          
          <Link 
            to="/contact" 
            className={cn(
              'font-medium',
              location.pathname === '/contact' ? 'text-primary' : 'text-foreground'
            )}
          >
            Contact
          </Link>
        </div>

        {/* Cart and Mobile Menu Button */}
        <div className="flex items-center space-x-4">
          <Link 
            to="/cart" 
            className={cn(
              'relative p-2 rounded-full transition-colors',
              location.pathname === '/cart' ? 'bg-primary/10 text-primary' : 'hover:bg-secondary'
            )}
          >
            <ShoppingCart size={20} />
            <span className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
              0
            </span>
          </Link>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-white pt-20 px-4 animate-slide-down">
            <div className="flex flex-col space-y-6 text-center">
              <Link 
                to="/" 
                className={cn(
                  'text-lg font-medium py-3 border-b border-gray-100',
                  location.pathname === '/' ? 'text-primary' : 'text-foreground'
                )}
              >
                Home
              </Link>
              
              <div className="py-3 border-b border-gray-100">
                <h3 className="text-lg font-medium mb-4">Products</h3>
                <div className="grid grid-cols-2 gap-4">
                  {categories.map((category) => (
                    <Link 
                      key={category.id}
                      to={`/products/${category.id}`}
                      className="flex flex-col items-center p-3 rounded-lg bg-secondary"
                    >
                      <span className="font-medium">{category.name}</span>
                      <span className="text-xs text-muted-foreground mt-1">{category.description}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              <Link 
                to="/about" 
                className={cn(
                  'text-lg font-medium py-3 border-b border-gray-100',
                  location.pathname === '/about' ? 'text-primary' : 'text-foreground'
                )}
              >
                About
              </Link>
              
              <Link 
                to="/contact" 
                className={cn(
                  'text-lg font-medium py-3 border-b border-gray-100',
                  location.pathname === '/contact' ? 'text-primary' : 'text-foreground'
                )}
              >
                Contact
              </Link>
              
              <Button 
                className="w-full mt-6" 
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Close Menu
              </Button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
