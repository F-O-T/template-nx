import type { UserConfig } from 'vitest/config';
import { configDefaults, defineConfig } from 'vitest/config';

type NodeTestConfigOptions = {
  overrides?: UserConfig;
};

const unitTestIncludes = ['**/__tests__/**/*.unit.test.ts'];

const integrationTestIncludes = ['**/__tests__/**/*.integration.test.ts'];

const sharedTestExclude = [
  ...configDefaults.exclude,
  'dist/**',
  'coverage/**',
  '.nx/**',
  '.tanstack/**',
  'src/routeTree.gen.ts',
];

const sharedCoverageConfig: NonNullable<UserConfig['test']>['coverage'] = {
  provider: 'v8',
  reporter: ['text', 'html', 'lcov'],
};

function defineBaseTestConfig(options: {
  include: string[];
  overrides?: UserConfig;
}) {
  const overrideTestConfig = options.overrides?.test ?? {};

  return defineConfig({
    ...options.overrides,
    test: {
      globals: true,
      clearMocks: true,
      restoreMocks: true,
      mockReset: true,
      include: options.include,
      exclude: sharedTestExclude,
      coverage: sharedCoverageConfig,
      ...overrideTestConfig,
    },
  });
}

export function defineNodeUnitTestConfig(options: NodeTestConfigOptions = {}) {
  const test = {
    environment: 'node',
    ...options.overrides?.test,
  };

  return defineBaseTestConfig({
    include: unitTestIncludes,
    overrides: {
      ...options.overrides,
      test,
    },
  });
}

export function defineNodeIntegrationTestConfig(
  options: NodeTestConfigOptions = {},
) {
  const test = {
    environment: 'node',
    passWithNoTests: true,
    ...options.overrides?.test,
  };

  return defineBaseTestConfig({
    include: integrationTestIncludes,
    overrides: {
      ...options.overrides,
      test,
    },
  });
}
