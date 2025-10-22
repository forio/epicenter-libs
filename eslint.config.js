import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';

export default [
    {
        ignores: ['**/dist/**', '**.config.js', '**/examples/**'],
    },
    js.configs.recommended,
    ...tseslint.configs.recommended,
    stylistic.configs.customize({
        indent: 4,
        semi: true,
        jsx: false,
        braceStyle: '1tbs',
        quoteProps: 'as-needed',
    }),
    {
        files: ['src/**/*.ts'],
        languageOptions: {
            parserOptions: {
                ecmaVersion: 2020,
                sourceType: 'module',
                project: './tsconfig.json',
            },
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020,
                epicenter: true,
            },
        },
        rules: {
            // TypeScript handles this better than ESLint
            'no-undef': 0,

            // Overrides from js.configs.recommended
            'no-console': 0,
            'no-constant-condition': 1,
            'no-empty': 1,
            'no-inner-declarations': [1, 'functions'],
            'no-unexpected-multiline': 1,

            // Best Practices
            'accessor-pairs': 2,
            'block-scoped-var': 1,
            'complexity': [1, 20],
            'consistent-return': 1,
            'curly': [2, 'multi-line'],
            'default-case': 2,
            'eqeqeq': 2,
            'guard-for-in': 2,
            'no-alert': 2,
            'no-caller': 2,
            'no-div-regex': 2,
            'no-eq-null': 2,
            'no-extend-native': 2,
            'no-extra-bind': 2,
            'no-floating-decimal': 2,
            'no-iterator': 2,
            'no-labels': 2,
            'no-lone-blocks': 2,
            'no-loop-func': 2,
            'no-magic-numbers': [2, {
                ignore: [-1, 0, 1],
            }],
            'no-multi-str': 2,
            'no-new-func': 2,
            'no-new-wrappers': 2,
            'no-octal-escape': 2,
            'no-proto': 2,
            'no-script-url': 2,
            'no-self-compare': 2,
            'no-sequences': 2,
            'no-throw-literal': 2,
            'no-unused-expressions': 1,
            'no-useless-call': 2,
            'no-useless-concat': 2,
            'no-void': 2,
            'radix': 2,
            'wrap-iife': 2,
            'yoda': 2,

            // Variables
            'no-label-var': 2,
            'no-undef-init': 2,
            'no-use-before-define': [1, {
                ignoreTypeReferences: true,
            }],

            // Node.js
            'no-path-concat': 2,
            'no-process-exit': 2,

            // Stylistic overrides
            'consistent-this': [2, 'me'],
            'max-depth': [1, 4],
            'new-cap': 1,
            'no-bitwise': 2,
            'no-lonely-if': 2,
            'no-nested-ternary': 2,
            'no-unneeded-ternary': 2,
            'one-var': [2, 'never'],
            '@stylistic/brace-style': [1, '1tbs', { allowSingleLine: true }],
            '@stylistic/indent': [1, 4, { SwitchCase: 1 }],
            '@stylistic/no-multiple-empty-lines': [2, { max: 2 }],
            '@stylistic/operator-linebreak': [1, 'after', {
                overrides: { '|': 'before' },
            }],
            '@stylistic/space-before-function-paren': [1, {
                anonymous: 'never',
                named: 'never',
                asyncArrow: 'always',
            }],

            // ES6
            'no-var': 2,
            'prefer-arrow-callback': 1,
            'prefer-const': 1,
            'prefer-spread': 1,
            'prefer-template': 1,
            '@stylistic/generator-star-spacing': [1, {
                before: true,
                after: false,
            }],

            // TypeScript specific overrides
            '@typescript-eslint/no-unused-vars': ['error', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            }],
            '@typescript-eslint/no-empty-object-type': ['error', {
                allowInterfaces: 'with-single-extends',
            }],
            '@stylistic/arrow-parens': [2, 'always'],
        },
    },
    // Test files configuration
    {
        files: ['tests/**/*.js', 'tests/**/*.spec.js'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.node,
                ...globals.es2020,
                epicenter: true,
                org: true,
                // Vitest globals
                describe: 'readonly',
                it: 'readonly',
                test: 'readonly',
                expect: 'readonly',
                beforeEach: 'readonly',
                afterEach: 'readonly',
                beforeAll: 'readonly',
                afterAll: 'readonly',
                vi: 'readonly',
            },
        },
        rules: {
            // Test-specific overrides
            'no-magic-numbers': [2, {
                ignore: [-1, 0, 1, 2, 10, 27, 60, 100, 200, 400, 404, 1000],
            }],
            // Allow unused vars/args/errors prefixed with _
            'no-unused-vars': 0,
            '@typescript-eslint/no-unused-vars': [1, {
                args: 'none',
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_',
                caughtErrorsIgnorePattern: '^_',
                ignoreRestSiblings: true,
            }],
            '@stylistic/arrow-parens': [2, 'always'],
        },
    },
];
