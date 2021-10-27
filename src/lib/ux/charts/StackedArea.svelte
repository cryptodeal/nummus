<script>
	import * as Pancake from '@sveltejs/pancake';
	import * as yootils from 'yootils';
	export let data;
	export let colors;
	export let values;
	export let format = 'currency';

	let x1 = Infinity;
	let x2 = -Infinity;
	data.forEach((d) => {
		if (d.date < x1) x1 = d.date;
		if (d.date > x2) x2 = d.date;
	});

	const months = [
		'Jan',
		'Feb',
		'Mar',
		'Apr',
		'May',
		'June',
		'Jul',
		'Aug',
		'Sep',
		'Oct',
		'Nov',
		'Dec'
	];

	const format_x = (x) => {
		const d = new Date(x);
		const month = months[d.getMonth()];
		return `${month} ${d.getDate()}`;
	};

	const format_y = (y) => {
		if (format === 'percent') {
			return `${y}%`;
		}
		let millions = y / 1000000;
		return `$${yootils.commas(millions)}M`;
	};

	const stacks = Pancake.stacks(data, values, 'date');

	const max = stacks.reduce((max, stack) => Math.max(max, ...stack.values.map((v) => v.end)), 0);

	const area = (values) =>
		values
			.map((d) => ({ x: d.i, y: d.end }))
			.concat(values.map((d) => ({ x: d.i, y: d.start })).reverse());
</script>

<div class="chart">
	<Pancake.Chart {x1} {x2} y1={0} y2={max}>
		<Pancake.Grid horizontal count={4} let:value let:first>
			<div class="grid-line horizontal"><span class:first>{format_y(value)}</span></div>
		</Pancake.Grid>

		<Pancake.Grid vertical count={3} let:value>
			<span class="x-label">{format_x(value)}</span>
		</Pancake.Grid>

		<Pancake.Svg>
			{#each stacks as s, i}
				<defs>
					<linearGradient id="myGradient-{values[i]}" x1="0" y1="0" x2="0" y2="1">
						<stop offset="0%" stop-color={colors[i][0]} />
						<stop offset="90%" stop-color={colors[i][1]} />
					</linearGradient>
				</defs>
				<Pancake.SvgPolygon data={area(s.values)} let:d>
					<path class="data" style="fill: url('#myGradient-{values[i]}')" {d} />
				</Pancake.SvgPolygon>
			{/each}
		</Pancake.Svg>
	</Pancake.Chart>
</div>

<style>
	.chart {
		height: 270px;
		padding: 0.5em 1.75em 3em 4em;
		margin: 0 0 36px 0;
		overflow: hidden;
	}

	.grid-line {
		position: relative;
		display: block;
	}

	span.first {
		display: none;
	}

	.grid-line span {
		position: absolute;
		left: -4em;
		bottom: -11px;
		font-family: sans-serif;
		font-size: 14px;
	}

	.x-label {
		position: absolute;
		width: 4em;
		left: -2em;
		bottom: -22px;
		font-family: sans-serif;
		font-size: 14px;
		text-align: center;
	}

	path.data {
		stroke: none;
	}
</style>
