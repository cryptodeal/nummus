import { addresses } from '$lib/const/index';
import { abi as BondCalcContract } from '$lib/abi/BondCalcContract.json';
import { Contract } from '@ethersproject/contracts';

export function getBondCalculator(networkID, provider) {
	return new Contract(addresses[networkID].BONDINGCALC_ADDRESS, BondCalcContract, provider);
}
