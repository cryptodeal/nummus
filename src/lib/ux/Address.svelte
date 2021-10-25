<script lang="ts">
	export let address = '';
	export let format;
	export let linked = true;
	$: formattedAddress =
		format === 'middle-truncated' ? address.slice(0, 6) + '…' + address.slice(-4) : address;
</script>

{#if linked}
	<a
		class="text-gray-800 dark:text-light-100"
		href="https://etherscan.io/address/{address}"
		target="_blank">{formattedAddress}</a
	>
{:else}<span class="text-gray-800 dark:text-light-100">{formattedAddress}</span>{/if}
