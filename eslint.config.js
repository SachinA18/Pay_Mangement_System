import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import typescriptEslint from "@typescript-eslint/eslint-plugin";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2021,
      globals: globals.browser,
      parser: "@typescript-eslint/parser",
      parserOptions: {
        ecmaVersion: 12,
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    settings: { react: { version: "detect" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "@typescript-eslint": typescriptEslint,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      ...typescriptEslint.configs.recommended.rules,
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/display-name": "off",
      "react/jsx-uses-react": "warn",
      "react/jsx-uses-vars": "warn",
      "react/jsx-fragments": ["warn", "syntax"],
      "react/jsx-key": "warn",
      "react/jsx-no-duplicate-props": "warn",
      "react/jsx-no-undef": "warn",
      "no-console": "warn",
      "require-unicode-regexp": "warn",
      "no-warning-comments": [
        "warn",
        { terms: ["todo", "fixme", "hack", "xxx"], location: "anywhere" },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "off",
      "prefer-const": "warn",
      "no-var": "warn",
      "react-hooks/exhaustive-deps": "off",
    },
  },
];
