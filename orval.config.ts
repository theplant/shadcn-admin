import { defineConfig } from 'orval'

export default defineConfig({
  api: {
    output: {
      mode: 'tags-split',
      target: 'src/api/generated/endpoints',
      schemas: 'src/api/generated/models',
      client: 'react-query',
      mock: false,  // IMPORTANT: Do NOT use faker.js mocks - use MSW with localStorage instead
      baseUrl: '/api',
      override: {
        mutator: {
          path: './src/api/custom-fetch.ts',
          name: 'customFetch',
        },
        // Without this, generated functions return
        // { data, status, headers } instead of the bare payload.
        fetch: {
          includeHttpResponseReturnType: false,
        },
      },
    },
    input: {
      target: './src/api/openapi.yaml',
    },
    // orval does not format what it emits, and `pnpm format:check` covers
    // generated files too.
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
})
