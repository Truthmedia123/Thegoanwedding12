export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/client/src/$1',
    '^@shared/(.*)$': '<rootDir>/shared/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.json',
        babelConfig: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ]
        }
      }
    ],
    '^.+\\.(js|jsx)$': [
      'babel-jest',
      {
        presets: [
          ['@babel/preset-env', { targets: { node: 'current' } }],
          ['@babel/preset-react', { runtime: 'automatic' }]
        ]
      }
    ]
  },
  transformIgnorePatterns: [
    '/node_modules/(?!(@testing-library|@babel|@jest|react|react-dom)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  collectCoverageFrom: [
    'client/src/**/*.{ts,tsx}',
    'server/**/*.{ts,tsx}',
    '!client/src/**/*.d.ts',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/*.test.{ts,tsx}',
  ],
  coverageThreshold: { 
    global: { 
      branches: 70, 
      functions: 70, 
      lines: 70, 
      statements: 70 
    } 
  }
};