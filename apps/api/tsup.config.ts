import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/server.ts'],
  format: ['esm'],
  platform: 'node',
  target: 'node22',
  outDir: 'dist',
  sourcemap: true,
  clean: true,
  splitting: false,
  // Workspace-Paket (TypeScript-Quellcode) wird in das Bundle eingebettet
  noExternal: ['@ccs/shared'],
});
