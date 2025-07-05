import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function PUT({ request, params }) {
	const data = await request.json();
	const employee = await prisma.employee.update({
		where: { id: parseInt(params.id) },
		data: {
			name: data.name,
			position: data.position,
			salary: parseFloat(data.salary),
			intmax: data.intmax || null
		}
	});
	return json(employee);
}

export async function DELETE({ params }) {
	await prisma.employee.delete({
		where: { id: parseInt(params.id) }
	});
	return json({ success: true });
}
