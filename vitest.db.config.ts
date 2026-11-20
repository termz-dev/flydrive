import { defineConfig } from "vitest/config";
import path from "node:path";

/** Database tests: need DATABASE_URL_TEST pointing at a disposable database. */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname, "src") } },
  test: {
    include: ["tests/db/**/*.test.ts"],
    environment: "node",
    globalSetup: ["tests/db/global-setup.ts"],
    setupFiles: ["tests/db/env.ts"],
    fileParallelism: false,
    testTimeout: 20000,
  },
});
