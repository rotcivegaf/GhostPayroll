<script lang="ts">
	import { onMount } from 'svelte';

	interface Employee {
		id: number;
		name: string;
		position: string;
		salary: number;
		intmax?: string;
		createdAt: string;
	}

	let employees: Employee[] = [];
	let name = '',
		position = '',
		salary = '',
		intmax = '';
	let editId: number | null = null;

	async function fetchEmployees() {
		employees = await (await fetch('/employees')).json();
	}

	async function saveEmployee() {
		const method = editId ? 'PUT' : 'POST';
		const url = editId ? `/employees/${editId}` : '/employees';

		await fetch(url, {
			method,
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ name, position, salary, intmax })
		});

		name = position = salary = intmax = '';
		editId = null;
		await fetchEmployees();
	}

	async function editEmployee(emp: Employee) {
		name = emp.name;
		position = emp.position;
		salary = emp.salary.toString();
		intmax = emp.intmax || '';
		editId = emp.id;
	}

	async function deleteEmployee(id: number) {
		await fetch(`/employees/${id}`, { method: 'DELETE' });
		await fetchEmployees();
	}

	onMount(fetchEmployees);
</script>

<div class="container mx-auto p-6">
	<a href="/" class="btn btn-sm btn-outline mb-4">← Back to Home</a>
	<h1 class="mb-6 text-3xl font-bold">👥 Employee Management</h1>

	<div class="card bg-base-100 mb-6 p-6 shadow-md">
		<h2 class="mb-4 text-xl font-semibold">{editId ? 'Edit' : 'Add'} Employee</h2>

		<div class="form-control mb-2">
			<input class="input input-bordered" bind:value={name} placeholder="Name" />
		</div>
		<div class="form-control mb-2">
			<input class="input input-bordered" bind:value={position} placeholder="Position" />
		</div>
		<div class="form-control mb-2">
			<input class="input input-bordered" bind:value={salary} placeholder="Salary" type="number" />
		</div>
		<div class="form-control mb-2">
			<input
				class="input input-bordered"
				bind:value={intmax}
				placeholder="Intmax Address (optional)"
			/>
		</div>
		<div class="flex gap-2">
			<button class="btn btn-primary" on:click={saveEmployee}>
				{editId ? 'Update' : 'Add'}
			</button>
			{#if editId}
				<button
					class="btn btn-outline"
					on:click={() => {
						editId = null;
						name = position = salary = intmax = '';
					}}
				>
					Cancel
				</button>
			{/if}
		</div>
	</div>

	<div class="overflow-x-auto">
		<table class="table-zebra table w-full">
			<thead>
				<tr><th>Name</th><th>Position</th><th>Salary</th><th>Intmax Address</th><th>Actions</th></tr
				>
			</thead>
			<tbody>
				{#each employees as emp}
					<tr>
						<td>{emp.name}</td>
						<td>{emp.position}</td>
						<td>${emp.salary}</td>
						<td class="font-mono text-sm">{emp.intmax || '-'}</td>
						<td class="flex gap-2">
							<a href="/employees/{emp.id}" class="btn btn-xs btn-success">View Payments</a>
							<button class="btn btn-xs btn-info" on:click={() => editEmployee(emp)}>Edit</button>
							<button class="btn btn-xs btn-error" on:click={() => deleteEmployee(emp.id)}
								>Delete</button
							>
						</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
