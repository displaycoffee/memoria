// @ts-nocheck

/* Packages */
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default tseslint.config(
	{
		ignores: ['**/*.js'],
	},
	{
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'module',
			globals: {
				...globals.browser,
				...globals.node,
				...globals.es2022,
			},
			parserOptions: {
				project: './tsconfig.json',
				ecmaFeatures: { jsx: true },
				tsconfigRootDir: import.meta.dirname,
			},
		},
		settings: {
			react: { version: 'detect' },
			'import/parsers': {
				'@typescript-eslint/parser': ['.ts', '.tsx'],
			},
			'import/resolver': {
				typescript: { alwaysTryTypes: true },
			},
		},
	},
	js.configs.recommended,
	tseslint.configs.recommendedTypeChecked,
	react.configs.flat.recommended,
	react.configs.flat['jsx-runtime'],
	reactHooks.configs.flat.recommended,
	jsxA11y.flatConfigs.recommended,
	importPlugin.flatConfigs.errors,
	eslintConfigPrettier,
	{
		rules: {
			'prefer-const': 'error',
			'@typescript-eslint/consistent-type-imports': 'error',
			'@typescript-eslint/no-empty-function': 'off',
			'@typescript-eslint/no-misused-promises': ['error', { checksVoidReturn: { attributes: false } }],
			'@typescript-eslint/no-require-await': 'off',
			'@typescript-eslint/no-explicit-any': 'error',
			'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
			'@typescript-eslint/require-await': 'off',
			'import/no-unresolved': 'off',
			'react/no-unescaped-entities': 'off',
			'react/prop-types': 'off',
			'react-hooks/exhaustive-deps': 'error',
		},
	},
);
