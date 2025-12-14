export default {
  extensionsToTreatAsEsm: ['.ts'],
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/', '/__tests__/output/', '/lib/'],
  passWithNoTests: true,
};
