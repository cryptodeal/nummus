import { readable, writable } from 'svelte/store';
import { browser } from '$app/env';
import { WebSocketProvider } from '@ethersproject/providers';
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
const state = {};

export const ethData = writable({});

export const web3Socket = readable(state, (set) => {
	if (!browser) return;

	const providerURI = `wss://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`;

	const instance = new WebSocketProvider(providerURI);
	set(instance);

	return () => {};
});
