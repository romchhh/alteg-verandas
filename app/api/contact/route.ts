import { NextRequest, NextResponse } from 'next/server';
import { contactFormSchema } from '@/lib/utils/validators';
import { createLead, Bitrix24Lead } from '@/lib/services/bitrix24';
import { sendTelegramMessage } from '@/lib/services/telegram';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the request body
    const validationResult = contactFormSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const data = validationResult.data;
    const formType = (body as { formType?: string }).formType === 'request_individual_quote' ? 'Request individual quote' : 'Get a Quote';
    const isB2B = formType === 'Request individual quote';
    const leadTitle = isB2B ? `Lead web B2B — ${data.name} — ${data.phone}` : `Lead web B2C — ${data.name} — ${data.phone}`;
    const details = data.projectDetails?.trim() || '';

    // Create lead in Bitrix24
    const leadData: Bitrix24Lead = {
      TITLE: leadTitle,
      NAME: data.name,
      EMAIL: data.email ? [{ VALUE: data.email, VALUE_TYPE: 'WORK' }] : [],
      PHONE: [{ VALUE: data.phone, VALUE_TYPE: 'WORK' }],
      COMMENTS: [
        `Form: ${formType}`,
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : '',
        data.interestedIn ? `I'm interested in: ${data.interestedIn}` : '',
        details ? `Project details:\n${details}` : '',
      ].filter(Boolean).join('\n'),
      SOURCE_ID: 'WEB',
      SOURCE_DESCRIPTION: isB2B ? 'Lead web B2B' : 'Lead web B2C',
    };

    try {
      const result = await createLead(leadData);
      
      if (result.error) {
        return NextResponse.json(
          { error: result.error_description || result.error || 'Failed to submit contact form' },
          { status: 500 }
        );
      }

      const lines = [
        '<b>📩 Get a Quote</b>',
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : '',
        data.interestedIn ? `Interest: ${data.interestedIn}` : '',
        data.projectDetails?.trim() ? `Details: ${data.projectDetails.trim()}` : '',
      ].filter(Boolean);
      sendTelegramMessage(lines.join('\n')).catch(() => {});

      return NextResponse.json(
        { 
          success: true, 
          leadId: result.result?.toString(),
          message: "Thank you! We'll contact you shortly." 
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Bitrix24 error:', error);
      const lines = [
        '<b>📩 Get a Quote</b>',
        `Name: ${data.name}`,
        `Phone: ${data.phone}`,
        data.email ? `Email: ${data.email}` : '',
        data.interestedIn ? `Interest: ${data.interestedIn}` : '',
        data.projectDetails?.trim() ? `Details: ${data.projectDetails.trim()}` : '',
      ].filter(Boolean);
      sendTelegramMessage(lines.join('\n')).catch(() => {});
      return NextResponse.json(
        { 
          success: true, 
          message: "Thank you! We'll contact you shortly." 
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
