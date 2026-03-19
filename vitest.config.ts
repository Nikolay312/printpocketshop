import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: "./tests/setup.ts",

    /**
     * 🔒 TRUE SERIAL EXECUTION (Vitest v4)
     */

    pool: "forks",
    isolate: false,
    fileParallelism: false,
    maxConcurrency: 1,

    sequence: {
      concurrent: false,
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname),

      "server-only": path.resolve(
        __dirname,
        "tests/__mocks__/server-only.ts"
      ),

      "@/lib/mail": path.resolve(
        __dirname,
        "tests/__mocks__/lib/mail.ts"
      ),
    },
  },
});
