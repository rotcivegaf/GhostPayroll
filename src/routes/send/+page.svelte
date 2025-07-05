<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { parseUnits } from 'ethers';

	let employees:any[] = [];
	let intmaxClient: any = null;
	let loggedIn = false;
	let isSending = false;
	let message = '';
	let tokens:any[] = [];
	let loginLoading = false;



    onMount(async () => {
        if (browser) {
            const { IntMaxClient} = await import('intmax2-client-sdk');
			intmaxClient = await IntMaxClient.init({ environment: 'testnet' });
			tokens = await intmaxClient.getTokensList(); // Get list of the tokens
			console.log(tokens);
			const tokenBalances = await intmaxClient.fetchTokenBalances();
			console.log(tokenBalances);

			const [deposits, receiveTransfers, sendTxs] = await Promise.all([
    intmaxClient.fetchDeposits({}),
    intmaxClient.fetchTransfers({}),
    intmaxClient.fetchTransactions({}),
  ]);
  console.log('\nTransaction History:');
  console.log('Latest deposits:', deposits[0]);
  console.log('Latest received transfers:', receiveTransfers[0]);
  console.log('Latest sent transfers:', sendTxs[0]);
		}
    });

	async function loadEmployees() {
		const res = await fetch('/employees');
		employees = await res.json();
	}

	async function loginIntmax() {
		if (!browser) return;
		loginLoading = true;
		const res = await intmaxClient.login();
		console.log(res);
		tokens = await intmaxClient.getTokensList(); // Get list of the tokens
		console.log(tokens);
		loginLoading = false;
		loggedIn = true;
		await loadEmployees();
		const [deposits, receiveTransfers, sendTxs] = await Promise.all([
    intmaxClient.fetchDeposits({}),
    intmaxClient.fetchTransfers({}),
    intmaxClient.fetchTransactions({}),
  ]);
  console.log('\nTransaction History:');
  console.log('Latest deposits:', deposits[0]);
  console.log('Latest received transfers:', receiveTransfers[0]);
  console.log('Latest sent transfers:', sendTxs[0]);
	}

	async function sendPayments() {
		if (!intmaxClient || !loggedIn) return;

		// @imortant FIXED TO USDC ON SEPOLIA
		const token = tokens.find(r => r.contractAddress.toLowerCase() == '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238'.toLowerCase())

		isSending = true;
		message = 'Sending payments...';

		const transfers = []
		// Simulate or call your logic here
		for (const emp of employees) {
			console.log(`Sending ${emp.salary} to ${emp.name}...`);
			transfers.push({
				amount: parseUnits(emp.salary.toString(), token.decimals).toString(),
				token: token,
				address: emp.intmax
			})
		}

		let errors = 0;
	while (true) {
		try {
			const transferResult = await intmaxClient.broadcastTransaction(transfers);

			// Save the payments in the database
			const paymentData = employees.map(emp => ({
				employeeId: emp.id,
				amount: emp.salary,
				intmax: emp.intmax
			}));

			const saveResponse = await fetch('/payments', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ payments: paymentData })
			});

			if (!saveResponse.ok) {
				throw new Error('Failed to save payments to database');
			}

			message = `✅ ${employees.length} payments sent and saved`;
			isSending = false;
			break;
		} catch (error:any) {
			errors++
			if(errors > 5) {
				message = `❌ Failed to send payments after multiple attempts`;
				isSending = false;
				break;
			}
			alert(error.message);
			if(error.message.includes('Invalid Intmax address')){
				message = `❌ Invalid Intmax address`;
				break;
			}

			console.warn('Withdrawal error:', error);

			const expectedErrorMessage = [
				'Pending tx error',
				'Failed to send tx request',
				'prev_digest mismatch with stored digest',
			];
			if (expectedErrorMessage.some((errorMessage) => error.message.includes(errorMessage))) {
				console.log('Retrying withdrawal in 5 seconds...');
				await new Promise((resolve) => setTimeout(resolve, 5000));
			}
		
    	}
	}
}
</script>

<div class="container mx-auto p-6">
	<a href="/" class="btn btn-sm btn-outline mb-4">
		← Back to Home
	</a>
	<h1 class="text-3xl font-bold mb-6">💸 Send payments</h1>

	{#if !loggedIn}
		<button class="btn btn-primary" disabled={loginLoading} on:click={loginIntmax}>
			{#if loginLoading}
				<div role="status">
					<svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
				Loading... Please wait
			{:else}
				🔐 Login with Intmax
			{/if}
		</button>
	{:else}
		<div>
			<div class="stats shadow mb-6">
				<div class="stat">
					<div class="stat-title">Employees</div>
					<div class="stat-value">{employees.length}</div>
				</div>
				<div class="stat">
					<div class="stat-title">Total to pay</div>
					<div class="stat-value text-green-600">
						${employees.reduce((s, e) => s + e.salary, 0).toFixed(2)}
					</div>
				</div>
			</div>

			<button class="btn btn-success" on:click={sendPayments} disabled={isSending}>
				{#if isSending}
				<div role="status">
					<svg aria-hidden="true" class="inline w-4 h-4 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
						<path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
					</svg>
					<span class="sr-only">Loading...</span>
				</div>
				Sending... this may take about 5 minutes...
				{:else}
				Send payments now
				{/if}
			</button>

			{#if message}
				<div class="alert alert-info shadow-lg mt-4">
					{message}
				</div>
			{/if}

			<!-- Lista -->
			<div class="overflow-x-auto mt-6">
				<table class="table table-zebra w-full">
					<thead>
						<tr><th>Name</th><th>Position</th><th>Salary</th><th>Intmax Address</th></tr>
					</thead>
					<tbody>
						{#each employees as emp}
							<tr>
								<td>{emp.name}</td>
								<td>{emp.position}</td>
								<td>${emp.salary}</td>
								<td class="font-mono text-sm">{emp.intmax || 'Not set'}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
