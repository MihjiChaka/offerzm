import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: "Misozi Banda",
    role: "Marketing Specialist",
    text: "I was struggling to get interviews for months. After using OfferZM to rewrite my summary and experience, I got 4 calls in two weeks! The expert suggestions are truly professional.",
    image: "https://picsum.photos/seed/banda/100/100"
  },
  {
    name: "Kelvin Phiri",
    role: "Software Engineer",
    text: "The Job Seeker Package is worth every Ngwee. The cover letter was perfectly tailored to the roles I was applying for. Highly recommended for anyone serious about their career.",
    image: "https://picsum.photos/seed/phiri/100/100"
  },
  {
    name: "Sarah Mulenga",
    role: "HR Manager",
    text: "As an HR professional, I can tell you that these CVs are exactly what we look for. They are clean, easy to read, and highlight the right information. Great tool for Zambian job seekers.",
    image: "https://picsum.photos/seed/mulenga/100/100"
  }
];

export default function Testimonials() {
  return (
    <section className="py-24 bg-primary text-white overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-accent-faint rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-faint rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Success Stories</h2>
          <p className="text-white-60 max-w-2xl mx-auto">
            Join thousands of Zambian professionals who have accelerated their careers with our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              className="bg-white-5 backdrop-blur-sm p-8 rounded-3xl border border-white-10 relative"
            >
              <Quote className="absolute top-6 right-6 text-accent-muted" size={40} />
              
              <p className="text-lg text-white-80 mb-8 leading-relaxed italic">
                "{t.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <img 
                  src={t.image} 
                  alt={t.name} 
                  className="w-12 h-12 rounded-full border-2 border-accent"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="font-bold text-white">{t.name}</h4>
                  <p className="text-xs text-white-50 uppercase tracking-widest">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
