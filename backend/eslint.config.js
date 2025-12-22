// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default [
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "module",
      parserOptions: {
        ecmaVersion: "latest",
      },
      globals: {
        process: "readonly", // tell ESLint that process exists
      },
    },
    env: {
      node: true, // important for Node.js globals
      es2021: true,
    },
    rules: {
      // Add or override rules here
      "no-unused-vars": ["warn"],
      "no-undef": ["error"],
    },
  },
];
// end of eslint.config.js