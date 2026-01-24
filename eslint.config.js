// @ts-check

import eslint from "@eslint/js"
import jsdoc from "eslint-plugin-jsdoc"
import { defineConfig } from "eslint/config"
import tseslint from "typescript-eslint"

export default defineConfig(
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ["src/**/*.ts"],
    plugins: {
      jsdoc,
    },
    rules: {
      "jsdoc/no-types": "warn",
      "jsdoc/require-file-overview": [
        "warn",
        {
          tags: {
            module: {
              initialCommentsOnly: true,
              mustExist: true,
              preventDuplicates: true,
            },
          },
        },
      ],
      "jsdoc/require-jsdoc": ["warn", { publicOnly: true }],
    },
  },
  {
    files: ["test/**/*.ts"],
    rules: {
      "@typescript-eslint/no-floating-promises": "off",
    },
  },
  {
    ignores: ["dist", "eslint.config.js"],
  },
)
