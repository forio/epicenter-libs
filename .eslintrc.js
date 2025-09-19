'use strict';

module.exports = {
    root: true,
    globals: {
        'epicenter': true,
        'globalThis': 'readonly',
    },
    ignorePatterns: ['**/dist/**'],
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    env: {
        'browser': true,
        'node': true,
        'es2020': true
    },
    rules: {
        'comma-dangle': [2, 'always-multiline'],
        'no-console': 0,
        'no-constant-condition': 1,
        'no-empty': 1,
        'no-extra-parens': 0,
        'no-inner-declarations': [1, 'functions'],
        'no-unexpected-multiline': 1,
        'use-isnan': 1,
        'accessor-pairs': 2,
        'block-scoped-var': 1,
        'complexity': [1, 20],
        'consistent-return': 1,
        'curly': [2, 'multi-line'],
        'default-case': 2,
        'dot-location': [2, 'property'],
        'dot-notation': [2, {
            'allowKeywords': true
        }],
        'eqeqeq': 2,
        'guard-for-in': 2,
        'no-alert': 2,
        'no-caller': 2,
        'no-div-regex': 2,
        'no-else-return': 0,
        'no-eq-null': 2,
        'no-eval': 2,
        'no-extend-native': 2,
        'no-extra-bind': 2,
        'no-floating-decimal': 2,
        'no-implicit-coercion': 0,
        'no-implied-eval': 2,
        'no-invalid-this': 0,
        'no-iterator': 2,
        'no-labels': 2,
        'no-lone-blocks': 2,
        'no-loop-func': 2,
        'no-magic-numbers': [2, {
            'ignore': [-1, 0, 1]
        }],
        'no-multi-spaces': [2, { ignoreEOLComments: true }],
        'no-multi-str': 2,
        'no-new-func': 2,
        'no-new-wrappers': 2,
        'no-new': 0,
        'no-octal-escape': 2,
        'no-octal': 2,
        'no-param-reassign': [0, {
            'props': false
        }],
        'no-process-env': 0,
        'no-proto': 2,
        'no-return-assign': 0,
        'no-script-url': 2,
        'no-self-compare': 2,
        'no-sequences': 2,
        'no-throw-literal': 2,
        'no-unused-expressions': 1,
        'no-useless-call': 2,
        'no-useless-concat': 2,
        'no-void': 2,
        'no-warning-comments': 0,
        'radix': 2,
        'vars-on-top': 0,
        'wrap-iife': 2,
        'yoda': 2,
        'init-declarations': 0,
        'no-label-var': 2,
        'no-shadow': 0,
        'no-undef-init': 2,
        'no-use-before-define': 1,
        'callback-return': 2,
        'global-require': 0,
        'handle-callback-err': 1,
        'no-mixed-requires': [1, {
            'grouping': true
        }],
        'no-new-require': 1,
        'no-path-concat': 2,
        'no-process-exit': 2,
        'no-restricted-modules': 0,
        'no-sync': 0,
        'array-bracket-spacing': [2, 'never'],
        'block-spacing': [2, 'always'],
        'brace-style': [1, '1tbs', {
            'allowSingleLine': true
        }],
        'comma-spacing': [1, {
            'before': false,
            'after': true
        }],
        'comma-style': [2, 'last'],
        'computed-property-spacing': [2, 'never'],
        'consistent-this': [2, 'me'],
        'eol-last': 0,
        'func-names': 0,
        'indent': [1, 4, { 'SwitchCase': 1 }],
        'key-spacing': [2, {
            'beforeColon': false,
            'afterColon': true
        }],
        'lines-around-comment': [0, {
            'beforeBlockComment': true
        }],
        'max-depth': [1, 4],
        'new-cap': 1,
        'new-parens': 2,
        'no-array-constructor': 2,
        'no-bitwise': 2,
        'no-lonely-if': 2,

        'no-multiple-empty-lines': [2, {
            'max': 2
        }],
        'no-negated-condition': 0,
        'no-nested-ternary': 2,
        'no-new-object': 2,
        'no-plusplus': 0,
        'no-spaced-func': 2,
        'no-trailing-spaces': 0,
        'no-unneeded-ternary': 2,
        'object-curly-spacing': 0,
        'one-var': [2, 'never'],
        'operator-assignment': [0, 'never'],
        'operator-linebreak': [1, 'after', {
            'overrides': {
                '|': 'after'
            }
        }],
        'padded-blocks': [0, 'never'],
        'quote-props': [2, 'as-needed'],
        'quotes': [2, 'single'],
        'semi-spacing': [2, {
            'before': false,
            'after': true
        }],
        'semi': [2, 'always'],
        'sort-vars': 0,
        'keyword-spacing': ['error', { 'before': true, 'after': true, 'overrides': {} }],
        'space-before-blocks': 1,
        'space-before-function-paren': [1, 'never'],
        'space-in-parens': [1, 'never'],
        'space-infix-ops': [1, {
            'int32Hint': false
        }],
        'space-unary-ops': 2,
        'wrap-regex': 2,
        'arrow-parens': [1, 'always'],
        'arrow-spacing': [2, {
            'before': true,
            'after': true
        }],
        'generator-star-spacing': [1, {
            'before': true,
            'after': false
        }],
        'no-arrow-condition': 0,
        'no-var': 2,
        'object-shorthand': 0,
        'prefer-arrow-callback': 1,
        'prefer-const': 1,
        'prefer-spread': 1,
        'prefer-template': 1,
    }
}
