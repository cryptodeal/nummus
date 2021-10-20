import { web3 } from 'svelte-web3';
import { addresses } from '$lib/const/index';
import { abi as BondCalcContract } from '$lib/abi/BondCalcContract.json';

export function getBondCalculator(networkID, provider) {
	return new web3.Contract(addresses[networkID].BONDINGCALC_ADDRESS, BondCalcContract, provider);
}
