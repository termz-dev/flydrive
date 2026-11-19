import next from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tseslint from "typescript-eslint";

const config = [
  { ignores: [".next/**", "node_modules/**", "next-env.d.ts", "coverage/**"] },
  ...next,
  ...nextTs,
  {
    files: ["**/*.ts", "**/*.tsx"],
    plugins: { "@typescript-eslint": tseslint.plugin },
    rules: {
      "no-empty": ["error", { allowEmptyCatch: false }],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["**/tests/**", "**/fixtures/**"],
              message: "Test fakes must never be imported into application code.",
            },
          ],
        },
      ],
    },
  },
];

export default config;
