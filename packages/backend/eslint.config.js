import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        // Node.js globals
        Buffer: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        // TypeScript/Node globals
        NodeJS: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      
      // General JavaScript rules - relaxed for existing code
      'no-console': 'off', // We use logging
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-const': 'warn',
      'no-var': 'error',
      'object-shorthand': 'warn',
      'prefer-arrow-callback': 'off',
      'prefer-template': 'off',
      'template-curly-spacing': 'off',
      'arrow-spacing': 'warn',
      'comma-dangle': 'off', // Too many to fix right now
      'comma-spacing': 'warn',
      'comma-style': 'warn',
      'computed-property-spacing': 'warn',
      'func-call-spacing': 'warn',
      'indent': 'off', // Too many to fix right now
      'key-spacing': 'warn',
      'keyword-spacing': 'warn',
      'linebreak-style': ['error', 'unix'],
      'no-trailing-spaces': 'off', // Too many to fix right now
      'quotes': 'off', // Too many to fix right now
      'semi': ['error', 'always'],
      'space-before-blocks': 'warn',
      'space-before-function-paren': 'off',
      'space-in-parens': 'warn',
      'space-infix-ops': 'warn',
      'space-unary-ops': 'warn',
      'spaced-comment': 'off',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      // Disable TypeScript-specific rules for JS files
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'generated/**',
      'migrations/**',
      'eslint.config.js',
      'scripts/**',
    ],
  },
];