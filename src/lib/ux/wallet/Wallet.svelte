<script>
	import { ethStore, connected, chainId } from '$lib/stores/api/wallet';
	import { browser } from '$app/env';
	import Blockie from '$lib/ux/Blockie.svelte';
	import Address from '$lib/ux/Address.svelte';
	let WalletConnectProvider;
	const infuraId = import.meta.env.VITE_INFURA_ID;
	$: if (browser) WalletConnectProvider = window.WalletConnectProvider.default;

	const walletConnectConfig = {
		bridge: 'https://bridge.walletconnect.org',
		qrcode: true,
		infuraId,
		chainId: $chainId
	};

	$: initWalletConnect = async () => {
		if (browser && WalletConnectProvider) {
			const provider = new WalletConnectProvider(walletConnectConfig);
			await provider.enable();
			ethStore.setProvider(provider);
		}
	};
</script>

{#if $connected}
	<div class="flex">
		<p>You're signed in as</p>
		<Blockie address={$ethStore.accounts[0]} />
		<Address address={$ethStore.accounts[0]} format="middle-truncated" />
	</div>
	<button
		class="rounded-lg hover:bg-warm-gray-400 hover:dark:bg-blue-gray-900"
		on:click={ethStore.close}
	>
		<h4 class="m-2 cardContent">Disconnect Wallet</h4>
	</button>
{:else}
	<div class="flex flex-col m-2 p-4 justify-center bg-white dark:bg-blue-gray-800">
		<button
			class="rounded-lg hover:bg-warm-gray-400 hover:dark:bg-blue-gray-900"
			on:click={ethStore.setBrowserProvider}
		>
			<img class="h-20 m-2 w-20 mx-auto" src="/metamask.svg" alt="MetaMask Logo" />
			<h4 class="m-2 cardContent">MetaMask</h4>
		</button>
		<button
			class="rounded-lg hover:bg-warm-gray-400 hover:dark:bg-blue-gray-900"
			on:click={initWalletConnect}
		>
			<img class="h-20 m-2 w-20 mx-auto" src="/walletconnect-circle.svg" alt="WalletConnect Logo" />
			<h4 class="m-2 cardContent">WalletConnect</h4>
		</button>
	</div>
{/if}
