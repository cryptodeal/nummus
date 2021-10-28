import { readable } from 'svelte/store';

export const treasuryData = readable(null, (set) => {
	queryGraph()
		.then(set)
		.catch((err) => console.error(`Failed to fetch`, err));

	//query graph api every minute
	const id = setInterval(() => {
		queryGraph()
			.then(set)
			.catch((err) => console.error(`Failed to fetch`, err));
	}, 3600000);

	return () => {
		clearInterval(id);
	};
});

const queryGraph = async () => {
	const res = await fetch('https://api.thegraph.com/subgraphs/name/drondin/olympus-graph', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			query: `
      query {
        protocolMetrics(first: 100, orderBy: timestamp, orderDirection: desc) {
          id
          timestamp
          ohmCirculatingSupply
          sOhmCirculatingSupply
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
          treasuryRiskFreeValue
          treasuryMarketValue
          nextEpochRebase
          nextDistributedOhm
          treasuryDaiRiskFreeValue
          treasuryFraxMarketValue
          treasuryDaiMarketValue
          treasuryFraxRiskFreeValue
          treasuryXsushiMarketValue
          treasuryWETHMarketValue
          currentAPY
          runway10k
          runway20k
          runway50k
          runwayCurrent
          holders
          treasuryOhmDaiPOL
          treasuryOhmFraxPOL
        }
      }
      `
		})
	});

	if (!res.ok) {
		throw new Error(`Bad response`);
	}
	const r = await res.json();
	if (r.errors) {
		throw new Error(`Graph query error: ${r.errors[0].message}`);
	}
	let metrics = r.data.protocolMetrics.map((entry) =>
		Object.entries(entry).reduce((obj, [key, value]) => ((obj[key] = parseFloat(value)), obj), {})
	);
	metrics = metrics.filter((pm) => pm.treasuryMarketValue > 0);

	let staked = r.data.protocolMetrics.map((entry) => ({
		staked:
			(parseFloat(entry.sOhmCirculatingSupply) / parseFloat(entry.ohmCirculatingSupply)) * 100,
		timestamp: entry.timestamp
	}));
	staked = staked.filter((pm) => pm.staked < 100);

	let runway = metrics.filter((pm) => pm.runway10k > 5);

	return { metrics, staked, runway };
};
