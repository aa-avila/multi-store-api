// eslint-disable-next-line @typescript-eslint/no-var-requires
const { defaults: tsjPreset } = require('ts-jest/presets');

module.exports = {
  // testEnvironment: 'node',
  transform: tsjPreset.transform,
  rootDir: 'src',
  testRegex: '.spec.ts$',
  preset: '@shelf/jest-mongodb',
  moduleFileExtensions: ['js', 'json', 'ts'],
  watchPathIgnorePatterns: ['globalConfig'],
  setupFilesAfterEnv: [],
  coverageDirectory: './coverage',
  collectCoverageFrom: ['src/**/*.ts'],
  coveragePathIgnorePatterns: [
    'node_modules',
    '.module.ts',
    '.config.ts',
    '.imports.ts',
    'main.ts',
    '.dto.ts',
    '.guard.ts',
    '.strategy.ts',
  ],
  coverageReporters: ['html', 'text', 'text-summary'],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
