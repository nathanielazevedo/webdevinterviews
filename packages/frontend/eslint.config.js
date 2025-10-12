import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { 
    ignores: [
      'dist/**',
      'node_modules/**',
      'public/**',
      '*.min.js',
      '*.bundle.js',
      '.next/**',
      '.nuxt/**',
      'build/**',
      'coverage/**',
      '*.d.ts',
    ]
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        sourceType: 'module',
      },
    },
    plugins: {
      'react': react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'import': importPlugin,
    },
    rules: {
      // React specific rules
      'react/jsx-uses-react': 'error',
      'react/jsx-uses-vars': 'error',
      'react/no-unescaped-entities': 'error',
      'react/prop-types': 'off', // Using TypeScript instead
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      
      // Import/Export rules - simplified for compatibility
      'import/no-duplicates': 'error',
      'import/first': 'error',
      
      // General JavaScript/TypeScript rules - relaxed for existing code
      'no-console': 'warn',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'off',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'semi': 'off', // Too many existing violations
      'quotes': 'off',
      'comma-dangle': 'off',
      'no-trailing-spaces': 'off',
      'indent': 'off',
      'key-spacing': 'off',
      'keyword-spacing': 'off',
      'space-before-blocks': 'off',
      'space-infix-ops': 'off',
      'arrow-spacing': 'off',
    },
    settings: {
      'import/resolver': {
        'typescript': {
          'alwaysTryTypes': true,
          'project': './tsconfig.json',
        },
        'node': {
          'extensions': ['.js', '.jsx', '.ts', '.tsx'],
        },
      },
      'react': {
        'version': 'detect',
      },
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    rules: {
      // Disable TypeScript-specific rules for JS files
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
)