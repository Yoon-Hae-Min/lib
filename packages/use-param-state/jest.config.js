module.exports = {
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/'],
  setupFilesAfterEnv: ['./jest.setup.js'],
};
