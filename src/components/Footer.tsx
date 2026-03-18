import React from 'react';
import { FileText, Facebook, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import { View } from '../App';

interface FooterProps {
  navigateTo: (view: View) => void;
  onShowTerms: () => void;
  onShowPrivacy: () => void;
}

export default function Footer({ navigateTo, onShowTerms, onShowPrivacy }: FooterProps) {
  return (
    <footer className="bg-slate-900 text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigateTo('home')}>
              <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <span className="text-2xl font-bold tracking-tight">
                OfferZM
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              Empowering Zambian job seekers with professional career services and expert resume building.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/george.chaka.923" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                <Facebook size={20} />
              </a>
              <a href="https://www.linkedin.com/in/mihji-george-chaka-72a8a1221/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                <Linkedin size={20} />
              </a>
              <a href="https://www.instagram.com/thisismihji/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white-5 flex items-center justify-center hover:bg-accent hover:text-primary transition-all">
                <Instagram size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button onClick={() => navigateTo('home')} className="hover:text-accent transition-colors">Home</button></li>
              <li><button onClick={() => navigateTo('builder')} className="hover:text-accent transition-colors">CV Builder</button></li>
              <li><button onClick={() => navigateTo('templates')} className="hover:text-accent transition-colors">Templates</button></li>
              <li><button onClick={() => navigateTo('services')} className="hover:text-accent transition-colors">Services</button></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-4 text-slate-400">
              <li><button onClick={() => navigateTo('services')} className="hover:text-accent transition-colors">CV Creation</button></li>
              <li><button onClick={() => navigateTo('services')} className="hover:text-accent transition-colors">CV Rewriting</button></li>
              <li><button onClick={() => navigateTo('templates')} className="hover:text-accent transition-colors">Cover Letters</button></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4 text-slate-400">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-accent" />
                <span>+260 977 572 626</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-accent" />
                <span>mihjigeorgechaka@gmail.com</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-accent" />
                <span>Chipata, Zambia</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-white-5 flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-slate-500">
          <p>© 2026 OfferZM. All rights reserved. Strictly Copyrighted.</p>
          <div className="flex gap-8">
            <button onClick={onShowPrivacy} className="hover:text-white transition-colors">Privacy Policy</button>
            <button onClick={onShowTerms} className="hover:text-white transition-colors">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
