import { getCurrency } from 'locale-currency';
const EPOCH_INTERVAL = 2200;
const BLOCK_RATE_SECONDS = 13.14;

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

export { formatCurrency, prettifySeconds, calcRebaseTime };
