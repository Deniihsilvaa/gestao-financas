import globals from "globals";
import pluginJs from "@eslint/js";
import pluginReact from "eslint-plugin-react";
import pluginTs from "@typescript-eslint/eslint-plugin"; // Importa o plugin TypeScript
import parser from "@typescript-eslint/parser"; // Importa o parser TypeScript

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx,tsx}"], // Ajuste os tipos de arquivos a serem analisados
    languageOptions: {
      globals: globals.browser, // Definições globais para o ambiente de navegador
      parser, // Adiciona o parser TypeScript
      parserOptions: {
        ecmaVersion: 2020, // Suporte para ES2020
        sourceType: "module", // Módulos ECMAScript
        ecmaFeatures: {
          jsx: true, // Ativa o suporte a JSX
        },
      },
    },
  },
  pluginJs.configs.recommended, // Configurações recomendadas para JavaScript
  pluginReact.configs.flat.recommended, // Configurações recomendadas para React
  {
    files: ["**/*.ts", "**/*.tsx"], // Aplica regras específicas para arquivos TypeScript
    plugins: {
      "@typescript-eslint": pluginTs, // Adiciona o plugin do TypeScript
    },
    extends: [
      "plugin:@typescript-eslint/recommended", // Regras recomendadas para TypeScript
      "plugin:react/recommended", // Regras recomendadas para React
    ],
    rules: {
      // Aqui você pode adicionar ou sobrescrever regras específicas para o TypeScript
    },
  },
];
