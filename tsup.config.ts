import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'bin/create-monolith-app': 'src/bin/create-monolith-app.ts',
  },
  format: ['esm'],
  target: 'node20',
  clean: true,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
});
