import React from 'react';
import { FileText, CheckCircle, AlertCircle, Info } from 'lucide-react';

export default function Terms() {
  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Terms of Service</h1>
          <p className="text-slate-500">Last updated: March 18, 2026</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Info size={20} className="text-accent" />
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using OfferZM, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, you may not access or use our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <CheckCircle size={20} className="text-accent" />
                2. Use of Services
              </h2>
              <p>
                OfferZM provides tools for creating professional documents, including CVs and cover letters, and features for document analysis ("Roast"). You agree to use these services only for lawful purposes and in accordance with these Terms.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>You are responsible for the accuracy of the information you provide.</li>
                <li>You must not use our services to create fraudulent or misleading documents.</li>
                <li>You must not attempt to interfere with the proper working of our platform.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <AlertCircle size={20} className="text-accent" />
                3. Payments and Refunds
              </h2>
              <p>
                Certain features of OfferZM require payment. All payments are processed through our secure payment partners.
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Fees are non-refundable unless otherwise required by law.</li>
                <li>We reserve the right to change our pricing at any time.</li>
                <li>Payments are processed using local Zambian payment methods (e.g., Airtel Money, MTN Mobile Money).</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Intellectual Property</h2>
              <p>
                The OfferZM platform and its original content, features, and functionality are and will remain the exclusive property of OfferZM and its licensors. The documents you create using our tools are your property.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">5. Limitation of Liability</h2>
              <p>
                In no event shall OfferZM be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">6. Changes to Terms</h2>
              <p>
                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any significant changes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">7. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:
                <br />
                Email: mihjigeorgechaka@gmail.com
                <br />
                Phone: +260 977 572 626
                <br />
                Address: Chipata, Zambia
              </p>
            </section>
          </div>
    </div>
  );
}
