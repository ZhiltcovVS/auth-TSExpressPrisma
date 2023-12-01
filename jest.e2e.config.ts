import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  verbose: true, // Чтобы выдеть детально output
  preset: 'ts-jest',
  testRegex: '.e2e-spec.ts$',
};

export default config;
