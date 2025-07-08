
import React from 'react';
import { Link } from 'react-router-dom';
import { useSettings } from '@/contexts/Settingscontext';

const Footer = () => {
  const { generalSettings } = useSettings();
  const storeName = generalSettings?.storeName || 'CloudApp';
  const storeEmail = generalSettings?.storeEmail || 'contact@cloudappstore.com';
  const storeDescription = generalSettings?.storeDescription || 'We sell the best cloud solutions for your business needs.';

  return (
    <footer className="bg-gray-100 border-t mt-12">
      <div className="container-tight py-12 grid gap-8 md:grid-cols-3">
        <div>
          <h3 className="text-lg font-bold mb-4">{storeName}</h3>
          <p className="text-gray-600 mb-4">{storeDescription}</p>
          <p className="text-gray-700">Contact: {storeEmail}</p>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Quick Links</h3>
          <ul className="space-y-2">
            <li><Link to="/" className="text-gray-600 hover:text-primary">Home</Link></li>
            <li><Link to="/about" className="text-gray-600 hover:text-primary">About</Link></li>
            <li><Link to="/contact" className="text-gray-600 hover:text-primary">Contact</Link></li>
            <li><Link to="/cart" className="text-gray-600 hover:text-primary">Cart</Link></li>
          </ul>
        </div>
        
        <div>
          <h3 className="text-lg font-bold mb-4">Categories</h3>
          <ul className="space-y-2">
            <li><Link to="/products/productivity" className="text-gray-600 hover:text-primary">Productivity</Link></li>
            <li><Link to="/products/analytics" className="text-gray-600 hover:text-primary">Analytics</Link></li>
            <li><Link to="/products/security" className="text-gray-600 hover:text-primary">Security</Link></li>
            <li><Link to="/products/communication" className="text-gray-600 hover:text-primary">Communication</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="border-t py-6">
        <div className="container-tight text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {storeName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
