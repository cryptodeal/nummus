<script>
	//import Toggle from 'svelte-toggle';
	import Logo from './Logo.svelte';
	import Hamburger from './Hamburger.svelte';
	import { browser } from '$app/env';
	import { theme } from '$lib/stores/localStore';
	export let sidebar = false;

	let toggled = null;
	if (browser) toggled = localStorage.getItem('theme') === 'dark' ? true : false;
	const saveTheme = (mode, toggled) => {
		theme.set(mode);
		// eslint-disable-next-line no-unused-vars
		toggled = !!toggled;
	};
	const toggle = () => {
		if ($theme === 'dark') {
			document.documentElement.classList.remove('dark');
			saveTheme('light', toggled);
		} else {
			document.documentElement.classList.add('dark');
			saveTheme('dark', toggled);
		}
	};
</script>

<header class="flex bg-opacity-80 text-gray-800 dark:text-light-100 p-4 items-center">
	<div class="flex justify-start lg:(w-1/3)">
		<Hamburger bind:open={sidebar} />
	</div>
	<div class="hidden lg:(flex justify-center w-1/3)">
		<Logo style="h-10" />
	</div>

	<div class="flex w-full justify-end lg:w-1/3">
		<!--Start WindiCSS dropdown menu-->
		<div class="group">
			<button
				class="flex navButton navSelect text-gray-800 hover:text-light-100 dark:text-light-100 mx-2 rounded-md text-md p-2 inline-flex items-center focus:outline-none"
			>
				<svg
					class="h-5 w-5 fill-current"
					viewBox="0 0 20 20"
					preserveAspectRatio="xMidYMid meet"
					xmlns="http://www.w3.org/2000/svg"
					aria-hidden="true"
				>
					<path
						d="M10.5 18.1953C14.7891 18.1953 18.3359 14.6484 18.3359 10.3594C18.3359 6.0625 14.7891 2.52344 10.4922 2.52344C6.20312 2.52344 2.66406 6.0625 2.66406 10.3594C2.66406 14.6484 6.21094 18.1953 10.5 18.1953ZM10.4531 7.35938C9.96094 7.35938 9.5625 6.96875 9.5625 6.48438C9.5625 5.98438 9.96094 5.59375 10.4531 5.59375C10.9375 5.59375 11.3281 5.98438 11.3281 6.48438C11.3281 6.96875 10.9375 7.35938 10.4531 7.35938ZM9.07031 14.7188C8.80469 14.7188 8.60938 14.5234 8.60938 14.2656C8.60938 14.0234 8.80469 13.8203 9.07031 13.8203H10.2109V9.71094H9.17188C8.91406 9.71094 8.71875 9.51562 8.71875 9.25781C8.71875 9.01562 8.91406 8.8125 9.17188 8.8125H10.7109C11.0234 8.8125 11.1953 9.03906 11.1953 9.36719V13.8203H12.3359C12.5938 13.8203 12.7969 14.0234 12.7969 14.2656C12.7969 14.5234 12.5938 14.7188 12.3359 14.7188H9.07031Z"
					/>
				</svg>
				<span class="ml-2">NUM</span>
			</button>
			<div class="absolute z-10 hidden group-hover:(block)">
				<div class="px-2 mt-3 navButton dropdown pt-2 shadow-lg rounded-xl">
					<div class="flex flex-col py-4 px-2 w-200px max-w-200px">
						<div class="pb-4 block w-full m-0">
							<a href="#null" target="_blank" class="w-full m-0">
								<button
									class="navSelect mb-1 text-gray-800 dark:text-light-100 hover:text-light-100 pl-4 py-2 w-full inline-flex items-center rounded-lg"
								>
									<span>
										<p class="text-left text-md m-0">Buy on Sushiswap</p>
									</span>
									<svg
										viewBox="0 0 20 20"
										height="20px"
										width="20px"
										xmlns="http://www.w3.org/2000/svg"
										class="fill-current pl-1"
										focusable="false"
										aria-hidden="true"
									>
										<path
											d="M4.29688 17.4453H13.8359C15.3594 17.4453 16.1406 16.6641 16.1406 15.1641V5.58594C16.1406 4.07812 15.3594 3.29688 13.8359 3.29688H4.29688C2.77344 3.29688 1.99219 4.07031 1.99219 5.58594V15.1641C1.99219 16.6719 2.77344 17.4453 4.29688 17.4453ZM4.3125 16.4766C3.4375 16.4766 2.96094 16.0156 2.96094 15.1094V5.63281C2.96094 4.73438 3.4375 4.26562 4.3125 4.26562H13.8125C14.6797 4.26562 15.1719 4.73438 15.1719 5.63281V15.1094C15.1719 16.0156 14.6797 16.4766 13.8125 16.4766H4.3125ZM11.6094 12.2422C11.875 12.2422 12.0469 12.0469 12.0469 11.7656V7.86719C12.0469 7.52344 11.8594 7.375 11.5547 7.375H7.64062C7.35156 7.375 7.17188 7.54688 7.17188 7.8125C7.17188 8.07812 7.35938 8.25781 7.64844 8.25781H9.53125L10.6641 8.17969L9.60938 9.17188L6.22656 12.5547C6.14062 12.6406 6.07812 12.7578 6.07812 12.8828C6.07812 13.1562 6.25781 13.3359 6.53125 13.3359C6.67969 13.3359 6.78906 13.2734 6.875 13.1875L10.25 9.82031L11.2344 8.77344L11.1562 10.0547V11.7734C11.1562 12.0625 11.3359 12.2422 11.6094 12.2422Z"
										/>
									</svg>
								</button>
							</a>
							<a href="#null" target="_blank" class="w-full m-0">
								<button
									class="navSelect text-gray-800 hover:text-light-100 dark:text-light-100 mb-1 pl-4 py-2 w-full inline-flex items-center rounded-lg"
								>
									<span>
										<p class="text-left text-md m-0">Buy on Uniswap</p>
									</span>
									<svg
										viewBox="0 0 20 20"
										height="20px"
										width="20px"
										xmlns="http://www.w3.org/2000/svg"
										class="fill-current pl-1"
										focusable="false"
										aria-hidden="true"
									>
										<path
											d="M4.29688 17.4453H13.8359C15.3594 17.4453 16.1406 16.6641 16.1406 15.1641V5.58594C16.1406 4.07812 15.3594 3.29688 13.8359 3.29688H4.29688C2.77344 3.29688 1.99219 4.07031 1.99219 5.58594V15.1641C1.99219 16.6719 2.77344 17.4453 4.29688 17.4453ZM4.3125 16.4766C3.4375 16.4766 2.96094 16.0156 2.96094 15.1094V5.63281C2.96094 4.73438 3.4375 4.26562 4.3125 4.26562H13.8125C14.6797 4.26562 15.1719 4.73438 15.1719 5.63281V15.1094C15.1719 16.0156 14.6797 16.4766 13.8125 16.4766H4.3125ZM11.6094 12.2422C11.875 12.2422 12.0469 12.0469 12.0469 11.7656V7.86719C12.0469 7.52344 11.8594 7.375 11.5547 7.375H7.64062C7.35156 7.375 7.17188 7.54688 7.17188 7.8125C7.17188 8.07812 7.35938 8.25781 7.64844 8.25781H9.53125L10.6641 8.17969L9.60938 9.17188L6.22656 12.5547C6.14062 12.6406 6.07812 12.7578 6.07812 12.8828C6.07812 13.1562 6.25781 13.3359 6.53125 13.3359C6.67969 13.3359 6.78906 13.2734 6.875 13.1875L10.25 9.82031L11.2344 8.77344L11.1562 10.0547V11.7734C11.1562 12.0625 11.3359 12.2422 11.6094 12.2422Z"
										/>
									</svg>
								</button>
							</a>
						</div>
						<hr class="mb-4 bg-gray-800 dark:border-light-100 border-none h-1px overflow-hidden" />
					</div>
				</div>
			</div>
		</div>
		<!--End WindiCSS dropdown menu-->

		<button
			class="navButton navSelect mx-2 rounded-lg hover:text-light-100 focus:outline-none text-md p-2"
		>
			Connect Wallet
		</button>
		<button
			class="navButton navSelect mx-2 hover:text-light-100 rounded-lg p-2 focus:outline-none"
			on:click={toggle}
		>
			{#if toggled !== null}
				{#if $theme === 'light'}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						class="h-5 w-5"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 512 512"
						style=""
					>
						<path
							d="M256 387c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4v-46.2c0-8.5-6.9-15.4-15.4-15.4z"
							fill="currentColor"
						/><path
							d="M256 48c-8.5 0-15.4 6.9-15.4 15.4v46.2c0 8.5 6.9 15.4 15.4 15.4s15.4-6.9 15.4-15.4V63.4c0-8.5-6.9-15.4-15.4-15.4z"
							fill="currentColor"
						/>
						<path
							d="M125 256c0-8.5-6.9-15.4-15.4-15.4H63.4c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4z"
							fill="currentColor"
						/>
						<path
							d="M448.6 240.6h-46.2c-8.5 0-15.4 6.9-15.4 15.4s6.9 15.4 15.4 15.4h46.2c8.5 0 15.4-6.9 15.4-15.4s-6.9-15.4-15.4-15.4z"
							fill="currentColor"
						/>
						<path
							d="M152.5 344.1c-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5l32.7-32.7c6-6 6-15.8 0-21.8-2.9-2.9-6.8-4.5-10.9-4.5z"
							fill="currentColor"
						/>
						<path
							d="M359.5 167.9c4.1 0 8-1.6 10.9-4.5l32.7-32.7c2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5l-32.7 32.7c-2.9 2.9-4.5 6.8-4.5 10.9s1.6 8 4.5 10.9c2.9 2.9 6.8 4.5 10.9 4.5z"
							fill="currentColor"
						/>
						<path
							d="M130.7 108.9c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-2.9 2.9-4.5 6.8-4.5 10.9 0 4.1 1.6 8 4.5 10.9l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7z"
							fill="currentColor"
						/>
						<path
							d="M370.4 348.6c-2.9-2.9-6.8-4.5-10.9-4.5-4.1 0-8 1.6-10.9 4.5-6 6-6 15.8 0 21.8l32.7 32.7c2.9 2.9 6.8 4.5 10.9 4.5 4.1 0 8-1.6 10.9-4.5 2.9-2.9 4.5-6.8 4.5-10.9s-1.6-8-4.5-10.9l-32.7-32.7z"
							fill="currentColor"
						/>
						<path
							d="M256 160c-52.9 0-96 43.1-96 96s43.1 96 96 96 96-43.1 96-96-43.1-96-96-96z"
							fill="currentColor"
						/>
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						class="h-5 w-5"
						preserveAspectRatio="xMidYMid meet"
						viewBox="0 0 24 24"
					>
						<path
							d="M20.742 13.045a8.088 8.088 0 0 1-2.077.271c-2.135 0-4.14-.83-5.646-2.336a8.025 8.025 0 0 1-2.064-7.723A1 1 0 0 0 9.73 2.034a10.014 10.014 0 0 0-4.489 2.582c-3.898 3.898-3.898 10.243 0 14.143a9.937 9.937 0 0 0 7.072 2.93a9.93 9.93 0 0 0 7.07-2.929a10.007 10.007 0 0 0 2.583-4.491a1.001 1.001 0 0 0-1.224-1.224zm-2.772 4.301a7.947 7.947 0 0 1-5.656 2.343a7.953 7.953 0 0 1-5.658-2.344c-3.118-3.119-3.118-8.195 0-11.314a7.923 7.923 0 0 1 2.06-1.483a10.027 10.027 0 0 0 2.89 7.848a9.972 9.972 0 0 0 7.848 2.891a8.036 8.036 0 0 1-1.484 2.059z"
							fill="currentColor"
						/>
					</svg>
				{/if}
			{/if}
		</button>
	</div>
</header>
