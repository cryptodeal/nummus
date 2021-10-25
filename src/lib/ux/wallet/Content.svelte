<script>
	import { getContext } from 'svelte';
	import Address from '$lib/ux/Address.svelte';
	import Blockie from '$lib/ux/Blockie.svelte';
	import { connected, ethStore } from '$lib/stores/api/wallet';
	import Wallet from '$lib/ux/wallet/Wallet.svelte';

	const { open } = getContext('simple-modal');
	const showWalletModal = () => {
		open(Wallet);
	};
</script>

<button
	class="navButton navSelect mx-2 rounded-lg hover:text-light-100 focus:outline-none text-md px-2"
	on:click={showWalletModal}
>
	{#if !$connected}
		Connect Wallet
	{:else}
		<div class="flex items-center content-center overflow-hidden">
			<div class="rounded-full overflow-hidden mr-2">
				<Blockie address={$ethStore.accounts[0]} />
			</div>
			<Address address={$ethStore.accounts[0]} format="middle-truncated" linked={false} />
		</div>
	{/if}
</button>
