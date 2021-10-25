import { writable, derived } from 'svelte/store';
import chains from '$lib/const/chains';
import { Web3Provider } from '@ethersproject/providers';
import { isHexString } from '@ethersproject/bytes';
import { BigNumber } from '@ethersproject/bignumber';
import { Contract } from '@ethersproject/contracts';

const getGlobalObject = () => {
	if (typeof globalThis !== 'undefined') {
		// eslint-disable-next-line no-undef
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

const getWindowEthereum = () => {
	try {
		if (getGlobalObject().ethereum) return getGlobalObject().ethereum;
	} catch (err) {
		console.error('no globalThis.ethereum object');
	}
};

export const createStore = () => {
	// eslint-disable-next-line no-unused-vars
	const { subscribe, update, set } = writable({
		connected: false,
		accounts: []
	});

	const setProvider = async (provider, callback) => {
		const instance = new Web3Provider(provider);
		const signer = instance.getSigner();
		const chainId = await signer.getChainId();
		// no account with ganache
		const accounts = /127/.test(provider) ? [] : await instance.listAccounts();
		if (callback) {
			instance._provider.removeListener('accountsChanged', () => setProvider(provider, true));
			instance._provider.removeListener('chainChanged', () => setProvider(provider, true));
		} else {
			if (instance._provider && instance._provider.on) {
				instance._provider.on('accountsChanged', () => setProvider(provider, true));
				instance._provider.on('chainChanged', () => setProvider(provider, true));
			}
		}
		update(() => ({
			provider,
			signer,
			providerType: 'String',
			connected: true,
			chainId,
			accounts,
			instance
		}));
	};

	const setBrowserProvider = async () => {
		if (!getWindowEthereum())
			throw new Error('Please install authorized browser extension (Metamask or similar)');
		const res = await getWindowEthereum().request({ method: 'eth_requestAccounts' });
		getWindowEthereum().on('accountsChanged', setBrowserProvider);
		getWindowEthereum().on('chainChanged', setBrowserProvider);
		const instance = new Web3Provider(getWindowEthereum());
		const signer = instance.getSigner();
		const chainId = await signer.getChainId();
		//console.log(`chainId: ${chainId}`)
		update(() => ({
			provider: getWindowEthereum(),
			signer,
			providerType: 'Browser',
			connected: true,
			chainId,
			accounts: res,
			instance
		}));
	};

	const close = async (provider) => {
		if (provider && provider.disconnect) {
			await provider.disconnect();
		}
		update(() => ({
			connected: false,
			accounts: []
		}));
	};

	return {
		setBrowserProvider,
		setProvider,
		close,
		subscribe
	};
};

const allStores = {};

const noData = { rpc: [], faucets: [], nativeCurrency: {} };

const getData = (id) => {
	if (!id) return noData;
	if (isHexString(id)) id = BigNumber.from(id);
	//console.log(id);
	for (const data of chains) {
		if (data.chainId === id) return data;
	}
	return noData;
};

export const makeChainStore = (name) => {
	const ethStore = (allStores[name] = createStore());

	allStores[name].connected = derived(ethStore, ($ethStore) => $ethStore.connected);
	allStores[name].chainId = derived(ethStore, ($ethStore) => $ethStore.chainId);
	allStores[name].providerType = derived(ethStore, ($ethStore) => $ethStore.providerType);
	allStores[name].selectedAccount = derived(ethStore, ($ethStore) => {
		if ($ethStore.connected) return $ethStore.accounts.length ? $ethStore.accounts[0] : null;
		return null;
	});

	allStores[name].walletType = derived(ethStore, ($ethStore) => {
		if (!$ethStore.provider) return null;
		if (typeof $ethStore.provider === 'string') return $ethStore.provider;
		if ($ethStore.provider.isMetaMask) return 'MetaMask (or compatible)';
		if ($ethStore.provider.isNiftyWallet) return 'Nifty';
		if ($ethStore.provider.isTrust) return 'Trust';
		return 'Unknown';
	});

	allStores[name].web3 = derived(ethStore, ($ethStore) => {
		//if (!$ethStore.instance) return { utils: Web3.utils, version: Web3.version }
		return $ethStore.instance;
	});

	allStores[name].chainData = derived(ethStore, ($ethStore) =>
		$ethStore.chainId ? getData($ethStore.chainId) : {}
	);

	return allStores[name];
};

export const getChainStore = (name) => {
	if (!allStores[name]) throw new Error(`chain store ${name} does not exist`);
	return allStores[name];
};

export const makeContractStore = (abi, address) =>
	derived([web3, connected], ([$web3, $connected]) => {
		if ($connected && $web3) {
			return new Contract(address, abi, $web3);
		}
		return null;
	});

export const defaultChainStore = makeChainStore('default');
export const connected = allStores.default.connected;
export const chainId = allStores.default.chainId;
export const providerType = allStores.default.providerType;
export const selectedAccount = allStores.default.selectedAccount;
export const walletType = allStores.default.walletType;
export const web3 = allStores.default.web3;
export const chainData = allStores.default.chainData;

export const ethStore = defaultChainStore;
