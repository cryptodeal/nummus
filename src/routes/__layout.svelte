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
	<Sidebar bind:open />
	<Navbar bind:sidebar={open} />
	<slot />
</div>
