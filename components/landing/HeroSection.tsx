'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/utils/validators';
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
          src="/hero-desktop.jpg"
          alt="ALTEG production facility"
          fill
          className="object-cover object-center lg:hidden"
          priority
          sizes="100vw"
        />
        {/* Desktop background */}
        <Image
          src="/hero-desktop.jpg"
          alt="ALTEG production facility"
          fill
          className="hidden lg:block object-cover object-center lg:object-[center_25%]"
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
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-8 lg:gap-10 items-start min-h-[calc(100vh-4rem)] md:min-h-[calc(90vh-5rem)] lg:min-h-0">
          {/* Left Side - Content */}
          <div className="w-full flex flex-col items-start text-left order-1">
            <h1 className="text-4xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-5 leading-tight tracking-tight max-w-3xl">
              Alteg verandas, canopies &amp; aluminium fencing for UK homes
            </h1>
            <ul className="text-lg sm:text-xl md:text-xl lg:text-xl xl:text-2xl text-white/90 space-y-2 sm:space-y-2.5 max-w-2xl list-none pl-0">
              {HERO_BULLETS.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-white shrink-0 mt-0.5">*</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Side - Contact Form */}
          <div
            id="contact"
            className="w-full scroll-mt-24 flex justify-center mt-10 sm:mt-8 lg:mt-0 order-2"
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
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register('name')}
                  placeholder="Enter your name"
                  className="w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-sm sm:text-base"
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
                  className="w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-sm sm:text-base"
                />
                {errors.phone && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              <div className="w-full space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-medium text-[#050544] mb-0.5 sm:mb-1">
                  Project details (optional)
                </label>
                <textarea
                  {...register('interest')}
                  rows={3}
                  placeholder="For example: veranda 6x3m with glass roof, or aluminium fencing along rear boundary…"
                  className="w-full px-0 py-1 sm:py-1.5 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-sm sm:text-base resize-none"
                />
                {errors.interest && (
                  <p className="mt-1 text-xs sm:text-sm text-red-600" role="alert">
                    {errors.interest.message}
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
                {isSubmitting ? 'Sending...' : 'Send request'}
              </button>
            </form>
          </div>
        </div>

        {/* CTA Buttons Block */}
        <div className="w-full flex justify-center mt-8 sm:mt-10 lg:mt-12">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 lg:gap-6 w-full max-w-2xl">
            <Button
              href="#verandas"
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
    </section>
  );
};
