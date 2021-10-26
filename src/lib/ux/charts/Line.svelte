<script>
	import * as Pancake from '@sveltejs/pancake';
	import * as yootils from 'yootils';
	export let data;
	export let label;
	export let format = 'currency';
	let closest;
	let x1 = Infinity;
	let x2 = -Infinity;
	let y1 = Infinity;
	let y2 = -Infinity;
	data.forEach((d) => {
		if (d.x < x1) x1 = d.x;
		if (d.x > x2) x2 = d.x;
		if (d.y < y1) y1 = d.y;
		if (d.y > y2) y2 = d.y;
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

	const format_Date = (x) => {
		const d = new Date(x);
		const month = months[d.getMonth()];
		return `${month} ${d.getDate()}, ${d.getFullYear()}`;
	};

	const format_y = (y) => {
		if (format === 'percent') {
			return `${y}%`;
		}
		let millions = y / 1000000;
		return `$${yootils.commas(millions)}M`;
	};

	//$: console.log(data)
</script>

<div class="chart">
	<Pancake.Chart {x1} {x2} {y1} {y2}>
		<Pancake.Grid horizontal count={3} let:value let:first>
			<div class="grid-line horizontal">
				<span class:first>{format_y(value)}</span>
			</div>
		</Pancake.Grid>

		<Pancake.Grid vertical count={3} let:value>
			<span class="x-label">{format_x(value)}</span>
		</Pancake.Grid>

		<Pancake.Svg>
			<Pancake.SvgLine {data} let:d>
				{#if d}
					<path class="data stroke-gray-800 dark:stroke-light-100" {d} />
				{/if}
			</Pancake.SvgLine>
		</Pancake.Svg>

		{#if closest}
			<Pancake.Point x={closest.x} y={closest.y}>
				<span class="annotation-point" />
				<div
					class="annotation navButton"
					style="transform: translate(-{100 * ((closest.x - x1) / (x2 - x1))}%,0)"
				>
					<strong>{format_Date(closest.x)}</strong>
					<span>{label}: {closest.y}</span>
				</div>
			</Pancake.Point>
		{/if}

		<Pancake.Quadtree {data} bind:closest />
	</Pancake.Chart>
</div>

<style>
	.chart {
		height: 270px;
		padding: 0 1.75em 3em 4em;
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
		stroke-linejoin: round;
		stroke-linecap: round;
		stroke-width: 1px;
		fill: none;
	}

	.annotation {
		position: absolute;
		white-space: nowrap;
		bottom: 1em;
		line-height: 1.2;
		padding: 0.2em 0.4em;
		border-radius: 2px;
	}

	.annotation-point {
		position: absolute;
		width: 10px;
		height: 10px;
		background-color: #ff3e00;
		border-radius: 50%;
		transform: translate(-50%, -50%);
	}

	.annotation strong {
		display: block;
		font-size: 20px;
	}

	.annotation span {
		display: block;
		font-size: 14px;
	}
</style>
