module.exports = {
  testEnvironment: 'node',
  testPathIgnorePatterns: ['/node_modules/', '/dist/', '/esm/', '/__tests__/output/'],
  passWithNoTests: true,
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'babel-jest',
      {
        presets: ['@babel/preset-env', '@babel/preset-typescript'],
      },
    ],
  },
};
