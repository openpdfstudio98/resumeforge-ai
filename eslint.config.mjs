import { defineConfig, globalIgnores } from "eslint/config";
import core from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";
export default defineConfig([...core, ...typescript, globalIgnores([".next/**", "out/**", "next-env.d.ts", "test-results/**"])]);
