import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const bookingSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  company: z.string().optional(),
  serviceInterest: z.string().optional(),
  requestedDate: z.string().min(5, 'Preferred date/time is required'),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validated = bookingSchema.parse(body);

    const booking = await prisma.booking.create({
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
    await prisma.lead.create({
      data: {
        name: validated.name,
        email: validated.email,
        phone: validated.phone || null,
        company: validated.company || null,
        serviceInterest: validated.serviceInterest || 'Discovery Strategy Meeting',
        message: `Booked a Strategy Call for: ${validated.requestedDate}. Notes: ${validated.notes || 'None'}`,
        status: 'NEW',
        budget: '$5,000+',
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Your meeting request has been scheduled! A calendar invite will be sent to your email.',
      bookingId: booking.id,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.errors }, { status: 400 });
    }
    console.error('Booking error:', error);
    return NextResponse.json({ success: false, error: 'Failed to schedule meeting' }, { status: 500 });
  }
}
