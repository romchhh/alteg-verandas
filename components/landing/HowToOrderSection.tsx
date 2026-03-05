import React from 'react';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';

const steps = [
  {
    number: '1',
    title: 'Tell us about your project',
    description:
      'Send us basic details about your veranda, canopy or fencing project – dimensions, preferred roof type and colour.',
  },
  {
    number: '2',
    title: 'Receive your tailored quote',
    description:
      'We prepare a personalised quotation for a veranda kit, fencing run or profile package and confirm lead times for the UK.',
  },
  {
    number: '3',
    title: 'Approve and arrange delivery',
    description:
      'Approve the quote and choose delivery or collection. We manufacture, prepare and ship your order anywhere in the UK.',
  },
];

export const HowToOrderSection: React.FC = () => {
  return (
    <section id="how-to-order" className="pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-gradient-to-b from-white to-[#E9EDF4]">
      <span id="delivery" className="block scroll-mt-24 -translate-y-20" aria-hidden="true" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#050544] mb-4 sm:mb-5 leading-tight tracking-tight">
            How to get your veranda or fencing
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed px-2">
            Simple process, professional service. From first enquiry to installation‑ready veranda or fencing in three clear steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 mb-10 sm:mb-16 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl p-8 sm:p-10 border-2 border-gray-100 hover:border-[#445DFE] transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 relative group"
            >
              {/* Number Badge - Larger and More Prominent */}
              <div className="absolute -top-6 -left-6 z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-[#050544] to-[#445DFE] text-white rounded-full flex items-center justify-center font-bold text-3xl sm:text-4xl shadow-2xl group-hover:scale-110 transition-transform duration-300">
                  {step.number}
                </div>
              </div>
              
              {/* Content */}
              <div className="pt-4 sm:pt-6">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#050544] uppercase tracking-wide leading-tight mb-5 sm:mb-6">
                  {step.title}
                </h3>
                <div className="text-gray-600 text-lg sm:text-xl leading-relaxed">
                  <p>{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/#calculator">
            <Button 
              variant="primary" 
              size="lg"
              className="!bg-[#050544] hover:!bg-[#445DFE] text-white px-8 py-4 text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-none"
            >
              Start Your Order
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
