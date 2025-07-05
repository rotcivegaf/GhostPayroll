import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/db.js';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	try {
		const employeeId = parseInt(params.id);

		if (isNaN(employeeId)) {
			return json({ error: 'Invalid employee ID' }, { status: 400 });
		}

		const employee = await prisma.employee.findUnique({
			where: { id: employeeId },
			include: {
				payments: {
					orderBy: {
						paidAt: 'desc'
					}
				}
			}
		});

		if (!employee) {
			return json({ error: 'Employee not found' }, { status: 404 });
		}

		return json(employee);
	} catch (error) {
		console.error('Error fetching employee payments:', error);
		return json({ error: 'Internal server error' }, { status: 500 });
	}
};
