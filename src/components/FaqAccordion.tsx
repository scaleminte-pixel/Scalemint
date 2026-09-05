'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import AnimateOnScroll, { StaggerContainer, StaggerItem } from './AnimateOnScroll';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
  limit?: number;
}

export default function FaqAccordion({ faqs, limit = 5 }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [showAll, setShowAll] = useState(false);

  const displayedFaqs = showAll ? faqs : faqs.slice(0, limit);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-14 sm:py-16 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateOnScroll variant="fadeUp" className="text-center space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-300 border border-purple-500/20">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Direct Answers to Common Inquiries
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">
            Essential facts on our sprint execution model, IP handover, and delivery commitments.
          </p>
        </AnimateOnScroll>

        <StaggerContainer staggerDelay={0.08} className="space-y-4">
          {displayedFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <StaggerItem key={faq.id || index} variant="fadeUp">
                <div
                  className={`glass-card rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'border-purple-500/50 bg-agency-card/90 shadow-glow-purple/20'
                      : 'border-agency-border hover:border-agency-border/90'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(index)}
                    className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-heading font-bold text-base sm:text-lg text-white">
                      {faq.question}
                    </span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className={`w-7 h-7 rounded-full bg-agency-dark flex items-center justify-center border shrink-0 ${
                        isOpen ? 'border-purple-500 text-purple-400' : 'border-agency-border text-gray-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.35, ease: [0.25, 0.4, 0.25, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 text-sm text-gray-300 leading-relaxed border-t border-agency-border/40">
                          <p>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        {/* View All Questions Toggle If List is Long */}
        {faqs.length > limit && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2.5 rounded-full text-xs font-heading font-semibold text-purple-300 bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-purple-500/30 transition-all inline-flex items-center gap-2"
            >
              <span>{showAll ? 'Show Fewer Questions' : `View All ${faqs.length} Questions`}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showAll ? 'rotate-180' : ''}`} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
