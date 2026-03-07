import { z } from 'zod';

export const customerInfoSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  company: z.string().optional(),
  address: z
    .object({
      street: z.string().min(3, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      postcode: z.string().min(5, 'Postcode is required'),
      country: z.string().optional(),
    })
    .optional(),
});

export const quoteRequestSchema = z.object({
  customer: customerInfoSchema,
  notes: z.string().optional(),
  isWholesale: z.boolean().default(false),
});

export const orderSchema = z.object({
  customer: customerInfoSchema.extend({
    address: z.object({
      street: z.string().min(3, 'Street address is required'),
      city: z.string().min(2, 'City is required'),
      postcode: z.string().min(5, 'Postcode is required'),
      country: z.string().default('United Kingdom'),
    }),
  }),
  delivery: z.object({
    postcode: z.string().min(5, 'Postcode is required'),
    method: z.enum(['standard', 'express', 'collection']).default('standard'),
    instructions: z.string().optional(),
  }),
  notes: z.string().optional(),
});

export const wholesaleFormSchema = z.object({
  company: z.string().min(2, 'Company name is required'),
  contactName: z.string().min(2, 'Contact name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number is required'),
  annualVolume: z.string().optional(),
  productInterests: z.array(z.string()).optional(),
  message: z.string().optional(),
  attachmentUrl: z.string().optional(),
});

/** Get a Quote form — Block 6 (contact page). Also used by hero form. */
export const QUOTE_INTEREST_OPTIONS = [
  'Veranda / Canopy',
  'Fencing',
  'Profile Systems',
  'Accessories / Seals',
] as const;

export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  interestedIn: z.enum(QUOTE_INTEREST_OPTIONS).optional(),
  projectDetails: z.string().optional().default('').refine((s) => !s || s.length >= 3, 'At least 3 characters if provided'),
});

export const productInquiryFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  message: z.string().optional(),
});

export const adminProductSchema = z.object({
  nameEn: z.string().min(1, "Name is required"),
  dimensions: z.string().min(1, "Dimensions are required"),
  pricePerKg: z.union([z.string(), z.number()]).optional(),
  weightPerMeter: z.union([z.string(), z.number()]).optional(),
  standardLengths: z.string().min(1, "At least one length required"),
}).refine(
  (data) => {
    const lengths = String(data.standardLengths).split(",").map((s) => parseFloat(s.trim())).filter((n) => !isNaN(n));
    return lengths.length > 0;
  },
  { message: "Enter at least one valid length (e.g. 1, 3, 6)", path: ["standardLengths"] }
).refine(
  (data) => {
    const v = data.pricePerKg != null && data.pricePerKg !== "" ? parseFloat(String(data.pricePerKg)) : NaN;
    return isNaN(v) || v >= 0;
  },
  { message: "Price per kg must be ≥ 0", path: ["pricePerKg"] }
).refine(
  (data) => {
    const v = data.weightPerMeter != null && data.weightPerMeter !== "" ? parseFloat(String(data.weightPerMeter)) : NaN;
    return isNaN(v) || v > 0;
  },
  { message: "Weight per m must be > 0", path: ["weightPerMeter"] }
);

export const adminCategorySchema = z.object({
  id: z.string().min(1, "ID is required").regex(/^[a-z0-9_]+$/, "ID: lowercase letters, numbers, underscores only"),
  nameEn: z.string().min(1, "Name (EN) is required"),
});

export type CustomerInfoFormData = z.infer<typeof customerInfoSchema>;
export type QuoteRequestFormData = z.infer<typeof quoteRequestSchema>;
export type OrderFormData = z.infer<typeof orderSchema>;
export type WholesaleFormData = z.infer<typeof wholesaleFormSchema>;
export type ContactFormData = z.infer<typeof contactFormSchema>;
export type ProductInquiryFormData = z.infer<typeof productInquiryFormSchema>;