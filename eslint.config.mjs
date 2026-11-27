import next from 'eslint-config-next/core-web-vitals';

const eslintConfig = [
  ...next,
  {
    // The react-hooks v7 (React Compiler) advisory rules over-fire on
    // legitimate patterns in this codebase: setState in data-fetch effects,
    // Math.random inside useMemo (r3f particle scatter), and useFrame
    // camera mutation. They stay visible as warnings, not build failures.
    rules: {
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
  {
    ignores: ['.next/**', 'out/**', 'node_modules/**'],
  },
];

export default eslintConfig;
