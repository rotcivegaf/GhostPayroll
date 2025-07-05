import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
  const employees = await prisma.employee.findMany({ orderBy: { id: 'asc' } });
  return json(employees);
}

export async function POST({ request }) {
  const data = await request.json();
  const employee = await prisma.employee.create({
    data: {
      name: data.name,
      position: data.position,
      salary: parseFloat(data.salary),
      intmax: data.intmax || null
    }
  });
  return json(employee);
}
