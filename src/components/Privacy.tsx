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
                At OfferZM, we collect information that you provide directly to us when you create an account, build a CV, or generate a cover letter. This includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Personal details (Name, email, phone number, location)</li>
                <li>Professional history (Work experience, education, skills)</li>
                <li>Documents you upload for our "Roast" features</li>
                <li>Payment information (processed securely via our payment partners)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <Lock size={20} className="text-accent" />
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 space-y-2 mt-4">
                <li>Provide, maintain, and improve our services</li>
                <li>Generate professional documents based on your input</li>
                <li>Analyze and critique your CV/Cover Letter in our Roast features</li>
                <li>Communicate with you about updates, security, and support</li>
                <li>Process transactions and send related information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                <FileText size={20} className="text-accent" />
                3. Data Security
              </h2>
              <p>
                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction. Your data is stored securely and we do not sell your personal information to third parties.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-primary mb-4">4. Your Rights</h2>
              <p>
                You have the right to access, update, or delete your personal information at any time. You can do this by logging into your dashboard or contacting our support team at mihjigeorgechaka@gmail.com.
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
