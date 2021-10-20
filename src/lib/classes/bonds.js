import { web3 } from 'svelte-web3';
import { getBondCalculator } from '$lib/helpers/BondCalculator';
import { addresses } from '$lib/const/index';

export const NetworkID = {
	Mainnet: 1,
	Testnet: 4
};

export class Bond {
	constructor(type, bondOpts) {
		this.name = bondOpts.name;
		this.displayName = bondOpts.displayName;
		this.type = type;
		this.bondIconSvg = bondOpts.bondIconSvg;
		this.bondContractABI = bondOpts.bondContractABI;
		this.networkAddrs = bondOpts.networkAddrs;
		this.bondToken = bondOpts.bondToken;
	}

	getAddressForBond(networkID) {
		return this.networkAddrs[networkID].bondAddress;
	}
	getContractForBond(networkID, provider) {
		const bondAddress = this.getAddressForBond(networkID);
		return web3.Contract(bondAddress, this.bondContractABI, provider);
	}

	getAddressForReserve(networkID) {
		return this.networkAddrs[networkID].reserveAddress;
	}

	getContractForReserve(networkID, provider) {
		const bondAddress = this.getAddressForReserve(networkID);
		return web3.Contract(bondAddress, this.reserveContract, provider);
	}

	async getBondReservePrice(networkID, provider) {
		const pairContract = this.getContractForReserve(networkID, provider);
		const reserves = await pairContract.getReserves();
		const marketPrice = reserves[1] / reserves[0] / Math.pow(10, 9);

		return marketPrice;
	}
}

export class LPBond extends Bond {
	constructor(lpBondOpts) {
		super('LP', lpBondOpts);

		this.lpUrl = lpBondOpts.lpUrl;
		this.reserveContract = lpBondOpts.reserveContract;
		this.displayUnits = 'LP';
	}
	async getTreasuryBalance(networkID, provider) {
		const token = this.getContractForReserve(networkID, provider);
		const tokenAddress = this.getAddressForReserve(networkID);
		const bondCalculator = getBondCalculator(networkID, provider);
		const tokenAmount = await token.balanceOf(addresses[networkID].TREASURY_ADDRESS);
		const valuation = await bondCalculator.valuation(tokenAddress, tokenAmount);
		const markdown = await bondCalculator.markdown(tokenAddress);
		let tokenUSD = (valuation / Math.pow(10, 9)) * (markdown / Math.pow(10, 18));
		return tokenUSD;
	}
}
