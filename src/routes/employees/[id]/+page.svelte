<script lang="ts">
	import { page } from '$app/state';
	import { onMount } from 'svelte';

	interface Employee {
		id: number;
		name: string;
		position: string;
		salary: number;
		intmax: string;
		createdAt: string;
	}

	interface Payment {
		id: number;
		amount: number;
		intmax: string;
		paidAt: string;
	}

	interface EmployeeWithPayments extends Employee {
		payments: Payment[];
	}

	let employee: EmployeeWithPayments | null = null;
	let loading = true;
	let error: string | null = null;

	$: employeeId = page.params.id;

	onMount(async () => {
		try {
			const response = await fetch(`/employees/${employeeId}/payments`);
			if (!response.ok) {
				throw new Error('Failed to fetch employee data');
			}
			employee = await response.json();
		} catch (err) {
			error = err instanceof Error ? err.message : 'An error occurred';
		} finally {
			loading = false;
		}
	});

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	}

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: 'USD'
		}).format(amount);
	}
</script>

<svelte:head>
	<title>Payment History - {employee?.name || 'Employee'}</title>
</svelte:head>

<div class="container mx-auto p-6">
	{#if loading}
		<div class="flex h-64 items-center justify-center">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{:else if error}
		<div class="alert alert-error shadow-lg">
			<div>
				<span>🚫 {error}</span>
			</div>
			<div>
				<a href="/employees" class="btn btn-sm btn-neutral">← Back to Employees</a>
			</div>
		</div>
	{:else if employee}
		<!-- Back Link -->
		<a href="/employees" class="btn btn-sm btn-outline mb-4"> ← Back to Employees </a>

		<!-- Employee Info -->
		<div class="card bg-base-100 mb-6 shadow-md">
			<div class="card-body">
				<h2 class="card-title text-2xl">👤 {employee.name}</h2>
				<div class="mt-2 grid grid-cols-1 gap-4 md:grid-cols-4">
					<div>
						<p class="text-sm text-gray-500">Position</p>
						<p class="font-semibold">{employee.position}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Salary</p>
						<p class="font-semibold text-green-600">{formatCurrency(employee.salary)}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Intmax Address</p>
						<p class="font-mono text-sm">{employee.intmax || 'Not set'}</p>
					</div>
					<div>
						<p class="text-sm text-gray-500">Since</p>
						<p>{formatDate(employee.createdAt)}</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Payment Summary -->
		<div class="stats mb-4 shadow">
			<div class="stat">
				<div class="stat-title">Total Payments</div>
				<div class="stat-value text-primary">{employee.payments.length}</div>
			</div>
			<div class="stat">
				<div class="stat-title">Total Amount</div>
				<div class="stat-value text-green-500">
					{formatCurrency(employee.payments.reduce((s, p) => s + p.amount, 0))}
				</div>
			</div>
		</div>

		<!-- Payment Table -->
		<div class="card bg-base-100 shadow-md">
			<div class="card-body">
				<h2 class="card-title mb-2 text-xl">💳 Payment History</h2>

				{#if employee.payments.length === 0}
					<div class="py-8 text-center text-gray-500">
						<p class="text-lg">No payments yet</p>
						<p>This employee hasn't received any payments.</p>
					</div>
				{:else}
					<div class="overflow-x-auto">
						<table class="table-zebra table w-full">
							<thead>
								<tr>
									<th>#</th>
									<th>Amount</th>
									<th>Intmax Address</th>
									<th>Date</th>
								</tr>
							</thead>
							<tbody>
								{#each employee.payments as payment}
									<tr>
										<td>#{payment.id}</td>
										<td class="font-medium text-green-600">{formatCurrency(payment.amount)}</td>
										<td class="font-mono text-sm">{payment.intmax || '-'}</td>
										<td>{formatDate(payment.paidAt)}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		</div>
	{/if}
</div>
