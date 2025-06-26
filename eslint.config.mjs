import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js recommended configs (most popular standard)
  ...compat.extends('next/core-web-vitals', 'next/typescript'),

  // Prettier integration (prevents conflicts)
  ...compat.extends('prettier'),

  // Popular community rules
  {
    rules: {
      // Most popular code quality rules
      'no-console': 'warn',
      'no-unused-vars': 'off', // TypeScript handles this better
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_' },
      ],
      'prefer-const': 'error',

      // React best practices (most adopted)
      'react/prop-types': 'off', // TypeScript handles props
      'react/react-in-jsx-scope': 'off', // Next.js auto-imports React

      // Architecture enforcement (feature-based)
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/features/*/*'],
              message: 'Import from feature index: @/features/[feature-name]',
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
