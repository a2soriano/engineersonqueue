import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig(() => {
  const version = String(Date.now());
  return {
    base: '/engineersonqueue/',
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
