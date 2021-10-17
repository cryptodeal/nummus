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

	const clickToClose = () => {
		if (open) open = !open;
	};
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

<div
	class="backdrop flex sm:hidden"
	aria-hidden="true"
	style="opacity: {open ? 1 : 0}; z-index:{open
		? 10
		: -1}; transition: opacity 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;"
	on:click={clickToClose}
/>
<div class="h-100vh w-100vw">
	<Sidebar bind:open />
	<Navbar bind:sidebar={open} />
	<div class="h-full overflow-auto p-2">
		<slot />
	</div>
</div>

<style>
	.backdrop {
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: 0;
		position: fixed;
		align-items: center;
		backdrop-filter: blur(15px);
		justify-content: center;
		background-color: rgba(255, 255, 255, 0);
		-webkit-tap-highlight-color: transparent;
	}
</style>
