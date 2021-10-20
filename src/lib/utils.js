import { getCurrency } from 'locale-currency';
import { ethStore, web3, connected, makeContractStore, chainId } from 'svelte-web3';
import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS } from '$lib/const/index';
import { getMarketPrice } from '$lib/helpers/index';
import { addresses } from '$lib/const/index';
import { abi as sOHMv2 } from '$lib/abi/sOhmv2.json';
import { abi as OlympusStakingv2 } from '$lib/abi/OlympusStakingv2.json';

const formatCurrency = (value, locale, numDec) => {
	return new Intl.NumberFormat(locale, {
		style: 'currency',
		currency: getCurrency(locale),
		minimumFractionDigits: 0,
		maximumFractionDigits: numDec ? numDec : 0
	}).format(value);
};

const getRebaseBlock = (currentBlock) => {
	return currentBlock + EPOCH_INTERVAL - (currentBlock % EPOCH_INTERVAL);
};

const secondsToBlock = (startBlock, endBlock) => {
	const blocksAway = endBlock - startBlock;
	const secondsAway = blocksAway * BLOCK_RATE_SECONDS;

	return secondsAway;
};

const calcRebaseTime = (currentBlock) => {
	const rebaseBlock = getRebaseBlock(currentBlock);
	const secondsAway = secondsToBlock(currentBlock, rebaseBlock);
	return secondsAway;
};

const prettifySeconds = (seconds, resolution) => {
	if (seconds !== 0 && !seconds) {
		return '';
	}

	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);

	if (resolution === 'day') {
		return d + (d == 1 ? ' day' : ' days');
	}

	const dDisplay = d > 0 ? d + (d == 1 ? ' day, ' : ' days, ') : '';
	const hDisplay = h > 0 ? h + (h == 1 ? ' hr, ' : ' hrs, ') : '';
	const mDisplay = m > 0 ? m + (m == 1 ? ' min' : ' mins') : '';

	let result = dDisplay + hDisplay + mDisplay;
	if (mDisplay === '') {
		result = result.slice(0, result.length - 2);
	}

	return result;
};

const initWeb3 = () => {
	ethStore.setBrowserProvider();
};

const closeWeb3 = () => {
	ethStore.close();
};

const initStakingContract = (chainId) => {
	return makeContractStore(OlympusStakingv2, addresses[chainId].STAKING_ADDRESS);
};

const initSohmMainContract = (chainId) => {
	return makeContractStore(sOHMv2, addresses[chainId].SOHM_ADDRESS);
};

const calcContractData = async (stakingContract, sOhmMainContract) => {
	// Calculating staking
	const epoch = await stakingContract.methods.epoch().call();
	const stakingReward = epoch.distribute;
	const circ = await sOhmMainContract.methods.circulatingSupply().call();
	const stakingRebase = stakingReward / circ;
	const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
	const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

	// Current index
	const currentIndex = await stakingContract.methods.index().call();
	//console.log(currentIndex)

	return {
		currentIndex,
		fiveDayRate,
		stakingAPY,
		//stakingTVL,
		stakingRebase
		//marketCap,
		//marketPrice,
		//circSupply,
		//totalSupply,
	};
};

const getContractData = (stakingContract, sOhmMainContract, web3) => {
	return calcContractData(stakingContract, sOhmMainContract)
		.then(({ currentIndex, fiveDayRate, stakingAPY, stakingRebase }) => {
			return {
				currentIndex: web3.utils.fromWei(`${currentIndex}`, 'gwei'),
				fiveDayRate,
				stakingAPY,
				stakingRebase
			};
		})
		.then((data) => {
			return data;
		});
};

export {
	formatCurrency,
	prettifySeconds,
	calcRebaseTime,
	initWeb3,
	closeWeb3,
	calcContractData,
	initStakingContract,
	initSohmMainContract,
	getContractData
};
