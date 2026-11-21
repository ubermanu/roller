import { defineConfig } from 'wxt'

export default defineConfig({
  srcDir: 'src',
  outDir: 'dist',
  imports: false,
  modules: ['@wxt-dev/module-svelte'],
  zip: {
    name: 'roller',
  },
  manifest: ({ browser }) => ({
    name: 'Roller',
    description: 'Enable auto scrolling with the mouse wheel button on Linux',
    minimum_chrome_version: browser === 'firefox' ? undefined : '88',
    icons: {
      16: 'icons/icon16.png',
      32: 'icons/icon32.png',
      48: 'icons/icon48.png',
      128: 'icons/icon128.png',
    },
    permissions: ['storage'],
    browser_specific_settings:
      browser === 'firefox'
        ? { gecko: { id: '{c0b65bfc-5191-4489-b2ed-4052c055e9b2}' } }
        : undefined,
  }),
})
