<script>
	import Info from '$lib/assets/Info.svelte';
	import Expand from '$lib/assets/Expand.svelte';
	import * as yootils from 'yootils';
	import { ohmGraph } from '$lib/stores/api/graph';
	import { treasuryData } from '$lib/stores/api/treasuryMetrics';
	import { rebaseData } from '$lib/stores/api/rebaseData';
	import getUserLocale from 'get-user-locale';
	import { browser } from '$app/env';
	import { formatCurrency } from '$lib/utils';
	import StackedArea from '$lib/ux/charts/StackedArea.svelte';
	import Shadow from '$lib/ux/loading/Shadow.svelte';
	import Line from '$lib/ux/charts/Line.svelte';

	let locale;
	if (browser) locale = getUserLocale();
	//$: console.log($ohmGraph)
	$: tvl = $treasuryData
		? $treasuryData.metrics.map((t) => {
				return {
					totalValueLocked: t.totalValueLocked,
					date: new Date(t.timestamp * 1000)
				};
		  })
		: null;

	$: marketValTAssets = $treasuryData
		? $treasuryData.metrics.map((t) => {
				return {
					treasuryDaiMarketValue: t.treasuryDaiMarketValue,
					treasuryFraxMarketValue: t.treasuryFraxMarketValue,
					treasuryWETHMarketValue: t.treasuryWETHMarketValue,
					treasuryXsushiMarketValue: t.treasuryXsushiMarketValue,
					date: new Date(t.timestamp * 1000)
				};
		  })
		: null;

	$: riskFreeVal = $treasuryData
		? $treasuryData.metrics.map((t) => {
				return {
					treasuryDaiRiskFreeValue: t.treasuryDaiRiskFreeValue,
					treasuryFraxRiskFreeValue: t.treasuryFraxRiskFreeValue,
					date: new Date(t.timestamp * 1000)
				};
		  })
		: null;

	$: tOhmDaiPOL = $treasuryData
		? $treasuryData.metrics.map((t) => {
				return {
					treasuryOhmDaiPOL: t.treasuryOhmDaiPOL,
					date: new Date(t.timestamp * 1000)
				};
		  })
		: null;

	$: ohmStaked = $treasuryData
		? $treasuryData.staked.map((t) => {
				return {
					staked: t.staked,
					date: new Date(t.timestamp * 1000)
				};
		  })
		: null;

	$: apyOverTime = $rebaseData
		? $rebaseData.map((t) => {
				return {
					y: Math.log10(t.apy),
					x: t.timestamp * 1000
				};
		  })
		: null;

	$: runWay = $treasuryData
		? $treasuryData.runway.map((t) => {
				return {
					y: t.runwayCurrent,
					x: t.timestamp * 1000
				};
		  })
		: null;

	//$: console.log(marketValTAssets);
	//$: if($treasuryData) console.log($treasuryData.metrics[0])
	//$: console.log(marketValTAssets)
</script>

<div class="p-8px">
	<div class="h-full min-w-300px flex flex-col justify-start items-center overflow-y-auto">
		<div class="sm:px-13 max-w-1280px w-full block flex-grow mx-auto bg-transparent">
			<!--Card 1: Stat Summary-->
			<div class="w-full mb-23px sm:text-center block">
				<div
					class="flex flex-row sm:text-center flex-wrap justify-evenly w-full mx-auto md:max-h-355px px-30px pt-20px pb-30px rounded-lg navButton"
				>
					<div class="flex flex-col sm:(flex-row flex-wrap items-center) justify-between w-full">
						<!--Market Cap-->
						<div class="summaryItem">
							<h6 class="cardLabel">Market Cap</h6>
							{#if locale && $ohmGraph.marketCap}
								<h5 class="cardContent">
									{formatCurrency($ohmGraph.marketCap, locale)}
								</h5>
							{:else}
								<div class="flex justify-center cardLabel pt-2 animate-pulse">
									<div class="cardLoading h-5 w-37 rounded-lg" />
								</div>
							{/if}
						</div>
						<!--OHM Price-->
						<div class="summaryItem">
							<h6 class="cardLabel">OHM Price</h6>
							{#if locale && $ohmGraph.marketPrice}
								<h5 class="cardContent">
									${yootils.commas($ohmGraph.marketPrice.toFixed(2))}
								</h5>
							{:else}
								<div class="flex justify-center cardLabel pt-2 animate-pulse">
									<div class="cardLoading h-5 w-21 rounded-lg" />
								</div>
							{/if}
						</div>
						<!--wsOHM Price-->
						<div class="summaryItem">
							<h6 class="cardLabel block">
								wsOHM Price
								<div class="inline-flex justify-center self-center">
									<svg
										class="w-4 h-4 fill-current"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										focusable="false"
										aria-hidden="true"
										style="margin: 0px 5px; font-size: 1em;"
										><path
											d="M9.23438 18.1953C13.5234 18.1953 17.0703 14.6484 17.0703 10.3594C17.0703 6.0625 13.5234 2.52344 9.22656 2.52344C4.9375 2.52344 1.39844 6.0625 1.39844 10.3594C1.39844 14.6484 4.94531 18.1953 9.23438 18.1953ZM9.23438 17.1797C5.45312 17.1797 2.41406 14.1328 2.41406 10.3594C2.41406 6.57812 5.45312 3.53125 9.22656 3.53125C13.0078 3.53125 16.0547 6.57812 16.0625 10.3594C16.0625 14.1328 13.0156 17.1797 9.23438 17.1797ZM9.1875 7.41406C9.67188 7.41406 10.0469 7.03906 10.0469 6.5625C10.0469 6.08594 9.67188 5.70312 9.1875 5.70312C8.71094 5.70312 8.32812 6.08594 8.32812 6.5625C8.32812 7.03906 8.71094 7.41406 9.1875 7.41406ZM7.83594 14.625H11.0391C11.2891 14.625 11.4844 14.4375 11.4844 14.1953C11.4844 13.9531 11.2891 13.7578 11.0391 13.7578H9.91406V9.38281C9.91406 9.0625 9.75 8.84375 9.44531 8.84375H7.9375C7.6875 8.84375 7.49219 9.03906 7.49219 9.27344C7.49219 9.52344 7.6875 9.71094 7.9375 9.71094H8.96094V13.7578H7.83594C7.58594 13.7578 7.39062 13.9531 7.39062 14.1953C7.39062 14.4375 7.58594 14.625 7.83594 14.625Z"
										/></svg
									>
								</div>
							</h6>
							<h5 class="cardContent">$30,479.48</h5>
						</div>
						<!--Circulating Supply-->
						<div class="summaryItem">
							<h6 class="cardLabel">Circulating Supply (total)</h6>
							{#if $ohmGraph.circSupply && $ohmGraph.totalSupply}
								<h5 class="cardContent">
									{$ohmGraph.circSupply.toFixed()} / {$ohmGraph.totalSupply.toFixed()}
								</h5>
							{:else}
								<div class="flex justify-center cardLabel pt-2 animate-pulse">
									<div class="cardLoading h-5 w-45 rounded-lg" />
								</div>
							{/if}
						</div>
						<!--Backing per OHM-->
						<div class="summaryItem">
							<h6 class="cardLabel">Backing per OHM</h6>
							{#if $ohmGraph.circSupply && $treasuryData?.metrics}
								<h5 class="cardContent">
									${yootils.commas(
										($treasuryData.metrics[0].treasuryMarketValue / $ohmGraph.circSupply).toFixed(2)
									)}
								</h5>
							{:else}
								<div class="flex justify-center cardLabel pt-2 animate-pulse">
									<div class="cardLoading h-5 w-19 rounded-lg" />
								</div>
							{/if}
						</div>
						<!--Current Index-->
						<div class="summaryItem">
							<h6 class="cardLabel block">
								Current Index
								<div class="inline-flex justify-center self-center">
									<svg
										class="w-4 h-4 fill-current"
										viewBox="0 0 20 20"
										fill="none"
										xmlns="http://www.w3.org/2000/svg"
										focusable="false"
										aria-hidden="true"
										style="margin: 0px 5px; font-size: 1em;"
										><path
											d="M9.23438 18.1953C13.5234 18.1953 17.0703 14.6484 17.0703 10.3594C17.0703 6.0625 13.5234 2.52344 9.22656 2.52344C4.9375 2.52344 1.39844 6.0625 1.39844 10.3594C1.39844 14.6484 4.94531 18.1953 9.23438 18.1953ZM9.23438 17.1797C5.45312 17.1797 2.41406 14.1328 2.41406 10.3594C2.41406 6.57812 5.45312 3.53125 9.22656 3.53125C13.0078 3.53125 16.0547 6.57812 16.0625 10.3594C16.0625 14.1328 13.0156 17.1797 9.23438 17.1797ZM9.1875 7.41406C9.67188 7.41406 10.0469 7.03906 10.0469 6.5625C10.0469 6.08594 9.67188 5.70312 9.1875 5.70312C8.71094 5.70312 8.32812 6.08594 8.32812 6.5625C8.32812 7.03906 8.71094 7.41406 9.1875 7.41406ZM7.83594 14.625H11.0391C11.2891 14.625 11.4844 14.4375 11.4844 14.1953C11.4844 13.9531 11.2891 13.7578 11.0391 13.7578H9.91406V9.38281C9.91406 9.0625 9.75 8.84375 9.44531 8.84375H7.9375C7.6875 8.84375 7.49219 9.03906 7.49219 9.27344C7.49219 9.52344 7.6875 9.71094 7.9375 9.71094H8.96094V13.7578H7.83594C7.58594 13.7578 7.39062 13.9531 7.39062 14.1953C7.39062 14.4375 7.58594 14.625 7.83594 14.625Z"
										/></svg
									>
								</div>
							</h6>
							<h5 class="cardContent">26.08 sOHM</h5>
						</div>
					</div>
				</div>
			</div>

			<!--Card 2: Chart Data-->
			<div
				class="flex flex-wrap -m-8px"
				style="transform: none; transition: transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms; width: calc(100% + 16px);"
			>
				<!--Section 1: Total Value Deposited-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>Total Value Deposited</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if locale && $ohmGraph.stakingTVL}
										<h4 class="cardContent font-semibold mr-5px">
											{formatCurrency($ohmGraph.stakingTVL, locale)}
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-44 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if tvl}
									<StackedArea
										data={tvl}
										colors={[['#768299', '#98B3E9']]}
										values={['totalValueLocked']}
									/>
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 2: Market Value of Treasury Assets-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>Market Value of Treasury Assets</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if $treasuryData?.metrics}
										<h4 class="cardContent font-semibold mr-5px">
											${yootils.commas($treasuryData.metrics[0].treasuryMarketValue.toFixed(0))}
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-40.5 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if marketValTAssets}
									<StackedArea
										data={marketValTAssets}
										colors={[
											['#F5AC37', '#EA9276'],
											['#768299', '#98B3E9'],
											['#DC30EB', '#EA98F1'],
											['#8BFF4D', '#4C8C2A']
										]}
										values={[
											'treasuryDaiMarketValue',
											'treasuryFraxMarketValue',
											'treasuryWETHMarketValue',
											'treasuryXsushiMarketValue'
										]}
									/>
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 3: Risk Free Value of Treasury Assets-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>Risk Free Value of Treasury Assets</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if riskFreeVal}
										<h4 class="cardContent font-semibold mr-5px">
											${yootils.commas($treasuryData.metrics[0].treasuryRiskFreeValue.toFixed(0))}
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-37 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if riskFreeVal}
									<StackedArea
										data={riskFreeVal}
										colors={[
											['#F5AC37', '#EA9276'],
											['#768299', '#98B3E9'],
											['#000', '#fff'],
											['#000', '#fff']
										]}
										values={['treasuryDaiRiskFreeValue', 'treasuryFraxRiskFreeValue']}
									/>
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 4: Protocol Owned Liquidity OHM-DAI-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>Protocol Owned Liquidity OHM-DAI</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if tOhmDaiPOL}
										<h4 class="cardContent font-semibold mr-5px">
											{tOhmDaiPOL[0].treasuryOhmDaiPOL.toFixed(2)}%
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-21.5 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if tOhmDaiPOL}
									<StackedArea
										data={tOhmDaiPOL}
										format={'percent'}
										colors={[['rgba(128, 204, 131, 1)', 'rgba(128, 204, 131, 0)']]}
										values={['treasuryOhmDaiPOL']}
									/>
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 5: OHM Staked-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>OHM Staked</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if ohmStaked}
										<h4 class="cardContent font-semibold mr-5px">
											{ohmStaked[0].staked.toFixed(2)}%
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-21.5 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if ohmStaked}
									<StackedArea
										data={ohmStaked}
										format={'percent'}
										colors={[['#55EBC7', '#47ACEB']]}
										values={['staked']}
									/>
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 6: APY over time-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>APY over time</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if apyOverTime}
										<h4 class="cardContent font-semibold mr-5px">
											{Math.pow(10, apyOverTime[0].y).toFixed(2)}%
										</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-26.5 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if apyOverTime}
									<Line data={apyOverTime} label="APY" format={'percent'} scale={'log'} />
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
				<!--Section 7: Runway Availables-->
				<div class="chartItem">
					<div class="chartCard navButton">
						<div class="chartContent">
							<!--Header-->
							<div class="chartHeader">
								<div class="w-full overflow-hidden flex items-center justify-between cardLabel">
									<div class="w-9/10 flex items-center">
										<h6>Runway Available</h6>
										<div class="flex inline-flex justify-center self-center mx-5px">
											<Info />
										</div>
									</div>
									<Expand />
								</div>
								<div class="flex">
									{#if runWay}
										<h4 class="cardContent font-semibold mr-5px">{runWay[0].y.toFixed(1)} Days</h4>
									{:else}
										<div class="flex justify-start mr-5px cardLabel pt-2 animate-pulse">
											<div class="cardLoading h-5 w-30.5 rounded-lg w-full" />
										</div>
									{/if}
									<h4 class="cardLabel font-normal">Today</h4>
								</div>
							</div>
							<!--Chart-->
							<div class="chart">
								{#if runWay}
									<Line data={runWay} label={'Days'} format={'days'} />
								{:else}
									<div class="flex w-full h-full justify-center items-center">
										<Shadow />
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.summaryItem {
		@apply m-3px min-w-140px w-3/10;
	}

	.chartItem {
		@apply p-8px m-0 flex-grow-0 max-w-full block;
		flex-basis: 100%;
	}

	@media (min-width: 1024px) {
		.chartItem {
			@apply p-8px m-0 flex-grow-0 max-w-1/2 block;
			flex-basis: 50%;
		}
	}

	.chartCard {
		@apply w-full m-auto max-h-355px py-20px whitespace-nowrap rounded-lg;
	}

	.chartContent {
		@apply w-full h-full pr-10px;
	}

	.chartHeader {
		@apply px-20px py-0 min-w-300px mb-20px block;
	}

	.chart {
		@apply w-full min-w-310px min-h-260px block;
	}
</style>
