import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,tsx,ts}"], // Inclui arquivos TypeScript e JSX
    languageOptions: {
      globals: globals.browser,
      parser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs, // Adiciona o plugin TypeScript
      "react": pluginReact, // Adiciona o plugin React
    },
    settings: {
      react: {
        version: "detect", // Detecta automaticamente a versão do React
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // Regras JS recomendadas
      ...pluginReact.configs.recommended.rules, // Regras React recomendadas
      ...pluginTs.configs.recommended.rules, // Regras TypeScript recomendadas

      // Regras personalizadas
      "no-console": "warn",
      "react/react-in-jsx-scope": "off",
    },
  }
];
