'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData, QUOTE_INTEREST_OPTIONS } from '@/lib/utils/validators';
import { Button } from '@/components/shared/Button';

const HERO_BULLETS = [
  'Made‑to‑measure verandas and canopies',
  'Aluminium fencing and profile systems',
  'European manufacturing, supplied across the UK',
  'Trade and homeowner enquiries welcome',
];

export const HeroSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setSubmitMessage({
          type: 'success',
          text: result.message || 'Thank you! We will contact you soon.',
        });
        reset();
      } else {
        setSubmitMessage({
          type: 'error',
          text: result.error || 'Failed to submit form. Please try again.',
        });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="relative min-h-[100vh] md:min-h-[90vh] lg:min-h-[85vh] flex items-center lg:items-end justify-center overflow-hidden mt-16 md:mt-20 lg:mt-0 lg:pt-20 pb-0 lg:pb-0">
      {/* Background Image - modern production facility */}
      <div className="absolute inset-0">
        {/* Mobile background */}
        <Image
          src="/The-Value-of-Adding-a-House-Extension.jpg"
          alt="Modern house with aluminium veranda and extension"
          fill
          className="object-cover object-center lg:hidden"
          priority
          sizes="100vw"
        />
        {/* Desktop background */}
        <Image
          src="/The-Value-of-Adding-a-House-Extension.jpg"
          alt="Modern house with aluminium veranda and extension"
          fill
          className="hidden lg:block object-cover object-center lg:object-[center_30%]"
          priority
          sizes="100vw"
        />
        {/* Dark overlay for better text contrast */}
        <div className="absolute inset-0 bg-black/40" />
        {/* Gradient overlay - darker at the bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {/* Caption */}

      </div>

      {/* Content Overlay - Grid Layout */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24 lg:pt-24 lg:pb-8 xl:pb-10">
        <div className="flex flex-col lg:grid lg:grid-cols-2 lg:[grid-template-columns:minmax(0,1.3fr)_minmax(0,0.7fr)] gap-8 lg:gap-10 items-start min-h-[calc(100vh-4rem)] md:min-h-[calc(90vh-5rem)] lg:min-h-0">
          {/* Left Side - Content */}
          <div className="w-full flex flex-col items-center lg:items-start text-center lg:text-left order-1">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-5 leading-tight tracking-tight max-w-3xl lg:max-w-4xl xl:max-w-5xl">
              Verandas&nbsp;&amp;&nbsp;canopies aluminium fencing
              <br />
              <span className="inline-flex items-center mt-3 sm:mt-4 px-5 py-2 sm:px-6 sm:py-2.5 border border-red-300/80 bg-red-500/20 text-red-100 text-2xl sm:text-3xl md:text-4xl lg:text-3xl xl:text-4xl font-bold tracking-wide shadow-[0_0_28px_rgba(239,68,68,0.45)] animate-pulse">
                From&nbsp;&pound;1,999
              </span>
            </h1>
            <ul className="text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl text-white/90 space-y-2 sm:space-y-2.5 max-w-2xl list-none pl-0 w-full mt-1 sm:mt-0">
              {HERO_BULLETS.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-2 justify-center lg:justify-start text-left max-w-xl mx-auto lg:mx-0 lg:max-w-none"
                >
                  <span className="text-white shrink-0 mt-0.5">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Mobile CTA Buttons Block — before form on small screens */}
          <div className="w-full flex justify-center mt-8 sm:mt-10 lg:mt-12 sm:hidden order-2">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6 w-full max-w-sm">
              <Button
                href="/catalog/verandas"
                variant="outline"
                className="w-full min-h-[58px] border-2 border-white bg-black/45 text-white hover:bg-white/10 rounded-none text-lg font-bold tracking-wide shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
              >
                Explore verandas &amp; canopies
              </Button>
              <Button
                href="/contact"
                variant="outline"
                className="w-full min-h-[58px] bg-white text-black border-white hover:bg-white/90 rounded-none text-lg font-bold tracking-wide shadow-[0_8px_20px_rgba(0,0,0,0.45)]"
              >
                Get a free quote
              </Button>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div
            id="contact"
            className="w-full scroll-mt-24 flex justify-center mt-10 sm:mt-8 lg:mt-0 order-3"
          >
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="bg-white/95 backdrop-blur-sm rounded-none p-4 sm:p-5 md:p-6 lg:p-6 xl:p-7 space-y-3 lg:space-y-4 w-full max-w-sm sm:max-w-md lg:max-w-lg"
            >
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold text-black mb-1 sm:mb-2 lg:mb-3">
                Request a call back
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
                Leave your details and a short note about your veranda, canopy or fencing project. We
                will get back to you as soon as possible.
              </p>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter your full name"
                  className="hero-active-field w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-red-500 placeholder:text-gray-400 focus:outline-none focus:border-red-600 text-black text-sm sm:text-base"
                />
                {errors.name && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register('phone')}
                  placeholder="+44"
                  className="hero-active-field w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-red-500 placeholder:text-gray-400 focus:outline-none focus:border-red-600 text-black text-sm sm:text-base"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register('email')}
                  placeholder="your@email.com"
                  className="hero-active-field w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-red-500 placeholder:text-gray-400 focus:outline-none focus:border-red-600 text-black text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  I&apos;m interested in
                </label>
                <select
                  {...register('interestedIn')}
                  className="hero-active-field w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-red-500 text-black text-sm sm:text-base focus:outline-none focus:border-red-600"
                  defaultValue=""
                >
                  <option value="">— Select —</option>
                  {QUOTE_INTEREST_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  Project details (optional)
                </label>
                <textarea
                  {...register('projectDetails')}
                  rows={3}
                  placeholder="For example: veranda 6x3m with glass roof, or aluminium fencing along rear boundary…"
                  className="hero-active-field w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-red-500 placeholder:text-gray-400 focus:outline-none focus:border-red-600 text-black text-sm sm:text-base resize-none"
                />
                {errors.projectDetails && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.projectDetails.message}
                  </p>
                )}
              </div>

              {submitMessage && (
                <div
                  className={`p-2 text-sm ${
                    submitMessage.type === 'success'
                      ? 'bg-green-50 text-green-800'
                      : 'bg-red-50 text-red-800'
                  }`}
                >
                  {submitMessage.text}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black text-white font-medium py-2 sm:py-2.5 lg:py-3 px-6 transition-colors duration-200 mt-2 sm:mt-3 rounded-none text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Request'}
              </button>
            </form>
          </div>
        </div>

        {/* CTA Buttons Block — desktop/tablet */}
        <div className="w-full hidden sm:flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6 w-full max-w-2xl">
            <Button
              href="/catalog/verandas"
              variant="outline"
              className="w-full border-2 border-white text-white hover:bg-white/10 rounded-none text-base sm:text-lg lg:text-xl font-semibold"
            >
              Explore verandas &amp; canopies
            </Button>
            <Button
              href="/contact"
              variant="outline"
              className="w-full bg-white text-black border-white hover:bg-white/90 rounded-none text-base sm:text-lg lg:text-xl font-semibold"
            >
              Get a free quote
            </Button>
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes heroFieldBlink {
          0%,
          100% {
            border-color: #ef4444;
            box-shadow: 0 0 0 0 rgba(239, 68, 68, 0);
          }
          50% {
            border-color: #dc2626;
            box-shadow: 0 4px 14px -8px rgba(220, 38, 38, 0.9);
          }
        }

        .hero-active-field {
          animation: heroFieldBlink 1.1s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};
