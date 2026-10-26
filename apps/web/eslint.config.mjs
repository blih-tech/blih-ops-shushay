import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default defineConfig(
  ...nextVitals,
  globalIgnores([".next/**", "node_modules/**"]),
);
