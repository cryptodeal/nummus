import { ohm_dai } from '$lib/const/bonds';
import { web3 } from 'svelte-web3';
import PairContract from '$lib/abi/PairContract.json';

export async function getMarketPrice(networkID) {
	const ohm_dai_address = ohm_dai.getAddressForReserve(networkID);
	const pairContract = web3.Contract(ohm_dai_address, PairContract);
	const reserves = await pairContract.getReserves();
	const marketPrice = reserves[1] / reserves[0];

	// commit('set', { marketPrice: marketPrice / Math.pow(10, 9) });
	return marketPrice;
}

export function trim(number, precision) {
	const array = number.toString().split('.');
	if (array.length === 1) return number.toString();
	if (precision === 0) return array[0].toString();

	const poppedNumber = array.pop() || '0';
	array.push(poppedNumber.substring(0, precision));
	const trimmedNumber = array.join('.');
	return trimmedNumber;
}
