<script>
	const options = [
		{
			label: 'Manage Employees',
			icon: '👥',
			href: '/employees',
			color: 'btn-primary'
		},
		{
			label: 'Send payments',
			icon: '💸',
			href: '/send',
			color: 'btn-success'
		},
		{
			label: 'Payments history',
			icon: '🧾',
			href: '/payments',
			color: 'btn-info'
		}
	];
</script>

<div class="bg-base-200 flex min-h-screen flex-col items-center justify-center p-6 text-center">
	<h1 class="mb-10 text-4xl font-bold">GhostPayroll 👻</h1>

	<div class="grid w-full max-w-md gap-6">
		{#each options as opt}
			<a href={opt.href} class={`btn text-lg ${opt.color}`}>
				<span class="text-2xl">{opt.icon}</span>
				{opt.label}
			</a>
		{/each}
	</div>
</div>
