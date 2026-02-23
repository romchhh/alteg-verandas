'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/utils/validators';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { siteConfig } from '@/config/site';

const PhoneIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const MailIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const MapPinIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452H17.24v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.046V9h3.073v1.561h.044c.428-.81 1.474-1.664 3.034-1.664 3.245 0 3.842 2.137 3.842 4.917v6.638zM5.337 7.433c-.986 0-1.783-.8-1.783-1.786 0-.987.797-1.787 1.783-1.787.985 0 1.785.8 1.785 1.787 0 .986-.8 1.786-1.785 1.786zM6.813 20.452H3.861V9h2.952v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
  </svg>
);

const HOMEPAGE_SECTION_IDS = ['catalog', 'advantages', 'how-to-order', 'faq', 'trust', 'features', 'about', 'calculator', 'customer-segments'];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : '';
    if (hash && HOMEPAGE_SECTION_IDS.includes(hash)) {
      window.location.replace(`/#${hash}`);
    }
  }, []);

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
        setSubmitMessage({ type: 'success', text: result.message || 'Thank you! We will contact you soon.' });
        reset();
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit form. Please try again.' });
      }
    } catch (error) {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 md:pt-20">
      {/* Hero Section — photo + dark blur */}
      <section className="relative text-white py-12 sm:py-16 md:py-20 overflow-hidden min-h-[280px] sm:min-h-[320px] md:min-h-[360px] flex items-center">
        <div className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt="ALTEG — Get in touch"
            fill
            className="object-cover scale-105 blur-[2px]"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/40" aria-hidden="true" />
        </div>
        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 leading-tight">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 max-w-2xl mx-auto">
              We're here to help with your aluminium profile needs. Contact us for quotes, technical support, or any questions.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Left Side - Contact Information (one block) */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#050544] mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Reach out to us through any of the channels below. Our team is ready to assist you with your aluminium profile requirements.
                </p>

                <div className="bg-gray-50 rounded-xl p-6 sm:p-8 border border-gray-100">
                  {/* Phone */}
                  <div className="flex items-start gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0 last:pt-0 pt-0">
                    <PhoneIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#050544] mb-1">Phone</h3>
                      <a href={`tel:${siteConfig.links.phone}`} className="text-gray-700 hover:text-[#445DFE] transition-colors text-base">
                        {siteConfig.links.phoneDisplay || siteConfig.links.phone}
                      </a>
                      <p className="text-sm text-gray-500 mt-0.5">Mon-Fri: 9AM-6PM</p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start gap-4 py-6 border-b border-gray-200 last:border-0 last:pb-0 last:pt-0">
                    <MailIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#050544] mb-1">Email</h3>
                      <a href={`mailto:${siteConfig.links.email}`} className="text-gray-700 hover:text-[#445DFE] transition-colors text-base">
                        {siteConfig.links.email}
                      </a>
                      <p className="text-sm text-gray-500 mt-0.5">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start gap-4 py-6 border-b border-gray-200 last:border-0 last:pb-0 last:pt-0">
                    <MapPinIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#050544] mb-1">Warehouse & Office</h3>
                      <a href={siteConfig.links.mapUrl} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-[#445DFE] transition-colors text-base block whitespace-pre-line">
                        {siteConfig.links.address}
                      </a>
                      <p className="text-sm text-gray-500 mt-0.5">
                        <a href={siteConfig.links.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[#445DFE] hover:underline">View on Google Maps</a>
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex items-start gap-4 py-6 border-b border-gray-200 last:border-0 last:pb-0">
                    <ClockIcon className="w-6 h-6 text-gray-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-[#050544] mb-1">Business Hours</h3>
                      <p className="text-gray-700 text-base">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        <span className="text-sm text-gray-500">Saturday & Sunday: Closed</span>
                      </p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="pt-6">
                    <h3 className="text-lg font-semibold text-[#050544] mb-3">Social Media</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Follow us to stay updated on new products and offers.
                    </p>
                    <div className="flex gap-3">
                      <a
                        href="https://www.facebook.com/profile.php?id=61588085476531"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#050544] text-white flex items-center justify-center hover:bg-[#445DFE] transition-colors"
                        aria-label="Facebook"
                      >
                        <FacebookIcon className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.instagram.com/alteg_uk/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#050544] text-white flex items-center justify-center hover:bg-[#445DFE] transition-colors"
                        aria-label="Instagram"
                      >
                        <InstagramIcon className="w-5 h-5" />
                      </a>
                      <a
                        href="https://www.linkedin.com/in/alteg-uk-5891693b2/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 rounded-full bg-[#050544] text-white flex items-center justify-center hover:bg-[#445DFE] transition-colors"
                        aria-label="LinkedIn"
                      >
                        <LinkedInIcon className="w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side - Contact Form */}
              <div>
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 md:p-8 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-bold text-[#050544] mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-[#050544] mb-2">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        {...register('name')}
                        placeholder="Enter your name"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#445DFE] text-[#050544] text-base"
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#050544] mb-2">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        {...register('phone')}
                        placeholder="+44"
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#445DFE] text-[#050544] text-base"
                      />
                      {errors.phone && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {errors.phone.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-[#050544] mb-2">
                        Request (optional)
                      </label>
                      <textarea
                        {...register('interest')}
                        rows={5}
                        placeholder="Describe your project or inquiry..."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#445DFE] text-[#050544] text-base resize-none"
                      />
                      {errors.interest && (
                        <p className="mt-2 text-sm text-red-600" role="alert">
                          {errors.interest.message}
                        </p>
                      )}
                    </div>

                    {submitMessage && (
                      <div
                        className={`p-4 rounded-lg text-sm ${
                          submitMessage.type === 'success'
                            ? 'bg-green-50 text-green-800 border border-green-200'
                            : 'bg-red-50 text-red-800 border border-red-200'
                        }`}
                      >
                        {submitMessage.text}
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      variant="primary"
                      className="w-full bg-[#445DFE] hover:bg-[#050544] text-white py-3 px-6 text-base font-semibold transition-all duration-300 rounded-none"
                    >
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div className="mt-12 sm:mt-16 md:mt-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#050544] mb-6 text-center">
                Find Us on the Map
              </h2>
              <div className="bg-gray-200 rounded-lg overflow-hidden shadow-lg" style={{ height: '400px' }}>
                <iframe
                  src={siteConfig.links.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="ALTEG UK - Unit A3, Riverside Industrial Estate, Littlehampton"
                />
              </div>
              <p className="text-center text-gray-600 mt-4 text-sm">
                <a href={siteConfig.links.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[#445DFE] font-semibold hover:underline">
                  Open in Google Maps
                </a>
                {' — '}
                {siteConfig.links.address}
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
