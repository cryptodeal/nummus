<script>
	import Logo from '$lib/nav/Logo.svelte';
	export let open = false;
</script>

<aside
	class="absolute flex-col w-full h-full text-red-800 sm:w-260px dark:(text-green-400)"
	class:open
>
	<div class="flex mt-12 justify-center">
		<Logo />
	</div>
	<nav class="mt-12 text-xl px-8">
		<!--
      <a class="block" href="/">Home</a>
		<a class="block" href="/about">About</a>
    <a class="block" href="/markets">Markets</a>
    <a class="block" href="/dashboard">Dashboard</a>
    -->
		<ul class="mt-12">
			<li class="flex w-full justify-between text-gray-500 cursor-pointer items-center mb-6">
				<a
					href="javascript:void(0)"
					class="flex items-center focus:outline-none focus:ring-2 focus:ring-white"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-grid"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<rect x="4" y="4" width="6" height="6" rx="1" />
						<rect x="14" y="4" width="6" height="6" rx="1" />
						<rect x="4" y="14" width="6" height="6" rx="1" />
						<rect x="14" y="14" width="6" height="6" rx="1" />
					</svg>
					<span class="text-md ml-2">Dashboard</span>
				</a>
			</li>
		</ul>
	</nav>
	<div class="px-8 border-t border-gray-700 bottom-0">
		<ul class="w-full flex items-center justify-between bg-gray-800">
			<li class="cursor-pointer text-white pt-5 pb-3">
				<button
					aria-label="show notifications"
					class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-bell"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<path
							d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6"
						/>
						<path d="M9 17v1a3 3 0 0 0 6 0v-1" />
					</svg>
				</button>
			</li>
			<li class="cursor-pointer text-white pt-5 pb-3">
				<button
					aria-label="open chats"
					class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-messages"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<path d="M21 14l-3 -3h-7a1 1 0 0 1 -1 -1v-6a1 1 0 0 1 1 -1h9a1 1 0 0 1 1 1v10" />
						<path d="M14 15v2a1 1 0 0 1 -1 1h-7l-3 3v-10a1 1 0 0 1 1 -1h2" />
					</svg>
				</button>
			</li>
			<li class="cursor-pointer text-white pt-5 pb-3">
				<button
					aria-label="open settings"
					class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-settings"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<path
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<circle cx="12" cy="12" r="3" />
					</svg>
				</button>
			</li>
			<li class="cursor-pointer text-white pt-5 pb-3">
				<button
					aria-label="open logs"
					class="focus:outline-none focus:ring-2 rounded focus:ring-gray-300"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon icon-tabler icon-tabler-archive"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path stroke="none" d="M0 0h24v24H0z" />
						<rect x="3" y="4" width="18" height="4" rx="2" />
						<path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
						<line x1="10" y1="12" x2="14" y2="12" />
					</svg>
				</button>
			</li>
		</ul>
	</div>
</aside>

<style>
	aside {
		left: -100%;
		transition: left 0.3s ease-in-out;
		z-index: 1;
	}

	.open {
		left: 0;
		z-index: 1;
	}
</style>
