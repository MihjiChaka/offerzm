import React from 'react';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="p-8 md:p-12">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
          <Shield size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-primary">Privacy Policy</h1>
          <p className="text-slate-500">Last updated: March 18, 2026</p>
        </div>
      </div>

      <div className="prose prose-slate max-w-none space-y-8 text-slate-600">
            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Eye size={20} className="text-accent" />
                1. Information We Collect
              </h2>
              <p>
                At OfferZM, we prioritize your privacy. We <strong>do not collect</strong> or store any personal information. There is <strong>no account creation</strong> required to use our services.
              </p>
              <p>
                Any data you enter into our CV builder, cover letter generator, or "Roast" features is processed in real-time to provide you with the service and is not saved on our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Lock size={20} className="text-accent" />
                2. How We Handle Your Data
              </h2>
              <p>
                Since we do not store your data, we use it only to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Generate professional documents based on your current session input</li>
                <li>Analyze and critique your CV/Cover Letter in our Roast features</li>
                <li>Provide real-time AI-powered career suggestions</li>
              </ul>
              <p>
                Once you close your browser or refresh the page, your session data is cleared.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText size={20} className="text-accent" />
                3. Data Security
              </h2>
              <p>
                We use secure connections (HTTPS) to ensure that the data you enter is encrypted while in transit. Because we don't store your personal history or documents, there is no risk of your data being compromised from our servers.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Your Rights</h2>
              <p>
                You have full control over your data. Since nothing is stored, you don't need to request deletion. Simply clearing your browser cache or closing the application ensures your data is gone.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">5. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
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
