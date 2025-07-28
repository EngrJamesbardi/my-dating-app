module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
  },
  testMatch: ['**/backend/tests/**/*.test.ts', '**/src/__tests__/**/*.test.tsx'],
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
};
