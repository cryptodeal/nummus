import WindiCSS from 'vite-plugin-windicss';
import vercel from '@sveltejs/adapter-vercel';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: vercel(),
		// hydrate the <div id="svelte"> element in src/app.html
		target: '#svelte',
		vite: {
			plugins: [WindiCSS()]
			/*
      build: {
        commonjsOptions: {
          transformMixedEsModules: true,
        },
      },
      optimizeDeps: {
				include: ['@walletconnect/web3-provider']
			},
      */
		}
	}
};

export default config;
