import { readable } from 'svelte/store';

export const ohmGraph = readable(0, (set) => {
	queryGraph()
		.then(set)
		.catch((err) => console.error(`Failed to fetch`, err));

	//query graph api every minute
	const id = setInterval(() => {
		queryGraph()
			.then(set)
			.catch((err) => console.error(`Failed to fetch`, err));
	}, 60000);

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
			query: `{
        _meta {
          block {
            number
          }
        }
        protocolMetrics(first: 1, orderBy: timestamp, orderDirection: desc) {
          timestamp
          ohmCirculatingSupply
          sOhmCirculatingSupply
          totalSupply
          ohmPrice
          marketCap
          totalValueLocked
          nextEpochRebase
          nextDistributedOhm
        }
      }`
		})
	});

	if (!res.ok) {
		throw new Error(`Bad response`);
	}
	const graphData = await res.json();
	if (graphData.errors) {
		throw new Error(`Graph query error: ${graphData.errors[0].message}`);
	}
	return {
		stakingTVL: parseFloat(graphData.data.protocolMetrics[0].totalValueLocked),
		marketCap: parseFloat(graphData.data.protocolMetrics[0].marketCap),
		circSupply: parseFloat(graphData.data.protocolMetrics[0].ohmCirculatingSupply),
		totalSupply: parseFloat(graphData.data.protocolMetrics[0].totalSupply),
		currentBlock: parseInt(graphData.data._meta.block.number)
	};
};
