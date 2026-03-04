import { NextRequest, NextResponse } from 'next/server';
import { productInquiryFormSchema } from '@/lib/utils/validators';
import { createLead, Bitrix24Lead } from '@/lib/services/bitrix24';
import { sendTelegramMessage } from '@/lib/services/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validationResult = productInquiryFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const productId = (body as { productId?: string }).productId ?? '';
    const productName = (body as { productName?: string }).productName ?? '';

    const leadTitle = `Product inquiry — ${data.name} — ${productName || productId}`;
    const leadData: Bitrix24Lead = {
      TITLE: leadTitle,
      NAME: data.name,
      EMAIL: [{ VALUE: data.email, VALUE_TYPE: 'WORK' }],
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: `Product inquiry\n\nProduct: ${productName || productId} (${productId})\n\nMessage:\n${data.message || '—'}`,
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: 'Product inquiry',
    };

    try {
      await createLead(leadData);
    } catch (_) {}

    const lines = [
      '<b>Product inquiry</b>',
      `Name: ${data.name}`,
      `Email: ${data.email}`,
      `Phone: ${data.phone}`,
      `Product: ${productName || productId}`,
      data.message ? `Message: ${data.message}` : '',
    ].filter(Boolean);
    sendTelegramMessage(lines.join('\n')).catch(() => {});

    return NextResponse.json(
      { success: true, message: 'Thank you! We will contact you shortly.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Product inquiry error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
