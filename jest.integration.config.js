module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/test/integration/**/*.integration-spec.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  coverageDirectory: './coverage/integration',
};
