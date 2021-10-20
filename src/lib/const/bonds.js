import BondOhmDaiContract from '$lib/abi/bonds/OhmDaiContract.json';
import ReserveOhmDaiContract from '$lib/abi/reserves/OhmDai.json';
import { NetworkID, LPBond } from '$lib/classes/bonds';

export const ohm_dai = new LPBond({
	name: 'ohm_dai_lp',
	displayName: 'OHM-DAI LP',
	bondToken: 'DAI',
	//bondIconSvg: OhmDaiImg,
	bondContractABI: BondOhmDaiContract,
	reserveContract: ReserveOhmDaiContract,
	networkAddrs: {
		[NetworkID.Mainnet]: {
			bondAddress: '0x956c43998316b6a2F21f89a1539f73fB5B78c151',
			reserveAddress: '0x34d7d7Aaf50AD4944B70B320aCB24C95fa2def7c'
		},
		[NetworkID.Testnet]: {
			bondAddress: '0xcF449dA417cC36009a1C6FbA78918c31594B9377',
			reserveAddress: '0x8D5a22Fb6A1840da602E56D1a260E56770e0bCE2'
		}
	},
	lpUrl:
		'https://app.sushi.com/add/0x383518188c0c6d7730d91b2c03a03c837814a899/0x6b175474e89094c44da98b954eedeac495271d0f'
});
