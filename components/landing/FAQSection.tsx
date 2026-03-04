'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FAQ_ITEMS } from '@/lib/constants/faq';
import { siteConfig } from '@/config/site';

const faqs = FAQ_ITEMS;

const PlusIcon: React.FC<{ isOpen: boolean; className?: string }> = ({ isOpen, className = '' }) => {
  if (isOpen) {
    return (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
};

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#050544] mb-3 sm:mb-4 leading-tight tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Answers to common questions about verandas, canopies, fencing and aluminium profile projects in the UK.
          </p>
        </div>

        <div className="max-w-3xl mx-auto rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-sm">
          {faqs.map((faq, index) => (
            <div key={index}>
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-4 sm:px-6 py-4 sm:py-5 bg-white hover:bg-gray-50 transition-colors flex items-center justify-between text-left group"
              >
                <span className="text-[#050544] font-medium text-sm sm:text-base md:text-lg pr-3 sm:pr-4 flex-1 leading-snug">
                  {faq.question}
                </span>
                <div className="flex-shrink-0 text-gray-500 group-hover:text-[#050544] transition-colors ml-2">
                  <PlusIcon isOpen={openIndex === index} className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
              </button>
              {openIndex === index && (
                <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 border-t border-gray-200">
                  {index === faqs.length - 1 ? (
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                      Can&apos;t find the answer you need? Contact us directly:{' '}
                      <Link href="/contact" className="text-[#050544] underline hover:text-[#445DFE] focus:outline-none focus:ring-2 focus:ring-[#445DFE]/40 rounded">
                        contact page (address &amp; details)
                      </Link>
                      {' or call '}
                      <a href={`tel:${siteConfig.links.phone}`} className="text-[#050544] underline hover:text-[#445DFE] focus:outline-none focus:ring-2 focus:ring-[#445DFE]/40 rounded">
                        {siteConfig.links.phoneDisplay}
                      </a>
                      .
                    </p>
                  ) : (
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
                  )}
                </div>
              )}
              {/* Divider line */}
              {index < faqs.length - 1 && (
                <div className="h-px bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
