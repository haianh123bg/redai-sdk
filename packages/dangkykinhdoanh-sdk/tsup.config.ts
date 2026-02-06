import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/utils/response-parser.ts"],
  format: ["cjs", "esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  splitting: false,
});
