<script>
	import 'virtual:windi.css';
	import './app.css';
	import { browser } from '$app/env';
	import Navbar from '$lib/nav/Navbar.svelte';
	import Sidebar from '$lib/nav/Sidebar.svelte';
	import { theme } from '$lib/stores/localStore.js';
	if (browser) {
		theme.useLocalStorage();
	}

	let open = false;
</script>

<svelte:head>
	<script>
		(function () {
			if (typeof document === 'undefined') return; // SSR
			if (
				localStorage.theme === 'dark' ||
				(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.classList.add('dark');
				localStorage.setItem('theme', 'dark');
			} else {
				document.documentElement.classList.remove('dark');
			}
		})();
	</script>
</svelte:head>

<div class="w-full h-full">
	<div
		class="backdrop"
		aria-hidden="true"
		style="opacity: {open ? 1 : 0}; z-index:{open
			? 10
			: -1}; ransition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
	/>
	<Sidebar bind:open />
	<Navbar bind:sidebar={open} />
	<slot />
</div>

<style>
	.backdrop {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		display: flex;
		z-index: 0;
		position: fixed;
		align-items: center;
		backdrop-filter: blur(15px);
		justify-content: center;
		background-color: rgba(255, 255, 255, 0);
		-webkit-tap-highlight-color: transparent;
	}
</style>
