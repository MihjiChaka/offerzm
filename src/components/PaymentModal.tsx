import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Smartphone, Loader2, CheckCircle2, MessageSquare, CreditCard } from 'lucide-react';
import { cn } from '../lib/utils';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: {
    title: string;
    price: string;
  } | null;
}

export default function PaymentModal({ isOpen, onClose, service }: PaymentModalProps) {
  const [step, setStep] = useState<'details' | 'processing' | 'success'>('details');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [provider, setProvider] = useState<'MTN' | 'Airtel' | 'Zamtel'>('MTN');

  useEffect(() => {
    if (!isOpen) {
      setStep('details');
      setPhone('');
      setName('');
    }
  }, [isOpen]);

  const handlePayment = () => {
    if (!phone || !name) return;
    setStep('processing');
    
    // We no longer automatically trigger the dialer as per user request
    // The user will see the instructions and the USSD code to dial manually
  };

  const getUSSDCode = () => {
    // Standard Zambian Mobile Money Transfer String
    // User requested to use the default *115# as direct strings are broken
    return `*115%23`;
  };

  const notifyWhatsApp = () => {
    const ownerNumber = '260977572626';
    const message = `*New Payment Notification*\n\n*Service:* ${service?.title}\n*Amount:* ${service?.price}\n*Customer:* ${name}\n*Phone:* ${phone}\n*Provider:* ${provider}\n\nThis payment was initiated via OfferZM. Please confirm receipt on your mobile money account.`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${ownerNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-primary/40 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-primary flex items-center gap-2">
            <CreditCard size={18} className="text-accent" />
            Mobile Money Payment
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {step === 'details' && (
              <motion.div 
                key="details"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                  <div className="text-xs font-bold text-primary/60 uppercase tracking-widest mb-1">Total Amount</div>
                  <div className="text-3xl font-bold text-primary">{service.price}</div>
                  <div className="text-sm text-slate-500 mt-1">For: {service.title}</div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Full Name</label>
                    <input 
                      type="text"
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-accent transition-all"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500">Mobile Money Number</label>
                    <div className="relative">
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="tel"
                        placeholder="097 / 096 / 095..."
                        className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 outline-none focus:border-accent transition-all"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {(['MTN', 'Airtel', 'Zamtel'] as const).map((p) => (
                      <button
                        key={p}
                        onClick={() => setProvider(p)}
                        className={cn(
                          "py-3 rounded-xl text-xs font-bold border transition-all",
                          provider === p 
                            ? "bg-primary text-white border-primary shadow-md" 
                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-200"
                        )}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={!phone || !name}
                  className="w-full py-4 bg-primary text-white rounded-2xl font-bold hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  Pay Now
                </button>
                <p className="text-[10px] text-center text-slate-400">
                  By clicking Pay Now, a USSD prompt will be sent to your phone.
                </p>
              </motion.div>
            )}

            {step === 'processing' && (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-6 text-center space-y-6"
              >
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto">
                  <Smartphone size={32} />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-primary mb-2">Dial to Pay</h4>
                  <p className="text-slate-500 text-sm max-w-[280px] mx-auto">
                    Please dial the code below on your phone to send <span className="font-bold text-primary">{service.price}</span> to <span className="font-bold text-primary">0977572626</span>.
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-200 space-y-4">
                  <div className="text-2xl font-mono font-bold text-primary tracking-wider">
                    {getUSSDCode()}
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(getUSSDCode());
                        alert("Code copied to clipboard!");
                      }}
                      className="flex-1 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                      Copy Code
                    </button>
                    <a 
                      href={`tel:${getUSSDCode()}`}
                      className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                    >
                      Dial Now
                    </a>
                  </div>
                </div>

                <div className="text-left space-y-3">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Manual Instructions</p>
                  <div className="bg-slate-50 p-4 rounded-2xl text-[10px] text-slate-600 space-y-2">
                    <p>1. Dial <span className="font-bold text-primary">*115#</span> (Airtel/MTN)</p>
                    <p>2. Select <span className="font-bold text-primary">Send Money</span></p>
                    <p>3. Enter Number: <span className="font-bold text-primary">0977572626</span></p>
                    <p>4. Enter Amount: <span className="font-bold text-primary">{service.price}</span></p>
                    <p>5. Enter your PIN to confirm</p>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    onClick={() => setStep('success')}
                    className="w-full py-4 bg-accent text-primary rounded-2xl font-bold hover:bg-accent-hover transition-all shadow-lg shadow-accent/20"
                  >
                    I Have Paid
                  </button>
                  <button 
                    onClick={() => setStep('details')}
                    className="mt-4 text-xs font-bold text-slate-400 hover:text-primary transition-colors"
                  >
                    Go Back
                  </button>
                </div>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-primary mb-2">Payment Initiated!</h4>
                  <p className="text-slate-500 text-sm">
                    Thank you, {name}. Your payment for {service.title} is being processed.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
                  <p className="text-xs text-slate-500 leading-relaxed">
                    To complete your order, please click the button below to notify our team via WhatsApp. This helps us start working on your CV immediately.
                  </p>
                  <button 
                    onClick={notifyWhatsApp}
                    className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                  >
                    <MessageSquare size={20} />
                    Notify via WhatsApp
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
