<script>
	import { ohmGraph } from '$lib/stores/api/graph';
	import getUserLocale from 'get-user-locale';
	import { browser } from '$app/env';
	import {
		calcRebaseTime,
		formatCurrency,
		prettifySeconds,
		getContractData,
		initStakingContract,
		initSohmMainContract,
		getOhmLusdCrucibleData
	} from '$lib/utils';
	import { connected, web3 } from '$lib/stores/api/wallet';
	import { trim } from '$lib/helpers/index';
	import { web3Socket } from '$lib/stores/api/ethSocket';

	let locale;
	if (browser) locale = getUserLocale();

	const formatTime = (block) => {
		if (block) {
			const time = calcRebaseTime(block);
			return prettifySeconds(time);
		}
	};

	let stakingContract;
	let sOhmMainContract;
	let data;
	let poolData;
	let currentBlock;

	$: if (browser) {
		stakingContract = initStakingContract();
		sOhmMainContract = initSohmMainContract();
	}
	$: if (browser) {
		data = getContractData(stakingContract, sOhmMainContract).then((data) => {
			return data;
		});

		poolData = getOhmLusdCrucibleData();
	}
	//$: console.log(data)
	$: currentBlock =
		browser && !$connected
			? $web3Socket.getBlockNumber().then((block) => {
					return block;
			  })
			: browser && $connected
			? $web3.getBlockNumber().then((block) => {
					return block;
			  })
			: null;
</script>

<div class="flex flex-col justify-center items-center pt-5 pb-8 px-8 mb-7">
	<!--First Card-->
	<div class="w-97/100 max-w-833px rounded-lg navButton mb-7 pt-5 pb-8 px-4">
		<div class="w-full flex flex-col">
			<!--Card Header-->
			<div class="p-2 m-0">
				<div class="w-full h-min-33px mb-4">
					<h5 class="font-semibold">Single Stake (3, 3)</h5>
					<div class="m-0 relative leading-none">
						{#if currentBlock == null}
							<div class="flex justify-start cardLabel animate-pulse">
								<div class="cardLoading h-3 w-40 rounded-lg w-full" />
							</div>
						{:else}
							{#await currentBlock}
								<div class="flex justify-start cardLabel animate-pulse">
									<div class="cardLoading h-3 w-40 rounded-lg w-full" />
								</div>
							{:then rebaseTime}
								<p class="text-xs">
									<strong>{formatTime(rebaseTime)}</strong> to next rebase
								</p>
							{:catch error}
								<p class="text-red-700 text-xs">{error.message}</p>
							{/await}
						{/if}
					</div>
				</div>
			</div>
			<!--Stake Metrics-->
			<div class="p-2 m-0 w-full">
				<div class="flex w-full mt-3 p-0 md:text-center">
					<div class="w-full flex-wrap md:flex">
						<!--Flex Item 1: APY-->
						<div
							class="flex-col items-start w-full py-2 whitespace-nowrap overflow-ellipsis overflow-hidden md:(w-1/3 w-max-1/3 items-center)"
						>
							<h5 class="cardLabel">APY</h5>
							<!--TODO: Add reactive APY based on contract-->
							{#if data == null}
								<div class="flex justify-start md:justify-center cardLabel animate-pulse">
									<div class="cardLoading h-6 w-24 rounded-lg" />
								</div>
							{:else}
								{#await data}
									<div class="flex justify-start md:justify-center cardLabel animate-pulse">
										<div class="cardLoading h-6 w-24 rounded-lg" />
									</div>
								{:then { stakingAPY }}
									<h4 class="cardContent font-medium">{trim(stakingAPY * 100, 1)}%</h4>
								{:catch error}
									<h4 class="cardContent text-red-700 font-medium">{error.message}</h4>
								{/await}
							{/if}
						</div>
						<!--Flex Item 2: Total Value Deposited-->
						<div
							class="flex-col items-start w-full py-2 whitespace-nowrap overflow-ellipsis overflow-hidden md:(w-1/3 w-max-1/3 items-center)"
						>
							<h5 class="cardLabel">Total Value Deposited</h5>
							<!--TODO: Add reactive Total Value Deposited based on contract-->
							{#if locale && $ohmGraph.stakingTVL}
								<h4 class="cardContent font-medium">
									{formatCurrency($ohmGraph.stakingTVL, locale)}
								</h4>
							{:else}
								<div class="flex justify-start md:justify-center cardLabel pt-2 animate-pulse">
									<div class="cardLoading h-6 w-50 rounded-lg w-full" />
								</div>
							{/if}
						</div>
						<!--Flex Item 3: Current Index-->
						<div
							class="flex-col items-start w-full py-2 whitespace-nowrap overflow-ellipsis overflow-hidden md:(w-1/3 w-max-1/3 items-center)"
						>
							<h5 class="cardLabel">Current Index</h5>
							<!--TODO: Add reactive Total Value Deposited based on contract-->
							{#if data == null}
								<div class="flex justify-start md:justify-center cardLabel animate-pulse">
									<div class="cardLoading h-6 w-24 rounded-lg w-full" />
								</div>
							{:else}
								{#await data}
									<div class="flex justify-start md:justify-center cardLabel animate-pulse">
										<div class="cardLoading h-6 w-24 rounded-lg w-full" />
									</div>
								{:then { currentIndex }}
									<h4 class="cardContent font-medium">{trim(currentIndex, 1)} NUM</h4>
								{:catch error}
									<h4 class="cardContent text-red-700 font-medium">{error.message}</h4>
								{/await}
							{/if}
						</div>
					</div>
				</div>
			</div>
			<!--Stake Details-->
			<div class="my-3 mx-2">
				<div class="text-center flex-col">
					<button class="mx-auto colorButton">
						<span class="w-full">Connect Wallet</span>
					</button>
					<h6 class="font-medium cardContent m-0">Connect your wallet to stake NUM</h6>
				</div>
			</div>
		</div>
	</div>

	<!--Second Card-->
	<div class="w-97/100 max-w-833px rounded-lg navButton pt-5 pb-8 px-4 mb-8">
		<div class="w-full flex flex-col">
			<!--Card Header-->
			<div class="w-full h-min-33px mb-2">
				<h5 class="font-semibold">Farm Pool</h5>
			</div>

			<!--Card Content-->
			<div class="cardContent">
				<!--Farm Pool Table-->
				<div class="w-full overflow-x-auto block">
					<table class="w-full my-3 mx-0 table border-none">
						<!--  Screen < MD Table -->
						<tbody class="table-row-group md:hidden border-none">
							<tr class="table-row">
								<th class="table-cell cardLabel p-2 text-left border-b-0 font-medium">Asset</th>
								<td class="table-cell cardContent p-2 text-left border-b-0 font-medium">
									<div class="flex items-center justify-end">
										<div class="w-64px flex items-center justify-center align-middle">
											<svg
												width="62"
												height="32"
												viewBox="0 0 64 32"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"
												focusable="false"
												color="#FCFCFC"
												aria-hidden="true"
												style="height: 32px; width: 62px;"
												><defs id="defs82"
													><clipPath id="b"
														><rect width="128" height="128" id="rect2" x="0" y="0" /></clipPath
													></defs
												><g
													id="a"
													clip-path="url(#b)"
													transform="matrix(0.25003187,0,0,0.25003187,29.993954,-0.09628032)"
													><g transform="translate(0,-0.007)" id="g15"
														><path
															d="M 101.714,81.709 A 63.907,63.907 0 0 1 51.675,126.8 V 108.588 A 30.378,30.378 0 0 0 63.039,100.96 29.384,29.384 0 0 0 67.5,94.7 29.685,29.685 0 0 0 70.96,80.637 C 70.96,64.537 59.337,58.1 48.44,53.326 l -5.518,-2.439 c -5.9,-2.646 -10.413,-5 -10.413,-9.029 0,-5.569 4.86,-8.562 9.444,-8.562 4.878,0 7.645,1.8 10.568,6.867 l 2.266,3.926 14.581,-9.357 -1.9,-3.528 A 28.319,28.319 0 0 0 51.676,17.604 V 0.9 c 1.418,0.242 2.819,0.553 4.238,0.917 0.138,0.035 0.294,0.069 0.45,0.1 a 3.682,3.682 0 0 1 0.467,0.121 0.535,0.535 0 0 1 0.138,0.035 c 0.381,0.1 0.778,0.19 1.176,0.311 a 63.992,63.992 0 0 1 43.569,79.325 z"
															transform="translate(23.721,0.614)"
															fill="#745ddf"
															id="path7"
														/><path
															d="m 76.779,81.972 c 0,7.334 -6.625,11.865 -12.748,11.865 -7.351,0 -11.554,-6.071 -12.367,-11.71 L 50.972,77.232 33.33,82.2 l 0.8,3.944 c 2.525,12.436 11.018,21.379 22.555,24.077 v 17.625 a 64.405,64.405 0 0 1 -9.271,-1.782 c -0.432,-0.1 -0.848,-0.225 -1.28,-0.346 A 64.037,64.037 0 0 1 0,64.295 V 2.805 A 2.528,2.528 0 0 1 2.525,0.28 h 54.156 v 17.608 a 25.936,25.936 0 0 0 -15.1,11.692 24.69,24.69 0 0 0 -3.252,12.4 v 0.346 C 38.5,56.684 49.053,62.686 59.016,67.2 l 4.984,2.162 0.415,0.19 c 7.902,3.616 12.364,5.985 12.364,12.42 z"
															transform="translate(0,0.162)"
															fill="#2eb6ea"
															id="path9"
														/><g transform="translate(33.33,0.392)" id="g13"
															><path
																d="m 80.621,81.251 a 29.685,29.685 0 0 1 -3.459,14.062 29.384,29.384 0 0 1 -4.463,6.261 30.378,30.378 0 0 1 -11.364,7.626 l 0.008,18.3 -5.115,0.452 c 0,0 -10.969,0.329 -13.581,0 L 42.62,110.379 C 31.084,107.68 22.591,98.738 20.066,86.3 l -0.8,-3.944 17.642,-4.964 0.692,4.895 C 38.417,87.928 42.62,94 49.971,94 c 6.123,0 12.748,-4.532 12.748,-11.865 0,-6.434 -4.463,-8.8 -12.367,-12.419 l -0.415,-0.19 -4.981,-2.162 C 34.993,62.848 24.442,56.846 24.269,42.49 V 42.144 A 24.69,24.69 0 0 1 27.521,29.744 25.936,25.936 0 0 1 42.62,18.05 V 0.424 C 54.156,0.326 55.039,0.394 61.335,1.5 v 16.723 a 28.319,28.319 0 0 1 15.792,13.6 l 1.9,3.528 -14.578,9.349 -2.266,-3.926 c -2.923,-5.068 -5.691,-6.867 -10.568,-6.867 -4.584,0 -9.444,2.992 -9.444,8.562 0,4.03 4.514,6.382 10.413,9.029 L 58.1,53.94 C 69,58.714 80.621,65.148 80.621,81.251 Z"
																transform="translate(-19.27,-0.392)"
																fill="#ffffff"
																id="path11"
															/></g
														></g
													></g
												><path
													d="M 0,16 C 0,7.16344 7.16344,0 16,0 24.8366,0 32,7.16344 32,16 32,24.8366 24.8366,32 16,32 7.16344,32 0,24.8366 0,16 Z"
													fill="#708b96"
													id="path74"
												/><path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="m 17.536,22.997526 v 0.032 h 5.504 v -1.984 h -2.718 c 1.6353,-1.239 2.686,-3.165 2.686,-5.328 0,-3.7379 -3.1376,-6.7680002 -7.008,-6.7680002 -3.8704,0 -7.00801,3.0301002 -7.00801,6.7680002 0,2.163 1.05071,4.089 2.68601,5.328 H 8.95999 v 1.984 H 14.464 v -0.032 -0.6751 -1.9595 c -2.0055,-0.6312 -3.456,-2.4653 -3.456,-4.6294 0,-2.6863 2.235,-4.864 4.992,-4.864 2.757,0 4.992,2.1777 4.992,4.864 0,2.1641 -1.4506,3.9982 -3.456,4.6294 z"
													fill="#ffffff"
													id="path76"
												/></svg
											>
										</div>
										<p class="font-medium text-sm">NUM-LUSD</p>
									</div>
								</td>
							</tr>
							<tr class="table-row">
								<th class="table-cell cardLabel p-2 text-left border-b-0 font-medium">APY</th>
								{#if poolData == null}
									<td
										class="table-cell text-sm p-2 text-right border-b-0 font-medium animate-pulse"
									>
										<div class="cardLoading h-4 rounded-lg w-12" />
									</td>
								{:else}
									{#await poolData}
										<td
											class="table-cell text-sm p-2 text-right border-b-0 font-medium animate-pulse"
										>
											<div class="cardLoading h-4 rounded-lg w-12" />
										</td>
									{:then { apy }}
										<td class="table-cell text-sm p-2 text-right border-b-0 font-medium"
											>{trim(apy, 1)}%</td
										>
									{:catch error}
										<td
											class="table-cell text-sm p-2 text-red-700 text-right border-b-0 font-medium"
											>{error.message}</td
										>
									{/await}
								{/if}
							</tr>
							<tr class="table-row">
								<th class="table-cell cardLabel p-2 text-left border-b-0 font-medium">TVD</th>
								{#if poolData == null}
									<td
										class="table-cell text-sm p-2 text-right border-b-0 font-medium animate-pulse"
									>
										<div class="cardLoading h-4 rounded-lg w-12" />
									</td>
								{:else}
									{#await poolData}
										<td
											class="table-cell text-sm p-2 text-right border-b-0 font-medium animate-pulse"
										>
											<div class="cardLoading h-4 rounded-lg w-12" />
										</td>
									{:then { tvl }}
										<td class="table-cell text-sm p-2 text-right border-b-0 font-medium"
											>{formatCurrency(tvl, locale)}</td
										>
									{:catch error}
										<td
											class="table-cell text-sm p-2 text-red-700 text-right border-b-0 font-medium"
											>{error.message}</td
										>
									{/await}
								{/if}
							</tr>
							<tr class="table-row">
								<th class="table-cell cardLabel p-2 text-left border-b-0 font-medium">Balance</th>
								<td class="table-cell text-sm p-2 text-right border-b-0 font-medium">0 SLP</td>
							</tr>
						</tbody>

						<!-- Screen >= MD Table -->
						<thead class="hidden md:table-header-group outline-none align-middle border-none">
							<tr class="table-row cardLabel align-middle outline-transparent border-none">
								<th class="table-cell p-4 text-left border-b-0 font-medium">Asset</th>
								<th class="table-cell p-4 text-left border-b-0 font-medium">APY</th>
								<th class="table-cell p-4 text-left border-b-0 font-medium">TVD</th>
								<th class="table-cell p-4 text-left border-b-0 font-medium">Balance</th>
							</tr>
						</thead>
						<tbody class="hidden md:table-row-group align-middle border-none">
							<tr class="cardContent table-row">
								<td class="table-cell p-4 text-left border-b-0 font-medium">
									<div class="flex items-center">
										<div class="w-64px flex items-center justify-center align-middle">
											<svg
												width="62"
												height="32"
												viewBox="0 0 64 32"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
												class="MuiSvgIcon-root MuiSvgIcon-fontSizeSmall"
												focusable="false"
												color="#FCFCFC"
												aria-hidden="true"
												style="height: 32px; width: 62px;"
												><defs id="defs82"
													><clipPath id="b"
														><rect width="128" height="128" id="rect2" x="0" y="0" /></clipPath
													></defs
												><g
													id="a"
													clip-path="url(#b)"
													transform="matrix(0.25003187,0,0,0.25003187,29.993954,-0.09628032)"
													><g transform="translate(0,-0.007)" id="g15"
														><path
															d="M 101.714,81.709 A 63.907,63.907 0 0 1 51.675,126.8 V 108.588 A 30.378,30.378 0 0 0 63.039,100.96 29.384,29.384 0 0 0 67.5,94.7 29.685,29.685 0 0 0 70.96,80.637 C 70.96,64.537 59.337,58.1 48.44,53.326 l -5.518,-2.439 c -5.9,-2.646 -10.413,-5 -10.413,-9.029 0,-5.569 4.86,-8.562 9.444,-8.562 4.878,0 7.645,1.8 10.568,6.867 l 2.266,3.926 14.581,-9.357 -1.9,-3.528 A 28.319,28.319 0 0 0 51.676,17.604 V 0.9 c 1.418,0.242 2.819,0.553 4.238,0.917 0.138,0.035 0.294,0.069 0.45,0.1 a 3.682,3.682 0 0 1 0.467,0.121 0.535,0.535 0 0 1 0.138,0.035 c 0.381,0.1 0.778,0.19 1.176,0.311 a 63.992,63.992 0 0 1 43.569,79.325 z"
															transform="translate(23.721,0.614)"
															fill="#745ddf"
															id="path7"
														/><path
															d="m 76.779,81.972 c 0,7.334 -6.625,11.865 -12.748,11.865 -7.351,0 -11.554,-6.071 -12.367,-11.71 L 50.972,77.232 33.33,82.2 l 0.8,3.944 c 2.525,12.436 11.018,21.379 22.555,24.077 v 17.625 a 64.405,64.405 0 0 1 -9.271,-1.782 c -0.432,-0.1 -0.848,-0.225 -1.28,-0.346 A 64.037,64.037 0 0 1 0,64.295 V 2.805 A 2.528,2.528 0 0 1 2.525,0.28 h 54.156 v 17.608 a 25.936,25.936 0 0 0 -15.1,11.692 24.69,24.69 0 0 0 -3.252,12.4 v 0.346 C 38.5,56.684 49.053,62.686 59.016,67.2 l 4.984,2.162 0.415,0.19 c 7.902,3.616 12.364,5.985 12.364,12.42 z"
															transform="translate(0,0.162)"
															fill="#2eb6ea"
															id="path9"
														/><g transform="translate(33.33,0.392)" id="g13"
															><path
																d="m 80.621,81.251 a 29.685,29.685 0 0 1 -3.459,14.062 29.384,29.384 0 0 1 -4.463,6.261 30.378,30.378 0 0 1 -11.364,7.626 l 0.008,18.3 -5.115,0.452 c 0,0 -10.969,0.329 -13.581,0 L 42.62,110.379 C 31.084,107.68 22.591,98.738 20.066,86.3 l -0.8,-3.944 17.642,-4.964 0.692,4.895 C 38.417,87.928 42.62,94 49.971,94 c 6.123,0 12.748,-4.532 12.748,-11.865 0,-6.434 -4.463,-8.8 -12.367,-12.419 l -0.415,-0.19 -4.981,-2.162 C 34.993,62.848 24.442,56.846 24.269,42.49 V 42.144 A 24.69,24.69 0 0 1 27.521,29.744 25.936,25.936 0 0 1 42.62,18.05 V 0.424 C 54.156,0.326 55.039,0.394 61.335,1.5 v 16.723 a 28.319,28.319 0 0 1 15.792,13.6 l 1.9,3.528 -14.578,9.349 -2.266,-3.926 c -2.923,-5.068 -5.691,-6.867 -10.568,-6.867 -4.584,0 -9.444,2.992 -9.444,8.562 0,4.03 4.514,6.382 10.413,9.029 L 58.1,53.94 C 69,58.714 80.621,65.148 80.621,81.251 Z"
																transform="translate(-19.27,-0.392)"
																fill="#ffffff"
																id="path11"
															/></g
														></g
													></g
												><path
													d="M 0,16 C 0,7.16344 7.16344,0 16,0 24.8366,0 32,7.16344 32,16 32,24.8366 24.8366,32 16,32 7.16344,32 0,24.8366 0,16 Z"
													fill="#708b96"
													id="path74"
												/><path
													fill-rule="evenodd"
													clip-rule="evenodd"
													d="m 17.536,22.997526 v 0.032 h 5.504 v -1.984 h -2.718 c 1.6353,-1.239 2.686,-3.165 2.686,-5.328 0,-3.7379 -3.1376,-6.7680002 -7.008,-6.7680002 -3.8704,0 -7.00801,3.0301002 -7.00801,6.7680002 0,2.163 1.05071,4.089 2.68601,5.328 H 8.95999 v 1.984 H 14.464 v -0.032 -0.6751 -1.9595 c -2.0055,-0.6312 -3.456,-2.4653 -3.456,-4.6294 0,-2.6863 2.235,-4.864 4.992,-4.864 2.757,0 4.992,2.1777 4.992,4.864 0,2.1641 -1.4506,3.9982 -3.456,4.6294 z"
													fill="#ffffff"
													id="path76"
												/></svg
											>
										</div>
										<p class="font-medium text-sm">NUM-LUSD</p>
									</div>
								</td>
								{#if poolData == null}
									<td class="table-cell text-sm p-4 text-left border-b-0 font-medium animate-pulse">
										<div class="cardLoading h-4 rounded-lg w-12" />
									</td>
								{:else}
									{#await poolData}
										<td
											class="table-cell text-sm p-4 text-left border-b-0 font-medium animate-pulse"
										>
											<div class="cardLoading h-4 w-12 rounded-lg w-full" />
										</td>
									{:then { apy }}
										<td class="table-cell text-sm p-4 text-left border-b-0 font-medium">
											{trim(apy, 1)}%</td
										>
									{:catch error}
										<td class="table-cell text-sm p-4 text-red-700 text-left border-b-0 font-medium"
											>{error.message}</td
										>
									{/await}
								{/if}
								<!--Staking Pool: Total Value Deposited-->
								{#if poolData == null}
									<td class="table-cell text-sm p-4 text-left border-b-0 font-medium animate-pulse">
										<div class="cardLoading h-4 rounded-lg w-12" />
									</td>
								{:else}
									{#await poolData}
										<td
											class="table-cell text-sm p-4 text-left border-b-0 font-medium animate-pulse"
										>
											<div class="cardLoading h-4 w-12 rounded-lg w-full" />
										</td>
									{:then { tvl }}
										<td class="table-cell text-sm p-4 text-left border-b-0 font-medium">
											{formatCurrency(tvl, locale)}</td
										>
									{:catch error}
										<td class="table-cell text-sm p-4 text-red-700 text-left border-b-0 font-medium"
											>{error.message}</td
										>
									{/await}
								{/if}
								<td class="table-cell text-sm p-4 text-left border-b-0 font-medium">0 SLP</td>
								<td class="table-cell text-sm p-4 text-left border-b-0 font-medium">
									<a href="#replaceMe" target="_blank" class="minButton">
										<span>
											<p class="text-left text-md m-0">Stake in Crucible</p>
										</span>
										<svg
											viewBox="0 0 20 20"
											height="20px"
											width="20px"
											xmlns="http://www.w3.org/2000/svg"
											class="fill-current pl-1"
											focusable="false"
											aria-hidden="true"
										>
											<path
												d="M4.29688 17.4453H13.8359C15.3594 17.4453 16.1406 16.6641 16.1406 15.1641V5.58594C16.1406 4.07812 15.3594 3.29688 13.8359 3.29688H4.29688C2.77344 3.29688 1.99219 4.07031 1.99219 5.58594V15.1641C1.99219 16.6719 2.77344 17.4453 4.29688 17.4453ZM4.3125 16.4766C3.4375 16.4766 2.96094 16.0156 2.96094 15.1094V5.63281C2.96094 4.73438 3.4375 4.26562 4.3125 4.26562H13.8125C14.6797 4.26562 15.1719 4.73438 15.1719 5.63281V15.1094C15.1719 16.0156 14.6797 16.4766 13.8125 16.4766H4.3125ZM11.6094 12.2422C11.875 12.2422 12.0469 12.0469 12.0469 11.7656V7.86719C12.0469 7.52344 11.8594 7.375 11.5547 7.375H7.64062C7.35156 7.375 7.17188 7.54688 7.17188 7.8125C7.17188 8.07812 7.35938 8.25781 7.64844 8.25781H9.53125L10.6641 8.17969L9.60938 9.17188L6.22656 12.5547C6.14062 12.6406 6.07812 12.7578 6.07812 12.8828C6.07812 13.1562 6.25781 13.3359 6.53125 13.3359C6.67969 13.3359 6.78906 13.2734 6.875 13.1875L10.25 9.82031L11.2344 8.77344L11.1562 10.0547V11.7734C11.1562 12.0625 11.3359 12.2422 11.6094 12.2422Z"
											/>
										</svg>
									</a>
								</td>
							</tr>
						</tbody>
					</table>
					<div class="w-full md:hidden">
						<a href="#replaceMe" target="_blank" class="minButton w-full justify-center">
							<span>
								<p class="text-left text-md m-0">Stake in Crucible</p>
							</span>
							<svg
								viewBox="0 0 20 20"
								height="20px"
								width="20px"
								xmlns="http://www.w3.org/2000/svg"
								class="fill-current pl-1"
								focusable="false"
								aria-hidden="true"
							>
								<path
									d="M4.29688 17.4453H13.8359C15.3594 17.4453 16.1406 16.6641 16.1406 15.1641V5.58594C16.1406 4.07812 15.3594 3.29688 13.8359 3.29688H4.29688C2.77344 3.29688 1.99219 4.07031 1.99219 5.58594V15.1641C1.99219 16.6719 2.77344 17.4453 4.29688 17.4453ZM4.3125 16.4766C3.4375 16.4766 2.96094 16.0156 2.96094 15.1094V5.63281C2.96094 4.73438 3.4375 4.26562 4.3125 4.26562H13.8125C14.6797 4.26562 15.1719 4.73438 15.1719 5.63281V15.1094C15.1719 16.0156 14.6797 16.4766 13.8125 16.4766H4.3125ZM11.6094 12.2422C11.875 12.2422 12.0469 12.0469 12.0469 11.7656V7.86719C12.0469 7.52344 11.8594 7.375 11.5547 7.375H7.64062C7.35156 7.375 7.17188 7.54688 7.17188 7.8125C7.17188 8.07812 7.35938 8.25781 7.64844 8.25781H9.53125L10.6641 8.17969L9.60938 9.17188L6.22656 12.5547C6.14062 12.6406 6.07812 12.7578 6.07812 12.8828C6.07812 13.1562 6.25781 13.3359 6.53125 13.3359C6.67969 13.3359 6.78906 13.2734 6.875 13.1875L10.25 9.82031L11.2344 8.77344L11.1562 10.0547V11.7734C11.1562 12.0625 11.3359 12.2422 11.6094 12.2422Z"
								/>
							</svg>
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
