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
  
  <div class="min-h-screen flex flex-col items-center justify-center bg-base-200 p-6 text-center">
    <h1 class="text-4xl font-bold mb-10">GhostPayroll 👻</h1>
  
    <div class="grid gap-6 w-full max-w-md">
      {#each options as opt}
        <a href={opt.href} class={`btn text-lg ${opt.color}`}>
          <span class="text-2xl">{opt.icon}</span>
          {opt.label}
        </a>
      {/each}
    </div>
  </div>
  