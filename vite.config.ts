import { defineConfig, loadEnv } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(({ mode }) => {
  const version = String(Date.now());
  const base = loadEnv(mode, '.', 'VITE_').VITE_BASE_PATH || '/';
  return {
    base,
    define: { __SITE_VERSION__: JSON.stringify(version) },
    plugins: [
      svelte(),
      {
        name: 'site-version',
        apply: 'build',
        generateBundle() {
          this.emitFile({
            type: 'asset',
            fileName: 'version.json',
            source: JSON.stringify({ version })
          });
        }
      }
    ]
  };
});
