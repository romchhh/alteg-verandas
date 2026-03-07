'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactFormSchema, ContactFormData } from '@/lib/utils/validators';
import { Modal } from '@/components/shared/Modal';
import { useContactModalStore } from '@/store/contactModal';

export const ContactModal: React.FC = () => {
  const { isOpen, close, variant } = useContactModalStore();
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
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          formType: variant === 'quote' ? 'request_individual_quote' : undefined,
        }),
      });
      const result = await response.json();
      if (result.success) {
        setSubmitMessage({ type: 'success', text: result.message || 'Thank you! We will contact you soon.' });
        reset();
      } else {
        setSubmitMessage({ type: 'error', text: result.error || 'Failed to submit. Please try again.' });
      }
    } catch {
      setSubmitMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setSubmitMessage(null);
    reset();
    close();
  };

  const title = variant === 'quote' ? 'Request individual quote' : 'Contact us';

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={title} size="lg" closeOnOverlayClick={!isSubmitting} rounded={false}>
      <div className="bg-white p-5 md:p-6 lg:p-7">
        {variant === 'quote' && (
          <p className="text-gray-700 mb-4">
            Can&apos;t find the profile you need? Send us a drawing or description — we&apos;ll manufacture to order.
          </p>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 lg:space-y-4">
          <div className="w-full space-y-1.5 lg:space-y-2">
            <label className="block text-sm font-medium text-[#050544] mb-1 lg:mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register('name')}
              placeholder="Enter your name"
              className="w-full px-0 py-1.5 lg:py-2 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-base"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="w-full space-y-1.5 lg:space-y-2">
            <label className="block text-sm font-medium text-[#050544] mb-1 lg:mb-1.5">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              {...register('phone')}
              placeholder="+44"
              className="w-full px-0 py-1.5 lg:py-2 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-base"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div className="w-full space-y-1.5 lg:space-y-2">
            <label className="block text-sm font-medium text-[#050544] mb-1 lg:mb-1.5">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...register('email')}
              placeholder="your@email.com"
              className="w-full px-0 py-1.5 lg:py-2 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-base"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="w-full space-y-1.5 lg:space-y-2">
            <label className="block text-sm font-medium text-[#050544] mb-1 lg:mb-1.5">
              Request (optional)
            </label>
            <textarea
              {...register('projectDetails')}
              rows={3}
              placeholder="Describe your project, drawing or profile..."
              className="w-full px-0 py-1.5 lg:py-2 bg-transparent border-0 border-b-2 border-black placeholder:text-gray-400 focus:outline-none focus:border-[#050544] text-black text-base resize-none"
            />
            {errors.projectDetails && (
              <p className="mt-1 text-sm text-red-600" role="alert">
                {errors.projectDetails.message}
              </p>
            )}
          </div>

          {submitMessage && (
            <div
              className={`p-2 lg:p-2.5 text-sm ${
                submitMessage.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
              }`}
            >
              {submitMessage.text}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-black text-white font-medium py-2.5 lg:py-3 px-6 transition-colors duration-200 mt-3 lg:mt-4 rounded-none text-base"
          >
            {isSubmitting ? 'Sending...' : 'Submit Request'}
          </button>
        </form>
      </div>
    </Modal>
  );
};
