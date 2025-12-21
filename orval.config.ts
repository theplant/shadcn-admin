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
      },
    },
    input: {
      target: './src/api/openapi.yaml',
    },
  },
})
