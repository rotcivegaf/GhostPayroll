import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  const payments = await prisma.payment.findMany({
    include: { employee: true },
    orderBy: { paidAt: 'desc' }
  });

  // Agrupar por día
  const grouped: Record<string, typeof payments> = {};
  for (const p of payments) {
    const dateKey = new Date(p.paidAt).toISOString().split('T')[0]; // "YYYY-MM-DD"
    grouped[dateKey] ??= [];
    grouped[dateKey].push(p);
  }

  return json(grouped);
}

interface PaymentData {
  employeeId: number;
  amount: number;
  intmax: string;
}

export async function POST({ request }) {
  const { payments } = await request.json();
  
  try {
    const savedPayments = await Promise.all(
      payments.map((payment: PaymentData) =>
        prisma.payment.create({
          data: {
            employeeId: payment.employeeId,
            amount: payment.amount,
            intmax: payment.intmax
          }
        })
      )
    );
    
    return json({ success: true, payments: savedPayments });
  } catch (error) {
    console.error('Error saving payments:', error);
    return json({ success: false, error: 'Failed to save payments' }, { status: 500 });
  }
}
