import { ethStore, web3, connected, makeContractStore, chainData } from '$lib/stores/api/wallet';
import { web3Socket } from './stores/api/ethSocket';
import { EPOCH_INTERVAL, BLOCK_RATE_SECONDS } from '$lib/const/index';
//import { getMarketPrice } from '$lib/helpers/index';
import { addresses } from '$lib/const/index';
import { abi as sOHMv2 } from '$lib/abi/sOhmv2.json';
import { abi as OlympusStakingv2 } from '$lib/abi/OlympusStakingv2.json';
import { formatUnits } from '@ethersproject/units';
import { calcAludelDetes } from '$lib/helpers/OhmLusdCrucible';
import { Contract } from '@ethersproject/contracts';

const formatCurrency = (value, precision = 0) => {
	return new Intl.NumberFormat('en-US', {
		style: 'currency',
		currency: 'USD',
		maximumFractionDigits: precision,
		minimumFractionDigits: precision
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

const initStakingContract = () => {
	let networkId;
	let isConnected;
	let socketProvider;
	connected.subscribe((value) => {
		isConnected = value;
	});
	if (!isConnected) {
		web3Socket.subscribe((provider) => {
			socketProvider = provider;
		});
		return new Contract(addresses[1].STAKING_ADDRESS, OlympusStakingv2, socketProvider);
	} else {
		chainData.subscribe((data) => {
			networkId = data['networkId'];
		});
		return makeContractStore(OlympusStakingv2, addresses[networkId].STAKING_ADDRESS);
	}
};

const initSohmMainContract = () => {
	let networkId;
	let isConnected;
	let socketProvider;
	connected.subscribe((value) => {
		isConnected = value;
	});
	if (!isConnected) {
		web3Socket.subscribe((provider) => {
			socketProvider = provider;
		});
		return new Contract(addresses[1].SOHM_ADDRESS, sOHMv2, socketProvider);
	} else {
		chainData.subscribe((data) => {
			networkId = data['networkId'];
		});
		return makeContractStore(sOHMv2, addresses[networkId].SOHM_ADDRESS);
	}
};

const getContractData = async (stakingContract, sOhmMainContract) => {
	// Calculating staking
	if (stakingContract.subscribe && sOhmMainContract.subscribe) {
		let stakeContract, sOhmContract;
		stakingContract.subscribe((value) => {
			stakeContract = value;
		});
		sOhmMainContract.subscribe((value) => {
			sOhmContract = value;
		});
		stakingContract = stakeContract;
		sOhmMainContract = sOhmContract;
	}
	const epoch = await stakingContract.epoch();
	const stakingReward = epoch.distribute;
	//console.log(stakingReward)
	const circ = await sOhmMainContract.circulatingSupply();
	const stakingRebase = stakingReward / circ;
	const fiveDayRate = Math.pow(1 + stakingRebase, 5 * 3) - 1;
	const stakingAPY = Math.pow(1 + stakingRebase, 365 * 3) - 1;

	// Current index
	const currentIndex = await stakingContract.index();
	//console.log(currentIndex)

	return {
		currentIndex: formatUnits(`${currentIndex}`, 'gwei'),
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

const getOhmLusdCrucibleData = async () => {
	let networkId;
	let provider;
	let isConnected;
	connected.subscribe((value) => {
		isConnected = value;
	});
	if (isConnected) {
		chainData.subscribe((data) => {
			networkId = data['networkId'];
		});
		web3.subscribe((value) => {
			provider = value;
		});
	} else {
		networkId = 1;
		web3Socket.subscribe((socketProvider) => {
			provider = socketProvider;
		});
	}
	//console.log(`networkId: ${networkId}`)
	const crucibleDetes = await calcAludelDetes(networkId, provider);
	let avgApy = crucibleDetes.averageApy;
	if (isNaN(avgApy)) avgApy = 0;
	return {
		apy: avgApy,
		tvl: crucibleDetes.tvlUsd
		// NOTE (appleseed): balance is in accountSlice for the bond
		// balance: ethers.utils.formatUnits(sushiOhmLusdBalance, "gwei"),
	};
};

export {
	formatCurrency,
	prettifySeconds,
	calcRebaseTime,
	initWeb3,
	closeWeb3,
	initStakingContract,
	initSohmMainContract,
	getContractData,
	getOhmLusdCrucibleData
};
