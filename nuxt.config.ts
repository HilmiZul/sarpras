import { defineNuxtConfig } from "nuxt/config";
import pkg from './package.json'
// import { readFileSync } from 'fs'
// import { read, utils } from 'xlsx'

export default defineNuxtConfig({
  compatibilityDate: '2026-04-22',
  devtools: { enabled: false },
  css: [
    "~/assets/css/lumen.min.css",
    "bootstrap-icons/font/bootstrap-icons.min.css"
  ],
  ssr: false,
  app: {
    head: {
      htmlAttrs: {
        lang: 'id',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ],
      script: [
        { src: "https://cdn.jsdelivr.net/npm/bootstrap@5.2/dist/js/bootstrap.bundle.min.js" },
      ]
    }
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.PB_API_BASE_URL,
			apiPort: process.env.PB_API_PORT,
      appVersion: pkg.version,
      author: pkg.author,
		},
	},
  vite: {
    assetsInclude: ['**/*.xlsx'], // xlsx file should be treated as assets

    // plugins: [
    //   {
    //     name: "vite-sheet",
    //     transform(_code, id) {
    //       if(!id.match(/\.xlsx$/)) return;
    //       var wb = read(readFileSync(id.replace(/\?sheetjs$/, "")));
    //       var data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
    //       return `export default JSON.parse('${JSON.stringify(data).replace(/\\/g, "\\\\")}')`;
    //     }
    //   },
    // ],
  },
})
