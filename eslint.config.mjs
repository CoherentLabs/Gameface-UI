import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import tokensValidator from "./eslint-custom-rules/tokens-validator.js";

export default defineConfig([
  {
    files: ["**/*.tsx"],
    plugins: {
      custom: {
        rules: {
          "tokens-validator": tokensValidator,
        },
      },
    },
    rules: {
      "custom/tokens-validator": "warn",
    },
  },
  tseslint.configs.base,
]);