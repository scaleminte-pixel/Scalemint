'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import AnimateOnScroll from './AnimateOnScroll';

interface LeadFormProps {
  defaultService?: string;
}

export default function LeadForm({ defaultService = '' }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    whatsapp: '',
    company: '',
    serviceInterest: defaultService || 'Website Design',
    budget: '$2,000 - $5,000',
    message: '',
  });

  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
    utmTerm: '',
    utmContent: '',
    landingPage: '',
    referrer: '',
  });

  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Extract UTMs on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: urlParams.get('utm_source') || '',
        utmMedium: urlParams.get('utm_medium') || '',
        utmCampaign: urlParams.get('utm_campaign') || '',
        utmTerm: urlParams.get('utm_term') || '',
        utmContent: urlParams.get('utm_content') || '',
        landingPage: window.location.pathname,
        referrer: document.referrer || '',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const payload = {
        ...formData,
        ...utmParams,
      };

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit inquiry');
      }

      setStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        whatsapp: '',
        company: '',
        serviceInterest: 'Website Design',
        budget: '$2,000 - $5,000',
        message: '',
      });
    } catch (err: any) {
      console.error('Submission error:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  const services = [
    'Branding Design',
    'Website Design',
    'Video Editing',
    'AI UGC Video Editing',
    'Digital Marketing Service',
    'Google Ads Service',
    'Full 360° Agency Retainer',
  ];

  const budgetBrackets = [
    'Under $1,500',
    '$1,500 - $3,000',
    '$3,000 - $5,000',
    '$5,000 - $10,000',
    '$10,000+',
  ];

  const inputClasses = "w-full px-4 py-3 rounded-xl bg-agency-dark/90 border border-agency-border focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/30 text-white text-sm transition-all duration-300 placeholder:text-gray-500";

  return (
    <div id="contact" className="relative">
      <AnimateOnScroll variant="scaleUp" duration={0.8}>
        <div className="glass-card rounded-2xl p-6 sm:p-10 border border-agency-border/80 shadow-card-subtle relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute -top-24 -right-24 w-60 h-60 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-12 space-y-4"
            >
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold text-white">Inquiry Received!</h3>
              <p className="text-gray-300 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for reaching out. A Senior Partner from Scalemint will review your project requirements and get back to you within 24 business hours.
              </p>
              <button
                type="button"
                onClick={() => setStatus('idle')}
                className="mt-4 px-6 py-2.5 rounded-full bg-agency-card text-sm text-gray-300 hover:text-white border border-agency-border transition-colors"
              >
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
                  <span>Direct Inquiries</span>
                </div>
                <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white tracking-tight">
                  Let&apos;s Build Something High-Converting
                </h3>
                <p className="text-sm text-gray-400">
                  Fill out the quick brief below to receive a strategic estimate and consultation roadmap.
                </p>
              </div>

              {status === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMessage}</span>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Your Full Name <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Morgan"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Work Email <span className="text-purple-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="alex@company.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Phone / WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Phone / WhatsApp (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Company / Brand */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Company / Brand Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Lumina Health"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className={inputClasses}
                  />
                </div>

                {/* Service Interest */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Service of Interest
                  </label>
                  <select
                    value={formData.serviceInterest}
                    onChange={(e) => setFormData({ ...formData, serviceInterest: e.target.value })}
                    className={inputClasses}
                  >
                    {services.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Estimated Budget */}
                <div>
                  <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                    Estimated Project Budget
                  </label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className={inputClasses}
                  >
                    {budgetBrackets.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                  Tell Us About Your Project & Goals <span className="text-purple-400">*</span>
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="What are your key goals, current bottlenecks, and ideal launch timeline?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className={inputClasses}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full py-4 rounded-xl font-heading font-semibold text-base bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-glow-purple flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 hover:scale-[1.01] hover:shadow-glow-blue"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Processing Your Request...</span>
                  </>
                ) : (
                  <>
                    <span>Request Proposal & Strategy Call</span>
                    <Send className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-gray-500">
                🔒 We value your confidentiality. Strict NDA respected. No spam, ever.
              </p>
            </form>
          )}
        </div>
      </AnimateOnScroll>
    </div>
  );
}
