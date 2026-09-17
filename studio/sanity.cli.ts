import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  // LexoRank is CommonJS. Let Node load it during schema extraction instead of
  // transforming it as ESM; browser production builds still bundle it normally.
  vite: {ssr: {external: ['lexorank']}},
  api: {
    projectId: '80rpogyy',
    dataset: 'production'
  },
  typegen: {
    enabled: true,
    path: './src/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: './src/sanity.types.ts',
  },
  deployment: {
    appId: 'eounucdn71jh6ijv5bxzc1vl',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: false,
  },
})
