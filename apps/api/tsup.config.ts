import { defineConfig, type Options } from "tsup";

export default defineConfig((options: Options) => ({
  entryPoints: ["src/index.ts"],
  clean: true,
  format: ["cjs"],
  external: [], // <- override default, include all packages
  noExternal: ['@repo/logger'],
  ...options,
}));
