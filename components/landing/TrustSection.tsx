import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/shared/Button';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { TrustpilotReviews } from '@/components/landing/TrustpilotReviews';

const trustPoints = [
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    title: 'ABOUT ALTEG',
    content: (
      <div>
        <p className="text-white/90 mb-4 leading-relaxed">
          ALTEG is a European manufacturer of aluminium profiles supplying customers across the UK.
        </p>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">15+</div>
            <div className="text-xs text-white/70 leading-tight">Years in Production</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">500+</div>
            <div className="text-xs text-white/70 leading-tight">Tons Monthly</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-bold text-white mb-1">EN</div>
            <div className="text-xs text-white/70 leading-tight">Standards</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'COMPETITIVE PRICING',
    content: (
      <div>
        <p className="text-white/90 mb-3 leading-relaxed">
          Direct supplies, no middleman markups. Straight from manufacturer to you.
        </p>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>No intermediaries</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Competitive pricing</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: 'QUALITY GUARANTEE',
    content: (
      <div>
        <p className="text-white/90 mb-3 leading-relaxed">
          Full control from raw materials to finished profiles. EN standards compliant.
        </p>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Full production cycle control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Factory quality control</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Compliance with European standards (EN)</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    title: 'PRODUCTION FLEXIBILITY',
    content: (
      <div>
        <p className="text-white/90 mb-3 leading-relaxed">
          Cutting, drilling, milling, and custom solutions tailored to your project.
        </p>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Free cutting to size</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>All items cut to preferred size upon request</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Tailored solutions</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'DELIVERY SERVICE',
    content: (
      <div>
        <p className="text-white/90 mb-3 leading-relaxed">
          Fast and reliable delivery to any location across the UK, on time and on schedule.
        </p>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Delivery across the UK</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Typical delivery time: 2-5 business days</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Free delivery over £77 (ex. VAT)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Pallet and courier delivery options</span>
          </li>
        </ul>
      </div>
    ),
  },
  {
    icon: (
      <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'SOCIAL RESPONSIBILITY',
    content: (
      <div>
        <p className="text-white/90 mb-3 leading-relaxed">
          Committed to sustainable manufacturing practices, environmental stewardship, and ethical business operations.
        </p>
        <ul className="space-y-2 text-white/80 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Recyclable aluminium production</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Energy-efficient manufacturing processes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Waste reduction and material optimization</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-white mt-1">✓</span>
            <span>Ethical supply chain and fair labor practices</span>
          </li>
        </ul>
      </div>
    ),
  },
];

const TESTIMONIALS = [
  { quote: 'Reliable supply and fair pricing. We order regularly.', name: 'J. Mitchell', company: 'Metalworks Ltd, Birmingham', image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Cutting to size saved us time. Quality is consistent.', name: 'Sarah K.', company: 'Fabrication Solutions, Manchester', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Switched from another supplier — no regrets. On-time delivery.', name: 'D. Roberts', company: 'Roberts Aluminium, Leeds', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Good range of profiles, quick quotes. Recommended.', name: 'A. Patel', company: 'Patel Engineering, London', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Professional team, clear communication. Will use again.', name: 'M. Collins', company: 'Collins & Co, Bristol', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Competitive for wholesale. We use them for all our angles.', name: 'T. Wright', company: 'Wright Fabrications, Sheffield', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Best lead times we have had. Always in stock for our key profiles.', name: 'R. Hughes', company: 'Hughes Metal, Cardiff', image: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Free cutting to size is a game-changer. No waste, fair prices.', name: 'Emma L.', company: 'Ltd Design Studio, Edinburgh', image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=face' },
  { quote: 'We switched our whole supply to ALTEG. Quality and service are top.', name: 'P. O’Brien', company: 'O’Brien Fabrication, Liverpool', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Quick turnaround on custom lengths. Would recommend to anyone.', name: 'Lisa M.', company: 'Mason Engineering, Nottingham', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Transparent pricing, no hidden costs. A proper partner for our business.', name: 'K. Thompson', company: 'Thompson & Sons, Newcastle', image: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?w=96&h=96&fit=crop&crop=face' },
  { quote: 'Consistent quality and reliable delivery. Our go-to for aluminium.', name: 'N. Foster', company: 'Foster Aluminium, Southampton', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=96&h=96&fit=crop&crop=face' },
];

export const TrustSection: React.FC = () => {
  return (
    <section id="advantages" className="scroll-mt-20 md:scroll-mt-24 pt-12 sm:pt-16 md:pt-20 lg:pt-24 pb-12 sm:pb-16 md:pb-20 lg:pb-24 bg-[#141414] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight tracking-tight">
            Manufacturer, Quality & Logistics
          </h2>
          <p className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto leading-relaxed px-2 mb-6">
            ALTEG is not just a stockist — we are a European manufacturer with full control over production, quality and pricing for the UK market.
          </p>
          <p className="text-sm sm:text-base text-white/60 max-w-2xl mx-auto leading-relaxed px-2">
            Below we confirm our status as a manufacturer and answer key questions about logistics, lead times and compliance with European (EN) standards.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {trustPoints.map((point, index) => (
            <div 
              key={index}
              className="bg-black/40 rounded-lg p-4 sm:p-6 border border-white/10 hover:border-[#445DFE] transition-colors"
            >
              <div className="flex items-start sm:items-center gap-3 mb-3 sm:mb-4 flex-col sm:flex-row">
                <div className="text-white w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
                  {point.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white uppercase tracking-wide mb-3 sm:mb-4 leading-tight">
                  {point.title}
                </h3>
              </div>
              <div className="text-white/90 text-sm sm:text-base">
                {point.content}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Reviews — horizontal scroll with photos */}
        <div className="mb-12 sm:mb-16">
          <h3 className="text-xl sm:text-2xl font-bold text-white uppercase tracking-wide mb-2 text-center">
          Customer Reviews
          </h3>
          <p className="text-white/80 italic text-center mb-6 text-sm sm:text-base">
            Trusted by customers across the UK
          </p>
          <div className="relative -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="overflow-x-auto scrollbar-hide pb-2">
              <div className="flex gap-4 flex-nowrap" style={{ minWidth: 'min-content' }}>
                {TESTIMONIALS.map((t, i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[280px] sm:w-[320px] bg-black/40 rounded-lg p-4 sm:p-5 border border-white/10 text-left"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden flex-shrink-0 bg-white/10">
                        <Image
                          src={t.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-white/90 text-xs sm:text-sm font-semibold">{t.name}</p>
                        <p className="text-white/60 text-xs truncate" title={t.company}>{t.company}</p>
                      </div>
                    </div>
                    {/* 5-star rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <p className="text-white/95 text-sm sm:text-base italic">&ldquo;{t.quote}&rdquo;</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Trustpilot Reviews Block — real data from API when TRUSTPILOT_API_KEY is set */}
          <div className="mt-8 sm:mt-10">
            <TrustpilotReviews />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/wholesale" className="w-full sm:w-auto">
            <Button 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto !bg-[#050544] hover:!bg-[#445DFE] text-white px-8 py-4 text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-none"
            >
              Request a quote
            </Button>
          </Link>
          <Link href="/contact" className="w-full sm:w-auto">
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-[#050544] px-8 py-4 text-base md:text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl rounded-none"
            >
              Contact us
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
