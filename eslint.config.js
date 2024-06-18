import sonarjs from "eslint-plugin-sonarjs";
import unicorn from "eslint-plugin-unicorn";
import prettier from "eslint-config-prettier";
import tseslint from "typescript-eslint";

export default [
  sonarjs.configs.recommended,
  prettier,
  ...tseslint.configs.recommended,
  unicorn.configs["flat/recommended"],
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
    },
  },
  {
    files: ["src/**/*.ts*"],
    ignores: ["!.*", "dist", "node_modules", "coverage", "plop", "storybook-static", "scripts"],
  },
  {
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/prevent-abbreviations": "off",
    },
  },
  {
    files: ["**/*preset.js"],
    rules: {
      "unicorn/prefer-module": "off",
    },
  },
];
