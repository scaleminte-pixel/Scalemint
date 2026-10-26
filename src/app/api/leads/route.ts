import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const leadSchema = z.object({
  name: z.string().min(2, 'Name is required (at least 2 characters)'),
  email: z.string().email('Valid email address is required'),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
  budget: z.string().optional(),
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  landingPage: z.string().optional(),
  referrer: z.string().optional(),
});

const LEAD_RATE_LIMIT = { maxRequests: 5, windowSeconds: 60 * 60 }; // 5 per hour

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`lead:${ip}`, LEAD_RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many submissions. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const validated = leadSchema.parse(body);

    const newLead = await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        whatsapp: validated.whatsapp || null,
        company: validated.company || null,
        serviceInterest: validated.serviceInterest || null,
        message: validated.message,
        budget: validated.budget || null,
        utmSource: validated.utmSource || null,
        utmMedium: validated.utmMedium || null,
        utmCampaign: validated.utmCampaign || null,
        utmTerm: validated.utmTerm || null,
        utmContent: validated.utmContent || null,
        landingPage: validated.landingPage || null,
        referrer: validated.referrer || null,
        status: 'NEW',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you! Your inquiry has been received. Our team will reach out within 24 hours.',
      leadId: newLead.id,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    console.error('Error saving lead:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error while saving your request.' },
      { status: 500 }
    );
  }
}
