import { defineNodeUnitTestConfig } from '../../tooling/config/vitest/node';

export default defineNodeUnitTestConfig({
  overrides: {
    root: import.meta.dirname,
    resolve: {
      alias: {
        '@core/auth': `${import.meta.dirname}/../../core/auth/src/index.ts`,
        '@core/arcjet': `${import.meta.dirname}/../../core/arcjet/src/index.ts`,
        '@core/env': `${import.meta.dirname}/../../core/env/src/env.ts`,
      },
    },
  },
});
