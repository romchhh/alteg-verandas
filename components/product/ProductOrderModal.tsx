'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '@/components/shared/Modal';
import { Input } from '@/components/shared/Input';
import { Button } from '@/components/shared/Button';
import { productInquiryFormSchema, type ProductInquiryFormData } from '@/lib/utils/validators';

export interface ProductOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
}

export function ProductOrderModal({ isOpen, onClose, productId, productName }: ProductOrderModalProps) {
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductInquiryFormData>({
    resolver: zodResolver(productInquiryFormSchema),
    defaultValues: { name: '', email: '', phone: '', message: '' },
  });

  const onSubmit = async (data: ProductInquiryFormData) => {
    setSubmitStatus('idle');
    setErrorMessage('');
    try {
      const res = await fetch('/api/product-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId,
          productName,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setSubmitStatus('error');
        setErrorMessage(json.error || 'Something went wrong.');
        return;
      }
      setSubmitStatus('success');
      reset();
      setTimeout(() => {
        onClose();
        setSubmitStatus('idle');
      }, 2000);
    } catch {
      setSubmitStatus('error');
      setErrorMessage('Network error. Please try again.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Request a quote"
      size="md"
      closeOnOverlayClick={true}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <p className="text-sm text-gray-600">
          Fill in the form and we&apos;ll get back to you about this product.
        </p>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
          <Input
            {...register('name')}
            type="text"
            placeholder="Your name"
            error={errors.name?.message}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">E-mail</label>
          <Input
            {...register('email')}
            type="email"
            placeholder="your@email.com"
            error={errors.email?.message}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Phone</label>
          <Input
            {...register('phone')}
            type="tel"
            placeholder="Your phone number"
            error={errors.phone?.message}
            className="w-full"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Your message</label>
          <textarea
            {...register('message')}
            placeholder="Dimensions, quantity, or any questions..."
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#445DFE] focus:ring-1 focus:ring-[#445DFE] focus:outline-none"
          />
        </div>

        {submitStatus === 'success' && (
          <p className="text-sm font-medium text-green-600">
            Thank you! We will contact you shortly.
          </p>
        )}
        {submitStatus === 'error' && (
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#050544] hover:bg-[#445DFE] text-white rounded-none"
          >
            {isSubmitting ? 'Sending...' : 'Send request'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-none"
          >
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
