import type { UserConfig } from 'vitest/config';

import { defineBaseTestConfig } from './base.ts';
import { integrationTestIncludes, unitTestIncludes } from './filters.ts';

type NodeTestConfigOptions = {
  overrides?: UserConfig;
};

export function defineNodeUnitTestConfig(options: NodeTestConfigOptions = {}) {
  return defineBaseTestConfig({
    include: unitTestIncludes,
    overrides: {
      test: {
        environment: 'node',
      },
      ...options.overrides,
    },
  });
}

export function defineNodeIntegrationTestConfig(
  options: NodeTestConfigOptions = {},
) {
  return defineBaseTestConfig({
    include: integrationTestIncludes,
    overrides: {
      test: {
        environment: 'node',
        passWithNoTests: true,
      },
      ...options.overrides,
    },
  });
}
