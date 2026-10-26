import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  requestedDate: z.string().min(5, 'Preferred date/time is required').refine(
    (val) => !isNaN(new Date(val).getTime()),
    { message: 'Invalid date format. Please provide a valid date.' }
  ),
  notes: z.string().optional(),
});

const BOOKING_RATE_LIMIT = { maxRequests: 3, windowSeconds: 60 * 60 }; // 3 per hour

export async function POST(request: Request) {
  try {
    // Rate limit check
    const ip = getClientIp(request);
    const { allowed, retryAfterSeconds } = checkRateLimit(`booking:${ip}`, BOOKING_RATE_LIMIT);
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many booking requests. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } }
      );
    }

    const body = await request.json();
    const validated = bookingSchema.parse(body);

    // Use transaction to ensure booking and lead are created atomically
    const result = await prisma.$transaction(async (tx) => {
      const booking = await tx.booking.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company || null,
          serviceInterest: validated.serviceInterest || null,
          requestedDate: new Date(validated.requestedDate),
          notes: validated.notes || null,
          status: 'PENDING',
        },
      });

      // Also register as high-intent lead in Leads table
      await tx.lead.create({
        data: {
          name: validated.name,
          email: validated.email,
          phone: validated.phone || null,
          company: validated.company || null,
          serviceInterest: validated.serviceInterest || 'Discovery Strategy Meeting',
          message: `Booked a Strategy Call for: ${validated.requestedDate}. Notes: ${validated.notes || 'None'}`,
          status: 'NEW',
        },
      });

      return booking;
    });

    return NextResponse.json({
      success: true,
      message: 'Your meeting request has been scheduled! A calendar invite will be sent to your email.',
      bookingId: result.id,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error('Booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to schedule meeting' }, { status: 500 });
  }
}

