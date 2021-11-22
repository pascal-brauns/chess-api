import { Config } from '@jest/types';
import { pathsToModuleNameMapper } from 'ts-jest/utils';
import tsconfig from './tsconfig.json';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  modulePathIgnorePatterns: ['build'],
  moduleFileExtensions: ['js', 'ts'],
  collectCoverage: true,
  coverageReporters: ['json', 'html'],
  collectCoverageFrom: [
    '**/src/Library/**'
  ],
  coverageDirectory: 'coverage',
  moduleNameMapper: pathsToModuleNameMapper(tsconfig.compilerOptions.paths, {
    prefix: '<rootDir>/src'
  })
};

export default config;