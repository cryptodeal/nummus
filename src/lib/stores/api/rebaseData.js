import { readable } from 'svelte/store';

export const rebaseData = readable(null, (set) => {
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
        rebases(where: {contract: "0xfd31c7d00ca47653c6ce64af53c1571f9c36566a"}, orderBy: timestamp, first: 1000, orderDirection: desc) {
          percentage
          timestamp
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
	let data = r.data.rebases.map((entry) => {
		return {
			apy: Math.pow(parseFloat(entry.percentage) + 1, 365 * 3) * 100,
			timestamp: entry.timestamp
		};
	});

	data = data.filter((pm) => pm.apy < 300000);

	return data;
};
