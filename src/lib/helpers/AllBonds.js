import { StableBond, LPBond, NetworkID } from '$lib/classes/bonds';
//Import SVG Icons
import LusdImg from '$lib/assets/tokens/LUSD.svelte';
import OhmLusdImg from '$lib/assets/tokens/OHM-LUSD.svelte';

//Import Contract ABI as JSON
import { abi as LusdBondContract } from '$lib/abi/bonds/LusdContract.json';
import { abi as BondOhmLusdContract } from '$lib/abi/bonds/OhmLusdContract.json';
import { abi as ReserveOhmLusdContract } from '$lib/abi/reserves/OhmLusd.json';

export const lusd = new StableBond({
	name: 'lusd',
	displayName: 'LUSD',
	bondToken: 'LUSD',
	bondIconSvg: LusdImg,
	bondContractABI: LusdBondContract,
	networkAddrs: {
		[NetworkID.Mainnet]: {
			bondAddress: '0x10C0f93f64e3C8D0a1b0f4B87d6155fd9e89D08D',
			reserveAddress: '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0'
		},
		[NetworkID.Testnet]: {
			bondAddress: '0x3aD02C4E4D1234590E87A1f9a73B8E0fd8CF8CCa',
			reserveAddress: '0x45754dF05AA6305114004358eCf8D04FF3B84e26'
		}
	}
});

export const ohm_lusd = new LPBond({
	name: 'ohm_lusd_lp',
	displayName: 'OHM-LUSD LP',
	bondToken: 'LUSD',
	bondIconSvg: OhmLusdImg,
	bondContractABI: BondOhmLusdContract,
	reserveContract: ReserveOhmLusdContract,
	networkAddrs: {
		[NetworkID.Mainnet]: {
			bondAddress: '0xFB1776299E7804DD8016303Df9c07a65c80F67b6',
			reserveAddress: '0xfDf12D1F85b5082877A6E070524f50F6c84FAa6b'
		},
		[NetworkID.Testnet]: {
			// NOTE (appleseed-lusd): using ohm-dai rinkeby contracts
			bondAddress: '0xcF449dA417cC36009a1C6FbA78918c31594B9377',
			reserveAddress: '0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2'
		}
	},
	lpUrl:
		'https://app.sushi.com/add/0x383518188C0C6d7730D91b2c03a03C837814a899/0x5f98805A4E8be255a32880FDeC7F6728C6568bA0'
});
