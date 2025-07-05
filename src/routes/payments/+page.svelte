<script lang="ts">
	import { onMount } from 'svelte';

	type Payment = {
		id: number;
		amount: number;
		intmax?: string;
		paidAt: string;
		employee: { name: string };
	};

	let grouped: Record<string, Payment[]> = {};
	let selectedDate: string | null = null;

	onMount(async () => {
		const res = await fetch('/payments');
		grouped = await res.json();
	});

	function getTotal(payments: Payment[]) {
		return payments.reduce((sum, p) => sum + p.amount, 0);
	}
</script>

<div class="container mx-auto p-6">
	<a href="/" class="btn btn-sm btn-outline mb-4">← Back to Home</a>

	<h1 class="mb-6 text-3xl font-bold">📄 Payments history</h1>

	<div class="space-y-4">
		{#if Object.entries(grouped).length == 0}
			<div class="alert alert-info">
				<span>No payments registered</span>
			</div>
		{/if}
		{#each Object.entries(grouped) as [date, payments]}
			<div class="card bg-base-100 p-4 shadow-md">
				<div class="flex items-center justify-between">
					<div>
						<h2 class="text-xl font-semibold">{date}</h2>
						<p>{payments.length} empleados — ${getTotal(payments).toFixed(2)}</p>
					</div>
					<button
						class="btn btn-sm btn-outline"
						on:click={() => (selectedDate = selectedDate === date ? null : date)}
					>
						{selectedDate === date ? 'Hide' : 'Show details'}
					</button>
				</div>

				{#if selectedDate === date}
					<div class="mt-4 overflow-x-auto">
						<table class="table-zebra table w-full">
							<thead>
								<tr><th>Employee</th><th>Amount</th><th>Intmax Address</th><th>Time</th></tr>
							</thead>
							<tbody>
								{#each payments as p}
									<tr>
										<td>{p.employee.name}</td>
										<td>${p.amount}</td>
										<td class="font-mono text-sm">{p.intmax || '-'}</td>
										<td>{new Date(p.paidAt).toLocaleTimeString()}</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{/if}
			</div>
		{/each}
	</div>
</div>
