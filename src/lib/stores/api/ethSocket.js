import { readable, writable } from 'svelte/store';
import { browser } from '$app/env';
const alchemyKey = import.meta.env.VITE_ALCHEMY_KEY;
const state = {};

const getGlobalObject = () => {
	if (typeof globalThis !== 'undefined') {
		return globalThis;
	}
	if (typeof self !== 'undefined') {
		return self;
	}
	if (typeof window !== 'undefined') {
		return window;
	}
	if (typeof global !== 'undefined') {
		return global;
	}
	throw new Error('cannot find the global object');
};

let Web3 = {};

const loadWeb3 = () => {
	if (Web3.version) return;
	try {
		Web3 = getGlobalObject().Web3 || {};
	} catch (err) {
		console.error('no globalThis.Web3 object');
	}
};

const getWindowEthereum = () => {
	try {
		if (getGlobalObject().ethereum) return getGlobalObject().ethereum;
	} catch (err) {
		console.error('no globalThis.ethereum object');
	}
};

export const ethData = writable({});

export const web3Socket = readable(state, (set) => {
	if (!browser) return;

	const providerURI = `wss://eth-mainnet.alchemyapi.io/v2/${alchemyKey}`;

	const init = () => {
		loadWeb3();
		if (!Web3.version) throw new Error('Cannot find Web3');
		if (getWindowEthereum()) getWindowEthereum().autoRefreshOnNetworkChange = false;
	};

	init();
	const instance = new Web3(providerURI);
	set(instance);

	return () => {};
});
