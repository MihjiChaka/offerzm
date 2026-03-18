import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function WhatsAppButton() {
  return (
    <a 
      href="https://wa.me/260977572626" 
      target="_blank" 
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <MessageSquare size={28} fill="currentColor" />
      <span className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white text-slate-900 px-4 py-2 rounded-xl shadow-lg text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-100 pointer-events-none">
        Need help? Chat with us!
      </span>
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
    </a>
  );
}
