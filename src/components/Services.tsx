import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Check, Zap, FileText, Mail, Package, ArrowRight } from 'lucide-react';
import { View } from '../App';
import PaymentModal from './PaymentModal';

interface ServicesProps {
  navigateTo: (view: View) => void;
  fullPage?: boolean;
}

const services = [
  {
    id: 'creation',
    title: 'CV / Resume Creation',
    price: 'K100',
    icon: <FileText className="text-primary" />,
    features: [
      'Professional Layout',
      'ATS-Friendly Format',
      'Custom Design',
      '24-Hour Delivery'
    ],
    popular: true
  },
  {
    id: 'rewriting',
    title: 'CV / Resume Rewriting',
    price: 'K50',
    icon: <Zap className="text-primary" />,
    features: [
      'Content Optimization',
      'Keyword Research',
      'Grammar Correction',
      'Formatting Update'
    ],
    popular: false
  },
  {
    id: 'cover-letter',
    title: 'Cover Letter Writing',
    price: 'K50',
    icon: <Mail className="text-primary" />,
    features: [
      'Tailored Content',
      'Professional Tone',
      'Modern Template',
      'Editable Format'
    ],
    popular: false
  }
];

export default function Services({ navigateTo, fullPage = false }: ServicesProps) {
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<{title: string, price: string} | null>(null);

  const handleOrder = (service: any) => {
    setSelectedService({ title: service.title, price: service.price });
    setIsPaymentModalOpen(true);
  };

  return (
    <section className={fullPage ? "pt-32 pb-20 bg-white" : "py-20 bg-white"}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-primary mb-4">Professional CV Services</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Can't find the time to build it yourself? Let our experts handle it for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`relative p-8 rounded-3xl border ${
                service.popular 
                  ? "border-accent bg-primary text-white shadow-2xl scale-105 z-10" 
                  : "border-slate-100 bg-slate-50 text-slate-900"
              }`}
            >
              {service.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-primary text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
                  Best Value
                </div>
              )}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                service.popular ? "bg-white-10" : "bg-white shadow-sm"
              }`}>
                {service.icon}
              </div>
              
              <h3 className="text-xl font-bold mb-2">{service.title}</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-3xl font-bold">{service.price}</span>
                <span className={`text-xs uppercase font-bold ${service.popular ? "text-white-60" : "text-slate-400"}`}>One-time</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {service.features.map((feature, j) => (
                  <li key={j} className="flex items-start gap-3 text-sm">
                    <Check size={16} className={service.popular ? "text-accent" : "text-green-500"} />
                    <span className={service.popular ? "text-white-80" : "text-slate-600"}>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handleOrder(service)}
                className={`w-full py-4 rounded-2xl font-bold transition-all active:scale-95 ${
                  service.popular 
                    ? "bg-accent text-primary hover:bg-accent-hover" 
                    : "bg-primary text-white hover:bg-primary"
                }`}
              >
                Order Now
              </button>
            </motion.div>
          ))}
        </div>

        {!fullPage && (
          <div className="mt-16 text-center">
            <button 
              onClick={() => navigateTo('services')}
              className="inline-flex items-center gap-2 text-primary font-bold hover:text-accent transition-colors group"
            >
              View all services
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={isPaymentModalOpen} 
        onClose={() => setIsPaymentModalOpen(false)} 
        service={selectedService} 
      />
    </section>
  );
}
