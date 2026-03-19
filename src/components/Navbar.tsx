import React, { useState } from 'react';
import { Menu, X, FileText, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { View } from '../App';

interface NavbarProps {
  currentView: View;
  navigateTo: (view: View) => void;
  isScrolled: boolean;
}

export default function Navbar({ currentView, navigateTo, isScrolled }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', view: 'home' as View },
    { name: 'Templates', view: 'templates' as View },
    { name: 'Services', view: 'services' as View },
    { name: 'Jobs', view: 'jobs' as View },
    { name: '🔥 Roast', view: 'roast' as View },
  ];

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-4 py-4",
      isScrolled ? "bg-white-90 backdrop-blur-md shadow-sm" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => navigateTo('home')}
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform">
            <FileText size={24} />
          </div>
          <span className="text-xl font-bold text-primary tracking-tight">
            OfferZM
          </span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigateTo(link.view)}
              className={cn(
                "text-sm font-medium transition-colors hover:text-accent",
                currentView === link.view ? "text-accent" : "text-primary"
              )}
            >
              {link.name}
            </button>
          ))}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigateTo('cover-letter-builder')}
              className="text-primary text-sm font-bold hover:text-accent transition-colors"
            >
              Create Cover Letter
            </button>
            <button 
              onClick={() => navigateTo('builder')}
              className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              Create My CV
            </button>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-primary"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Nav */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-xl border-t border-slate-100 p-4 flex flex-col gap-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                navigateTo(link.view);
                setIsMenuOpen(false);
              }}
              className={cn(
                "text-left py-2 text-lg font-medium",
                currentView === link.view ? "text-accent" : "text-primary"
              )}
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => {
              navigateTo('cover-letter-builder');
              setIsMenuOpen(false);
            }}
            className="text-primary font-bold py-2"
          >
            Create Cover Letter
          </button>
          <button 
            onClick={() => {
              navigateTo('builder');
              setIsMenuOpen(false);
            }}
            className="bg-primary text-white px-6 py-3 rounded-xl text-center font-bold"
          >
            Create My CV
          </button>
        </div>
      )}
    </nav>
  );
}
